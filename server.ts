import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_TEACHERS,
  INITIAL_SUBJECTS,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
  INITIAL_GRADES,
  INITIAL_SCHEDULE,
  INITIAL_EXAMS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES
} from './src/lib/data/initialData';
import { Student, Teacher, ClassModel, SubjectModel, AttendanceRecord, GradeRecord, ScheduleItem, ExamModel, DocumentModel, NotificationModel, ActivityItem } from './src/types';
import { normalizeStudentData } from './src/lib/studentUtils';

const DATA_DIR = path.join(process.cwd(), 'data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');

function loadStoredStudents(): Student[] {
  try {
    if (fs.existsSync(STUDENTS_FILE)) {
      const content = fs.readFileSync(STUDENTS_FILE, 'utf-8');
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        console.log(`[Storage] Loaded ${data.length} students from disk cache`);
        return data;
      }
    }
  } catch (err) {
    console.warn('[Storage] Could not read students from disk:', err);
  }
  return [...INITIAL_STUDENTS];
}

function persistStudentsToDisk(data: Student[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Failed to persist students to disk:', err);
  }
}

// Database initialized with persistent storage or realistic Khmer demo dataset
let users = [...INITIAL_USERS];
let classes: ClassModel[] = [...INITIAL_CLASSES];
let teachers: Teacher[] = [...INITIAL_TEACHERS];
let subjects: SubjectModel[] = [...INITIAL_SUBJECTS];
let students: Student[] = loadStoredStudents();
let attendances: AttendanceRecord[] = [...INITIAL_ATTENDANCE];
let grades: GradeRecord[] = [...INITIAL_GRADES];
let schedules: ScheduleItem[] = [...INITIAL_SCHEDULE];
let exams: ExamModel[] = [...INITIAL_EXAMS];
let documents: DocumentModel[] = [...INITIAL_DOCUMENTS];
let notifications: NotificationModel[] = [...INITIAL_NOTIFICATIONS];
let activities: ActivityItem[] = [...INITIAL_ACTIVITIES];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase body size limit to 50MB to support large CSV/Excel datasets, avatars, and bulk operations
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Handle oversized payload or malformed JSON errors gracefully
  app.use((err: any, req: Request, res: Response, next: any) => {
    if (err && (err.type === 'entity.too.large' || err.status === 413)) {
      return res.status(413).json({
        error: 'ទំហំឯកសារធំពេក (Payload too large). សូមជ្រើសរើសឯកសារតូចជាង 50MB។',
        status: 413
      });
    }
    if (err && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        error: 'ទម្រង់ទិន្នន័យមិនត្រឹមត្រូវ (Malformed JSON payload)',
        status: 400
      });
    }
    next(err);
  });

  // CORS / security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString(), platform: 'KrouDigital4.0 Khmer Digital Education' });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, role } = req.body;
    let foundUser = users.find(u => u.username.toLowerCase() === (username || '').toLowerCase() || u.email.toLowerCase() === (username || '').toLowerCase());
    
    if (!foundUser && role) {
      foundUser = users.find(u => u.role === role);
    }
    
    if (!foundUser) {
      // Default to Super Admin for smooth demo if generic
      foundUser = users[0];
    }

    res.json({
      success: true,
      token: 'jwt-kroudigital-token-' + Date.now(),
      user: foundUser,
      message: 'ចូលប្រើប្រព័ន្ធដោយជោគជ័យ'
    });
  });

  // Auth: Current User
  app.get('/api/auth/me', (req: Request, res: Response) => {
    res.json({ user: users[0] });
  });

  // Dashboard Stats
  app.get('/api/dashboard/stats', (req: Request, res: Response) => {
    const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
    const totalAttendanceRecorded = attendances.length || 1;
    const attendanceRate = Math.round((presentCount / totalAttendanceRecorded) * 100);

    res.json({
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      totalSubjects: subjects.length,
      attendanceRate: attendanceRate || 95,
      upcomingExams: exams.filter(e => e.status === 'SCHEDULED').length,
      activities: activities.slice(0, 8),
      notifications: notifications.slice(0, 5)
    });
  });

  // Students CRUD
  app.get('/api/students', (req: Request, res: Response) => {
    const { search, classId, status } = req.query;
    let result = [...students];

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(s => 
        (s.khmer_name && s.khmer_name.toLowerCase().includes(q)) ||
        (s.nameKhmer && s.nameKhmer.toLowerCase().includes(q)) ||
        (s.english_name && s.english_name.toLowerCase().includes(q)) ||
        (s.nameEnglish && s.nameEnglish.toLowerCase().includes(q)) ||
        (s.rlc && s.rlc.toLowerCase().includes(q)) ||
        (s.studentCode && s.studentCode.toLowerCase().includes(q)) ||
        (s.grade && s.grade.toLowerCase().includes(q)) ||
        (s.phone_number && s.phone_number.includes(q)) ||
        (s.remark && s.remark.toLowerCase().includes(q)) ||
        (s.orther && s.orther.toLowerCase().includes(q))
      );
    }

    if (classId && typeof classId === 'string' && classId !== 'ALL') {
      result = result.filter(s => s.classId === classId || s.grade === classId);
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      result = result.filter(s => s.status === status);
    }

    res.json(result);
  });

  app.post('/api/students', (req: Request, res: Response) => {
    const body = req.body;
    const newStudent: Student = normalizeStudentData(body, students.length + 1);

    students.unshift(newStudent);
    persistStudentsToDisk(students);

    // Record activity
    activities.unshift({
      id: 'act-' + Date.now(),
      action: 'បានចុះឈ្មោះសិស្សថ្មី',
      target: `${newStudent.khmer_name} (${newStudent.rlc})`,
      userName: 'អ្នកគ្រប់គ្រងសាលា',
      timeAgo: 'ទើបតែបញ្ចូល',
      type: 'STUDENT'
    });

    res.status(201).json(newStudent);
  });

  app.get('/api/students/:id', (req: Request, res: Response) => {
    const student = students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'រកមិនឃើញសិស្ស' });
    const studentGrades = grades.filter(g => g.studentId === student.id);
    const studentAttendance = attendances.filter(a => a.studentId === student.id);
    res.json({ student, grades: studentGrades, attendance: studentAttendance });
  });

  app.put('/api/students/:id', (req: Request, res: Response) => {
    const index = students.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញសិស្ស' });
    
    const updated = normalizeStudentData({ ...students[index], ...req.body }, index + 1);
    students[index] = updated;
    persistStudentsToDisk(students);
    res.json(updated);
  });

  app.delete('/api/students/:id', (req: Request, res: Response) => {
    const index = students.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញសិស្ស' });
    const deleted = students.splice(index, 1)[0];
    persistStudentsToDisk(students);
    res.json({ success: true, message: 'បានលុបទិន្នន័យសិស្សជោគជ័យ', deleted });
  });

  // Bulk import students (CSV / Excel)
  app.post('/api/students/import', (req: Request, res: Response) => {
    const importedList = req.body.students;
    if (!Array.isArray(importedList) || importedList.length === 0) {
      return res.status(400).json({ error: 'មិនមានទិន្នន័យសិស្សសម្រាប់នាំចូលឡើយ' });
    }

    const newStudents: Student[] = importedList.map((item, idx) => {
      return normalizeStudentData(item, students.length + idx + 1);
    });

    // Add new students to in-memory store
    students.unshift(...newStudents);
    // Persist immediately to disk
    persistStudentsToDisk(students);

    // Record activity
    activities.unshift({
      id: 'act-' + Date.now(),
      action: 'បាននាំចូលទិន្នន័យសិស្ស (CSV/Excel)',
      target: `${newStudents.length} នាក់ ជោគជ័យ`,
      userName: 'អ្នកគ្រប់គ្រងសាលា',
      timeAgo: 'ទើបតែនាំចូល',
      type: 'STUDENT'
    });

    res.status(201).json({
      success: true,
      message: `បាននាំចូលទិន្នន័យសិស្សចំនួន ${newStudents.length} នាក់ដោយជោគជ័យ`,
      count: newStudents.length,
      students: newStudents
    });
  });

  // Clear all students endpoint
  app.delete('/api/students', (req: Request, res: Response) => {
    const count = students.length;
    students = [];
    persistStudentsToDisk([]);
    attendances = [];
    grades = [];
    
    // Record activity
    activities.unshift({
      id: 'act-' + Date.now(),
      action: 'បានសម្អាតទិន្នន័យសិស្សទាំងអស់',
      target: `${count} នាក់`,
      userName: 'អ្នកគ្រប់គ្រងសាលា',
      timeAgo: 'ទើបតែលុប',
      type: 'STUDENT'
    });

    res.json({ success: true, message: `បានសម្អាតទិន្នន័យសិស្សទាំងអស់ (${count} នាក់) ជោគជ័យ`, count });
  });

  // Teachers CRUD
  app.get('/api/teachers', (req: Request, res: Response) => {
    res.json(teachers);
  });

  app.post('/api/teachers', (req: Request, res: Response) => {
    const body = req.body;
    const newId = 'tch-' + (teachers.length + 1).toString().padStart(3, '0');
    const newTeacher: Teacher = {
      id: newId,
      teacherCode: `TCH-${(teachers.length + 1).toString().padStart(3, '0')}`,
      nameKhmer: body.nameKhmer || 'គ្រូថ្មី',
      nameEnglish: body.nameEnglish || 'New Teacher',
      gender: body.gender || 'MALE',
      email: body.email || 'teacher@kroudigital.edu.kh',
      phone: body.phone || '012 333 444',
      department: body.department || 'វិទ្យាសាស្ត្រ',
      subjects: body.subjects || ['ភាសាខ្មែរ'],
      degree: body.degree || 'បរិញ្ញាបត្រ',
      status: 'ACTIVE',
      joinedDate: new Date().toISOString().split('T')[0],
      assignedClassNames: body.assignedClassNames || ['ថ្នាក់ទី១២ ក']
    };
    teachers.unshift(newTeacher);
    res.status(201).json(newTeacher);
  });

  app.put('/api/teachers/:id', (req: Request, res: Response) => {
    const index = teachers.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញគ្រូ' });
    teachers[index] = { ...teachers[index], ...req.body };
    res.json(teachers[index]);
  });

  app.delete('/api/teachers/:id', (req: Request, res: Response) => {
    const index = teachers.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញគ្រូ' });
    const removed = teachers.splice(index, 1)[0];
    res.json({ success: true, message: 'បានលុបព័ត៌មានគ្រូជោគជ័យ', removed });
  });

  // Classes CRUD
  app.get('/api/classes', (req: Request, res: Response) => {
    const classesWithCount = classes.map(c => ({
      ...c,
      studentCount: students.filter(s => s.classId === c.id).length
    }));
    res.json(classesWithCount);
  });

  app.post('/api/classes', (req: Request, res: Response) => {
    const body = req.body;
    const newId = 'cls-' + (classes.length + 1);
    const newClass: ClassModel = {
      id: newId,
      name: body.name || `ថ្នាក់ទី${body.grade || 12} ថ្មី`,
      grade: Number(body.grade) || 12,
      academicYear: body.academicYear || '២០២៥-២០២៦',
      room: body.room || 'បន្ទប់ D401',
      teacherId: body.teacherId || (teachers[0]?.id || 'tch-001'),
      teacherName: teachers.find(t => t.id === body.teacherId)?.nameKhmer || 'អ្នកគ្រូ ចាន់ សុខា',
      studentCount: 0,
      capacity: Number(body.capacity) || 35,
      shift: body.shift || 'MORNING'
    };
    classes.push(newClass);
    res.status(201).json(newClass);
  });

  app.put('/api/classes/:id', (req: Request, res: Response) => {
    const index = classes.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញថ្នាក់រៀន' });
    classes[index] = { ...classes[index], ...req.body };
    res.json(classes[index]);
  });

  app.delete('/api/classes/:id', (req: Request, res: Response) => {
    const index = classes.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញថ្នាក់រៀន' });
    const removed = classes.splice(index, 1)[0];
    res.json({ success: true, message: 'បានលុបថ្នាក់រៀនជោគជ័យ', removed });
  });

  // Subjects CRUD
  app.get('/api/subjects', (req: Request, res: Response) => {
    res.json(subjects);
  });

  app.post('/api/subjects', (req: Request, res: Response) => {
    const body = req.body;
    const newSubject: SubjectModel = {
      id: 'sbj-' + (subjects.length + 1).toString().padStart(2, '0'),
      code: body.code || `SUB${subjects.length + 1}`,
      nameKhmer: body.nameKhmer || 'មុខវិជ្ជាថ្មី',
      nameEnglish: body.nameEnglish || 'New Subject',
      credits: Number(body.credits) || 3,
      hoursPerWeek: Number(body.hoursPerWeek) || 4,
      department: body.department || 'ចំណេះទូទៅ',
      teacherName: body.teacherName || 'អ្នកគ្រូ ចាន់ សុខា',
      applicableGrades: body.applicableGrades || [10, 11, 12]
    };
    subjects.push(newSubject);
    res.status(201).json(newSubject);
  });

  app.put('/api/subjects/:id', (req: Request, res: Response) => {
    const index = subjects.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញមុខវិជ្ជា' });
    subjects[index] = { ...subjects[index], ...req.body };
    res.json(subjects[index]);
  });

  app.delete('/api/subjects/:id', (req: Request, res: Response) => {
    const index = subjects.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញមុខវិជ្ជា' });
    const removed = subjects.splice(index, 1)[0];
    res.json({ success: true, message: 'បានលុបមុខវិជ្ជាជោគជ័យ', removed });
  });

  // Attendance
  app.get('/api/attendance', (req: Request, res: Response) => {
    const { classId, date } = req.query;
    let list = [...attendances];
    if (classId && typeof classId === 'string' && classId !== 'ALL') {
      list = list.filter(a => a.classId === classId);
    }
    if (date && typeof date === 'string') {
      list = list.filter(a => a.date === date);
    }
    res.json(list);
  });

  app.post('/api/attendance', (req: Request, res: Response) => {
    const { records } = req.body;
    if (Array.isArray(records)) {
      records.forEach((record: AttendanceRecord) => {
        const idx = attendances.findIndex(a => a.studentId === record.studentId && a.date === record.date);
        if (idx !== -1) {
          attendances[idx] = { ...attendances[idx], ...record };
        } else {
          attendances.push({ ...record, id: 'att-' + Date.now() + Math.random().toString(36).substring(2, 5) });
        }
      });
    }

    // Add activity
    activities.unshift({
      id: 'act-' + Date.now(),
      action: 'បានកត់ត្រាវត្តមានសិស្ស',
      target: `ចំនួន ${records?.length || 0} នាក់`,
      userName: 'អ្នកគ្រូ ចាន់ សុខា',
      timeAgo: 'ទើបតែបញ្ចូល',
      type: 'ATTENDANCE'
    });

    res.json({ success: true, message: 'បានកត់ត្រាវត្តមានជោគជ័យ', count: records?.length });
  });

  // Grades
  app.get('/api/grades', (req: Request, res: Response) => {
    const { classId, subjectId } = req.query;
    let list = [...grades];
    if (classId && typeof classId === 'string') {
      list = list.filter(g => g.classId === classId);
    }
    if (subjectId && typeof subjectId === 'string') {
      list = list.filter(g => g.subjectId === subjectId);
    }
    res.json(list);
  });

  app.post('/api/grades', (req: Request, res: Response) => {
    const { gradesList } = req.body;
    if (Array.isArray(gradesList)) {
      gradesList.forEach((gradeItem: GradeRecord) => {
        const idx = grades.findIndex(g => g.id === gradeItem.id || (g.studentId === gradeItem.studentId && g.subjectId === gradeItem.subjectId));
        if (idx !== -1) {
          grades[idx] = { ...grades[idx], ...gradeItem };
        } else {
          grades.push({ ...gradeItem, id: 'grd-' + Date.now() + Math.random().toString(36).substring(2, 5) });
        }
      });
    }

    activities.unshift({
      id: 'act-' + Date.now(),
      action: 'បានបញ្ចូលពិន្ទុថ្មី',
      target: `ចំនួន ${gradesList?.length || 0} សិស្ស`,
      userName: 'អ្នកគ្រូ ចាន់ សុខា',
      timeAgo: 'ទើបតែបញ្ចូល',
      type: 'GRADE'
    });

    res.json({ success: true, message: 'បានរក្សាទុកពិន្ទុជោគជ័យ' });
  });

  // Schedule
  app.get('/api/schedule', (req: Request, res: Response) => {
    const { classId } = req.query;
    let list = [...schedules];
    if (classId && typeof classId === 'string' && classId !== 'ALL') {
      list = list.filter(s => s.classId === classId);
    }
    res.json(list);
  });

  app.post('/api/schedule', (req: Request, res: Response) => {
    const body = req.body;
    const newSchedule: ScheduleItem = {
      id: 'sch-' + Date.now(),
      dayOfWeek: Number(body.dayOfWeek) || 1,
      period: Number(body.period) || 1,
      startTime: body.startTime || '07:30',
      endTime: body.endTime || '08:20',
      classId: body.classId || 'cls-12a',
      className: classes.find(c => c.id === body.classId)?.name || 'ថ្នាក់ទី១២ ក',
      subjectId: body.subjectId || 'sbj-01',
      subjectName: subjects.find(s => s.id === body.subjectId)?.nameKhmer || 'ភាសាខ្មែរ',
      teacherId: body.teacherId || 'tch-001',
      teacherName: teachers.find(t => t.id === body.teacherId)?.nameKhmer || 'អ្នកគ្រូ ចាន់ សុខា',
      room: body.room || 'A101',
      color: body.color || 'bg-cyan-50 border-cyan-300 text-cyan-800'
    };
    schedules.push(newSchedule);
    res.status(201).json(newSchedule);
  });

  app.delete('/api/schedule/:id', (req: Request, res: Response) => {
    const index = schedules.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញកាលវិភាគ' });
    const removed = schedules.splice(index, 1)[0];
    res.json({ success: true, message: 'បានលុបម៉ោងសិក្សា', removed });
  });

  // Exams
  app.get('/api/exams', (req: Request, res: Response) => {
    res.json(exams);
  });

  app.post('/api/exams', (req: Request, res: Response) => {
    const body = req.body;
    const newExam: ExamModel = {
      id: 'exm-' + Date.now(),
      titleKhmer: body.titleKhmer || 'ការប្រឡងថ្មី',
      titleEnglish: body.titleEnglish || 'New Exam',
      examType: body.examType || 'MIDTERM',
      subjectId: body.subjectId || 'sbj-01',
      subjectName: subjects.find(s => s.id === body.subjectId)?.nameKhmer || 'ភាសាខ្មែរ',
      classId: body.classId || 'cls-12a',
      className: classes.find(c => c.id === body.classId)?.name || 'ថ្នាក់ទី១២ ក',
      date: body.date || '2026-10-01',
      startTime: body.startTime || '08:00',
      endTime: body.endTime || '10:00',
      durationMinutes: Number(body.durationMinutes) || 120,
      room: body.room || 'បន្ទប់ A101',
      totalMarks: Number(body.totalMarks) || 100,
      passMarks: Number(body.passMarks) || 50,
      status: 'SCHEDULED'
    };
    exams.unshift(newExam);
    res.status(201).json(newExam);
  });

  app.put('/api/exams/:id', (req: Request, res: Response) => {
    const index = exams.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញការប្រឡង' });
    exams[index] = { ...exams[index], ...req.body };
    res.json(exams[index]);
  });

  app.delete('/api/exams/:id', (req: Request, res: Response) => {
    const index = exams.findIndex(e => e.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញការប្រឡង' });
    const removed = exams.splice(index, 1)[0];
    res.json({ success: true, message: 'បានលុបការប្រឡង', removed });
  });

  // Google Drive Config & Integration
  app.get('/api/drive/config', (req: Request, res: Response) => {
    let clientId = '';
    try {
      const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
      if (fs.existsSync(configPath)) {
        const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (parsed.oAuthClientId) {
          clientId = parsed.oAuthClientId;
        }
      }
    } catch (e) {
      console.warn('Could not read firebase-applet-config.json:', e);
    }

    if (!clientId && process.env.GOOGLE_OAUTH_CLIENT_ID) {
      clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    }
    if (!clientId) {
      clientId = '470039681099-npvjd9nguvogu7qrokofro5ujp5b920m.apps.googleusercontent.com';
    }

    res.json({
      clientId,
      projectId: 'gen-lang-client-0742622527',
      projectNumber: '470039681099',
      scope: 'https://www.googleapis.com/auth/drive.file'
    });
  });

  // Documents
  app.get('/api/documents', (req: Request, res: Response) => {
    res.json(documents);
  });

  app.post('/api/documents', (req: Request, res: Response) => {
    const body = req.body;
    const newDoc: DocumentModel = {
      id: body.id || 'doc-' + Date.now(),
      title: body.title || 'ឯកសារអប់រំថ្មី',
      category: body.category || 'CURRICULUM',
      fileType: body.fileType || 'PDF',
      fileSize: body.fileSize || '1.5 MB',
      uploadedBy: body.uploadedBy || 'អ្នកគ្រប់គ្រងសាលា',
      uploadedAt: new Date().toISOString().split('T')[0],
      downloadCount: 0,
      isStoredInDrive: Boolean(body.isStoredInDrive),
      driveFileId: body.driveFileId,
      driveWebViewLink: body.driveWebViewLink,
      driveDownloadUrl: body.driveDownloadUrl,
      driveIconLink: body.driveIconLink,
      driveFolderId: body.driveFolderId,
      driveFolderName: body.driveFolderName || 'KrouDigital 4.0 - បណ្ណាល័យសាលា'
    };
    documents.unshift(newDoc);
    res.status(201).json(newDoc);
  });

  app.delete('/api/documents/:id', (req: Request, res: Response) => {
    const index = documents.findIndex(d => d.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'រកមិនឃើញឯកសារ' });
    const removed = documents.splice(index, 1)[0];
    res.json({ success: true, message: 'បានលុបឯកសារជោគជ័យ', removed });
  });

  // Notifications
  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json(notifications);
  });

  app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
    const notif = notifications.find(n => n.id === req.params.id);
    if (notif) notif.read = true;
    res.json({ success: true, notif });
  });

  app.post('/api/notifications', (req: Request, res: Response) => {
    const body = req.body;
    const newNotif: NotificationModel = {
      id: 'notif-' + Date.now(),
      title: body.title || 'សេចក្តីជូនដំណឹងថ្មី',
      message: body.message || '',
      type: body.type || 'ANNOUNCEMENT',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      priority: body.priority || 'NORMAL'
    };
    notifications.unshift(newNotif);
    res.status(201).json(newNotif);
  });

  // Reset demo data endpoint
  app.post('/api/reset-data', (req: Request, res: Response) => {
    classes = [...INITIAL_CLASSES];
    teachers = [...INITIAL_TEACHERS];
    subjects = [...INITIAL_SUBJECTS];
    students = [...INITIAL_STUDENTS];
    attendances = [...INITIAL_ATTENDANCE];
    grades = [...INITIAL_GRADES];
    schedules = [...INITIAL_SCHEDULE];
    exams = [...INITIAL_EXAMS];
    documents = [...INITIAL_DOCUMENTS];
    notifications = [...INITIAL_NOTIFICATIONS];
    activities = [...INITIAL_ACTIVITIES];
    res.json({ success: true, message: 'បានស្តារទិន្នន័យគំរូដើមឡើងវិញជោគជ័យ' });
  });

  // Vite Middleware / SPA Fallback
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 KrouDigital4.0 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
