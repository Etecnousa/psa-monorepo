import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule - Módulo Global de Infraestructura
 * 
 * Declarado como @Global() para que PrismaService esté disponible
 * en todos los módulos sin necesidad de importarlo explícitamente.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
