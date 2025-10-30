import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './interface/user.entity';
import { ReserveEntity } from '../reserve/interface/reserve.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepo: jest.Mocked<Repository<UserEntity>>;
  let reserveRepo: jest.Mocked<Repository<ReserveEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ReserveEntity),
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(UserEntity));
    reserveRepo = module.get(getRepositoryToken(ReserveEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar todos os usuários', async () => {
    const users = [
      { id: 1, name: 'João', email: 'joao@test.com' },
      { id: 2, name: 'Maria', email: 'maria@test.com' },
    ] as UserEntity[];

    userRepo.find.mockResolvedValue(users);

    const result = await service.getAllUsers();

    expect(result).toEqual(users);
    expect(userRepo.find).toHaveBeenCalled();
  });
});
