import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './interface/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller'; // se você tiver
import { ReserveEntity } from '../reserve/interface/reserve.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomEntity, ReserveEntity]) 
  ],
  controllers: [RoomController], 
  providers: [RoomService],
  exports: [RoomService] 
})
export class RoomModule {}
