import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para renovar el access token usando un refresh token.
 * 
 * El refresh token se envía típicamente como cookie HttpOnly,
 * pero también soportamos envío en el body para flexibilidad.
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token obtenido durante el login',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty({ message: 'El refresh token es obligatorio' })
  refreshToken: string;
}
