import { Role } from '@prisma/client';

/**
 * Estructura del payload del Access Token JWT.
 * 
 * Solo incluimos la información estrictamente necesaria para:
 * 1. Identificar al usuario (sub)
 * 2. Autorizar por rol (role)
 */
export interface JwtPayload {
  /** Subject: ID del usuario */
  sub: string;
  
  /** Email del usuario (útil para logs y debugging) */
  email: string;
  
  /** Rol del usuario (para autorización RBAC) */
  role: Role;
  
  /** Issued at - añadido automáticamente por @nestjs/jwt */
  iat?: number;
  
  /** Expiration - añadido automáticamente por @nestjs/jwt */
  exp?: number;
}

/**
 * Estructura del payload del Refresh Token JWT.
 */
export interface RefreshTokenPayload {
  /** Subject: ID del usuario */
  sub: string;
  
  /** Tipo de token (para distinguir de access tokens) */
  type: 'refresh';
  
  /** Issued at */
  iat?: number;
  
  /** Expiration */
  exp?: number;
}
