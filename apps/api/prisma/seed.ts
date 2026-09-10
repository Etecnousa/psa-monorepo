import { PrismaClient, Role, CourseStatus, TopicStatus, AlertType, AlertSeverity } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de base de datos PSA...');
  console.log('='.repeat(60));

  // ===========================================================================
  // 1. LIMPIAR DATOS PREVIOS (idempotente)
  // ===========================================================================
  console.log('\n🧹 Limpiando datos previos...');
  
  // Orden importante por foreign keys
  await prisma.auditLog.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.lociPalace.deleteMany();
  await prisma.topicDependency.deleteMany();
  await prisma.document.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.block.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Base de datos limpia');

  // ===========================================================================
  // 2. CREAR USUARIOS
  // ===========================================================================
  console.log('\n👥 Creando usuarios...');

  const passwordHash = await bcrypt.hash('Password123!', 12);
  const now = new Date();

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@psa.local',
        passwordHash,
        firstName: 'Super',
        lastName: 'Admin',
        role: Role.SUPERADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: 'administracion@psa.local',
        passwordHash,
        firstName: 'Laura',
        lastName: 'Martínez',
        role: Role.ADMINISTRACION,
      },
    }),
    prisma.user.create({
      data: {
        email: 'profesor1@psa.local',
        passwordHash,
        firstName: 'Juan',
        lastName: 'García',
        role: Role.PROFESOR,
      },
    }),
    prisma.user.create({
      data: {
        email: 'profesor2@psa.local',
        passwordHash,
        firstName: 'María',
        lastName: 'López',
        role: Role.PROFESOR,
      },
    }),
    prisma.user.create({
      data: {
        email: 'alumno1@psa.local',
        passwordHash,
        firstName: 'Pedro',
        lastName: 'Sánchez',
        role: Role.ALUMNO,
      },
    }),
    prisma.user.create({
      data: {
        email: 'alumno2@psa.local',
        passwordHash,
        firstName: 'Ana',
        lastName: 'Torres',
        role: Role.ALUMNO,
      },
    }),
  ]);

  const [superadmin, admin, profesor1, profesor2, alumno1, alumno2] = users;
  console.log(`✅ ${users.length} usuarios creados`);

  // ===========================================================================
  // 3. CREAR CURSO
  // ===========================================================================
  console.log('\n📚 Creando curso...');

  const curso = await prisma.course.create({
    data: {
      name: 'Ingeniería del Software - Oposiciones 2026',
      description: 'Curso completo de preparación para oposiciones de Ingeniería del Software del Estado',
      startDate: new Date('2026-01-15'),
      examDate: new Date('2026-06-30'),
      status: CourseStatus.ACTIVO,
      professors: {
        connect: [
          { id: profesor1.id },
          { id: profesor2.id },
        ],
      },
    },
  });

  console.log(`✅ Curso creado: ${curso.name}`);

  // ===========================================================================
  // 4. MATRICULAR ALUMNOS
  // ===========================================================================
  console.log('\n🎓 Matriculando alumnos...');

  await prisma.enrollment.createMany({
    data: [
      { userId: alumno1.id, courseId: curso.id },
      { userId: alumno2.id, courseId: curso.id },
    ],
  });

  console.log('✅ 2 alumnos matriculados');

  // ===========================================================================
  // 5. CREAR BLOQUES TEMÁTICOS
  // ===========================================================================
  console.log('\n📦 Creando bloques temáticos...');

  const bloque1 = await prisma.block.create({
    data: {
      courseId: curso.id,
      name: 'Fundamentos de Ingeniería del Software',
      description: 'Conceptos básicos, metodologías y ciclo de vida',
      order: 1,
      plannedStart: new Date('2026-01-15'),
      plannedEnd: new Date('2026-02-15'),
    },
  });

  const bloque2 = await prisma.block.create({
    data: {
      courseId: curso.id,
      name: 'Metodologías Ágiles',
      description: 'Scrum, Kanban, XP y Lean',
      order: 2,
      plannedStart: new Date('2026-02-16'),
      plannedEnd: new Date('2026-03-31'),
    },
  });

  const bloque3 = await prisma.block.create({
    data: {
      courseId: curso.id,
      name: 'Gestión de Proyectos',
      description: 'PMBOK, planificación, control y cierre',
      order: 3,
      plannedStart: new Date('2026-04-01'),
      plannedEnd: new Date('2026-06-15'),
    },
  });

  console.log('✅ 3 bloques creados');

  // ===========================================================================
  // 6. CREAR TEMAS
  // ===========================================================================
  console.log('\n📝 Creando temas...');

  const tema1 = await prisma.topic.create({
    data: {
      blockId: bloque1.id,
      title: 'Ciclo de Vida del Software',
      description: 'Modelos de ciclo de vida: cascada, iterativo, incremental, espiral',
      objectives: 'Comprender los diferentes modelos de ciclo de vida y sus aplicaciones prácticas',
      plannedStart: new Date('2026-01-15'),
      plannedEnd: new Date('2026-01-22'),
      status: TopicStatus.COMPLETADO,
      actualEnd: new Date('2026-01-21'),
    },
  });

  const tema2 = await prisma.topic.create({
    data: {
      blockId: bloque1.id,
      title: 'Modelado de Requisitos',
      description: 'Técnicas de elicitação, análisis y especificación de requisitos',
      objectives: 'Dominar técnicas de captura y documentación de requisitos funcionales y no funcionales',
      plannedStart: new Date('2026-01-23'),
      plannedEnd: new Date('2026-01-30'),
      status: TopicStatus.COMPLETADO,
      actualEnd: new Date('2026-01-29'),
    },
  });

  const tema3 = await prisma.topic.create({
    data: {
      blockId: bloque1.id,
      title: 'Arquitectura de Software',
      description: 'Patrones arquitectónicos, decisiones de diseño y trade-offs',
      objectives: 'Identificar y aplicar patrones arquitectónicos comunes (MVC, microservicios, etc.)',
      plannedStart: new Date('2026-01-31'),
      plannedEnd: new Date('2026-02-07'),
      status: TopicStatus.EN_PROGRESO,
    },
  });

  const tema4 = await prisma.topic.create({
    data: {
      blockId: bloque2.id,
      title: 'Scrum Framework',
      description: 'Roles, eventos, artefactos y reglas de Scrum',
      objectives: 'Comprender y aplicar el framework Scrum completo en equipos de desarrollo',
      plannedStart: new Date('2026-02-16'),
      plannedEnd: new Date('2026-02-23'),
      status: TopicStatus.NO_INICIADO,
    },
  });

  const tema5 = await prisma.topic.create({
    data: {
      blockId: bloque2.id,
      title: 'Kanban y Lean',
      description: 'Principios Lean, gestión visual del trabajo, WIP limits',
      objectives: 'Implementar Kanban en equipos de desarrollo y optimizar el flujo de valor',
      plannedStart: new Date('2026-02-24'),
      plannedEnd: new Date('2026-03-02'),
      status: TopicStatus.NO_INICIADO,
    },
  });

  const tema6 = await prisma.topic.create({
    data: {
      blockId: bloque3.id,
      title: 'PMBOK y Grupos de Procesos',
      description: 'Los 5 grupos de procesos y 10 áreas de conocimiento del PMBOK',
      objectives: 'Dominar la guía PMBOK para la gestión profesional de proyectos',
      plannedStart: new Date('2026-04-01'),
      plannedEnd: new Date('2026-04-15'),
      status: TopicStatus.NO_INICIADO,
    },
  });

  console.log('✅ 6 temas creados con estados variados');

  // ===========================================================================
  // 7. CREAR DEPENDENCIAS ENTRE TEMAS
  // ===========================================================================
  console.log('\n🔗 Creando dependencias entre temas...');

  // El tema 4 (Scrum) depende del tema 1 (Ciclo de Vida)
  await prisma.topicDependency.create({
    data: {
      prerequisiteId: tema1.id,
      dependentId: tema4.id,
    },
  });

  console.log('✅ 1 dependencia creada (Tema 4 depende de Tema 1)');

  // ===========================================================================
  // 8. CREAR ALERTAS DE EJEMPLO
  // ===========================================================================
  console.log('\n🔔 Creando alertas de ejemplo...');

  const diasHastaExamen = Math.ceil(
    (new Date('2026-06-30').getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  await prisma.alert.create({
    data: {
      userId: profesor1.id,
      courseId: curso.id,
      type: AlertType.PROXIMIDAD_EXAMEN,
      severity: AlertSeverity.INFO,
      title: 'Examen próximo',
      message: `Faltan ${diasHastaExamen} días para el examen de oposición`,
      metadata: { daysRemaining: diasHastaExamen },
    },
  });

  await prisma.alert.create({
    data: {
      userId: alumno1.id,
      courseId: curso.id,
      type: AlertType.RETRASO_TEMA,
      severity: AlertSeverity.WARNING,
      title: 'Tema en progreso',
      message: 'El tema "Arquitectura de Software" está en progreso',
      metadata: { topicId: tema3.id },
    },
  });

  console.log('✅ 2 alertas creadas');

  // ===========================================================================
  // 9. CREAR LOG DE AUDITORÍA
  // ===========================================================================
  console.log('\n📋 Creando log de auditoría...');

  await prisma.auditLog.create({
    data: {
      userId: superadmin.id,
      action: 'SEED_EXECUTED',
      entity: 'System',
      ipAddress: '127.0.0.1',
      userAgent: 'Prisma Seed Script',
      metadata: { 
        version: '1.0.0',
        usersCreated: users.length,
        coursesCreated: 1,
        topicsCreated: 6,
      },
    },
  });

  console.log('✅ Log de auditoría creado');

  // ===========================================================================
  // RESUMEN FINAL
  // ===========================================================================
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Seed completado exitosamente!');
  console.log('='.repeat(60));
  console.log('\n📊 Resumen de datos creados:');
  console.log(`   - Usuarios: ${users.length} (1 superadmin, 1 admin, 2 profesores, 2 alumnos)`);
  console.log(`   - Cursos: 1`);
  console.log(`   - Bloques: 3`);
  console.log(`   - Temas: 6 (2 completados, 1 en progreso, 3 no iniciados)`);
  console.log(`   - Matrículas: 2`);
  console.log(`   - Dependencias: 1`);
  console.log(`   - Alertas: 2`);
  console.log(`   - Logs auditoría: 1`);
  console.log('\n🔐 Credenciales de prueba (TODOS los usuarios):');
  console.log('   Password: Password123!');
  console.log('\n   Emails:');
  console.log('     • admin@psa.local (SUPERADMIN)');
  console.log('     • administracion@psa.local (ADMINISTRACION)');
  console.log('     • profesor1@psa.local (PROFESOR)');
  console.log('     • profesor2@psa.local (PROFESOR)');
  console.log('     • alumno1@psa.local (ALUMNO)');
  console.log('     • alumno2@psa.local (ALUMNO)');
  console.log('\n' + '='.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
