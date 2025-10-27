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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReserveController = void 0;
const common_1 = require("@nestjs/common");
const reserve_service_1 = require("./reserve.service");
const createReservation_dto_1 = require("./dto/createReservation.dto");
const updateReservation_dto_1 = require("./dto/updateReservation.dto");
const roles_decorator_1 = require("../decorators/roles.decorator");
let ReserveController = class ReserveController {
    reserveService;
    constructor(reserveService) {
        this.reserveService = reserveService;
    }
    async create(createReservationDto, req) {
        const user = req.user;
        createReservationDto.userId = user.sub;
        console.log('🔵 [POST /reservation] Criando reserva para sala:', createReservationDto.roomId);
        return this.reserveService.create(createReservationDto);
    }
    async findAll() {
        console.log('🔵 [GET /reservation] Listando todas as reservas');
        return this.reserveService.findAll();
    }
    async findMyReservations(req) {
        const user = req.user;
        console.log(`🔵 [GET /reservation/my] Listando reservas do usuário: ${user.sub}`);
        return this.reserveService.findByUser(user.sub);
    }
    async findByRoom(roomId) {
        console.log(`🔵 [GET /reservation/room/:roomId] Listando reservas da sala: ${roomId}`);
        return this.reserveService.findByRoom(+roomId);
    }
    async findOne(id) {
        console.log(`🔵 [GET /reservation/:id] Buscando reserva: ${id}`);
        return this.reserveService.findOne(+id);
    }
    async update(id, updateReservationDto, req) {
        const user = req.user;
        console.log(`🔵 [PATCH /reservation/:id] Atualizando reserva ${id} pelo usuário ${user.sub}`);
        return this.reserveService.update(+id, updateReservationDto, user.sub, user.role);
    }
    async remove(id, req) {
        const user = req.user;
        console.log(`🔵 [DELETE /reservation/:id] Cancelando reserva ${id} pelo usuário ${user.sub}`);
        return this.reserveService.remove(+id, user.sub, user.role);
    }
};
exports.ReserveController = ReserveController;
__decorate([
    (0, roles_decorator_1.Roles)('user', 'manager'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createReservation_dto_1.CreateReservationDto, Object]),
    __metadata("design:returntype", Promise)
], ReserveController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)('manager'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReserveController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)('user', 'manager'),
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReserveController.prototype, "findMyReservations", null);
__decorate([
    (0, roles_decorator_1.Roles)('user', 'manager'),
    (0, common_1.Get)('room/:roomId'),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReserveController.prototype, "findByRoom", null);
__decorate([
    (0, roles_decorator_1.Roles)('user', 'manager'),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReserveController.prototype, "findOne", null);
__decorate([
    (0, roles_decorator_1.Roles)('user', 'manager'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateReservation_dto_1.UpdateReservationDto, Object]),
    __metadata("design:returntype", Promise)
], ReserveController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)('user', 'manager'),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReserveController.prototype, "remove", null);
exports.ReserveController = ReserveController = __decorate([
    (0, common_1.Controller)('reservation'),
    __metadata("design:paramtypes", [reserve_service_1.ReserveService])
], ReserveController);
//# sourceMappingURL=reserve.controller.js.map