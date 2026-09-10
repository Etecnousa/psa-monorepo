import { Role } from '@prisma/client';

/**
 * Datos de usuario devueltos por el repositorio.
 * 
 * Nota importante: NUNCA incluir `passwordHash` en este tipo.
 * El hash de la contraseña nunca debe salir de la capa de infraestructura.
 */
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Datos de usuario incluyendo el hash de contraseña.
 * Solo se usa internamente para validación de credenciales.
 */
export interface UserWithPassword extends UserData {
  passwordHash: string;
}

/**
 * Contrato del repositorio de autenticación.
 * 
 * Este es un PUERTO (en terminología Hexagonal) que define
 * las operaciones que el dominio necesita para gestionar usuarios.
 * La implementación concreta (Prisma) vivirá en infrastructure/.
 * 
 * Principio aplicado: Dependency Inversion (DIP de SOLID)
 */
export interface IAuthRepository {
  findByEmailWithPassword(email: string): Promise<UserWithPassword | null>;
  findByEmail(email: string): Promise<UserData | null>;
  findById(id: string): Promise<UserData | null>;
  create(data: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role?: Role;
  }): Promise<UserData>;
  saveRefreshToken(data: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
  }): Promise<void>;
  findRefreshToken(tokenHash: string): Promise<{
    id: string;
    userId: string;
    expiresAt: Date;
  } | null>;
  deleteRefreshToken(tokenHash: string): Promise<void>;
  deleteAllUserRefreshTokens(userId: string): Promise<void>;
  deleteExpiredRefreshTokens(): Promise<number>;
}

/**
 * Token de inyección de dependencias para NestJS.
 */
export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');
