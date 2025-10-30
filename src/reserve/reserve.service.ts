import {
    Injectable,
    ConflictException,
    NotFoundException,
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



    private async validateReservation(
        dto: CreateReservationDto | UpdateReservationDto,
        existingReservationId?: number, // usado em updates
    ): Promise<void> {
        const { date, startTime, endTime, roomId, userId } = dto;

        // Verificação de campos obrigatórios
        if (!roomId) throw new NotFoundException('O ID da sala é obrigatório.');
        if (!userId) throw new NotFoundException('O ID do usuário é obrigatório.');
        if (!date) throw new NotFoundException('A data da reserva é obrigatória.');
        if (!startTime || !endTime)
            throw new NotFoundException('Os horários de início e término são obrigatórios.');

        // Verifica se a sala existe e está disponível
        const room = await this.roomService.findOne(roomId);
        if (!room) throw new NotFoundException(`Sala com ID ${roomId} não encontrada.`);
        if (!room.isAvailable)
            throw new NotFoundException(`A sala "${room.name}" não está disponível para reservas.`);

        // Verifica se o usuário existe
        const user = await this.userService.getUserById(userId);
        if (!user) throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);

        //  Verificações de tempo
        const [year, month, day] = date.split('-').map(Number);
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        // Cria datas no fuso local
        const startDateTime = new Date(year, month - 1, day, startHour, startMinute);
        const endDateTime = new Date(year, month - 1, day, endHour, endMinute);
        const now = new Date();

        if (startDateTime < now) {
            throw new NotFoundException(
                'Não é permitido reservar uma sala para um horário no passado.',
            );
        }

        const durationMinutes =
            (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60);
        if (durationMinutes < 60) {
            throw new NotFoundException('A duração mínima de uma reserva é de 1 hora.');
        }
        if (startDateTime >= endDateTime) {
            throw new NotFoundException(
                'O horário de término deve ser posterior ao horário de início.',
            );
        }

        // Verifica sobreposição
        const overlappingReservations = await this.reservationRepository
            .createQueryBuilder('reservation')
            .where('reservation.roomId = :roomId', { roomId })
            .andWhere('reservation.date = :date', { date })
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

    async create(createReservationDto: CreateReservationDto): Promise<ReserveEntity> {
        await this.validateReservation(createReservationDto);

        const reservation = this.reservationRepository.create(createReservationDto);
        const savedReservation = await this.reservationRepository.save(reservation);
        return savedReservation;
    }

    async findAll(): Promise<ReserveEntity[]> {
        return await this.reservationRepository.find({
            relations: ['room', 'user'],
            order: { date: 'ASC', startTime: 'ASC' },
        });
    }

    async findOne(id: number): Promise<ReserveEntity> {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: ['room', 'user'],
        });

        if (!reservation)
            throw new NotFoundException(`Reserva com ID ${id} não encontrada.`);

        return reservation;
    }
    async findByUser(userId: number): Promise<ReserveEntity[]> {
        const reservations = await this.reservationRepository.find({
            where: { user: { id: userId } },
            relations: ['room', 'user'],
        });

        if (!reservations.length) {
            throw new NotFoundException(`Nenhuma reserva encontrada para o usuário ${userId}`);
        }

        return reservations;
    }
    async update(
        id: number,
        updateReservationDto: UpdateReservationDto,
        requestingUserId: number,
        requestingUserRole: string,
    ): Promise<ReserveEntity> {
        const reservation = await this.findOne(id);

        if (
            requestingUserRole !== 'manager' &&
            reservation.userId !== requestingUserId
        ) {
            throw new NotFoundException(
                'Você não tem permissão para atualizar esta reserva.',
            );
        }

        await this.validateReservation(
            {
                ...reservation,
                ...updateReservationDto,
                userId: reservation.userId,
                roomId: reservation.roomId,
                date: updateReservationDto.date || reservation.date, // pega a nova data, ou a antiga
            },
            id,
        );

        Object.assign(reservation, updateReservationDto);
        const updatedReservation = await this.reservationRepository.save(reservation);

        return updatedReservation;
    }

    async remove(
        id: number,
        requestingUserId: number,
        requestingUserRole: string,
    ): Promise<void> {
        const reservation = await this.findOne(id);

        if (
            requestingUserRole !== 'manager' &&
            reservation.userId !== requestingUserId
        ) {
            throw new NotFoundException(
                'Você não tem permissão para cancelar esta reserva.',
            );
        }

        await this.reservationRepository.remove(reservation);
    }
}
