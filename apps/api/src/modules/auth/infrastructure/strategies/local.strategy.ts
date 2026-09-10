import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserData } from '../../domain/interfaces/auth.repository.interface';

/**
 * LocalStrategy - Estrategia Passport para email/password
 *
 * Se usa en el endpoint de login. Passport extrae automáticamente
 * username/password del body y llama a validate().
 *
 * Nota: Aunque Passport usa "username" por defecto, nosotros lo
 * re-configuramos para que use "email" como campo de usuario.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email', // Usar "email" en lugar de "username"
      passwordField: 'password',
    });
  }

  /**
   * Valida las credenciales.
   *
   * Passport llama automáticamente a este método.
   * - Si devuelve un usuario → autenticación exitosa
   * - Si devuelve null o lanza excepción → 401 Unauthorized
   *
   * @param email - Email del usuario
   * @param password - Contraseña en texto plano
   * @returns UserData si las credenciales son válidas
   * @throws UnauthorizedException si las credenciales son inválidas
   */
  async validate(email: string, password: string): Promise<UserData> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }
}
