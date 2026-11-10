/**
 * Entidad de dominio: Course
 * 
 * Representa un curso académico en el sistema.
 * Esta entidad es agnóstica a la tecnología de persistencia.
 */
export class Course {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly startDate: Date,
    public readonly examDate: Date,
    public readonly status: CourseStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Verifica si el curso está activo
   */
  isActive(): boolean {
    return this.status === CourseStatus.ACTIVE;
  }

  /**
   * Verifica si el curso ha finalizado
   */
  isFinished(): boolean {
    return this.status === CourseStatus.FINISHED;
  }
}

export enum CourseStatus {
  DRAFT = 'BORRADOR',
  ACTIVE = 'ACTIVO',
  FINISHED = 'FINALIZADO',
  ARCHIVED = 'ARCHIVADO',
}

// ============================================================================
// TIPOS DE DATOS PUROS (sin métodos de la clase)
// Se usan para entradas de creación/actualización en el repositorio
// ============================================================================

/**
 * Datos necesarios para crear un curso nuevo
 */
export interface CourseCreateData {
  name: string;
  description: string | null;
  startDate: Date;
  examDate: Date;
  status: CourseStatus;
}

/**
 * Datos opcionales para actualizar un curso existente
 */
export interface CourseUpdateData {
  name?: string;
  description?: string | null;
  startDate?: Date;
  examDate?: Date;
  status?: CourseStatus;
}
