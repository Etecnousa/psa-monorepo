import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para inicio de sesión.
 * 
 * No validamos la complejidad de la contraseña aquí porque
 * simplemente la comparamos con el hash almacenado. La validación
 * de complejidad es responsabilidad del registro/cambio de contraseña.
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'alumno1@psa.local',
  })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123!',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;
}
