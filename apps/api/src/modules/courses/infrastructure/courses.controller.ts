import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CoursesService } from '../application/services/courses.service';
import { CreateCourseDto } from '../application/dtos/create-course.dto';
import { UpdateCourseDto } from '../application/dtos/update-course.dto';

import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/infrastructure/guards/roles.guard';
import { Roles } from '../../auth/infrastructure/decorators/roles.decorator';

/**
 * CoursesController - Capa de presentación HTTP del módulo de cursos.
 * 
 * RESPONSABILIDADES:
 * - Recibir peticiones HTTP y validar la entrada (vía DTOs + ValidationPipe)
 * - Aplicar seguridad (autenticación JWT + autorización RBAC)
 * - Delegar la lógica de negocio al CoursesService
 * - Devolver respuestas HTTP apropiadas
 * 
 * NOTA: Este controller NO contiene lógica de negocio. Solo orquesta
 * la comunicación entre el cliente HTTP y la capa de aplicación.
 */
@ApiTags('Courses')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * POST /api/courses
   * Crear un nuevo curso.
   * Permitido para: PROFESOR, ADMINISTRACION, SUPERADMIN
   */
  @Post()
  @Roles(Role.PROFESOR, Role.ADMINISTRACION, Role.SUPERADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo curso' })
  @ApiResponse({ status: 201, description: 'Curso creado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'Sin permisos suficientes.' })
  @ApiResponse({ status: 409, description: 'Fechas incoherentes.' })
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  /**
   * GET /api/courses
   * Listar todos los cursos.
   * Permitido para: cualquier usuario autenticado.
   */
  @Get()
  @ApiOperation({ summary: 'Listar todos los cursos' })
  @ApiResponse({ status: 200, description: 'Listado de cursos devuelto.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  /**
   * GET /api/courses/:id
   * Obtener un curso por su ID.
   * Permitido para: cualquier usuario autenticado.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un curso por ID' })
  @ApiParam({ name: 'id', description: 'Identificador UUID del curso' })
  @ApiResponse({ status: 200, description: 'Curso encontrado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  async getCourseById(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.getCourseById(id);
  }

  /**
   * PATCH /api/courses/:id
   * Actualizar parcialmente un curso.
   * Permitido para: PROFESOR, ADMINISTRACION, SUPERADMIN
   */
  @Patch(':id')
  @Roles(Role.PROFESOR, Role.ADMINISTRACION, Role.SUPERADMIN)
  @ApiOperation({ summary: 'Actualizar un curso existente' })
  @ApiParam({ name: 'id', description: 'Identificador UUID del curso' })
  @ApiResponse({ status: 200, description: 'Curso actualizado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'Sin permisos suficientes.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  async updateCourse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, dto);
  }

  /**
   * DELETE /api/courses/:id
   * Eliminar un curso.
   * Permitido para: ADMINISTRACION, SUPERADMIN
   */
  @Delete(':id')
  @Roles(Role.ADMINISTRACION, Role.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar un curso' })
  @ApiParam({ name: 'id', description: 'Identificador UUID del curso' })
  @ApiResponse({ status: 200, description: 'Curso eliminado.' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'Sin permisos suficientes.' })
  @ApiResponse({ status: 404, description: 'Curso no encontrado.' })
  async deleteCourse(@Param('id', ParseUUIDPipe) id: string) {
    await this.coursesService.deleteCourse(id);
    return { message: 'Curso eliminado correctamente' };
  }
}
