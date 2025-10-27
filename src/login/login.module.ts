import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '../user/interface/user.entity';
import { UserModule } from '../user/user.module';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
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
  controllers: [LoginController],
  providers: [LoginService, ],
  exports: [LoginService]
})
export class LoginModule { }
 