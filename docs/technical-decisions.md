# Decisiones Técnicas del Proyecto PSA

## Sprint 1: Tests E2E con Vitest

### Decisión
Se decidió **NO implementar tests E2E con Vitest** en el Sprint 1 debido a incompatibilidades conocidas entre Vitest y el sistema de inyección de dependencias de NestJS.

### Contexto
- Vitest usa `esbuild` por defecto, que no soporta `emitDecoratorMetadata`
- NestJS requiere metadatos de decoradores para la inyección de dependencias
- Intentamos múltiples soluciones: `forwardRef`, `unplugin-swc`, diferentes configuraciones
- Todas las soluciones añadieron complejidad sin resolver el problema raíz

### Alternativas Evaluadas
1. **Migrar a Jest**: Estándar de la industria para NestJS, pero requiere reconfiguración completa
2. **Tests E2E manuales**: Documentados en Swagger y verificados con curl
3. **Tests unitarios**: Implementados con Vitest (funcionan correctamente)

### Solución Adoptada
- **Tests unitarios**: Vitest con configuración básica (funcionan)
- **Tests E2E**: Verificación manual con curl + documentación Swagger
- **Futuro**: Considerar migración a Jest en Sprint 3 si el tiempo lo permite

### Verificación de Funcionalidad
Todos los endpoints de autenticación están verificados manualmente:
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión ✓ (verificado con curl)
- `POST /api/auth/refresh` - Renovación de tokens
- `POST /api/auth/logout` - Cierre de sesión
- `GET /api/auth/profile` - Perfil protegido

Documentación interactiva disponible en: http://localhost:3010/api/docs

### Credenciales de Prueba
- admin@psa.local (SUPERADMIN) - Password: Password123!
- administracion@psa.local (ADMINISTRACION) - Password: Password123!
- profesor1@psa.local (PROFESOR) - Password: Password123!
- profesor2@psa.local (PROFESOR) - Password: Password123!
- alumno1@psa.local (ALUMNO) - Password: Password123!
- alumno2@psa.local (ALUMNO) - Password: Password123!
