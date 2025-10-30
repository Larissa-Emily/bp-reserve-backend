import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './interface/room.entity';
import { ReserveEntity } from '../reserve/interface/reserve.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';

describe('RoomService', () => {
  let service: RoomService;
  let roomRepository: jest.Mocked<Repository<RoomEntity>>;
  let reserveRepository: jest.Mocked<Repository<ReserveEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomService,
        {
          provide: getRepositoryToken(RoomEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
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

    service = module.get<RoomService>(RoomService);
    roomRepository = module.get(getRepositoryToken(RoomEntity));
    reserveRepository = module.get(getRepositoryToken(ReserveEntity));
  });

  afterEach(() => jest.clearAllMocks());

  // ---------------------------------------------
  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  // ---------------------------------------------
  describe('create', () => {
    it('deve criar uma nova sala', async () => {
      const dto = {
        name: 'Sala Nova',
        description: 'Sala de reunião',
        capacity: 10,
        location: '1º andar',
        isAvailable: true,
      };

      roomRepository.findOne.mockResolvedValue(null);
      roomRepository.create.mockReturnValue(dto as any);
      roomRepository.save.mockResolvedValue({ id: 1, ...dto } as RoomEntity);

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
      expect(roomRepository.findOne).toHaveBeenCalledWith({
        where: { name: dto.name },
      });
      expect(roomRepository.save).toHaveBeenCalled();
    });

    it('deve lançar erro se já existir uma sala com o mesmo nome', async () => {
      const dto = {
        name: 'Duplicada',
        description: 'Sala teste',
        capacity: 5,
        location: '2º andar',
        isAvailable: true,
      };

      roomRepository.findOne.mockResolvedValue(dto as RoomEntity);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  // ---------------------------------------------
  describe('findAll', () => {
    it('deve retornar todas as salas', async () => {
      const mockRooms = [
        { id: 1, name: 'Sala A' },
        { id: 2, name: 'Sala B' },
      ] as RoomEntity[];

      roomRepository.find.mockResolvedValue(mockRooms);

      const result = await service.findAll();

      expect(result).toEqual(mockRooms);
      expect(roomRepository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
    });
  });

  // ---------------------------------------------
  describe('findOne', () => {
    it('deve retornar uma sala pelo ID', async () => {
      const mockRoom = { id: 1, name: 'Sala A' } as RoomEntity;
      roomRepository.findOne.mockResolvedValue(mockRoom);

      const result = await service.findOne(1);

      expect(result).toEqual(mockRoom);
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('deve lançar erro se a sala não existir', async () => {
      roomRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------
  describe('update', () => {
    it('deve atualizar uma sala existente', async () => {
      const existingRoom = {
        id: 1,
        name: 'Antiga',
        description: 'Desc',
        capacity: 5,
        location: '1º andar',
        isAvailable: true,
      } as RoomEntity;

      const updateDto = { name: 'Nova Sala' };

      roomRepository.findOne.mockResolvedValueOnce(existingRoom); // findOne(id)
      roomRepository.findOne.mockResolvedValueOnce(null); // verifica se o nome é duplicado
      roomRepository.save.mockResolvedValue({
        ...existingRoom,
        ...updateDto,
      } as RoomEntity);

      const result = await service.update(1, updateDto);

      expect(result.name).toBe('Nova Sala');
      expect(roomRepository.save).toHaveBeenCalled();
    });

    it('deve lançar erro se tentar atualizar para um nome já existente', async () => {
      const existingRoom = { id: 1, name: 'Antiga' } as RoomEntity;
      const updateDto = { name: 'Duplicada' };

      roomRepository.findOne
        .mockResolvedValueOnce(existingRoom) // findOne(id)
        .mockResolvedValueOnce({ id: 2, name: 'Duplicada' } as RoomEntity); // nome duplicado

      await expect(service.update(1, updateDto)).rejects.toThrow(ConflictException);
    });
  });

  // ---------------------------------------------
  describe('remove', () => {
    it('deve deletar uma sala e suas reservas', async () => {
      const mockRoom = { id: 1, name: 'Sala A' } as RoomEntity;
      roomRepository.findOne.mockResolvedValue(mockRoom);
reserveRepository.delete.mockResolvedValue({ affected: 1 } as DeleteResult);
      roomRepository.remove.mockResolvedValue(mockRoom);

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Sala e reservas deletadas com sucesso!' });
      expect(reserveRepository.delete).toHaveBeenCalledWith({ room: { id: 1 } });
      expect(roomRepository.remove).toHaveBeenCalledWith(mockRoom);
    });

    it('deve lançar erro se a sala não for encontrada', async () => {
      roomRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  // ---------------------------------------------
  describe('findAvailable', () => {
    it('deve retornar apenas salas disponíveis', async () => {
      const mockRooms = [
        { id: 1, name: 'Sala Livre', isAvailable: true },
        { id: 2, name: 'Sala 2', isAvailable: true },
      ] as RoomEntity[];

      roomRepository.find.mockResolvedValue(mockRooms);

      const result = await service.findAvailable();

      expect(result).toEqual(mockRooms);
      expect(roomRepository.find).toHaveBeenCalledWith({
        where: { isAvailable: true },
        order: { name: 'ASC' },
      });
    });
  });
});
