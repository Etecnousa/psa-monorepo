/**
 * Entidad de dominio: Topic
 * 
 * Representa un tema individual dentro de un bloque.
 * Los temas son la unidad mínima de contenido educativo.
 */
export class Topic {
  constructor(
    public readonly id: string,
    public readonly blockId: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly objectives: string | null,
    public readonly plannedStart: Date,
    public readonly plannedEnd: Date,
    public readonly actualEnd: Date | null,
    public readonly status: TopicStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Verifica si el tema está completado
   */
  isCompleted(): boolean {
    return this.status === TopicStatus.COMPLETED;
  }

  /**
   * Verifica si el tema está en progreso
   */
  isInProgress(): boolean {
    return this.status === TopicStatus.IN_PROGRESS;
  }

  /**
   * Calcula el retraso en días (si existe)
   */
  getDelayInDays(): number | null {
    if (this.status === TopicStatus.COMPLETED && this.actualEnd) {
      const delay = this.actualEnd.getTime() - this.plannedEnd.getTime();
      return Math.ceil(delay / (1000 * 60 * 60 * 24));
    }
    return null;
  }
}

export enum TopicStatus {
  NOT_STARTED = 'NO_INICIADO',
  IN_PROGRESS = 'EN_PROGRESO',
  IN_REVISION = 'REVISION',
  COMPLETED = 'COMPLETADO',
}
