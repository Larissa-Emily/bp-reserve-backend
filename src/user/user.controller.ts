import { Body, Controller, Delete, Get, Post, Param, Patch, UseGuards } from '@nestjs/common';
import type { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './interface/user.entity';
import { Roles } from 'src/decorators/roles.decorator';
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Roles("manager")
    @Get()
    async getAllUsers(): Promise<UserEntity[]> {
        return this.userService.getAllUsers()
    }
    @Roles("manager")
    @Post()
    async createUser(@Body() createUser: CreateUserDto) {
        return this.userService.createUser(createUser);
    }

    @Roles("manager")
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }
}
