import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReserveEntity } from './interface/reserve.entity';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { RoomService } from '../room/room.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ReserveService {
    constructor(
        @InjectRepository(ReserveEntity)
        private readonly reservationRepository: Repository<ReserveEntity>,
        private readonly roomService: RoomService,
        private readonly userService: UserService,
    ) { }

    /** Converte "HH:MM" para minutos do dia */
    private timeToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    /** Formata data (YYYY-MM-DD) */
    private formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    /** 🔍 Validações de reserva */
    private async validateReservation(
        dto: CreateReservationDto | UpdateReservationDto,
        existingReservationId?: number, // usado em updates
    ): Promise<void> {
        const { date, startTime, endTime, roomId, userId } = dto;

        // 🧩 1. Verificação de campos obrigatórios
        if (!roomId) throw new BadRequestException('O ID da sala é obrigatório.');
        if (!userId) throw new BadRequestException('O ID do usuário é obrigatório.');
        if (!date) throw new BadRequestException('A data da reserva é obrigatória.');
        if (!startTime || !endTime)
            throw new BadRequestException('Os horários de início e término são obrigatórios.');

        // 🧱 2. Verifica se a sala existe e está disponível
        const room = await this.roomService.findOne(roomId);
        if (!room) throw new NotFoundException(`Sala com ID ${roomId} não encontrada.`);
        if (!room.isAvailable)
            throw new BadRequestException(`A sala "${room.name}" não está disponível para reservas.`);

        // 👤 3. Verifica se o usuário existe
        const user = await this.userService.getUserById(userId);
        if (!user) throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);

        // 📅 4. Verificações de tempo
        // Força a data a ser interpretada como local, não UTC
        const [year, month, day] = date.split('-').map(Number);
        const reservationDate = new Date(year, month - 1, day);
        const startDateTime = new Date(year, month - 1, day, ...startTime.split(':').map(Number));
        const endDateTime = new Date(year, month - 1, day, ...endTime.split(':').map(Number));

        const now = new Date();

        if (startDateTime < now) {
            throw new BadRequestException(
                'Não é permitido reservar uma sala para um horário no passado.',
            );
        }

        const durationMinutes =
            (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
        if (durationMinutes < 60) {
            throw new BadRequestException('A duração mínima de uma reserva é de 1 hora.');
        }
        if (startDateTime >= endDateTime) {
            throw new BadRequestException(
                'O horário de término deve ser posterior ao horário de início.',
            );
        }

        // ⏰ 5. Verifica sobreposição
        const overlappingReservations = await this.reservationRepository
            .createQueryBuilder('reservation')
            .where('reservation.roomId = :roomId', { roomId })
            .andWhere('reservation.date = :date', {
                date: this.formatDate(reservationDate),
            })
            .andWhere(
                '(reservation.startTime < :endTime AND reservation.endTime > :startTime)',
                { startTime, endTime },
            )
            .getMany();

        const hasOverlap = overlappingReservations.some((res) => {
            // Ignora a própria reserva no update
            if (existingReservationId && res.id === existingReservationId) return false;
            return true;
        });

        if (hasOverlap) {
            throw new ConflictException(
                'Já existe uma reserva sobreposta para esta sala e horário.',
            );
        }
    }

    /** 🟢 Criar reserva */
    async create(createReservationDto: CreateReservationDto): Promise<ReserveEntity> {
        console.log('🔵 [ReservationService.create] Dados recebidos:', createReservationDto);

        await this.validateReservation(createReservationDto);

        const reservation = this.reservationRepository.create(createReservationDto);
        const savedReservation = await this.reservationRepository.save(reservation);

        console.log('✅ [ReservationService.create] Reserva criada:', savedReservation);
        return savedReservation;
    }

    /** 📋 Listar todas as reservas (gerente) */
    async findAll(): Promise<ReserveEntity[]> {
        return await this.reservationRepository.find({
            relations: ['room', 'user'],
            order: { date: 'ASC', startTime: 'ASC' },
        });
    }

    /** 👤 Listar reservas por usuário */
    async findByUser(userId: number): Promise<ReserveEntity[]> {
        return await this.reservationRepository.find({
            where: { userId },
            relations: ['room', 'user'],
            order: { date: 'ASC', startTime: 'ASC' },
        });
    }

    /** 🏢 Listar reservas por sala */
    async findByRoom(roomId: number): Promise<ReserveEntity[]> {
        return await this.reservationRepository.find({
            where: { roomId },
            relations: ['room', 'user'],
            order: { date: 'ASC', startTime: 'ASC' },
        });
    }

    /** 🔍 Buscar reserva por ID */
    async findOne(id: number): Promise<ReserveEntity> {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: ['room', 'user'],
        });

        if (!reservation)
            throw new NotFoundException(`Reserva com ID ${id} não encontrada.`);

        return reservation;
    }

    async update(
        id: number,
        updateReservationDto: UpdateReservationDto,
        requestingUserId: number,
        requestingUserRole: string,
    ): Promise<ReserveEntity> {
        const reservation = await this.findOne(id);

        // 🔒 Permissão
        if (
            requestingUserRole !== 'manager' &&
            reservation.userId !== requestingUserId
        ) {
            throw new BadRequestException(
                'Você não tem permissão para atualizar esta reserva.',
            );
        }

        // ✅ Valida nova reserva
        await this.validateReservation(
            {
                ...reservation,
                ...updateReservationDto,
                userId: reservation.userId,
                roomId: reservation.roomId,
                date:
                    reservation.date instanceof Date
                        ? reservation.date.toISOString().split('T')[0]
                        : reservation.date,
            },
            id,
        );

        Object.assign(reservation, updateReservationDto);
        const updatedReservation = await this.reservationRepository.save(reservation);

        console.log('✅ [ReservationService.update] Reserva atualizada:', updatedReservation);
        return updatedReservation;
    }

    /** ❌ Cancelar reserva */
    async remove(
        id: number,
        requestingUserId: number,
        requestingUserRole: string,
    ): Promise<void> {
        const reservation = await this.findOne(id);

        // 🔒 Permissão
        if (
            requestingUserRole !== 'manager' &&
            reservation.userId !== requestingUserId
        ) {
            throw new BadRequestException(
                'Você não tem permissão para cancelar esta reserva.',
            );
        }

        await this.reservationRepository.remove(reservation);
        console.log('✅ [ReservationService.remove] Reserva cancelada:', id);
    }
}
