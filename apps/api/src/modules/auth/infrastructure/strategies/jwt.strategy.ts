import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../domain/value-objects/jwt-payload.vo';
import {
  IAuthRepository,
  AUTH_REPOSITORY,
} from '../../domain/interfaces/auth.repository.interface';
import { Inject } from '@nestjs/common';

/**
 * JwtStrategy - Estrategia Passport para Bearer tokens JWT
 *
 * Se usa en todos los endpoints protegidos. Passport:
 * 1. Extrae el token del header "Authorization: Bearer <token>"
 * 2. Verifica la firma con JWT_SECRET
 * 3. Valida que no haya expirado
 * 4. Llama a validate() con el payload decodificado
 *
 * El objeto devuelto por validate() se adjunta al request como req.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {
    // Usamos getOrThrow para garantizar que JWT_SECRET existe
    // Si no está configurado, la aplicación fallará al arrancar
    // (lo cual es preferible a tener seguridad rota en producción)
    const jwtSecret = configService.getOrThrow<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Rechazar tokens expirados
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Valida el payload del JWT.
   *
   * Passport llama a este método después de verificar la firma.
   * Aquí hacemos validaciones adicionales:
   * - Verificar que el usuario sigue existiendo
   * - Verificar que está activo
   *
   * @param payload - Payload decodificado del JWT
   * @returns Objeto que se adjuntará a req.user
   * @throws UnauthorizedException si la validación falla
   */
  async validate(payload: JwtPayload) {
    // Verificar que el usuario sigue existiendo y está activo
    const user = await this.authRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }

    // Devolvemos el objeto que estará disponible en req.user
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
