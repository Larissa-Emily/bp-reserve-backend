import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '../user/interface/user.entity';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    JwtModule.register({
      global: true, //nao será necessário importar o JwtModule em outro lugar
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' }, // duração de cada token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ],
  exports: [AuthService]
})
export class LoginModule { }
 