import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './interface/room.entity';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';
import { ReserveEntity } from '../reserve/interface/reserve.entity';
@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,

    @InjectRepository(ReserveEntity)
    private readonly reserveRepository: Repository<ReserveEntity>,
  ) { }
  // Criar sala
  async create(createRoomDto: CreateRoomDto): Promise<RoomEntity> {
    // Verifica se já existe uma sala com esse nome
    const existingRoom = await this.roomRepository.findOne({
      where: { name: createRoomDto.name },
    });

    if (existingRoom) {
      throw new ConflictException('Já existe uma sala com esse nome');
    }

    const room = this.roomRepository.create(createRoomDto);
    return await this.roomRepository.save(room);
  }

  // Listar todas as salas
  async findAll(): Promise<RoomEntity[]> {
    return await this.roomRepository.find({
      order: { name: 'ASC' },
    });
  }

  // Buscar sala por ID
  async findOne(id: number): Promise<RoomEntity> {
    const room = await this.roomRepository.findOne({ where: { id } });

    if (!room) {
      throw new NotFoundException(`Sala com ID ${id} não encontrada`);
    }

    return room;
  }

  // Atualizar sala
  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    const room = await this.findOne(id);

    // Se está tentando mudar o nome, verifica se já existe
    if (updateRoomDto.name && updateRoomDto.name !== room.name) {
      const existingRoom = await this.roomRepository.findOne({
        where: { name: updateRoomDto.name },
      });

      if (existingRoom) {
        throw new ConflictException('Já existe uma sala com esse nome');
      }
    }

    Object.assign(room, updateRoomDto);
    return await this.roomRepository.save(room);
  }

  // Deletar sala
  async remove(id: number): Promise<{ message: string }> {
    const room = await this.roomRepository.findOne({ where: { id } });

    if (!room) {
      throw new NotFoundException("Sala não encontrada");
    }

    // Aqui deleta todas as reservas da sala selecionada
    await this.reserveRepository.delete({ room: { id } })

    // Aqui deleta a sala
    await this.roomRepository.remove(room);

    return { message: 'Sala e reservas deletadas com sucesso!' }
  }

  // Buscar salas disponíveis
  async findAvailable(): Promise<RoomEntity[]> {
    return await this.roomRepository.find({
      where: { isAvailable: true },
      order: { name: 'ASC' },
    });
  }
}
