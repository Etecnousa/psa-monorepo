import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { ICourseRepository, COURSE_REPOSITORY } from '../../domain/interfaces/course-repository.interface';
import { Course, CourseStatus } from '../../domain/entities/course.entity';
import { CreateCourseDto } from '../dtos/create-course.dto';

@Injectable()
export class CreateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(dto: CreateCourseDto): Promise<Course> {
    // Validación de negocio: la fecha de examen debe ser posterior a la de inicio
    const startDate = new Date(dto.startDate);
    const examDate = new Date(dto.examDate);
    
    if (examDate <= startDate) {
      throw new ConflictException(
        'La fecha del examen debe ser posterior a la fecha de inicio del curso',
      );
    }

    // Crear la entidad de dominio
    const courseData = {
      name: dto.name,
      description: dto.description ?? null,
      startDate,
      examDate,
      status: dto.status ?? CourseStatus.DRAFT,
    };

    return this.courseRepository.create(courseData);
  }
}
