import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * JwtAuthGuard - Protege endpoints que requieren autenticación
 *
 * USO:
 * @UseGuards(JwtAuthGuard)
 * @Get('protected')
 * protectedEndpoint() { ... }
 *
 * O a nivel de controlador (todos los endpoints protegidos):
 * @Controller('users')
 * @UseGuards(JwtAuthGuard)
 * export class UsersController { ... }
 *
 * FLUJO:
 * 1. Extrae el Bearer token del header Authorization
 * 2. Passport verifica la firma y expiración (JwtStrategy)
 * 3. JwtStrategy.validate() busca el usuario en BD
 * 4. Si todo OK, el usuario se adjunta a req.user
 * 5. Si falla, lanza UnauthorizedException (401)
 *
 * EXTENSIÓN:
 * Hereda de AuthGuard('jwt') que es el wrapper de NestJS para Passport.
 * Sobrescribimos handleRequest para personalizar el manejo de errores.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * Permite marcar endpoints como públicos (sin autenticación).
   *
   * USO:
   * @Public()
   * @Get('health')
   * healthCheck() { ... }
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Permitir acceso sin autenticación
    }

    return super.canActivate(context);
  }

  /**
   * Maneja el resultado de la autenticación.
   *
   * @param err - Error si la autenticación falló
   * @param user - Usuario autenticado si tuvo éxito
   * @param info - Información adicional de Passport
   * @returns El usuario autenticado
   * @throws UnauthorizedException si la autenticación falló
   */
  handleRequest(err: any, user: any, info: any) {
    // Si hay error o no hay usuario, lanzar 401
    if (err || !user) {
      throw err || new UnauthorizedException('Autenticación requerida');
    }

    return user;
  }
}
