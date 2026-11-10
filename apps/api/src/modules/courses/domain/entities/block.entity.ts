/**
 * Entidad de dominio: Block
 * 
 * Representa un bloque temático dentro de un curso.
 * Los bloques agrupan temas relacionados lógicamente.
 */
export class Block {
  constructor(
    public readonly id: string,
    public readonly courseId: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly order: number,
    public readonly plannedStart: Date,
    public readonly plannedEnd: Date,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  /**
   * Verifica si el bloque está dentro de un rango de fechas
   */
  isWithinDateRange(startDate: Date, endDate: Date): boolean {
    return this.plannedStart >= startDate && this.plannedEnd <= endDate;
  }
}
