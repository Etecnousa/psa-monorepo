import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // 1. Configuración de CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // 2. Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // 3. ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 4. Configuración de Swagger (Documentación API)
  const config = new DocumentBuilder()
    .setTitle('PSA API')
    .setDescription('Programa de Seguimiento Académico - API de Autenticación y Gestión')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Introduce el token JWT en el formato: Bearer <token>',
        in: 'header',
      },
      'access-token', // Nombre de la seguridad
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Monta Swagger en la ruta /api/docs
  SwaggerModule.setup('api/docs', app, document);

  // 5. Iniciar servidor
  const port = process.env.PORT || 3010;
  await app.listen(port);
  
  logger.log(`🚀 PSA API corriendo en: http://localhost:${port}`);
  logger.log(`📚 Documentación Swagger: http://localhost:${port}/api/docs`);
  logger.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('❌ Error fatal al iniciar la aplicación:', error);
  process.exit(1);
});
