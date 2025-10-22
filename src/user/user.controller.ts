import { Body, Controller, Get, Post } from '@nestjs/common';
import type { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './interface/user.entity';
@Controller('user')
export class UserController {
    constructor(private readonly useService: UserService) { }
    @Get()
    async getAllUsers(): Promise<UserEntity[]> {
        return this.useService.getAllUsers()
    }
    @Post()
    async createUser(@Body() createUser: CreateUserDto): Promise<UserEntity> {
        return this.useService.createUser(createUser);
    }
}
