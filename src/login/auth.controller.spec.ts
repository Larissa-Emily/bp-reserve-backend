import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../user/interface/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

// 👇 Mockamos o bcrypt inteiro antes de qualquer teste
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<UserEntity>;
  let jwtService: JwtService;

  const mockUserRepo = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(UserEntity), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    jwtService = module.get(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve validar o usuário e retornar o token', async () => {
    const dto = { email: 'user@test.com', password: '123456' };

    const user: UserEntity = {
      id: 1,
      name: 'User Test',
      email: 'user@test.com',
      password: 'hashed_password',
      sector: 'TI',
      functionUser: 'Dev',
      phone: '99999-9999',
      role: 'user',
      reservations: [],
    };

    mockUserRepo.findOne.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.signAsync.mockResolvedValue('jwt-token');

    const result = await service.validateUser(dto);

    expect(result).toEqual({
      access_token: 'jwt-token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        sector: user.sector,
        role: user.role,
        functionUser: user.functionUser,
        phone: user.phone,
      },
    });

    expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { email: dto.email } });
    expect(jwtService.signAsync).toHaveBeenCalled();
  });

  it('deve lançar UnauthorizedException se o usuário não for encontrado', async () => {
    mockUserRepo.findOne.mockResolvedValue(null);

    await expect(
      service.validateUser({ email: 'notfound@test.com', password: '123456' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException se a senha estiver incorreta', async () => {
    const user: UserEntity = {
      id: 1,
      name: 'User Test',
      email: 'user@test.com',
      password: 'hashed_password',
      sector: 'TI',
      functionUser: 'Dev',
      phone: '99999-9999',
      role: 'user',
      reservations: [],
    };

    mockUserRepo.findOne.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.validateUser({ email: 'user@test.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException se ocorrer erro inesperado', async () => {
    mockUserRepo.findOne.mockRejectedValue(new Error('DB Error'));

    await expect(
      service.validateUser({ email: 'user@test.com', password: '123456' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
