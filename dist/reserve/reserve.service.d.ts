import { Repository } from 'typeorm';
import { ReserveEntity } from './interface/reserve.entity';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { RoomService } from '../room/room.service';
import { UserService } from '../user/user.service';
export declare class ReserveService {
    private readonly reservationRepository;
    private readonly roomService;
    private readonly userService;
    constructor(reservationRepository: Repository<ReserveEntity>, roomService: RoomService, userService: UserService);
    private timeToMinutes;
    private formatDate;
    private validateReservation;
    create(createReservationDto: CreateReservationDto): Promise<ReserveEntity>;
    findAll(): Promise<ReserveEntity[]>;
    findByUser(userId: number): Promise<ReserveEntity[]>;
    findByRoom(roomId: number): Promise<ReserveEntity[]>;
    findOne(id: number): Promise<ReserveEntity>;
    update(id: number, updateReservationDto: UpdateReservationDto, requestingUserId: number, requestingUserRole: string): Promise<ReserveEntity>;
    remove(id: number, requestingUserId: number, requestingUserRole: string): Promise<void>;
}
