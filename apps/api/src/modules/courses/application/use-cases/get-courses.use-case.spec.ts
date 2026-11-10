import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { GetCoursesUseCase } from './get-courses.use-case';
import { Course, CourseStatus } from '../../domain/entities/course.entity';
import { ICourseRepository } from '../../domain/interfaces/course-repository.interface';

describe('GetCoursesUseCase', () => {
  let useCase: GetCoursesUseCase;
  let mockRepository: ICourseRepository;

  const mockCourse: Course = new Course(
    'course-123',
    'Curso de Prueba',
    'Descripción',
    new Date('2026-11-01'),
    new Date('2027-05-15'),
    CourseStatus.ACTIVE,
    new Date(),
    new Date(),
  );

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      findAll: vi.fn().mockResolvedValue([mockCourse]),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    useCase = new GetCoursesUseCase(mockRepository);
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      const result = await useCase.findAll();
      expect(result).toEqual([mockCourse]);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no courses exist', async () => {
      (mockRepository.findAll as any).mockResolvedValue([]);
      const result = await useCase.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a course when it exists', async () => {
      (mockRepository.findById as any).mockResolvedValue(mockCourse);
      const result = await useCase.findById('course-123');
      expect(result).toEqual(mockCourse);
      expect(mockRepository.findById).toHaveBeenCalledWith('course-123');
    });

    it('should throw NotFoundException when course does not exist', async () => {
      (mockRepository.findById as any).mockResolvedValue(null);
      await expect(useCase.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(useCase.findById('non-existent')).rejects.toThrow(
        'Curso con ID non-existent no encontrado',
      );
    });
  });
});
