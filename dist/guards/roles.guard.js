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
exports.RolesGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const roles_decorator_1 = require("../decorators/roles.decorator");
const public_decorator_1 = require("../decorators/public.decorator");
let RolesGuard = class RolesGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        console.log('🔒 [RolesGuard] Verificando permissões...');
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('📍 [RolesGuard] É pública?', isPublic);
        if (isPublic) {
            console.log('✅ [RolesGuard] Rota pública, liberando...');
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        console.log('👤 [RolesGuard] User payload:', user);
        if (!user || !user.role) {
            console.log('❌ [RolesGuard] Usuário sem role!');
            throw new common_1.ForbiddenException('Usuário sem permissão definida');
        }
        const requiredRoles = this.reflector.getAllAndOverride(roles_decorator_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('🔑 [RolesGuard] Roles necessárias:', requiredRoles);
        console.log('👤 [RolesGuard] Role do usuário:', user.role);
        if (!requiredRoles || requiredRoles.length === 0) {
            console.log('❌ [RolesGuard] Rota sem roles definidas!');
            throw new common_1.ForbiddenException('Rota sem permissões definidas');
        }
        const hasRole = requiredRoles.some((role) => user.role === role);
        console.log('✅ [RolesGuard] Tem permissão?', hasRole);
        if (!hasRole) {
            console.log('🚫 [RolesGuard] Acesso negado!');
            throw new common_1.ForbiddenException(`Acesso negado. Você é: ${user.role}. Necessário: ${requiredRoles.join(' ou ')}`);
        }
        console.log('✅ [RolesGuard] Acesso liberado!');
        return true;
    }
};
exports.RolesGuard = RolesGuard;
exports.RolesGuard = RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], RolesGuard);
//# sourceMappingURL=roles.guard.js.map