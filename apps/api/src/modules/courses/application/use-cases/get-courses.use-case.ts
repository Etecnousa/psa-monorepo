import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ICourseRepository, COURSE_REPOSITORY } from '../../domain/interfaces/course-repository.interface';
import { Course } from '../../domain/entities/course.entity';

@Injectable()
export class GetCoursesUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseRepository.findAll();
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseRepository.findById(id);
    
    if (!course) {
      throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    }
    
    return course;
  }
}
