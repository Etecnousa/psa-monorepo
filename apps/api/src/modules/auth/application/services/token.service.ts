import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { JwtPayload, RefreshTokenPayload } from '../../domain/value-objects/jwt-payload.vo';
import { Role } from '@prisma/client';

/**
 * TokenService - Servicio de Aplicación para gestión de tokens JWT
 *
 * RESPONSABILIDADES:
 * - Generar Access Tokens (corta duración: 15min)
 * - Generar Refresh Tokens (larga duración: 7 días)
 * - Hashear Refresh Tokens antes de guardarlos en BD
 * - Validar y decodificar tokens
 */
@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Convierte una duración en formato string ("15m", "7d", "1h", "30s") a segundos.
   *
   * @param duration - Duración en formato humano (ej: "15m")
   * @param fallbackSeconds - Valor por defecto si el formato es inválido
   * @returns Duración en segundos (number)
   */
  private parseDurationToSeconds(duration: string, fallbackSeconds: number): number {
    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) {
      this.logger.warn(
        `Formato de duración inválido: "${duration}". Usando fallback: ${fallbackSeconds}s`,
      );
      return fallbackSeconds;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 'd':
        return value * 24 * 60 * 60;
      case 'h':
        return value * 60 * 60;
      case 'm':
        return value * 60;
      case 's':
        return value;
      default:
        return fallbackSeconds;
    }
  }

  /**
   * Genera un Access Token JWT.
   */
  async generateAccessToken(
    userId: string,
    email: string,
    role: Role,
  ): Promise<string> {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
    };

    const expiresInStr = this.configService.get<string>('JWT_EXPIRES_IN', '15m');
    const expiresInSec = this.parseDurationToSeconds(expiresInStr, 15 * 60);

    const options: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: expiresInSec, // ✅ number, compatible con JwtSignOptions
    };

    return this.jwtService.signAsync(payload, options);
  }

  /**
   * Genera un Refresh Token JWT.
   */
  async generateRefreshToken(userId: string): Promise<string> {
    const payload: RefreshTokenPayload = {
      sub: userId,
      type: 'refresh',
    };

    const expiresInStr = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const expiresInSec = this.parseDurationToSeconds(expiresInStr, 7 * 24 * 60 * 60);

    const options: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: expiresInSec, // ✅ number, compatible con JwtSignOptions
    };

    return this.jwtService.signAsync(payload, options);
  }

  /**
   * Hashea un token usando SHA-256.
   */
  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Verifica y decodifica un Access Token.
   */
  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Verifica y decodifica un Refresh Token.
   */
  async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    return this.jwtService.verifyAsync<RefreshTokenPayload>(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  /**
   * Calcula la fecha de expiración del Refresh Token.
   */
  getRefreshTokenExpiry(): Date {
    const expiresInStr = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const seconds = this.parseDurationToSeconds(expiresInStr, 7 * 24 * 60 * 60);
    return new Date(Date.now() + seconds * 1000);
  }
}
