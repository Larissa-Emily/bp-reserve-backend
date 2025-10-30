import { Test, TestingModule } from '@nestjs/testing';
import { ReserveController } from './reserve.controller';
import { ReserveService } from './reserve.service';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { ReserveEntity } from './interface/reserve.entity';

describe('ReserveController', () => {
    let controller: ReserveController;
    let service: ReserveService;

    const mockReserveService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        findByUser: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReserveController],
            providers: [
                { provide: ReserveService, useValue: mockReserveService },
            ],
        }).compile();

        controller = module.get<ReserveController>(ReserveController);
        service = module.get<ReserveService>(ReserveService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve estar definido', () => {
        expect(controller).toBeDefined();
    });

    it('deve criar uma reserva', async () => {
        const dto: CreateReservationDto = {
            roomId: 1,
            userId: 1,
            date: '2025-10-30',
            startTime: '10:00',
            endTime: '12:00',
        };

        const mockReservation: ReserveEntity = {
            id: 1,
            ...dto,
            createdAt: new Date(),
            updatedAt: new Date(),
            room: {
                id: 1,
                name: 'Sala A',
                capacity: 10,
                description: 'desc',
                location: '1º andar',
                isAvailable: true,
                reservations: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            user: {
                id: 1,
                name: 'User A',
                email: 'user@test.com',
                role: 'user',
                sector: 'TI',
                functionUser: 'Dev',
                phone: '12345678',
            },
        } as unknown as ReserveEntity; // 👈 força compatibilidade de tipo

        mockReserveService.create.mockResolvedValue(mockReservation);

        const req = { user: { sub: 1 } } as any;
        const result = await controller.create(dto, req);

        expect(result).toEqual(mockReservation);
        expect(service.create).toHaveBeenCalledWith({ ...dto, userId: 1 });
    });

    it('deve listar todas as reservas', async () => {
        const reservations: ReserveEntity[] = [];
        mockReserveService.findAll.mockResolvedValue(reservations);

        const result = await controller.findAll();
        expect(result).toEqual(reservations);
        expect(service.findAll).toHaveBeenCalled();
    });

    it('deve buscar reserva por id', async () => {
        const reservation: ReserveEntity = { id: 1 } as any;
        mockReserveService.findOne.mockResolvedValue(reservation);

        const result = await controller.findOne('1');
        expect(result).toEqual(reservation);
        expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('deve buscar reservas por usuário', async () => {
        const reservations: ReserveEntity[] = [{ id: 1 } as any];
        mockReserveService.findByUser.mockResolvedValue(reservations);

        const result = await controller.findByUser('1');
        expect(result).toEqual(reservations);
        expect(service.findByUser).toHaveBeenCalledWith(1);
    });

    it('deve atualizar reserva', async () => {
        const dto: UpdateReservationDto = { startTime: '11:00', endTime: '13:00' };
        const updated: ReserveEntity = { id: 1, ...dto } as any;
        mockReserveService.update.mockResolvedValue(updated);

        const req = { user: { sub: 1, role: 'user' } } as any;
        const result = await controller.update('1', dto, req);

        expect(result).toEqual(updated);
        expect(service.update).toHaveBeenCalledWith(1, dto, 1, 'user');
    });

    it('deve remover reserva', async () => {
        mockReserveService.remove.mockResolvedValue(undefined);

        const req = { user: { sub: 1, role: 'user' } } as any;
        const result = await controller.remove('1', req);

        expect(result).toBeUndefined();
        expect(service.remove).toHaveBeenCalledWith(1, 1, 'user');
    });
});
