import { Repository } from 'typeorm';
import { RoomEntity } from './interface/room.entity';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
export declare class RoomService {
    private readonly roomRepository;
    constructor(roomRepository: Repository<RoomEntity>);
    create(createRoomDto: CreateRoomDto): Promise<RoomEntity>;
    findAll(): Promise<RoomEntity[]>;
    findOne(id: number): Promise<RoomEntity>;
    update(id: number, updateRoomDto: UpdateRoomDto): Promise<RoomEntity>;
    remove(id: number): Promise<void>;
    findAvailable(): Promise<RoomEntity[]>;
}
