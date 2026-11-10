import { Injectable } from '@nestjs/common';
import { Course as PrismaCourse } from '@prisma/client';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { ICourseRepository } from '../../domain/interfaces';
import {
  Course,
  CourseStatus,
  CourseCreateData,
  CourseUpdateData,
} from '../../domain/entities';

/**
 * Implementación de ICourseRepository usando Prisma.
 * 
 * Esta clase pertenece a la capa de Infraestructura y actúa como una
 * "Capa Anti-Corrupción" (Anti-Corruption Layer): traduce entre el modelo
 * de datos de Prisma (persistencia) y las entidades de dominio.
 */
@Injectable()
export class PrismaCoursesRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ========================================================================
  // MAPEO ENTRE PRISMA Y DOMINIO
  // ========================================================================

  /**
   * Convierte un registro de Prisma en una entidad de dominio Course
   */
  private toDomain(data: PrismaCourse): Course {
    return new Course(
      data.id,
      data.name,
      data.description,
      data.startDate,
      data.examDate,
      this.mapStatusToDomain(data.status),
      data.createdAt,
      data.updatedAt,
    );
  }

  /**
   * Mapea el enum de estado de Prisma al enum de dominio.
   * Los valores de ambos enums coinciden exactamente (BORRADOR, ACTIVO, etc.)
   */
  private mapStatusToDomain(status: PrismaCourse['status']): CourseStatus {
    return status as unknown as CourseStatus;
  }

  /**
   * Mapea el enum de estado de dominio al enum de Prisma
   */
  private mapStatusToPrisma(status: CourseStatus): PrismaCourse['status'] {
    return status as unknown as PrismaCourse['status'];
  }

  // ========================================================================
  // OPERACIONES CRUD
  // ========================================================================

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
    });
    return course ? this.toDomain(course) : null;
  }

  async findAll(): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return courses.map((course) => this.toDomain(course));
  }

  async create(data: CourseCreateData): Promise<Course> {
    const course = await this.prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        examDate: data.examDate,
        status: this.mapStatusToPrisma(data.status),
      },
    });
    return this.toDomain(course);
  }

  async update(id: string, data: CourseUpdateData): Promise<Course> {
    const course = await this.prisma.course.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        examDate: data.examDate,
        status: data.status ? this.mapStatusToPrisma(data.status) : undefined,
      },
    });
    return this.toDomain(course);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({
      where: { id },
    });
  }
}
