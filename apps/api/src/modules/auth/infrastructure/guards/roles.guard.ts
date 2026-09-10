import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserData } from '../../domain/interfaces/auth.repository.interface';

/**
 * RolesGuard - Controla acceso por roles (RBAC)
 *
 * USO:
 * @UseGuards(JwtAuthGuard, RolesGuard)  // JwtAuthGuard PRIMERO
 * @Roles(Role.ADMIN, Role.SUPERADMIN)
 * @Get('admin-only')
 * adminEndpoint() { ... }
 *
 * FLUJO:
 * 1. JwtAuthGuard verifica que hay un usuario autenticado
 * 2. RolesGuard lee los roles requeridos del decorador @Roles()
 * 3. Si no hay @Roles(), permite acceso (endpoint público dentro de autenticados)
 * 4. Si hay @Roles(), verifica que el usuario tenga AL MENOS UNO de los roles
 * 5. Si no tiene ninguno, lanza ForbiddenException (403)
 *
 * PRINCIPIO:
 * - RolesGuard SIEMPRE debe usarse DESPUÉS de JwtAuthGuard
 * - JwtAuthGuard garantiza que req.user existe
 * - RolesGuard solo verifica permisos, no autenticación
 *
 * @example
 * // Solo ADMIN y SUPERADMIN pueden acceder
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles(Role.ADMIN, Role.SUPERADMIN)
 * @Delete(':id')
 * deleteUser(@Param('id') id: string) { ... }
 *
 * @example
 * // Cualquier usuario autenticado puede acceder (sin @Roles)
 * @UseGuards(JwtAuthGuard)
 * @Get('profile')
 * getProfile() { ... }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos del decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Si no hay @Roles(), permitir acceso (endpoint público dentro de autenticados)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3. Obtener el usuario autenticado del request
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserData;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // 4. Verificar que el usuario tenga AL MENOS UNO de los roles requeridos
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Acceso denegado. Roles requeridos: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
