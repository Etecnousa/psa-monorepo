import { Injectable, Logger } from '@nestjs/common';
import { CreateCourseUseCase } from '../use-cases/create-course.use-case';
import { GetCoursesUseCase } from '../use-cases/get-courses.use-case';
import { UpdateCourseUseCase } from '../use-cases/update-course.use-case';
import { DeleteCourseUseCase } from '../use-cases/delete-course.use-case';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { UpdateCourseDto } from '../dtos/update-course.dto';
import { Course } from '../../domain/entities/course.entity';

/**
 * CoursesService - Orquestador de la capa de Aplicación
 * 
 * RESPONSABILIDADES:
 * - Actuar como fachada única para el Controller
 * - Delegar la ejecución a los Use Cases correspondientes
 * - Centralizar logging y futuras preocupaciones transversales
 *   (transacciones, caché, métricas)
 */
@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    private readonly createCourseUseCase: CreateCourseUseCase,
    private readonly getCoursesUseCase: GetCoursesUseCase,
    private readonly updateCourseUseCase: UpdateCourseUseCase,
    private readonly deleteCourseUseCase: DeleteCourseUseCase,
  ) {}

  /**
   * Crea un nuevo curso
   */
  async createCourse(dto: CreateCourseDto): Promise<Course> {
    this.logger.log(`Creando curso: ${dto.name}`);
    const course = await this.createCourseUseCase.execute(dto);
    this.logger.log(`Curso creado con ID: ${course.id}`);
    return course;
  }

  /**
   * Obtiene todos los cursos
   */
  async getAllCourses(): Promise<Course[]> {
    this.logger.log('Obteniendo listado de cursos');
    return this.getCoursesUseCase.findAll();
  }

  /**
   * Obtiene un curso por su ID
   */
  async getCourseById(id: string): Promise<Course> {
    this.logger.log(`Buscando curso con ID: ${id}`);
    return this.getCoursesUseCase.findById(id);
  }

  /**
   * Actualiza un curso existente
   */
  async updateCourse(id: string, dto: UpdateCourseDto): Promise<Course> {
    this.logger.log(`Actualizando curso con ID: ${id}`);
    const course = await this.updateCourseUseCase.execute(id, dto);
    this.logger.log(`Curso actualizado: ${course.name}`);
    return course;
  }

  /**
   * Elimina un curso
   */
  async deleteCourse(id: string): Promise<void> {
    this.logger.log(`Eliminando curso con ID: ${id}`);
    await this.deleteCourseUseCase.execute(id);
    this.logger.log(`Curso eliminado correctamente`);
  }
}
