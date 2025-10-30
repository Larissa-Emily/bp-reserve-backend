import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { Roles } from '../decorators/roles.decorator';
import type { Request } from 'express';
import { ReserveEntity } from './interface/reserve.entity';

interface JwtPayload {
  sub: number;
  name: string;
  sector: string;
  email: string;
  role: string;
}

@Controller('reservation')
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) { }

  // Criar reserva
  @Roles('user', 'manager')
  @Post()
  async create(@Body() dto: CreateReservationDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    dto.userId = user.sub;
    return this.reserveService.create(dto);
  }

  // Listar todas as reservas
  @Roles('user', 'manager')
  @Get()
  async findAll(): Promise<ReserveEntity[]> {
    return this.reserveService.findAll();
  }

  // Buscar reserva por ID
  @Roles('user', 'manager')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.reserveService.findOne(+id);
  }
@Roles('user', 'manager')
@Get('user/:userId')
async findByUser(@Param('userId') userId: string) {
  return this.reserveService.findByUser(+userId);
}
  // Atualizar reserva
  @Roles('user', 'manager')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateReservationDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.reserveService.update(+id, dto, user.sub, user.role);
  }

  // Cancelar reserva
  @Roles('user', 'manager')
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.reserveService.remove(+id, user.sub, user.role);
  }
}
