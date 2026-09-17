import { Student, Teacher, ClassModel, SubjectModel, AttendanceRecord, GradeRecord, ScheduleItem, ExamModel, DocumentModel, NotificationModel, ActivityItem, User } from '../types';

export const api = {
  // Auth
  async login(username?: string, role?: string): Promise<{ success: boolean; token: string; user: User; message: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role })
      });
      return await res.json();
    } catch {
      return {
        success: true,
        token: 'local-demo-token',
        user: {
          id: 'usr-001',
          username: 'superadmin',
          email: 'admin@kroudigital.edu.kh',
          nameKhmer: 'ឯកឧត្តម បណ្ឌិត ជា សុវណ្ណ',
          nameEnglish: 'Dr. Chea Sovann',
          role: 'SUPER_ADMIN'
        },
        message: 'ចូលប្រើប្រព័ន្ធដោយជោគជ័យ'
      };
    }
  },

  // Stats
  async getDashboardStats() {
    try {
      const res = await fetch('/api/dashboard/stats');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  // Students
  async getStudents(filters?: { search?: string; classId?: string; status?: string }): Promise<Student[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.classId) params.append('classId', filters.classId);
      if (filters?.status) params.append('status', filters.status);
      const res = await fetch(`/api/students?${params.toString()}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async createStudent(data: Partial<Student>): Promise<Student> {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateStudent(id: string, data: Partial<Student>): Promise<Student> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteStudent(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/students/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Teachers
  async getTeachers(): Promise<Teacher[]> {
    try {
      const res = await fetch('/api/teachers');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async createTeacher(data: Partial<Teacher>): Promise<Teacher> {
    const res = await fetch('/api/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher> {
    const res = await fetch(`/api/teachers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteTeacher(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/teachers/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Classes
  async getClasses(): Promise<ClassModel[]> {
    try {
      const res = await fetch('/api/classes');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async createClass(data: Partial<ClassModel>): Promise<ClassModel> {
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateClass(id: string, data: Partial<ClassModel>): Promise<ClassModel> {
    const res = await fetch(`/api/classes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteClass(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/classes/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Subjects
  async getSubjects(): Promise<SubjectModel[]> {
    try {
      const res = await fetch('/api/subjects');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async createSubject(data: Partial<SubjectModel>): Promise<SubjectModel> {
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateSubject(id: string, data: Partial<SubjectModel>): Promise<SubjectModel> {
    const res = await fetch(`/api/subjects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteSubject(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/subjects/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Attendance
  async getAttendance(classId?: string, date?: string): Promise<AttendanceRecord[]> {
    try {
      const params = new URLSearchParams();
      if (classId) params.append('classId', classId);
      if (date) params.append('date', date);
      const res = await fetch(`/api/attendance?${params.toString()}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async saveAttendance(records: AttendanceRecord[]): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records })
    });
    return await res.json();
  },

  // Grades
  async getGrades(classId?: string, subjectId?: string): Promise<GradeRecord[]> {
    try {
      const params = new URLSearchParams();
      if (classId) params.append('classId', classId);
      if (subjectId) params.append('subjectId', subjectId);
      const res = await fetch(`/api/grades?${params.toString()}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async saveGrades(gradesList: GradeRecord[]): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gradesList })
    });
    return await res.json();
  },

  // Schedule
  async getSchedule(classId?: string): Promise<ScheduleItem[]> {
    try {
      const params = new URLSearchParams();
      if (classId) params.append('classId', classId);
      const res = await fetch(`/api/schedule?${params.toString()}`);
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async createScheduleItem(data: Partial<ScheduleItem>): Promise<ScheduleItem> {
    const res = await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteScheduleItem(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/schedule/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Exams
  async getExams(): Promise<ExamModel[]> {
    try {
      const res = await fetch('/api/exams');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async createExam(data: Partial<ExamModel>): Promise<ExamModel> {
    const res = await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async updateExam(id: string, data: Partial<ExamModel>): Promise<ExamModel> {
    const res = await fetch(`/api/exams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  async deleteExam(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/exams/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  },

  // Documents
  async getDocuments(): Promise<DocumentModel[]> {
    try {
      const res = await fetch('/api/documents');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async uploadDocument(data: Partial<DocumentModel>): Promise<DocumentModel> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Notifications
  async getNotifications(): Promise<NotificationModel[]> {
    try {
      const res = await fetch('/api/notifications');
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  async markNotificationRead(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH'
    });
    return await res.json();
  },

  async createNotification(data: Partial<NotificationModel>): Promise<NotificationModel> {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Reset Demo Data
  async resetDemoData(): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/reset-data', {
      method: 'POST'
    });
    return await res.json();
  }
};
