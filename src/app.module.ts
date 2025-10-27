import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './login/login.module';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { RoomModule } from './room/room.module';
import { ReserveController } from './reserve/reserve.controller';
import { ReserveModule } from './reserve/reserve.module';
@Module({
  imports: [
    LoginModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [`${__dirname}/.migration/{.ts, *.js}`],
      migrationsRun: true,
      synchronize: true,
    }),
    UserModule,
    LoginModule,
    RoomModule,
    ReserveModule,
    ReserveModule
  ],
  controllers: [ReserveController],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard, // valida token
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard, // valida role
  }
  ],
})
export class AppModule { }