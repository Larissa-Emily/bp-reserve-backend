import type { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './interface/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<UserEntity[]>;
    createUser(createUser: CreateUserDto): Promise<UserEntity>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
