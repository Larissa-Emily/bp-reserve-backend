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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/interface/user.entity");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.MAX_ATTEMPTS = 3;
        this.LOCK_TIME_MS = 10 * 60 * 1000; // 10 minutos
    }
    async validateUser(authDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { email: authDto.email },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Usuário não encontrado');
            }
            // 1️⃣ Verifica se a conta está bloqueada
            if (user.lock_until && user.lock_until > new Date()) {
                const timeLeft = Math.ceil((user.lock_until.getTime() - Date.now()) / 1000 / 60);
                throw new common_1.UnauthorizedException(`Conta bloqueada. Aguarde ${timeLeft} minuto(s) para tentar novamente.`);
            }
            // 2️⃣ Compara senha recebida com a salva
            const isPasswordValid = await bcrypt.compare(authDto.password, user.password);
            if (!isPasswordValid) {
                // Incrementa tentativas
                user.failed_attempts = (user.failed_attempts || 0) + 1;
                // Bloqueia se atingiu limite
                if (user.failed_attempts >= this.MAX_ATTEMPTS) {
                    user.lock_until = new Date(Date.now() + this.LOCK_TIME_MS);
                    user.failed_attempts = 0; // reseta contador
                    await this.userRepository.save(user);
                    throw new common_1.UnauthorizedException(`Muitas tentativas incorretas. Conta bloqueada por ${this.LOCK_TIME_MS / 60000} minutos.`);
                }
                // Atualiza contador sem bloquear ainda
                await this.userRepository.save(user);
                throw new common_1.UnauthorizedException('Senha incorreta');
            }
            // 3️⃣ Se senha correta, zera tentativas e desbloqueia
            if (user.failed_attempts > 0 || user.lock_until) {
                user.failed_attempts = 0;
                user.lock_until = null;
                await this.userRepository.save(user);
            }
            // 4️⃣ Gera token JWT
            const payload = {
                sub: user.id,
                name: user.name,
                sector: user.sector,
                functionUser: user.functionUser,
                phone: user.phone,
                email: user.email,
                role: user.role,
            };
            return {
                access_token: await this.jwtService.signAsync(payload),
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    sector: user.sector,
                    role: user.role,
                    functionUser: user.functionUser,
                    phone: user.phone,
                },
            };
        }
        catch (err) {
            if (err instanceof common_1.UnauthorizedException || err instanceof common_1.BadRequestException) {
                throw err;
            }
            throw new common_1.UnauthorizedException('Erro interno ao validar usuário');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map