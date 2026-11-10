import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { DeleteCourseUseCase } from './delete-course.use-case';
import { Course, CourseStatus } from '../../domain/entities/course.entity';
import { ICourseRepository } from '../../domain/interfaces/course-repository.interface';

describe('DeleteCourseUseCase', () => {
  let useCase: DeleteCourseUseCase;
  let mockRepository: ICourseRepository;

  const mockCourse: Course = new Course(
    'course-123',
    'Curso a eliminar',
    'Descripción',
    new Date('2026-11-01'),
    new Date('2027-05-15'),
    CourseStatus.ACTIVE,
    new Date(),
    new Date(),
  );

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn().mockResolvedValue(mockCourse),
      findAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new DeleteCourseUseCase(mockRepository);
  });

  it('should delete a course successfully', async () => {
    await expect(useCase.execute('course-123')).resolves.not.toThrow();
    expect(mockRepository.findById).toHaveBeenCalledWith('course-123');
    expect(mockRepository.delete).toHaveBeenCalledWith('course-123');
  });

  it('should throw NotFoundException when course does not exist', async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute('non-existent')).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
