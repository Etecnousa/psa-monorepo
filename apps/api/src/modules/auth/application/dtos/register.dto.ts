import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para el registro de nuevos usuarios.
 * 
 * Reglas de validación (según SRS US-1.1):
 * - Email: formato RFC 5322, único en BD (validado en use case)
 * - Password: mínimo 12 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 especial
 * - Nombre/Apellidos: obligatorios, longitud razonable
 */
export class RegisterDto {
  @ApiProperty({
    description: 'Email del usuario (formato RFC 5322)',
    example: 'nuevo.alumno@psa.local',
  })
  @IsEmail({}, { message: 'El email no tiene un formato válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({
    description: 'Contraseña (mínimo 12 caracteres, complejidad requerida)',
    example: 'Password123!',
    minLength: 12,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(12, { message: 'La contraseña debe tener al menos 12 caracteres' })
  @MaxLength(128, { message: 'La contraseña no puede exceder 128 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-])[A-Za-z\d@$!%*?&.#_\-]{12,}$/,
    {
      message:
        'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&.#_-)',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Carlos',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    example: 'García Martínez',
  })
  @IsString()
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  @MinLength(2, { message: 'Los apellidos deben tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'Los apellidos no pueden exceder 100 caracteres' })
  lastName: string;
}
