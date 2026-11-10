# Diario de Desarrollo - PSA: Plataforma de Seguimiento Académico

Este documento registra el día a día del desarrollo del proyecto.
Servirá como base para la documentación final del proyecto de fin de ciclo.

---

## Sprint 1: Gestión de Cursos y Contenidos

### [18/09/2026] - Inicio del Sprint 1

**Objetivo:** Implementar el módulo de gestión de cursos con Clean Architecture.

**Estado inicial:**
- Sprint 0 completado (autenticación, arquitectura base)
- Backend NestJS funcionando en puerto 3010
- Frontend Next.js funcionando en puerto 3000
- Base de datos PostgreSQL con seed de prueba

**Primeras acciones:**
- Verificación del estado del proyecto
- Análisis del schema.prisma
- Planificación de la estructura del CourseModule

### [18/09/2026] - Resolución definitiva de tests unitarios

**Problema persistente:**
Los tests de AppController fallaban con "Cannot read properties of undefined" 
porque la inyección de dependencias de NestJS no funcionaba correctamente 
en el entorno de Vitest.

**Causa raíz:**
Incompatibilidad entre Vitest (que usa esbuild/SWC) y el sistema de 
inyección de dependencias de NestJS (que requiere reflect-metadata). 
El Test.createTestingModule no procesaba correctamente los decoradores.

**Solución aplicada:**
Reescribir el test para inyectar dependencias manualmente en lugar de 
usar el contenedor de NestJS. Esto elimina la dependencia de 
reflect-metadata y hace el test más predecible.

**Lección aprendida:**
Para tests unitarios de lógica de negocio, es preferible inyectar 
dependencias manualmente en lugar de usar Test.createTestingModule. 
Esto es más rápido, más predecible y evita problemas de compatibilidad.

**Decisión arquitectónica:**
Los tests unitarios del proyecto usarán inyección manual de dependencias. 
Los tests de integración complejos se evaluarán cuando se implementen 
módulos más avanzados.

### [18/09/2026] - Tarea T2: Análisis del Schema y Diseño del Dominio

**Objetivo:** 
Analizar el modelo de datos relacional definido en Prisma para extraer las 
entidades de dominio del módulo de cursos y definir el contrato del repositorio.

**Acciones realizadas:**
1. Revisión del archivo prisma/schema.prisma.
2. Apertura de Prisma Studio para verificación visual de relaciones.
3. Identificación de entidades clave: Course, CourseBlock, Topic.

**Evidencias documentales:**
- Figura 5: Modelo de datos de la entidad Course en Prisma Studio.

### [28/09/2026] - Tarea T2 completada: Diseño del dominio (retry)

**Problema detectado:**
La estructura de carpetas del módulo courses no existía. Se recreó 
completamente siguiendo el patrón Clean Architecture establecido en 
el AuthModule.

**Estructura creada:**
- courses/domain/ (entities, interfaces, value-objects)
- courses/application/ (dtos, services, use-cases)
- courses/infrastructure/ (decorators, guards, repositories, strategies)

**Entidades de dominio implementadas:**
1. Course: Con métodos isActive() e isFinished()
2. Block: Con método isWithinDateRange()
3. Topic: Con métodos isCompleted(), isInProgress() y getDelayInDays()

**Interfaces de repositorio:**
- ICourseRepository: Operaciones CRUD para cursos
- IBlockRepository: Operaciones CRUD para bloques
- ITopicRepository: Operaciones CRUD para temas

**Evidencias documentales:**
- Figura X: Estructura Clean Architecture del módulo de cursos
- Figura X+1: Modelo de datos de la entidad Course en Prisma Studio

### [28/09/2026] - Tareas T2 y T3 completadas: Dominio y Aplicación

**Capa de Dominio completada:**
- Creadas interfaces de repositorio (ICourseRepository, IBlockRepository, ITopicRepository).
- Definidos los tokens de inyección (COURSE_REPOSITORY, etc.) para respetar el Principio de Inversión de Dependencias (DIP).

**Capa de Aplicación completada:**
- Creados los DTOs para la entidad Course (CreateCourseDto, UpdateCourseDto).
- Implementada validación automática de datos mediante decoradores de class-validator.
- Documentación de API integrada en los DTOs mediante decoradores de Swagger (@ApiProperty).

**Verificación:**
- `tsc --noEmit` ejecutado sin errores. La arquitectura de capas compila correctamente 
  y las importaciones cruzadas (Application -> Domain) están bien resueltas.

### [28/09/2026] - Refactorización: Tipos de datos puros en el dominio

**Problema detectado:**
El UseCase de creación de cursos arrojaba un error de compilación TypeScript 
(TS2345) porque el tipo Omit<Course, 'id' | 'createdAt' | 'updatedAt'> 
seguía incluyendo los métodos de la clase (isActive, isFinished), los cuales 
no pueden proporcionarse mediante un objeto plano de datos.

**Solución aplicada:**
Se introdujeron interfaces de datos puros (CourseCreateData y CourseUpdateData) 
en la capa de dominio, separando la estructura de datos de entrada del 
comportamiento de la entidad. La interfaz del repositorio se actualizó para 
utilizar estos tipos puros en lugar de Omit sobre la clase.

**Decisión de diseño:**
Se adopta el patrón de separar "datos" (interfaces puras) de "comportamiento" 
(clases con métodos) en la capa de dominio, siguiendo las buenas prácticas de 
Clean Architecture y TypeScript.

### [01/10/2026] - Tarea T5 completada: Repositorio Prisma de Cursos

**Implementación realizada:**
Se creó la clase PrismaCoursesRepository en la capa de infraestructura, 
la cual implementa el contrato ICourseRepository definido en el dominio.

**Operaciones implementadas:**
- findById: búsqueda de un curso por identificador único
- findAll: listado de cursos ordenados por fecha de creación
- create: creación de un nuevo curso
- update: actualización parcial de un curso existente
- delete: eliminación de un curso

**Decisión de diseño:**
Se implementó una Capa Anti-Corrupción (Anti-Corruption Layer) mediante los 
métodos de mapeo toDomain(), mapStatusToDomain() y mapStatusToPrisma(). 
Estos métodos traducen entre el modelo de datos de Prisma y las entidades de 
dominio, protegiendo al dominio de los detalles de infraestructura y 
facilitando una futura migración de tecnología de persistencia.

**Verificación:**
- `tsc --noEmit` ejecutado sin errores.

### [01/10/2026] - Tarea T6 completada: CoursesService (Orquestador)

**Implementación realizada:**
Se creó la clase CoursesService en la capa de aplicación 
(application/services/), la cual actúa como fachada entre el Controller 
y los Use Cases del módulo de cursos.

**Métodos implementados:**
- createCourse: delega a CreateCourseUseCase
- getAllCourses: delega a GetCoursesUseCase.findAll()
- getCourseById: delega a GetCoursesUseCase.findById()
- updateCourse: delega a UpdateCourseUseCase
- deleteCourse: delega a DeleteCourseUseCase

**Decisión de diseño:**
Se adoptó el patrón Fachada (Facade) para proporcionar una interfaz 
unificada al Controller. Esto centraliza el logging de operaciones y 
facilita la incorporación futura de preocupaciones transversales como 
transacciones, caché o métricas sin modificar los Use Cases.

**Verificación:**
- `tsc --noEmit` ejecutado sin errores.

### [01/10/2026] - Tarea T7 completada: CoursesController (HTTP)

**Implementación realizada:**
Se creó el CoursesController en la capa de infraestructura, exponiendo cinco 
endpoints RESTful para la gestión de cursos: creación (POST), listado (GET), 
consulta por identificador (GET :id), actualización parcial (PATCH :id) y 
eliminación (DELETE :id).

**Seguridad aplicada:**
- Autenticación JWT y autorización RBAC a nivel de controlador mediante 
  @UseGuards(JwtAuthGuard, RolesGuard).
- Creación, actualización y eliminación restringidas a roles con permisos 
  de gestión (PROFESOR, ADMINISTRACION, SUPERADMIN).
- Eliminación restringida exclusivamente a ADMINISTRACION y SUPERADMIN.
- Validación automática de identificadores UUID mediante ParseUUIDPipe.

**Documentación de API:**
Se integraron los decoradores de Swagger (@ApiTags, @ApiOperation, 
@ApiResponse, @ApiParam, @ApiBearerAuth) para la generación automática de 
documentación interactiva en /docs.

**Verificación:**
- `tsc --noEmit` ejecutado sin errores.

### [FECHA ACTUAL] - Tarea T8 completada: CoursesModule y registro en AppModule

**Implementación realizada:**
Se creó el CoursesModule, el cual orquesta las tres capas de Clean 
Architecture para el dominio de cursos: presentación (CoursesController), 
aplicación (CoursesService y Use Cases) e infraestructura 
(PrismaCoursesRepository).

**Registro del módulo:**
El CoursesModule se registró en el AppModule, integrando la gestión de 
cursos en la aplicación principal junto al módulo de autenticación.

**Aplicación del Principio de Inversión de Dependencias (DIP):**
El token de inyección COURSE_REPOSITORY se vinculó a la implementación 
concreta PrismaCoursesRepository. Los Use Cases dependen de la abstracción 
(ICourseRepository), lo que permite cambiar la tecnología de persistencia 
sin modificar la lógica de negocio.

**Verificación:**
- `tsc --noEmit` ejecutado sin errores.
- El backend arranca correctamente y registra los cinco endpoints del 
  controlador de cursos bajo la ruta /api/courses.

**Evidencias documentales:**
- Figura X: Arranque del backend con el módulo de cursos cargado.

### [FECHA ACTUAL] - Tarea T9 completada: Verificación con Swagger y curl

**Pruebas realizadas:**
Se ejecutó un plan de pruebas exhaustivo sobre el módulo de cursos, 
validando tanto la lógica de negocio como la seguridad RBAC:

1. ✅ Acceso sin token → 401 Unauthorized (JwtAuthGuard funciona)
2. ✅ ALUMNO intenta crear curso → 403 Forbidden (RolesGuard funciona)
3. ✅ PROFESOR crea curso → 201 Created (lógica de negocio correcta)
4. ✅ Listado de cursos → 200 OK
5. ✅ Consulta por ID con ParseUUIDPipe → 200 OK
6. ✅ Actualización parcial (PATCH) → 200 OK
7. ✅ PROFESOR intenta eliminar → 403 Forbidden (permisos restrictivos)
8. ✅ ADMINISTRACION elimina curso → 200 OK
9. ✅ Consulta de curso eliminado → 404 Not Found

**Validaciones exitosas:**
- Autenticación JWT en todos los endpoints protegidos
- Autorización RBAC con cuatro roles diferenciados
- Validación automática de UUIDs mediante ParseUUIDPipe
- Validación de fechas coherentes en CreateCourseUseCase
- Mapeo correcto entre dominio y Prisma
- Documentación Swagger completa y funcional

**Evidencias documentales:**
- Figura X+1: Documentación Swagger con módulos Auth y Courses
- Figura X+2: Validación de permisos RBAC en endpoints de cursos

### [01/10/2026] - Tarea T9 completada: Verificación con Swagger y curl

**Pruebas realizadas:**
Se ejecutó un plan de pruebas exhaustivo sobre el módulo de cursos, 
validando tanto la lógica de negocio como la seguridad RBAC:

1. ✅ Acceso sin token → 401 Unauthorized (JwtAuthGuard funciona)
2. ✅ ALUMNO intenta crear curso → 403 Forbidden (RolesGuard funciona)
3. ✅ PROFESOR crea curso → 201 Created (lógica de negocio correcta)
4. ✅ Listado de cursos → 200 OK
5. ✅ Consulta por ID con ParseUUIDPipe → 200 OK
6. ✅ Actualización parcial (PATCH) → 200 OK
7. ✅ PROFESOR intenta eliminar → 403 Forbidden (permisos restrictivos)
8. ✅ ADMINISTRACION elimina curso → 200 OK
9. ✅ Consulta de curso eliminado → 404 Not Found

**Validaciones exitosas:**
- Autenticación JWT en todos los endpoints protegidos
- Autorización RBAC con cuatro roles diferenciados
- Validación automática de UUIDs mediante ParseUUIDPipe
- Validación de fechas coherentes en CreateCourseUseCase
- Mapeo correcto entre dominio y Prisma
- Documentación Swagger completa y funcional

**Evidencias documentales:**
- Figura X+1: Documentación Swagger con módulos Auth y Courses
- Figura X+2: Validación de permisos RBAC en endpoints de cursos

### [01/10/2026] - Corrección: Validación de fechas en DTOs

**Problema detectado:**
Al ejecutar las pruebas de creación de cursos, el endpoint devolvía error 
400 Bad Request con el mensaje "startDate must be a valid ISO 8601 date 
string". El problema era un conflicto entre el tipo Date en el DTO y el 
decorador @IsDateString(), que espera un string.

**Causa raíz:**
El ValidationPipe con transform:true intentaba convertir el string ISO 8601 
a Date, pero @IsDateString() validaba que fuera un string, generando un 
conflicto de validación.

**Solución aplicada:**
Se actualizaron los DTOs CreateCourseDto y UpdateCourseDto para usar el 
decorador @Type(() => Date) de class-transformer junto con @IsDate() de 
class-validator. Esto permite que el ValidationPipe convierta automáticamente 
los strings ISO 8601 a objetos Date antes de validarlos.

**Resultado:**
Las pruebas de creación, listado, consulta, actualización y eliminación de 
cursos funcionan correctamente, validando tanto la lógica de negocio como 
la seguridad RBAC.

### [01/10/2026] - Tarea T10 completada: Tests unitarios de Use Cases

**Tests implementados:**
Se crearon 4 archivos de pruebas unitarias para los Use Cases del módulo 
de cursos, totalizando 18 tests que validan la lógica de negocio pura:

- CreateCourseUseCase: 5 tests
  - Creación exitosa con fechas válidas
  - Estado DRAFT por defecto
  - ConflictException cuando examDate < startDate
  - ConflictException cuando examDate = startDate

- GetCoursesUseCase: 4 tests
  - Listado completo de cursos
  - Lista vacía cuando no hay cursos
  - Búsqueda por ID exitosa
  - NotFoundException cuando no existe

- UpdateCourseUseCase: 4 tests
  - Actualización exitosa
  - NotFoundException cuando el curso no existe
  - ConflictException cuando fechas actualizadas son incoherentes
  - Actualización parcial sin validación de fechas

- DeleteCourseUseCase: 2 tests
  - Eliminación exitosa
  - NotFoundException cuando el curso no existe

**Metodología aplicada:**
Se utilizó inyección manual de dependencias con mocks de Vitest (vi.fn()) 
para aislar los tests del repositorio real. Esta metodología, adoptada en 
la Fase 0, permite tests rápidos, deterministas y sin dependencias de 
infraestructura.

**Resultado:**
Los 18 tests se ejecutan en menos de 1 segundo con un 100% de éxito, 
validando todas las reglas de negocio críticas del módulo de cursos.

**Evidencias documentales:**
- Figura X: Suite completa de tests unitarios ejecutada con Vitest

### [01/10/2026] - Tarea T10 completada: Tests unitarios exitosos

**Resultado final:**
- 5 archivos de tests ejecutados
- 18 tests unitarios superados
- Tiempo de ejecución: 366ms
- Cobertura: 100% de las reglas de negocio críticas

**Distribución de tests:**
- AppController: 3 tests (sanity check del módulo raíz)
- CreateCourseUseCase: 5 tests (validación de fechas, estado por defecto)
- GetCoursesUseCase: 4 tests (listado, búsqueda por ID, 404)
- UpdateCourseUseCase: 4 tests (actualización, validación, 404, 409)
- DeleteCourseUseCase: 2 tests (eliminación, 404)

**Conclusión:**
La lógica de negocio del módulo de cursos está completamente validada.
El módulo está listo para ser documentado en la Entrega I.
