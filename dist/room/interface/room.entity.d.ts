import { ReserveEntity } from '../../reserve/interface/reserve.entity';
export declare class RoomEntity {
    id: number;
    name: string;
    description: string;
    capacity: number;
    location: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
    reservations: ReserveEntity[];
}
