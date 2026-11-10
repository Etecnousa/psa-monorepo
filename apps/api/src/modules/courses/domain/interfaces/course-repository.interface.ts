import { Course, CourseCreateData, CourseUpdateData } from '../entities/course.entity';

/**
 * Contrato para el repositorio de Cursos.
 * La infraestructura (Prisma) deberá implementar esta interfaz.
 */
export interface ICourseRepository {
  findById(id: string): Promise<Course | null>;
  findAll(): Promise<Course[]>;
  create(data: CourseCreateData): Promise<Course>;
  update(id: string, data: CourseUpdateData): Promise<Course>;
  delete(id: string): Promise<void>;
}

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');
