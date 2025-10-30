import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    // Verifica se a rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);


    if (isPublic) {
      return true;
    }

    // Pega o usuário da requisição
    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Usuário sem permissão definida');
    }

    // Pega as roles necessárias do decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);


    // Se não tem @Roles() definido, bloqueia (como você configurou)
    if (!requiredRoles || requiredRoles.length === 0) {
      throw new ForbiddenException('Rota sem permissões definidas');
    }

    // Verifica se o usuário tem alguma das roles necessárias
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado. Você é: ${user.role}. Necessário: ${requiredRoles.join(' ou ')}`
      );
    }

    return true;
  }
}
