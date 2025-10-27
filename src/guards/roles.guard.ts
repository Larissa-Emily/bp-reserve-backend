import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('🔒 [RolesGuard] Verificando permissões...');

    // Verifica se a rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('📍 [RolesGuard] É pública?', isPublic);

    if (isPublic) {
      console.log('✅ [RolesGuard] Rota pública, liberando...');
      return true;
    }

    // Pega o usuário da requisição
    const { user } = context.switchToHttp().getRequest();
    console.log('👤 [RolesGuard] User payload:', user);

    if (!user || !user.role) {
      console.log('❌ [RolesGuard] Usuário sem role!');
      throw new ForbiddenException('Usuário sem permissão definida');
    }

    // Pega as roles necessárias do decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('🔑 [RolesGuard] Roles necessárias:', requiredRoles);
    console.log('👤 [RolesGuard] Role do usuário:', user.role);

    // Se não tem @Roles() definido, bloqueia (como você configurou)
    if (!requiredRoles || requiredRoles.length === 0) {
      console.log('❌ [RolesGuard] Rota sem roles definidas!');
      throw new ForbiddenException('Rota sem permissões definidas');
    }

    // Verifica se o usuário tem alguma das roles necessárias
    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log('✅ [RolesGuard] Tem permissão?', hasRole);

    if (!hasRole) {
      console.log('🚫 [RolesGuard] Acesso negado!');
      throw new ForbiddenException(
        `Acesso negado. Você é: ${user.role}. Necessário: ${requiredRoles.join(' ou ')}`
      );
    }

    console.log('✅ [RolesGuard] Acesso liberado!');
    return true;
  }
}
