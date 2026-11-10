import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConflictException } from '@nestjs/common';
import { CreateCourseUseCase } from './create-course.use-case';
import { Course, CourseStatus } from '../../domain/entities/course.entity';
import { ICourseRepository } from '../../domain/interfaces/course-repository.interface';
import { CreateCourseDto } from '../dtos/create-course.dto';

describe('CreateCourseUseCase', () => {
  let useCase: CreateCourseUseCase;
  let mockRepository: ICourseRepository;

  const mockCourse: Course = new Course(
    'course-123',
    'Curso de Prueba',
    'Descripción de prueba',
    new Date('2026-11-01'),
    new Date('2027-05-15'),
    CourseStatus.DRAFT,
    new Date(),
    new Date(),
  );

  beforeEach(() => {
    // Creamos el mock del repositorio con inyección manual
    mockRepository = {
      findById: vi.fn(),
      findAll: vi.fn(),
      create: vi.fn().mockResolvedValue(mockCourse),
      update: vi.fn(),
      delete: vi.fn(),
    };

    // Inyección manual del mock (patrón establecido en Fase 0)
    useCase = new CreateCourseUseCase(mockRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should create a course successfully with valid dates', async () => {
    const dto: CreateCourseDto = {
      name: 'Oposiciones Bomberos 2027',
      description: 'Preparación integral',
      startDate: new Date('2026-11-01'),
      examDate: new Date('2027-05-15'),
    };

    const result = await useCase.execute(dto);

    expect(result).toEqual(mockCourse);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Oposiciones Bomberos 2027',
        status: CourseStatus.DRAFT,
      }),
    );
  });

  it('should use DRAFT status by default when not provided', async () => {
    const dto: CreateCourseDto = {
      name: 'Curso sin estado',
      startDate: new Date('2026-11-01'),
      examDate: new Date('2027-05-15'),
    };

    await useCase.execute(dto);

    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: CourseStatus.DRAFT,
      }),
    );
  });

  it('should throw ConflictException when examDate is before startDate', async () => {
    const dto: CreateCourseDto = {
      name: 'Curso con fechas inválidas',
      startDate: new Date('2027-05-15'),  // Posterior
      examDate: new Date('2026-11-01'),   // Anterior (inválido)
    };

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    await expect(useCase.execute(dto)).rejects.toThrow(
      'La fecha del examen debe ser posterior a la fecha de inicio del curso',
    );
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when examDate equals startDate', async () => {
    const sameDate = new Date('2026-11-01');
    const dto: CreateCourseDto = {
      name: 'Curso con fechas iguales',
      startDate: sameDate,
      examDate: sameDate,
    };

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
