import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { Roles } from '../decorators/roles.decorator';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Roles('manager')
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Roles('user', 'manager') 
  @Get()
  findAll() {
    return this.roomService.findAll();
  }

  @Roles('user', 'manager')
  @Get('available')
  findAvailable() {
    return this.roomService.findAvailable();
  }

  @Roles('user', 'manager')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Roles('manager')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Roles('manager')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
