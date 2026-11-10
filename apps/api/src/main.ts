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

  // 2. Prefijo global para todas las rutas (EXCLUYENDO Swagger)
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '', method: 0 },           // Health check en raíz
      { path: 'docs', method: 0 },       // Swagger docs
      { path: 'docs-json', method: 0 },  // Swagger JSON spec
    ],
  });

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
      'access-token',
    )
    .addTag('Auth', 'Endpoints de autenticación y gestión de sesión')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Montamos Swagger en /docs (SIN el prefijo api porque lo excluimos arriba)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // 5. Iniciar servidor
  const port = process.env.PORT || 3010;
  await app.listen(port);
  
  logger.log(`🚀 PSA API corriendo en: http://localhost:${port}`);
  logger.log(`📚 Documentación Swagger: http://localhost:${port}/docs`);
  logger.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap().catch((error) => {
  console.error('❌ Error fatal al iniciar la aplicación:', error);
  process.exit(1);
});
