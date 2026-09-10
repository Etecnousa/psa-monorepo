import { SetMetadata } from '@nestjs/common';

/**
 * Decorador @Public() - Marca un endpoint como público (sin autenticación)
 *
 * USO:
 * @Controller('users')
 * @UseGuards(JwtAuthGuard)  // Todos los endpoints protegidos por defecto
 * export class UsersController {
 *
 *   @Public()  // Este endpoint NO requiere autenticación
 *   @Get('health')
 *   healthCheck() { ... }
 *
 *   @Get('profile')  // Este endpoint SÍ requiere autenticación
 *   getProfile() { ... }
 * }
 *
 * PRINCIPIO:
 * - Útil cuando aplicas JwtAuthGuard a nivel de controlador
 * - Permite excepciones puntuales (health checks, login, register)
 * - JwtAuthGuard verifica esta metadata y permite acceso sin token
 */
export const Public = () => SetMetadata('isPublic', true);
