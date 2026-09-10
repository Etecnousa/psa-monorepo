import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService - Adaptador de Infraestructura
 * 
 * Extiende PrismaClient para integrarse con el ciclo de vida de NestJS.
 * Gestiona la conexión y desconexión limpia de la base de datos.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    this.logger.log('Conectando a la base de datos PostgreSQL...');
    await this.$connect();
    this.logger.log('✅ Conexión a PostgreSQL establecida');
  }

  async onModuleDestroy() {
    this.logger.log('Cerrando conexión a PostgreSQL...');
    await this.$disconnect();
    this.logger.log('✅ Conexión a PostgreSQL cerrada');
  }

  /**
   * Limpia todas las tablas de la base de datos.
   * ÚSO EXCLUSIVO PARA TESTS. NO USAR EN PRODUCCIÓN.
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('cleanDatabase() no puede ejecutarse en producción');
    }

    const tablenames = await this.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    try {
      await this.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    } catch (error) {
      this.logger.error('Error limpiando base de datos:', error);
    }
  }
}
