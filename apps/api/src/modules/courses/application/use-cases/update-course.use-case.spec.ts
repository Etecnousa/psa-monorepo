import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UpdateCourseUseCase } from './update-course.use-case';
import { Course, CourseStatus } from '../../domain/entities/course.entity';
import { ICourseRepository } from '../../domain/interfaces/course-repository.interface';
import { UpdateCourseDto } from '../dtos/update-course.dto';

describe('UpdateCourseUseCase', () => {
  let useCase: UpdateCourseUseCase;
  let mockRepository: ICourseRepository;

  const mockCourse: Course = new Course(
    'course-123',
    'Curso Original',
    'Descripción original',
    new Date('2026-11-01'),
    new Date('2027-05-15'),
    CourseStatus.DRAFT,
    new Date(),
    new Date(),
  );

  const updatedCourse: Course = new Course(
    'course-123',
    'Curso Actualizado',
    'Nueva descripción',
    new Date('2026-11-01'),
    new Date('2027-05-15'),
    CourseStatus.ACTIVE,
    mockCourse.createdAt,
    new Date(),
  );

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn().mockResolvedValue(mockCourse),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn().mockResolvedValue(updatedCourse),
      delete: vi.fn(),
    };

    useCase = new UpdateCourseUseCase(mockRepository);
  });

  it('should update a course successfully', async () => {
    const dto: UpdateCourseDto = {
      name: 'Curso Actualizado',
      description: 'Nueva descripción',
      status: CourseStatus.ACTIVE,
    };

    const result = await useCase.execute('course-123', dto);

    expect(result).toEqual(updatedCourse);
    expect(mockRepository.findById).toHaveBeenCalledWith('course-123');
    expect(mockRepository.update).toHaveBeenCalledWith('course-123', dto);
  });

  it('should throw NotFoundException when course does not exist', async () => {
    (mockRepository.findById as any).mockResolvedValue(null);
    const dto: UpdateCourseDto = { name: 'Nuevo nombre' };

    await expect(useCase.execute('non-existent', dto)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when updated dates are incoherent', async () => {
    const dto: UpdateCourseDto = {
      startDate: new Date('2027-05-15'),  // Posterior
      examDate: new Date('2026-11-01'),   // Anterior (inválido)
    };

    await expect(useCase.execute('course-123', dto)).rejects.toThrow(
      ConflictException,
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should allow updating only one field without date validation', async () => {
    const dto: UpdateCourseDto = { name: 'Solo cambio de nombre' };
    const result = await useCase.execute('course-123', dto);
    expect(result).toEqual(updatedCourse);
  });
});
