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
exports.CreateRoomDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRoomDto {
    name;
    description;
    capacity;
    location;
    isAvailable;
}
exports.CreateRoomDto = CreateRoomDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3, { message: 'O nome deve ter no mínimo 3 caracteres' }),
    (0, class_validator_1.MaxLength)(100, { message: 'O nome deve ter no máximo 100 caracteres' }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(255, { message: 'A descrição deve ter no máximo 255 caracteres' }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'A capacidade deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'A capacidade deve ser no mínimo 1' }),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "capacity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50, { message: 'A localização deve ter no máximo 50 caracteres' }),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRoomDto.prototype, "isAvailable", void 0);
//# sourceMappingURL=createRoom.dto.js.map