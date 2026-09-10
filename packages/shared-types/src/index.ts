// Tipos compartidos entre backend y frontend

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  ADMINISTRACION = 'ADMINISTRACION',
  PROFESOR = 'PROFESOR',
  ALUMNO = 'ALUMNO',
}

export enum CourseStatus {
  BORRADOR = 'BORRADOR',
  ACTIVO = 'ACTIVO',
  FINALIZADO = 'FINALIZADO',
  ARCHIVADO = 'ARCHIVADO',
}

export enum TopicStatus {
  NO_INICIADO = 'NO_INICIADO',
  EN_PROGRESO = 'EN_PROGRESO',
  REVISION = 'REVISION',
  COMPLETADO = 'COMPLETADO',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  examDate: Date;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  blockId: string;
  title: string;
  description?: string;
  objectives?: string;
  plannedStart: Date;
  plannedEnd: Date;
  actualEnd?: Date;
  status: TopicStatus;
  createdAt: Date;
  updatedAt: Date;
}
