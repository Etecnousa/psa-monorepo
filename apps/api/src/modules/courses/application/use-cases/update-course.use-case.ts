import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ICourseRepository, COURSE_REPOSITORY } from '../../domain/interfaces/course-repository.interface';
import { Course } from '../../domain/entities/course.entity';
import { UpdateCourseDto } from '../dtos/update-course.dto';

@Injectable()
export class UpdateCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string, dto: UpdateCourseDto): Promise<Course> {
    // Verificar que el curso existe
    const existingCourse = await this.courseRepository.findById(id);
    
    if (!existingCourse) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    // Validación de negocio: si se actualizan fechas, verificar coherencia
    if (dto.startDate && dto.examDate) {
      const startDate = new Date(dto.startDate);
      const examDate = new Date(dto.examDate);
      
      if (examDate <= startDate) {
        throw new ConflictException(
          'La fecha del examen debe ser posterior a la fecha de inicio del curso',
        );
      }
    }

    return this.courseRepository.update(id, dto);
  }
}
