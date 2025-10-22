import { UserEntity } from './interface/user.entity';
import type { CreateUserDto } from './dto/createUser.dto';
import { Repository } from 'typeorm';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    createUser(createUserDto: CreateUserDto): Promise<UserEntity>;
    getAllUsers(): Promise<UserEntity[]>;
}
