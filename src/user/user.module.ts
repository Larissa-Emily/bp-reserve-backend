import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './interface/user.entity';
import { ReserveEntity } from '../reserve/interface/reserve.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ReserveEntity])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
