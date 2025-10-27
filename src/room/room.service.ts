import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './interface/room.entity';
import { CreateRoomDto } from './dto/createRoom.dto';
import { UpdateRoomDto } from './dto/updateRoom.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

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
  async remove(id: number): Promise<void> {
    const room = await this.findOne(id);
    await this.roomRepository.remove(room);
  }

  // Buscar salas disponíveis
  async findAvailable(): Promise<RoomEntity[]> {
    return await this.roomRepository.find({
      where: { isAvailable: true },
      order: { name: 'ASC' },
    });
  }
}
