"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reserve_service_1 = require("./reserve.service");
const reserve_controller_1 = require("./reserve.controller");
const reserve_entity_1 = require("./interface/reserve.entity");
const room_module_1 = require("../room/room.module");
const user_module_1 = require("../user/user.module");
let ReserveModule = class ReserveModule {
};
exports.ReserveModule = ReserveModule;
exports.ReserveModule = ReserveModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([reserve_entity_1.ReserveEntity]),
            room_module_1.RoomModule,
            user_module_1.UserModule,
        ],
        controllers: [reserve_controller_1.ReserveController],
        providers: [reserve_service_1.ReserveService],
        exports: [reserve_service_1.ReserveService],
    })
], ReserveModule);
//# sourceMappingURL=reserve.module.js.map