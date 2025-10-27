"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveEntity = void 0;
const typeorm_1 = require("typeorm");
const room_entity_1 = require("../../room/interface/room.entity");
const user_entity_1 = require("../../user/interface/user.entity");
let ReserveEntity = class ReserveEntity {
    id;
    date;
    startTime;
    endTime;
    roomId;
    room;
    userId;
    user;
    createdAt;
    updatedAt;
};
exports.ReserveEntity = ReserveEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReserveEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], ReserveEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 5 }),
    __metadata("design:type", String)
], ReserveEntity.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 5 }),
    __metadata("design:type", String)
], ReserveEntity.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReserveEntity.prototype, "roomId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => room_entity_1.RoomEntity, room => room.reservations),
    (0, typeorm_1.JoinColumn)({ name: 'roomId' }),
    __metadata("design:type", room_entity_1.RoomEntity)
], ReserveEntity.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReserveEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, user => user.reservations),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.UserEntity)
], ReserveEntity.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReserveEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ReserveEntity.prototype, "updatedAt", void 0);
exports.ReserveEntity = ReserveEntity = __decorate([
    (0, typeorm_1.Entity)('reservations')
], ReserveEntity);
//# sourceMappingURL=reserve.entity.js.map