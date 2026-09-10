import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

/**
 * Clave de metadata para almacenar los roles requeridos.
 * Se usa internamente por NestJS para que el RolesGuard pueda leerlos.
 */
export const ROLES_KEY = 'roles';

/**
 * Decorador @Roles() - Marca un endpoint con roles permitidos
 *
 * USO:
 * @Roles(Role.ADMIN, Role.SUPERADMIN)
 * @Get('admin-only')
 * adminEndpoint() { ... }
 *
 * PRINCIPIO:
 * - Si no se usa @Roles(), el endpoint es público (solo requiere autenticación si tiene @UseGuards(JwtAuthGuard))
 * - Si se usa @Roles(), el usuario debe tener AL MENOS UNO de los roles especificados
 * - Los roles se evalúan con OR (no AND)
 *
 * @param roles - Lista de roles permitidos (OR lógico)
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
