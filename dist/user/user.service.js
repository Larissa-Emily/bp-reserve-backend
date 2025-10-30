"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./interface/user.entity");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reserve_entity_1 = require("../reserve/interface/reserve.entity");
let UserService = UserService_1 = class UserService {
    constructor(userRepository, reserveRepository) {
        this.userRepository = userRepository;
        this.reserveRepository = reserveRepository;
        this.logger = new common_1.Logger(UserService_1.name); // Adicione o logger
    }
    // Metodo para ser reutilizavel
    async getUserById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Usuário com ID ${id} não encontrado`);
        }
        return user;
    }
    //Rota Get - pegar todos os usuarios
    async getAllUsers() {
        return this.userRepository.find();
    }
    async getUser(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Erro ao buscar usuario: ${id}`);
        }
        return user;
    }
    // Rota Post - criar novos usuarios
    async createUser(createUserDto) {
        const saltOrRounds = 10;
        const passwordHashed = await bcrypt.hash(createUserDto.password, saltOrRounds);
        return this.userRepository.save({
            ...createUserDto,
            password: passwordHashed,
        });
    }
    // rota de update - atualizar os dados por id 
    async update(id, updateUserDto) {
        this.logger.log(`Tentativa de atualizar usuário com ID: ${id}`);
        this.logger.log(`Dados recebidos para atualização: ${JSON.stringify(updateUserDto)}`);
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            this.logger.warn(`Usuário com ID ${id} não encontrado.`);
            throw new common_1.NotFoundException(`Usuário com o ID ${id} não encontrado.`);
        }
        Object.assign(user, updateUserDto);
        this.logger.log(`Objeto do usuário mesclado, pronto para salvar.`);
        const updatedUser = await this.userRepository.save(user);
        this.logger.log(`Usuário com ID ${updatedUser.id} salvo com sucesso.`);
        return updatedUser;
    }
    //rota Delete - remover um usuario por id 
    async remove(id) {
        const user = await this.getUserById(id); // ← Chama o método
        if (!user) {
            throw new common_1.NotFoundException("Usuario não encontrado!");
        }
        // Aqui deleta todas as reservas do usuario deletado
        await this.reserveRepository.delete({ user: { id } });
        // Aqui deleta o usuario
        await this.userRepository.remove(user);
        return { message: `Usuário ${user.name} foi deletado com sucesso` };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = UserService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(reserve_entity_1.ReserveEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map