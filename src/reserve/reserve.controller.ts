import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ReserveService } from './reserve.service';
import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { Roles } from '../decorators/roles.decorator';
import type { Request } from 'express'; // Para acessar o usuário do token

// Interface para o payload do token (se você já tiver uma, use-a)
interface JwtPayload {
    sub: number; 
    name: string;
    sector: string;
    email: string;
    role: string

}

@Controller('reservation')
export class ReserveController {
    constructor(private readonly reserveService: ReserveService) { }

    // Criar reserva (qualquer usuário logado)
    @Roles('user', 'manager')
    @Post()
    async create(@Body() createReservationDto: CreateReservationDto, @Req() req: Request) {
        const user = req.user as JwtPayload; // Obtém o usuário do token
        createReservationDto.userId = user.sub; // Garante que o userId é do usuário logado

        console.log('🔵 [POST /reservation] Criando reserva para sala:', createReservationDto.roomId);
        return this.reserveService.create(createReservationDto);
    }

    // Listar todas as reservas (apenas managers)
    @Roles('manager')
    @Get()
    async findAll() {
        console.log('🔵 [GET /reservation] Listando todas as reservas');
        return this.reserveService.findAll();
    }

    // Listar minhas reservas (usuário logado)
    @Roles('user', 'manager')
    @Get('my')
    async findMyReservations(@Req() req: Request) {
        const user = req.user as JwtPayload;
        console.log(`🔵 [GET /reservation/my] Listando reservas do usuário: ${user.sub}`);
        return this.reserveService.findByUser(user.sub);
    }

    // Listar reservas de uma sala específica (todos os usuários logados)
    @Roles('user', 'manager')
    @Get('room/:roomId')
    async findByRoom(@Param('roomId') roomId: string) {
        console.log(`🔵 [GET /reservation/room/:roomId] Listando reservas da sala: ${roomId}`);
        return this.reserveService.findByRoom(+roomId);
    }

    // Buscar reserva por ID (todos os usuários logados)
    @Roles('user', 'manager')
    @Get(':id')
    async findOne(@Param('id') id: string) {
        console.log(`🔵 [GET /reservation/:id] Buscando reserva: ${id}`);
        return this.reserveService.findOne(+id);
    }

    // Atualizar reserva (usuário responsável ou manager)
    @Roles('user', 'manager')
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto, @Req() req: Request) {
        const user = req.user as JwtPayload;
        console.log(`🔵 [PATCH /reservation/:id] Atualizando reserva ${id} pelo usuário ${user.sub}`);
        return this.reserveService.update(+id, updateReservationDto, user.sub, user.role);
    }

    // Cancelar/Deletar reserva (usuário responsável ou manager)
    @Roles('user', 'manager')
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request) {
        const user = req.user as JwtPayload;
        console.log(`🔵 [DELETE /reservation/:id] Cancelando reserva ${id} pelo usuário ${user.sub}`);
        return this.reserveService.remove(+id, user.sub, user.role);
    }
}
