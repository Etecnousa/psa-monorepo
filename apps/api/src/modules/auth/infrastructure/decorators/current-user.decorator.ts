import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserData } from '../../domain/interfaces/auth.repository.interface';

/**
 * Decorador @CurrentUser() - Extrae el usuario autenticado del request
 *
 * USO:
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: UserData) {
 *   return user;
 * }
 *
 * También soporta extraer propiedades específicas:
 * @Get('profile')
 * getProfile(@CurrentUser('id') userId: string) {
 *   return { userId };
 * }
 *
 * PRINCIPIO:
 * - El JwtStrategy adjunta el usuario al request como req.user
 * - Este decorador lo extrae de forma type-safe
 * - Si no hay usuario autenticado, devuelve undefined
 */
export const CurrentUser = createParamDecorator(
  (data: keyof UserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserData | undefined;

    if (!user) {
      return undefined;
    }

    // Si se especifica una propiedad, devolver solo esa
    return data ? user[data] : user;
  },
);
