import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CourseStatus } from '../../domain/entities/course.entity';

export class CreateCourseDto {
  @ApiProperty({ example: 'Oposiciones Ayuntamiento de Vigo 2027' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Preparación integral para las pruebas de acceso...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2026-11-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2027-05-15T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  examDate: Date;

  @ApiPropertyOptional({ enum: CourseStatus, default: CourseStatus.DRAFT })
  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;
}
