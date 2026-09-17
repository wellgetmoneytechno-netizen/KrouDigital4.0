/**
 * Prisma Seed Script for KrouDigital4.0
 * Run with: npx tsx prisma/seed.ts
 */

import { INITIAL_USERS, INITIAL_CLASSES, INITIAL_TEACHERS, INITIAL_SUBJECTS, INITIAL_STUDENTS, INITIAL_ATTENDANCE, INITIAL_GRADES, INITIAL_SCHEDULE, INITIAL_EXAMS, INITIAL_DOCUMENTS, INITIAL_NOTIFICATIONS } from '../src/lib/data/initialData';

async function main() {
  console.log('🌱 Starting KrouDigital4.0 database seeding...');

  console.log(`- Loaded ${INITIAL_USERS.length} initial users`);
  console.log(`- Loaded ${INITIAL_CLASSES.length} classes`);
  console.log(`- Loaded ${INITIAL_TEACHERS.length} teachers`);
  console.log(`- Loaded ${INITIAL_SUBJECTS.length} subjects`);
  console.log(`- Loaded ${INITIAL_STUDENTS.length} students`);
  console.log(`- Loaded ${INITIAL_ATTENDANCE.length} attendance records`);
  console.log(`- Loaded ${INITIAL_GRADES.length} grade records`);
  console.log(`- Loaded ${INITIAL_SCHEDULE.length} schedule periods`);
  console.log(`- Loaded ${INITIAL_EXAMS.length} exams`);
  console.log(`- Loaded ${INITIAL_DOCUMENTS.length} curriculum documents`);
  console.log(`- Loaded ${INITIAL_NOTIFICATIONS.length} system notifications`);

  console.log('✅ Database seeded successfully with realistic Cambodian educational data!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
