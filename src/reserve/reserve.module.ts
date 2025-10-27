import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReserveService } from './reserve.service';
import { ReserveController } from './reserve.controller';
import { ReserveEntity } from './interface/reserve.entity';
import { RoomModule } from '../room/room.module';
import { UserModule } from '../user/user.module'; // ← VERIFIQUE O CAMINHO AQUI TAMBÉM

@Module({
  imports: [
    TypeOrmModule.forFeature([ReserveEntity]),
    RoomModule,
    UserModule, 
  ],
  controllers: [ReserveController],
  providers: [ReserveService],
  exports: [ReserveService],
})
export class ReserveModule {}
