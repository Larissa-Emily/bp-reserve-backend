import { Test, TestingModule } from '@nestjs/testing';
import { RoomService } from './room.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomEntity } from './interface/room.entity';
import { ReserveEntity } from '../reserve/interface/reserve.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('RoomService', () => {
    let service: RoomService;
    let roomRepo: Repository<RoomEntity>;
    let reserveRepo: Repository<ReserveEntity>;

    const mockRoomRepo = {
        findOne: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
    };

    const mockReserveRepo = {
        delete: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoomService,
                { provide: getRepositoryToken(RoomEntity), useValue: mockRoomRepo },
                { provide: getRepositoryToken(ReserveEntity), useValue: mockReserveRepo },
            ],
        }).compile();

        service = module.get<RoomService>(RoomService);
        roomRepo = module.get<Repository<RoomEntity>>(getRepositoryToken(RoomEntity));
        reserveRepo = module.get<Repository<ReserveEntity>>(getRepositoryToken(ReserveEntity));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(service).toBeDefined();
    });

    it('deve criar uma sala', async () => {
        const dto: CreateRoomDto = {
            name: 'Nova Sala',
            description: 'Sala de reunião',
            capacity: 10,
            location: '1º andar',
            isAvailable: true,
        };

        const mockRoom: RoomEntity = {
            id: 1,
            name: 'Nova Sala',
            description: 'Sala de reunião', // obrigatório
            capacity: 10,
            location: '1º andar',           // obrigatório
            isAvailable: true,              // obrigatório
            reservations: [],               // obrigatório
            createdAt: new Date(),          // obrigatório
            updatedAt: new Date(),          // obrigatório
        };


        mockRoomRepo.findOne.mockResolvedValue(undefined);
        mockRoomRepo.create.mockReturnValue(mockRoom);
        mockRoomRepo.save.mockResolvedValue(mockRoom);

        const result = await service.create(dto);
        expect(result).toEqual(mockRoom);
        expect(mockRoomRepo.create).toHaveBeenCalledWith(dto);
        expect(mockRoomRepo.save).toHaveBeenCalledWith(mockRoom);
    });

    it('deve lançar conflito se já existir sala com mesmo nome', async () => {
        const dto: CreateRoomDto = {
            name: 'Sala Existente',
            description: 'Sala',
            capacity: 5,
            location: '2º andar',
            isAvailable: true,
        };

        const existingRoom = { id: 1, ...dto, reservations: [], createdAt: new Date(), updatedAt: new Date() };

        mockRoomRepo.findOne.mockResolvedValue(existingRoom);

        await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('deve listar todas as salas', async () => {
        const rooms: RoomEntity[] = [
            {
                id: 1,
                name: 'Sala A',
                description: 'Sala 1',
                capacity: 10,
                location: '1º andar',
                isAvailable: true,
                reservations: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        mockRoomRepo.find.mockResolvedValue(rooms);

        const result = await service.findAll();
        expect(result).toEqual(rooms);
        expect(mockRoomRepo.find).toHaveBeenCalled();
    });

    it('deve retornar sala disponível', async () => {
        const rooms: RoomEntity[] = [
            {
                id: 2,
                name: 'Sala B',
                description: 'Sala disponível',
                capacity: 15,
                location: '2º andar',
                isAvailable: true,
                reservations: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        mockRoomRepo.find.mockResolvedValue(rooms);

        const result = await service.findAvailable();
        expect(result).toEqual(rooms);
        expect(mockRoomRepo.find).toHaveBeenCalledWith({
            where: { isAvailable: true },
            order: { name: 'ASC' },
        });
    });

    it('deve atualizar uma sala', async () => {
        const existingRoom: RoomEntity = {
            id: 1,
            name: 'Sala A',
            description: 'Sala 1',
            capacity: 10,
            location: '1º andar',
            isAvailable: true,
            reservations: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updateDto: UpdateRoomDto = { name: 'Sala Atualizada', description: 'Nova descrição' };

        mockRoomRepo.findOne.mockResolvedValueOnce(existingRoom);
        mockRoomRepo.findOne.mockResolvedValueOnce(undefined); // Verifica conflito
        mockRoomRepo.save.mockResolvedValue({ ...existingRoom, ...updateDto });

        const result = await service.update(1, updateDto);
        expect(result.name).toBe('Sala Atualizada');
        expect(mockRoomRepo.save).toHaveBeenCalled();
    });

    it('deve deletar uma sala', async () => {
        const room: RoomEntity = {
            id: 1,
            name: 'Sala A',
            description: 'Sala 1',
            capacity: 10,
            location: '1º andar',
            isAvailable: true,
            reservations: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockRoomRepo.findOne.mockResolvedValue(room);
        mockReserveRepo.delete.mockResolvedValue({} as any);
        mockRoomRepo.remove.mockResolvedValue(room);

        const result = await service.remove(1);
        expect(result).toEqual({ message: 'Sala e reservas deletadas com sucesso!' });
    });
});
