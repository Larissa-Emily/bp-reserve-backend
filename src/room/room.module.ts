import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './interface/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller'; // se você tiver

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity]) // ISSO É ESSENCIAL!
  ],
  controllers: [RoomController], // se você tiver um controller
  providers: [RoomService],
  exports: [RoomService] // se precisar usar em outros módulos
})
export class RoomModule {}
