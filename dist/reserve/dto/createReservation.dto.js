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
exports.CreateReservationDto = void 0;
const class_validator_1 = require("class-validator");
class CreateReservationDto {
}
exports.CreateReservationDto = CreateReservationDto;
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'A data deve ser uma string de data válida (YYYY-MM-DD)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A data é obrigatória.' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O horário de início deve ser uma string' }),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'O horário de início deve estar no formato HH:MM',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O horário de início é obrigatório.' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O horário de término deve ser uma string' }),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'O horário de término deve estar no formato HH:MM',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O horário de término é obrigatório.' }),
    __metadata("design:type", String)
], CreateReservationDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'O ID da sala deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'O ID da sala deve ser maior que 0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID da sala é obrigatório.' }),
    __metadata("design:type", Number)
], CreateReservationDto.prototype, "roomId", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'O ID do usuário deve ser um número inteiro' }),
    (0, class_validator_1.Min)(1, { message: 'O ID do usuário deve ser maior que 0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O ID do usuário é obrigatório.' }),
    __metadata("design:type", Number)
], CreateReservationDto.prototype, "userId", void 0);
//# sourceMappingURL=createReservation.dto.js.map