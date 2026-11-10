import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICourseRepository, COURSE_REPOSITORY } from '../../domain/interfaces/course-repository.interface';

@Injectable()
export class DeleteCourseUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute(id: string): Promise<void> {
    // Verificar que el curso existe antes de eliminarlo
    const existingCourse = await this.courseRepository.findById(id);
    
    if (!existingCourse) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }

    await this.courseRepository.delete(id);
  }
}
