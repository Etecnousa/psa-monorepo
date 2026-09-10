import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  IAuthRepository,
  UserData,
  UserWithPassword,
} from '../../domain/interfaces/auth.repository.interface';
import { Role } from '@prisma/client';

/**
 * PrismaAuthRepository - Adaptador de Infraestructura
 *
 * Implementación concreta del IAuthRepository usando Prisma ORM.
 *
 * RESPONSABILIDADES:
 * - Traducir llamadas del dominio a operaciones Prisma
 * - Mapear objetos de Prisma a tipos del dominio (UserData, UserWithPassword)
 * - Garantizar que el passwordHash NUNCA salga en respuestas públicas
 * - Gestionar refresh tokens con hashing (seguridad)
 *
 * PRINCIPIOS APLICADOS:
 * - Dependency Inversion (SOLID): implementa un contrato abstracto
 * - Single Responsibility: solo gestiona persistencia de autenticación
 * - Separation of Concerns: aísla la lógica de BD del dominio
 */
@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Busca usuario por email INCLUYENDO el passwordHash.
   *
   * ⚠️ USO EXCLUSIVO para autenticación (login, validación de credenciales).
   * NUNCA devolver estos datos al cliente.
   */
  async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPassword | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Busca usuario por email SIN el passwordHash.
   *
   * Uso para respuestas de API, verificaciones de existencia, etc.
   */
  async findByEmail(email: string): Promise<UserData | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Busca usuario por ID sin passwordHash.
   */
  async findById(id: string): Promise<UserData | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Crea un nuevo usuario con contraseña ya hasheada.
   *
   * Nota: El hash se genera en el UseCase (RegisterUseCase),
   * no en el repositorio. Esto facilita testing y separación
   * de responsabilidades.
   */
  async create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role?: Role;
  }): Promise<UserData> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role ?? Role.ALUMNO,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  /**
   * Guarda un refresh token HASHEADO (no el token original).
   *
   * Principio de seguridad: nunca almacenar tokens en texto plano.
   * Si la BD se compromete, los tokens siguen siendo seguros.
   */
  async saveRefreshToken(data: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        tokenHash: data.tokenHash,
        userId: data.userId,
        expiresAt: data.expiresAt,
      },
    });
  }

  /**
   * Busca un refresh token por su hash.
   *
   * Devuelve null si no existe (token inválido o revocado).
   */
  async findRefreshToken(
    tokenHash: string,
  ): Promise<{ id: string; userId: string; expiresAt: Date } | null> {
    const token = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
      },
    });

    return token;
  }

  /**
   * Elimina un refresh token específico (logout de una sesión).
   */
  async deleteRefreshToken(tokenHash: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { tokenHash },
    });
  }

  /**
   * Elimina TODOS los refresh tokens de un usuario (logout global).
   *
   * Útil cuando:
   * - El usuario cambia su contraseña
   * - Se detecta actividad sospechosa
   * - El usuario hace "cerrar sesión en todos los dispositivos"
   */
  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * Limpia tokens expirados (tarea de mantenimiento).
   *
   * Devuelve el número de tokens eliminados.
   * Se debería ejecutar periódicamente (ej: cada hora vía cron job).
   */
  async deleteExpiredRefreshTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}
