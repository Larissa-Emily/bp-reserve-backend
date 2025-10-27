import { RoomEntity } from '../../room/interface/room.entity';
import { UserEntity } from '../../user/interface/user.entity';
export declare class ReserveEntity {
    id: number;
    date: Date;
    startTime: string;
    endTime: string;
    roomId: number;
    room: RoomEntity;
    userId: number;
    user: UserEntity;
    createdAt: Date;
    updatedAt: Date;
}
