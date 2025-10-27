import { UserEntity } from './interface/user.entity';
import type { CreateUserDto } from './dto/createUser.dto';
import { Repository } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    getUserById(id: number): Promise<UserEntity>;
    getAllUsers(): Promise<UserEntity[]>;
    createUser(createUserDto: CreateUserDto): Promise<UserEntity>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
