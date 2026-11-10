import { Module } from '@nestjs/common';

// Controller (capa de presentación)
import { CoursesController } from './infrastructure/courses.controller';

// Application layer
import { CoursesService } from './application/services/courses.service';
import { CreateCourseUseCase } from './application/use-cases/create-course.use-case';
import { GetCoursesUseCase } from './application/use-cases/get-courses.use-case';
import { UpdateCourseUseCase } from './application/use-cases/update-course.use-case';
import { DeleteCourseUseCase } from './application/use-cases/delete-course.use-case';

// Infrastructure layer
import { PrismaCoursesRepository } from './infrastructure/repositories/prisma-courses.repository';
import { COURSE_REPOSITORY } from './domain/interfaces/course-repository.interface';

// Shared modules
import { PrismaModule } from '../../common/prisma';

/**
 * CoursesModule - Módulo de gestión de cursos.
 * 
 * Orquesta todas las capas de Clean Architecture para el dominio de cursos:
 * - Domain: Entidades e interfaces (contratos)
 * - Application: Use Cases, DTOs y CoursesService (orquestador)
 * - Infrastructure: Controller (HTTP) y PrismaCoursesRepository (persistencia)
 */
@Module({
  imports: [PrismaModule],
  controllers: [CoursesController],
  providers: [
    // Capa de aplicación
    CoursesService,
    CreateCourseUseCase,
    GetCoursesUseCase,
    UpdateCourseUseCase,
    DeleteCourseUseCase,

    // Capa de infraestructura: inyección del repositorio (Principio DIP)
    {
      provide: COURSE_REPOSITORY,
      useClass: PrismaCoursesRepository,
    },
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
