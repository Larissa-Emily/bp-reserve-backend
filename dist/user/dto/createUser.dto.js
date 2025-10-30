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
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'O nome deve ser uma string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O nome não pode ser vazio.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O setor deve ser uma string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O setor não pode ser vazio.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "sector", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'A função deve ser uma string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A função não pode ser vazia.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "functionUser", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'O telefone deve ser uma string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O telefone não pode ser vazio.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'O email deve ser um endereço de email válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O email não pode ser vazio.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'A senha deve ser uma string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A senha não pode ser vazia.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'A role deve ser uma string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A role não pode ser vazia.' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
//# sourceMappingURL=createUser.dto.js.map