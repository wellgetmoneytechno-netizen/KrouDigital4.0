import { 
  Student, 
  Teacher, 
  ClassModel, 
  SubjectModel, 
  AttendanceRecord, 
  GradeRecord, 
  ScheduleItem, 
  ExamModel, 
  DocumentModel, 
  NotificationModel, 
  ActivityItem, 
  User 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_STUDENTS, 
  INITIAL_TEACHERS, 
  INITIAL_CLASSES, 
  INITIAL_SUBJECTS, 
  INITIAL_ATTENDANCE, 
  INITIAL_GRADES, 
  INITIAL_SCHEDULE, 
  INITIAL_EXAMS, 
  INITIAL_DOCUMENTS, 
  INITIAL_NOTIFICATIONS 
} from './data/initialData';
import { normalizeStudentData } from './studentUtils';

const isStaticMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname.endsWith('github.io') ||
    window.location.protocol === 'file:'
  );
};

// Safe local storage helpers for GitHub Pages / static hosting
function getLocalStore<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem('krou_store_' + key);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return defaultData;
}

function setLocalStore<T>(key: string, data: T): void {
  try {
    localStorage.setItem('krou_store_' + key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// Resilient fetch helper that falls back seamlessly on static deployments or offline
async function requestSafeJson<T>(
  url: string,
  options: RequestInit | undefined,
  fallback: () => T | Promise<T>
): Promise<T> {
  if (isStaticMode()) {
    return fallback();
  }

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      return fallback();
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return fallback();
    }
    return await res.json();
  } catch {
    return fallback();
  }
}

export const api = {
  // Auth
  async login(username?: string, role?: string): Promise<{ success: boolean; token: string; user: User; message: string }> {
    return requestSafeJson(
      '/api/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role })
      },
      () => {
        let matchedUser = INITIAL_USERS[0];
        if (role) {
          const byRole = INITIAL_USERS.find(u => u.role === role);
          if (byRole) matchedUser = byRole;
        } else if (username) {
          const byName = INITIAL_USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
          if (byName) matchedUser = byName;
        }
        return {
          success: true,
          token: 'krou-local-token-' + Date.now(),
          user: matchedUser,
          message: 'ចូលប្រើប្រព័ន្ធដោយជោគជ័យ'
        };
      }
    );
  },

  // Stats
  async getDashboardStats() {
    return requestSafeJson(
      '/api/dashboard/stats',
      undefined,
      () => {
        const students = getLocalStore<Student[]>('students', INITIAL_STUDENTS);
        const teachers = getLocalStore<Teacher[]>('teachers', INITIAL_TEACHERS);
        const classes = getLocalStore<ClassModel[]>('classes', INITIAL_CLASSES);
        return {
          totalStudents: students.length,
          totalTeachers: teachers.length,
          totalClasses: classes.length,
          attendanceRate: '96.4%',
          monthlyRevenue: '$14,250',
          growthRate: '+12.5%'
        };
      }
    );
  },

  // Students
  async getStudents(filters?: { search?: string; classId?: string; status?: string }): Promise<Student[]> {
    return requestSafeJson(
      `/api/students?${new URLSearchParams(filters as any).toString()}`,
      undefined,
      () => {
        let list = getLocalStore<Student[]>('students', INITIAL_STUDENTS);
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(s => 
            s.khmer_name?.toLowerCase().includes(q) ||
            s.english_name?.toLowerCase().includes(q) ||
            s.nameKhmer?.toLowerCase().includes(q) ||
            s.nameEnglish?.toLowerCase().includes(q) ||
            s.rlc?.toLowerCase().includes(q) ||
            s.studentCode?.toLowerCase().includes(q)
          );
        }
        if (filters?.classId) {
          list = list.filter(s => s.classId === filters.classId);
        }
        if (filters?.status) {
          list = list.filter(s => s.status === filters.status);
        }
        return list;
      }
    );
  },

  async createStudent(data: Partial<Student>): Promise<Student> {
    return requestSafeJson(
      '/api/students',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<Student[]>('students', INITIAL_STUDENTS);
        const newStudent = normalizeStudentData(data, current.length + 1);
        const updated = [newStudent, ...current];
        setLocalStore('students', updated);
        return newStudent;
      }
    );
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    return requestSafeJson(
      `/api/students/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<Student[]>('students', INITIAL_STUDENTS);
        const idx = current.findIndex(s => s.id === id);
        if (idx !== -1) {
          const updatedStudent = normalizeStudentData({ ...current[idx], ...data }, idx + 1);
          current[idx] = updatedStudent;
          setLocalStore('students', [...current]);
          return updatedStudent;
        }
        return normalizeStudentData(data, 1);
      }
    );
  },

  async deleteStudent(id: string): Promise<{ success: boolean }> {
    return requestSafeJson(
      `/api/students/${id}`,
      { method: 'DELETE' },
      () => {
        const current = getLocalStore<Student[]>('students', INITIAL_STUDENTS);
        const filtered = current.filter(s => s.id !== id);
        setLocalStore('students', filtered);
        return { success: true };
      }
    );
  },

  async importStudents(students: Partial<Student>[]): Promise<{ success: boolean; count: number; students: Student[] }> {
    if (!students || students.length === 0) {
      return { success: true, count: 0, students: [] };
    }

    return requestSafeJson(
      '/api/students/import',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students })
      },
      () => {
        const current = getLocalStore<Student[]>('students', INITIAL_STUDENTS);
        const normalized = students.map((s, idx) => normalizeStudentData(s, current.length + idx + 1));
        const combined = [...normalized, ...current];
        setLocalStore('students', combined);
        return {
          success: true,
          count: normalized.length,
          students: normalized
        };
      }
    );
  },

  async clearAllStudents(): Promise<{ success: boolean; count: number }> {
    return requestSafeJson(
      '/api/students',
      { method: 'DELETE' },
      () => {
        const current = getLocalStore<Student[]>('students', INITIAL_STUDENTS);
        setLocalStore('students', []);
        return { success: true, count: current.length };
      }
    );
  },

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    return requestSafeJson(
      '/api/teachers',
      undefined,
      () => getLocalStore<Teacher[]>('teachers', INITIAL_TEACHERS)
    );
  },

  async createTeacher(data: Partial<Teacher>): Promise<Teacher> {
    return requestSafeJson(
      '/api/teachers',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<Teacher[]>('teachers', INITIAL_TEACHERS);
        const newTeacher: Teacher = {
          id: 'tch-' + Date.now(),
          teacherCode: data.teacherCode || `TCH-${String(current.length + 1).padStart(3, '0')}`,
          nameKhmer: data.nameKhmer || 'គ្រូថ្មី',
          nameEnglish: data.nameEnglish || 'New Teacher',
          gender: data.gender || 'MALE',
          department: data.department || 'គណិតវិទ្យា',
          subjects: data.subjects || ['គណិតវិទ្យា'],
          degree: data.degree || 'បរិញ្ញាបត្រ',
          phone: data.phone || '012 345 678',
          email: data.email || 'teacher@kroudigital.edu.kh',
          status: data.status || 'ACTIVE',
          joinedDate: data.joinedDate || new Date().toISOString().split('T')[0],
          assignedClassNames: data.assignedClassNames || ['ថ្នាក់ទី១២ ក']
        };
        setLocalStore('teachers', [newTeacher, ...current]);
        return newTeacher;
      }
    );
  },

  async updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher> {
    return requestSafeJson(
      `/api/teachers/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<Teacher[]>('teachers', INITIAL_TEACHERS);
        const idx = current.findIndex(t => t.id === id);
        if (idx !== -1) {
          current[idx] = { ...current[idx], ...data };
          setLocalStore('teachers', [...current]);
          return current[idx];
        }
        return data as Teacher;
      }
    );
  },

  async deleteTeacher(id: string): Promise<{ success: boolean }> {
    return requestSafeJson(
      `/api/teachers/${id}`,
      { method: 'DELETE' },
      () => {
        const current = getLocalStore<Teacher[]>('teachers', INITIAL_TEACHERS);
        setLocalStore('teachers', current.filter(t => t.id !== id));
        return { success: true };
      }
    );
  },

  // Classes
  async getClasses(): Promise<ClassModel[]> {
    return requestSafeJson(
      '/api/classes',
      undefined,
      () => getLocalStore<ClassModel[]>('classes', INITIAL_CLASSES)
    );
  },

  async createClass(data: Partial<ClassModel>): Promise<ClassModel> {
    return requestSafeJson(
      '/api/classes',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<ClassModel[]>('classes', INITIAL_CLASSES);
        const newClass: ClassModel = {
          id: 'cls-' + Date.now(),
          name: data.name || 'ថ្នាក់ថ្មី',
          grade: data.grade || 12,
          room: data.room || 'បន្ទប់ B-101',
          academicYear: data.academicYear || '2025-2026',
          teacherId: data.teacherId || 'tch-001',
          teacherName: data.teacherName || 'អ្នកគ្រូ ចាន់ សុខា',
          studentCount: 0,
          capacity: data.capacity || 40,
          shift: data.shift || 'MORNING'
        };
        setLocalStore('classes', [newClass, ...current]);
        return newClass;
      }
    );
  },

  async updateClass(id: string, data: Partial<ClassModel>): Promise<ClassModel> {
    return requestSafeJson(
      `/api/classes/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<ClassModel[]>('classes', INITIAL_CLASSES);
        const idx = current.findIndex(c => c.id === id);
        if (idx !== -1) {
          current[idx] = { ...current[idx], ...data };
          setLocalStore('classes', [...current]);
          return current[idx];
        }
        return data as ClassModel;
      }
    );
  },

  async deleteClass(id: string): Promise<{ success: boolean }> {
    return requestSafeJson(
      `/api/classes/${id}`,
      { method: 'DELETE' },
      () => {
        const current = getLocalStore<ClassModel[]>('classes', INITIAL_CLASSES);
        setLocalStore('classes', current.filter(c => c.id !== id));
        return { success: true };
      }
    );
  },

  // Subjects
  async getSubjects(): Promise<SubjectModel[]> {
    return requestSafeJson(
      '/api/subjects',
      undefined,
      () => getLocalStore<SubjectModel[]>('subjects', INITIAL_SUBJECTS)
    );
  },

  async createSubject(data: Partial<SubjectModel>): Promise<SubjectModel> {
    return requestSafeJson(
      '/api/subjects',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<SubjectModel[]>('subjects', INITIAL_SUBJECTS);
        const newSubject: SubjectModel = {
          id: 'sbj-' + Date.now(),
          code: data.code || 'SUB-01',
          nameKhmer: data.nameKhmer || 'មុខវិជ្ជាថ្មី',
          nameEnglish: data.nameEnglish || 'New Subject',
          credits: data.credits || 2,
          hoursPerWeek: data.hoursPerWeek || 4,
          department: data.department || 'វិទ្យាសាស្ត្រ',
          applicableGrades: data.applicableGrades || [10, 11, 12]
        };
        setLocalStore('subjects', [newSubject, ...current]);
        return newSubject;
      }
    );
  },

  async updateSubject(id: string, data: Partial<SubjectModel>): Promise<SubjectModel> {
    return requestSafeJson(
      `/api/subjects/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<SubjectModel[]>('subjects', INITIAL_SUBJECTS);
        const idx = current.findIndex(s => s.id === id);
        if (idx !== -1) {
          current[idx] = { ...current[idx], ...data };
          setLocalStore('subjects', [...current]);
          return current[idx];
        }
        return data as SubjectModel;
      }
    );
  },

  async deleteSubject(id: string): Promise<{ success: boolean }> {
    return requestSafeJson(
      `/api/subjects/${id}`,
      { method: 'DELETE' },
      () => {
        const current = getLocalStore<SubjectModel[]>('subjects', INITIAL_SUBJECTS);
        setLocalStore('subjects', current.filter(s => s.id !== id));
        return { success: true };
      }
    );
  },

  // Attendance
  async getAttendance(classId?: string, date?: string): Promise<AttendanceRecord[]> {
    return requestSafeJson(
      `/api/attendance?${new URLSearchParams({ classId: classId || '', date: date || '' }).toString()}`,
      undefined,
      () => {
        let list = getLocalStore<AttendanceRecord[]>('attendance', INITIAL_ATTENDANCE);
        if (classId) list = list.filter(a => a.classId === classId);
        if (date) list = list.filter(a => a.date === date);
        return list;
      }
    );
  },

  async saveAttendance(records: AttendanceRecord[]): Promise<{ success: boolean; message: string }> {
    return requestSafeJson(
      '/api/attendance',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records })
      },
      () => {
        const current = getLocalStore<AttendanceRecord[]>('attendance', INITIAL_ATTENDANCE);
        const updated = [...records, ...current.filter(c => !records.some(r => r.id === c.id))];
        setLocalStore('attendance', updated);
        return { success: true, message: 'បានកត់ត្រាវត្តមានជោគជ័យ' };
      }
    );
  },

  // Grades
  async getGrades(classId?: string, subjectId?: string): Promise<GradeRecord[]> {
    return requestSafeJson(
      `/api/grades?${new URLSearchParams({ classId: classId || '', subjectId: subjectId || '' }).toString()}`,
      undefined,
      () => {
        let list = getLocalStore<GradeRecord[]>('grades', INITIAL_GRADES);
        if (classId) list = list.filter(g => g.classId === classId);
        if (subjectId) list = list.filter(g => g.subjectId === subjectId);
        return list;
      }
    );
  },

  async saveGrades(gradesList: GradeRecord[]): Promise<{ success: boolean; message: string }> {
    return requestSafeJson(
      '/api/grades',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gradesList })
      },
      () => {
        const current = getLocalStore<GradeRecord[]>('grades', INITIAL_GRADES);
        const updated = [...gradesList, ...current.filter(c => !gradesList.some(g => g.id === c.id))];
        setLocalStore('grades', updated);
        return { success: true, message: 'បានបញ្ចូលពិន្ទុជោគជ័យ' };
      }
    );
  },

  // Schedule
  async getSchedule(classId?: string): Promise<ScheduleItem[]> {
    return requestSafeJson(
      `/api/schedule?${new URLSearchParams({ classId: classId || '' }).toString()}`,
      undefined,
      () => {
        let list = getLocalStore<ScheduleItem[]>('schedules', INITIAL_SCHEDULE);
        if (classId) list = list.filter(s => s.classId === classId);
        return list;
      }
    );
  },

  async createScheduleItem(data: Partial<ScheduleItem>): Promise<ScheduleItem> {
    return requestSafeJson(
      '/api/schedule',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<ScheduleItem[]>('schedules', INITIAL_SCHEDULE);
        const newItem: ScheduleItem = {
          id: 'sch-' + Date.now(),
          classId: data.classId || 'cls-12a',
          className: data.className || 'ថ្នាក់ទី១២ ក',
          dayOfWeek: data.dayOfWeek || 1,
          period: data.period || 1,
          startTime: data.startTime || '07:00',
          endTime: data.endTime || '07:50',
          subjectId: data.subjectId || 'sbj-01',
          subjectName: data.subjectName || 'គណិតវិទ្យា',
          teacherId: data.teacherId || 'tch-001',
          teacherName: data.teacherName || 'អ្នកគ្រូ ចាន់ សុខា',
          room: data.room || 'B-101',
          color: data.color || 'bg-cyan-50 border-cyan-200 text-cyan-800'
        };
        setLocalStore('schedules', [newItem, ...current]);
        return newItem;
      }
    );
  },

  async deleteScheduleItem(id: string): Promise<{ success: boolean }> {
    return requestSafeJson(
      `/api/schedule/${id}`,
      { method: 'DELETE' },
      () => {
        const current = getLocalStore<ScheduleItem[]>('schedules', INITIAL_SCHEDULE);
        setLocalStore('schedules', current.filter(s => s.id !== id));
        return { success: true };
      }
    );
  },

  // Exams
  async getExams(): Promise<ExamModel[]> {
    return requestSafeJson(
      '/api/exams',
      undefined,
      () => getLocalStore<ExamModel[]>('exams', INITIAL_EXAMS)
    );
  },

  async createExam(data: Partial<ExamModel>): Promise<ExamModel> {
    return requestSafeJson(
      '/api/exams',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<ExamModel[]>('exams', INITIAL_EXAMS);
        const newExam: ExamModel = {
          id: 'exm-' + Date.now(),
          titleKhmer: data.titleKhmer || 'ការប្រឡងថ្មី',
          titleEnglish: data.titleEnglish || 'New Exam',
          examType: data.examType || 'MIDTERM',
          subjectId: data.subjectId || 'sbj-01',
          subjectName: data.subjectName || 'គណិតវិទ្យា',
          classId: data.classId || 'cls-12a',
          className: data.className || 'ថ្នាក់ទី១២ ក',
          date: data.date || '2025-10-15',
          startTime: data.startTime || '08:00',
          endTime: data.endTime || '09:30',
          durationMinutes: data.durationMinutes || 90,
          totalMarks: data.totalMarks || 100,
          passMarks: data.passMarks || 50,
          room: data.room || 'A-101',
          status: data.status || 'SCHEDULED'
        };
        setLocalStore('exams', [newExam, ...current]);
        return newExam;
      }
    );
  },

  async updateExam(id: string, data: Partial<ExamModel>): Promise<ExamModel> {
    return requestSafeJson(
      `/api/exams/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<ExamModel[]>('exams', INITIAL_EXAMS);
        const idx = current.findIndex(e => e.id === id);
        if (idx !== -1) {
          current[idx] = { ...current[idx], ...data };
          setLocalStore('exams', [...current]);
          return current[idx];
        }
        return data as ExamModel;
      }
    );
  },

  async deleteExam(id: string): Promise<{ success: boolean }> {
    return requestSafeJson(
      `/api/exams/${id}`,
      { method: 'DELETE' },
      () => {
        const current = getLocalStore<ExamModel[]>('exams', INITIAL_EXAMS);
        setLocalStore('exams', current.filter(e => e.id !== id));
        return { success: true };
      }
    );
  },

  // Documents
  async getDocuments(): Promise<DocumentModel[]> {
    return requestSafeJson(
      '/api/documents',
      undefined,
      () => getLocalStore<DocumentModel[]>('documents', INITIAL_DOCUMENTS)
    );
  },

  async uploadDocument(data: Partial<DocumentModel>): Promise<DocumentModel> {
    return requestSafeJson(
      '/api/documents',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<DocumentModel[]>('documents', INITIAL_DOCUMENTS);
        const newDoc: DocumentModel = {
          id: 'doc-' + Date.now(),
          title: data.title || 'ឯកសារថ្មី',
          category: data.category || 'CURRICULUM',
          fileType: data.fileType || 'PDF',
          fileSize: data.fileSize || '1.5 MB',
          uploadedBy: data.uploadedBy || 'អ្នកគ្រប់គ្រង',
          uploadedAt: data.uploadedAt || new Date().toISOString().split('T')[0],
          downloadCount: 0,
          isStoredInDrive: data.isStoredInDrive,
          driveFileId: data.driveFileId,
          driveWebViewLink: data.driveWebViewLink,
          driveFolderName: data.driveFolderName
        };
        setLocalStore('documents', [newDoc, ...current]);
        return newDoc;
      }
    );
  },

  async deleteDocument(id: string): Promise<{ success: boolean }> {
    return requestSafeJson(
      `/api/documents/${id}`,
      { method: 'DELETE' },
      () => {
        const current = getLocalStore<DocumentModel[]>('documents', INITIAL_DOCUMENTS);
        setLocalStore('documents', current.filter(d => d.id !== id));
        return { success: true };
      }
    );
  },

  async getDriveConfig(): Promise<{ clientId: string; projectId: string; projectNumber: string; scope: string }> {
    return requestSafeJson(
      '/api/drive/config',
      undefined,
      () => ({
        clientId: '',
        projectId: 'gen-lang-client-0742622527',
        projectNumber: '470039681099',
        scope: 'https://www.googleapis.com/auth/drive.file'
      })
    );
  },

  // Notifications
  async getNotifications(): Promise<NotificationModel[]> {
    return requestSafeJson(
      '/api/notifications',
      undefined,
      () => getLocalStore<NotificationModel[]>('notifications', INITIAL_NOTIFICATIONS)
    );
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    return requestSafeJson(
      `/api/notifications/${id}/read`,
      { method: 'PATCH' },
      () => {
        const current = getLocalStore<NotificationModel[]>('notifications', INITIAL_NOTIFICATIONS);
        const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
        setLocalStore('notifications', updated);
        return { success: true };
      }
    );
  },

  async createNotification(data: Partial<NotificationModel>): Promise<NotificationModel> {
    return requestSafeJson(
      '/api/notifications',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      },
      () => {
        const current = getLocalStore<NotificationModel[]>('notifications', INITIAL_NOTIFICATIONS);
        const newNotif: NotificationModel = {
          id: 'notif-' + Date.now(),
          title: data.title || 'សេចក្តីជូនដំណឹង',
          message: data.message || '',
          type: data.type || 'SYSTEM',
          createdAt: new Date().toISOString(),
          read: false,
          priority: data.priority || 'NORMAL'
        };
        setLocalStore('notifications', [newNotif, ...current]);
        return newNotif;
      }
    );
  },

  // Reset Demo Data
  async resetDemoData(): Promise<{ success: boolean; message: string }> {
    return requestSafeJson(
      '/api/reset-data',
      { method: 'POST' },
      () => {
        setLocalStore('students', INITIAL_STUDENTS);
        setLocalStore('teachers', INITIAL_TEACHERS);
        setLocalStore('classes', INITIAL_CLASSES);
        setLocalStore('subjects', INITIAL_SUBJECTS);
        setLocalStore('attendance', INITIAL_ATTENDANCE);
        setLocalStore('grades', INITIAL_GRADES);
        setLocalStore('schedules', INITIAL_SCHEDULE);
        setLocalStore('exams', INITIAL_EXAMS);
        setLocalStore('documents', INITIAL_DOCUMENTS);
        setLocalStore('notifications', INITIAL_NOTIFICATIONS);
        return { success: true, message: 'បានកំណត់ទិន្នន័យគំរូឡើងវិញជោគជ័យ' };
      }
    );
  }
};
