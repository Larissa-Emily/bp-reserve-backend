import { ReserveService } from './reserve.service';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import type { Request } from 'express';
export declare class ReserveController {
    private readonly reserveService;
    constructor(reserveService: ReserveService);
    create(createReservationDto: CreateReservationDto, req: Request): Promise<import("./interface/reserve.entity").ReserveEntity>;
    findAll(): Promise<import("./interface/reserve.entity").ReserveEntity[]>;
    findMyReservations(req: Request): Promise<import("./interface/reserve.entity").ReserveEntity[]>;
    findByRoom(roomId: string): Promise<import("./interface/reserve.entity").ReserveEntity[]>;
    findOne(id: string): Promise<import("./interface/reserve.entity").ReserveEntity>;
    update(id: string, updateReservationDto: UpdateReservationDto, req: Request): Promise<import("./interface/reserve.entity").ReserveEntity>;
    remove(id: string, req: Request): Promise<void>;
}
