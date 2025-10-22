import type { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './interface/user.entity';
export declare class UserController {
    private readonly useService;
    constructor(useService: UserService);
    getAllUsers(): Promise<UserEntity[]>;
    createUser(createUser: CreateUserDto): Promise<UserEntity>;
}
