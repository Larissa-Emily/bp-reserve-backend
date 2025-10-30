"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const user_module_1 = require("./user/user.module");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./login/auth.module");
const auth_guard_1 = require("./guards/auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const core_1 = require("@nestjs/core");
const room_module_1 = require("./room/room.module");
const reserve_controller_1 = require("./reserve/reserve.controller");
const reserve_module_1 = require("./reserve/reserve.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.LoginModule,
            config_1.ConfigModule.forRoot({
                envFilePath: ['.env.development.local', '.env.development'],
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                database: process.env.DB_DATABASE,
                host: process.env.DB_HOST,
                password: process.env.DB_PASSWORD,
                port: Number(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                migrations: [`${__dirname}/.migration/{.ts, *.js}`],
                migrationsRun: true,
                synchronize: process.env.NODE_ENV !== 'production', // Use essa abordagem
            }),
            user_module_1.UserModule,
            auth_module_1.LoginModule,
            room_module_1.RoomModule,
            reserve_module_1.ReserveModule,
            reserve_module_1.ReserveModule
        ],
        controllers: [reserve_controller_1.ReserveController],
        providers: [{
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard, // valida token
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard, // valida role
            }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map