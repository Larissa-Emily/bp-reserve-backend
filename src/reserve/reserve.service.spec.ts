import { Test, TestingModule } from '@nestjs/testing';
import { ReserveService } from './reserve.service';
import { Repository } from 'typeorm';
import { ReserveEntity } from './interface/reserve.entity';
import { RoomService } from '../room/room.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';

describe('ReserveService', () => {
  let service: ReserveService;
  let repository: Repository<ReserveEntity>;
  let roomService: RoomService;
  let userService: UserService;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    })),
  };

  const mockRoomService = { findOne: jest.fn() };
  const mockUserService = { getUserById: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReserveService,
        { provide: getRepositoryToken(ReserveEntity), useValue: mockRepo },
        { provide: RoomService, useValue: mockRoomService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<ReserveService>(ReserveService);
    repository = module.get(getRepositoryToken(ReserveEntity));
    roomService = module.get(RoomService);
    userService = module.get(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  it('deve criar uma reserva', async () => {
    const dto = { roomId: 1, userId: 1, date: '2025-10-30', startTime: '10:00', endTime: '12:00' };
    const room = { id: 1, name: 'Sala A', isAvailable: true } as any;
    const user = { id: 1 } as any;
    mockRoomService.findOne.mockResolvedValue(room);
    mockUserService.getUserById.mockResolvedValue(user);
    mockRepo.create.mockReturnValue(dto);
    mockRepo.save.mockResolvedValue({ id: 1, ...dto });

    const result = await service.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(repository.save).toHaveBeenCalled();
  });

  it('deve lançar NotFoundException se a sala não existir', async () => {
    mockRoomService.findOne.mockResolvedValue(null);
    await expect(service.create({ roomId: 999 } as any)).rejects.toThrow(NotFoundException);
  });

  it('deve listar todas as reservas', async () => {
    const data = [{ id: 1 }] as any;
    mockRepo.find.mockResolvedValue(data);

    const result = await service.findAll();
    expect(result).toEqual(data);
  });

  it('deve buscar reserva por id', async () => {
    const reservation = { id: 1 } as any;
    mockRepo.findOne.mockResolvedValue(reservation);

    const result = await service.findOne(1);
    expect(result).toEqual(reservation);
  });

  it('deve lançar NotFoundException ao buscar reserva inexistente', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('deve remover reserva', async () => {
    const reservation = { id: 1 } as any;
    mockRepo.findOne.mockResolvedValue(reservation);
    mockRepo.remove.mockResolvedValue(undefined);

    await service.remove(1, 1, 'manager');
    expect(repository.remove).toHaveBeenCalledWith(reservation);
  });
});
