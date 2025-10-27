"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reserve_entity_1 = require("./interface/reserve.entity");
const room_service_1 = require("../room/room.service");
const user_service_1 = require("../user/user.service");
let ReserveService = class ReserveService {
    reservationRepository;
    roomService;
    userService;
    constructor(reservationRepository, roomService, userService) {
        this.reservationRepository = reservationRepository;
        this.roomService = roomService;
        this.userService = userService;
    }
    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    async validateReservation(dto, existingReservationId) {
        const { date, startTime, endTime, roomId, userId } = dto;
        if (!roomId)
            throw new common_1.BadRequestException('O ID da sala é obrigatório.');
        if (!userId)
            throw new common_1.BadRequestException('O ID do usuário é obrigatório.');
        if (!date)
            throw new common_1.BadRequestException('A data da reserva é obrigatória.');
        if (!startTime || !endTime)
            throw new common_1.BadRequestException('Os horários de início e término são obrigatórios.');
        const room = await this.roomService.findOne(roomId);
        if (!room)
            throw new common_1.NotFoundException(`Sala com ID ${roomId} não encontrada.`);
        if (!room.isAvailable)
            throw new common_1.BadRequestException(`A sala "${room.name}" não está disponível para reservas.`);
        const user = await this.userService.getUserById(userId);
        if (!user)
            throw new common_1.NotFoundException(`Usuário com ID ${userId} não encontrado.`);
        const [year, month, day] = date.split('-').map(Number);
        const reservationDate = new Date(year, month - 1, day);
        const startDateTime = new Date(year, month - 1, day, ...startTime.split(':').map(Number));
        const endDateTime = new Date(year, month - 1, day, ...endTime.split(':').map(Number));
        const now = new Date();
        if (startDateTime < now) {
            throw new common_1.BadRequestException('Não é permitido reservar uma sala para um horário no passado.');
        }
        const durationMinutes = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
        if (durationMinutes < 60) {
            throw new common_1.BadRequestException('A duração mínima de uma reserva é de 1 hora.');
        }
        if (startDateTime >= endDateTime) {
            throw new common_1.BadRequestException('O horário de término deve ser posterior ao horário de início.');
        }
        const overlappingReservations = await this.reservationRepository
            .createQueryBuilder('reservation')
            .where('reservation.roomId = :roomId', { roomId })
            .andWhere('reservation.date = :date', {
            date: this.formatDate(reservationDate),
        })
            .andWhere('(reservation.startTime < :endTime AND reservation.endTime > :startTime)', { startTime, endTime })
            .getMany();
        const hasOverlap = overlappingReservations.some((res) => {
            if (existingReservationId && res.id === existingReservationId)
                return false;
            return true;
        });
        if (hasOverlap) {
            throw new common_1.ConflictException('Já existe uma reserva sobreposta para esta sala e horário.');
        }
    }
    async create(createReservationDto) {
        console.log('🔵 [ReservationService.create] Dados recebidos:', createReservationDto);
        await this.validateReservation(createReservationDto);
        const reservation = this.reservationRepository.create(createReservationDto);
        const savedReservation = await this.reservationRepository.save(reservation);
        console.log('✅ [ReservationService.create] Reserva criada:', savedReservation);
        return savedReservation;
    }
    async findAll() {
        return await this.reservationRepository.find({
            relations: ['room', 'user'],
            order: { date: 'ASC', startTime: 'ASC' },
        });
    }
    async findByUser(userId) {
        return await this.reservationRepository.find({
            where: { userId },
            relations: ['room', 'user'],
            order: { date: 'ASC', startTime: 'ASC' },
        });
    }
    async findByRoom(roomId) {
        return await this.reservationRepository.find({
            where: { roomId },
            relations: ['room', 'user'],
            order: { date: 'ASC', startTime: 'ASC' },
        });
    }
    async findOne(id) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: ['room', 'user'],
        });
        if (!reservation)
            throw new common_1.NotFoundException(`Reserva com ID ${id} não encontrada.`);
        return reservation;
    }
    async update(id, updateReservationDto, requestingUserId, requestingUserRole) {
        const reservation = await this.findOne(id);
        if (requestingUserRole !== 'manager' &&
            reservation.userId !== requestingUserId) {
            throw new common_1.BadRequestException('Você não tem permissão para atualizar esta reserva.');
        }
        await this.validateReservation({
            ...reservation,
            ...updateReservationDto,
            userId: reservation.userId,
            roomId: reservation.roomId,
            date: reservation.date instanceof Date
                ? reservation.date.toISOString().split('T')[0]
                : reservation.date,
        }, id);
        Object.assign(reservation, updateReservationDto);
        const updatedReservation = await this.reservationRepository.save(reservation);
        console.log('✅ [ReservationService.update] Reserva atualizada:', updatedReservation);
        return updatedReservation;
    }
    async remove(id, requestingUserId, requestingUserRole) {
        const reservation = await this.findOne(id);
        if (requestingUserRole !== 'manager' &&
            reservation.userId !== requestingUserId) {
            throw new common_1.BadRequestException('Você não tem permissão para cancelar esta reserva.');
        }
        await this.reservationRepository.remove(reservation);
        console.log('✅ [ReservationService.remove] Reserva cancelada:', id);
    }
};
exports.ReserveService = ReserveService;
exports.ReserveService = ReserveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reserve_entity_1.ReserveEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        room_service_1.RoomService,
        user_service_1.UserService])
], ReserveService);
//# sourceMappingURL=reserve.service.js.map