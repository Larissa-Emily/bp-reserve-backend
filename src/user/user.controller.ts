import { Body, Controller, Delete, Get, Post, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './interface/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { UpdateUserDto } from './dto/updateUser.dto'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Roles("manager")
    @Get()
    async getAllUsers(): Promise<UserEntity[]> {
        return this.userService.getAllUsers()
    }

    @Roles('user', 'manager')
    @Get(':id')
    getUser(@Param('id') id: string) {
        return this.userService.getUser(+id)
    }
    @Roles("manager")
    @Post()
    async createUser(@Body() createUser: CreateUserDto) {
        return this.userService.createUser(createUser);
    }

    @Roles('user', 'manager')
    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(id, updateUserDto);
    }

    @Roles("manager")
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) { // <--- E aqui também
        return this.userService.remove(id);
    }
}