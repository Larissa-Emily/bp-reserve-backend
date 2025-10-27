import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    create(createRoomDto: CreateRoomDto): Promise<import("./interface/room.entity").RoomEntity>;
    findAll(): Promise<import("./interface/room.entity").RoomEntity[]>;
    findAvailable(): Promise<import("./interface/room.entity").RoomEntity[]>;
    findOne(id: string): Promise<import("./interface/room.entity").RoomEntity>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<import("./interface/room.entity").RoomEntity>;
    remove(id: string): Promise<void>;
}
