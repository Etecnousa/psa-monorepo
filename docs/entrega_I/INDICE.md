# ENTREGA I - PSA: Plataforma de Seguimiento Académico
## Fecha límite: 19 de octubre de 2026

### ESTRUCTURA DEL DOCUMENTO (estimación: 15-20 páginas)

1. IDENTIFICACIÓN DEL AUTOR/A (1 página)
   1.1. Datos personales
   1.2. Ciclo formativo y centro educativo
   1.3. Empresa colaboradora (Nova Oposiciones)

2. FINALIDAD DEL PROYECTO (2-3 páginas)
   2.1. Definición del proyecto (enfoque ASIR: administración de sistemas)
   2.2. Objetivos (despliegue seguro + aplicación funcional)
   2.3. Sector del mercado
   2.4. Usuarios destinatarios (4 roles)

3. REQUISITOS PREVIOS (2 páginas)
   3.1. Conocimientos técnicos (sistemas, redes, Docker)
   3.2. Requisitos de hardware y software
   3.3. Infraestructura necesaria (VPS, dominio, etc.)

4. PLANIFICACIÓN DEL CONTENIDO (2 páginas)
   4.1. Metodología de trabajo (fases incrementales)
   4.2. Cronograma general del proyecto
   4.3. Estado actual: Fase 0 completada

5. DISEÑO E IMPLEMENTACIÓN - FASE 0: APLICACIÓN BASE (5-6 páginas)
   5.1. Arquitectura general del sistema (monorepo, capas)
   5.2. Stack tecnológico (NestJS, Next.js, PostgreSQL, Docker)
   5.3. Modelo de datos (schema.prisma)
   5.4. Módulo de autenticación
       5.4.1. JWT + Refresh Tokens
       5.4.2. RBAC con 4 roles
       5.4.3. Guards y decoradores
   5.5. Módulo de cursos (CRUD básico)
   5.6. Contenerización con Docker y Docker Compose

6. DISEÑO E IMPLEMENTACIÓN - FASE 1: DESPLIEGUE Y SEGURIDAD (4-5 páginas)
   6.1. Contratación/configuración del servidor VPS
   6.2. Bastionado del servidor
       6.2.1. Configuración segura de SSH
       6.2.2. Creación de usuarios con sudo
       6.2.3. Instalación de fail2ban
   6.3. Instalación de Docker y Docker Compose
   6.4. Despliegue de la aplicación PSA en contenedores
   6.5. Configuración inicial de cortafuegos (UFW)

7. INSTALACIÓN Y CONFIGURACIÓN (2 páginas)
   7.1. Guía paso a paso para replicar el entorno
   7.2. Variables de entorno
   7.3. Comandos de gestión (start, stop, logs, backup)

8. RESULTADOS Y CONCLUSIONES PARCIALES (1-2 páginas)
   8.1. Logros de la Entrega I
   8.2. Dificultades encontradas y soluciones
   8.3. Próximos pasos (Entrega II: backups y monitorización)

9. CÓDIGO (apéndice - solo fragmentos clave)
   9.1. docker-compose.yml
   9.2. Scripts de gestión básicos
   9.3. Configuración de Nginx (si aplica)

10. DOCUMENTACIÓN Y BIBLIOGRAFÍA (1 página)
    10.1. Fuentes consultadas
    10.2. Libros de referencia

### CAPTURAS DE PANTALLA NECESARIAS (máximo 50% del documento)

**Fase 0 - Aplicación:**
- Figura 1: Estructura del monorepo (tree)
- Figura 2: Swagger UI con endpoints de Auth
- Figura 3: Swagger UI con endpoints de Courses
- Figura 4: Prisma Studio mostrando modelo de datos
- Figura 5: docker-compose.yml
- Figura 6: Contenedores corriendo (docker ps)

**Fase 1 - Servidor:**
- Figura 7: Acceso SSH al servidor
- Figura 8: Configuración de /etc/ssh/sshd_config
- Figura 9: Usuarios creados (cat /etc/passwd | grep bash)
- Figura 10: fail2ban activo (systemctl status fail2ban)
- Figura 11: Docker instalado (docker --version)
- Figura 12: Aplicación desplegada en el servidor
- Figura 13: Cortafuegos UFW activo (ufw status)
- Figura 14: Acceso a la aplicación desde el navegador (HTTP)

### TAREAS POR DÍA (11 días disponibles)

**Día 8 (hoy tarde):** Planificación y estructura [ACTUAL]
**Día 9 (mañana):** Documentar Fase 0 - aplicación (sección 5)
**Día 10 (viernes):** Configurar servidor VPS + bastionado básico
**Día 11 (sábado):** Instalar Docker + desplegar aplicación + cortafuegos
**Día 12 (domingo):** Documentar Fase 1 - despliegue (sección 6)
**Día 13-14 (lunes-martes):** Redactar secciones 1-4 (contexto)
**Día 15-16 (miércoles-jueves):** Redactar secciones 7-8 (instalación + conclusiones)
**Día 17 (viernes):** Capturas de pantalla + formato final
**Día 18 (sábado):** Revisión + generación PDF/ODT
**Día 19 (domingo):** Envío al tutor
