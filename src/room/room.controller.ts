import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { Roles } from '../decorators/roles.decorator';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Criar sala (apenas managers)
  @Roles('manager')
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    console.log('🔵 [POST /room] Criando sala:', createRoomDto.name);
    return this.roomService.create(createRoomDto);
  }

  // Listar todas as salas (todos os usuários logados)
  @Roles('user', 'manager')
  @Get()
  findAll() {
    console.log('🔵 [GET /room] Listando todas as salas');
    return this.roomService.findAll();
  }

  // Listar salas disponíveis (todos os usuários logados)
  @Roles('user', 'manager')
  @Get('available')
  findAvailable() {
    console.log('🔵 [GET /room/available] Listando salas disponíveis');
    return this.roomService.findAvailable();
  }

  // Buscar sala por ID (todos os usuários logados)
  @Roles('user', 'manager')
  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('🔵 [GET /room/:id] Buscando sala:', id);
    return this.roomService.findOne(+id);
  }

  // Atualizar sala (apenas managers)
  @Roles('manager')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    console.log('🔵 [PATCH /room/:id] Atualizando sala:', id);
    return this.roomService.update(+id, updateRoomDto);
  }

  // Deletar sala (apenas managers)
  @Roles('manager')
  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('🔵 [DELETE /room/:id] Deletando sala:', id);
    return this.roomService.remove(+id);
  }
}
