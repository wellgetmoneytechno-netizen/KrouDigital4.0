import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, Student, Teacher, ClassModel, SubjectModel, AttendanceRecord, GradeRecord, ScheduleItem, ExamModel, DocumentModel, NotificationModel, ActivityItem, GoogleDriveFile, GoogleDriveUser } from '../types';
import { api } from '../lib/api';
import { normalizeStudentData } from '../lib/studentUtils';
import * as XLSX from 'xlsx';
import {
  getStoredDriveToken,
  setStoredDriveToken,
  fetchGoogleDriveAbout,
  getOrCreateDriveFolder,
  listGoogleDriveFiles,
  uploadFileToGoogleDrive,
  deleteFileFromGoogleDrive,
  initGoogleDriveAuth,
  requestGoogleDriveToken,
  disconnectGoogleDrive as svcDisconnectDrive,
  formatBytes,
  KROU_FOLDER_NAME
} from '../lib/googleDriveService';
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
} from '../lib/data/initialData';

export type AppRoute =
  | 'landing'
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'classes'
  | 'subjects'
  | 'attendance'
  | 'grades'
  | 'schedule'
  | 'exams'
  | 'documents'
  | 'reports'
  | 'notifications'
  | 'settings';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  role: Role;
  language: 'km' | 'en';
  currentRoute: AppRoute;
  sidebarCollapsed: boolean;
  toasts: Toast[];
  students: Student[];
  teachers: Teacher[];
  classes: ClassModel[];
  subjects: SubjectModel[];
  attendances: AttendanceRecord[];
  grades: GradeRecord[];
  schedules: ScheduleItem[];
  exams: ExamModel[];
  documents: DocumentModel[];
  notifications: NotificationModel[];
  activities: ActivityItem[];
  isLoading: boolean;
  
  // Actions
  login: (username?: string, role?: Role) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: Role) => void;
  setLanguage: (lang: 'km' | 'en') => void;
  navigate: (route: AppRoute) => void;
  toggleSidebar: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  
  // CRUD operations
  addStudent: (student: Partial<Student>) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  importStudents: (students: Partial<Student>[]) => Promise<number>;
  clearAllStudents: () => Promise<void>;
  
  addTeacher: (teacher: Partial<Teacher>) => Promise<void>;
  updateTeacher: (id: string, data: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;

  addClass: (cls: Partial<ClassModel>) => Promise<void>;
  updateClass: (id: string, data: Partial<ClassModel>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;

  addSubject: (subj: Partial<SubjectModel>) => Promise<void>;
  updateSubject: (id: string, data: Partial<SubjectModel>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  saveAttendanceRecords: (records: AttendanceRecord[]) => Promise<void>;
  saveGradeRecords: (grades: GradeRecord[]) => Promise<void>;

  addScheduleItem: (item: Partial<ScheduleItem>) => Promise<void>;
  deleteScheduleItem: (id: string) => Promise<void>;

  addExam: (exam: Partial<ExamModel>) => Promise<void>;
  updateExam: (id: string, data: Partial<ExamModel>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;

  addDocument: (doc: Partial<DocumentModel>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  broadcastAnnouncement: (title: string, message: string) => Promise<void>;
  resetAllData: () => Promise<void>;

  // Google Drive Integration
  isDriveConnected: boolean;
  driveUser: GoogleDriveUser | null;
  driveFiles: GoogleDriveFile[];
  isSyncingDrive: boolean;
  driveFolderId: string | null;
  connectGoogleDrive: () => Promise<boolean>;
  disconnectGoogleDriveState: () => void;
  syncGoogleDrive: () => Promise<void>;
  uploadFileToDriveAndLibrary: (file: File | Blob, docData: Partial<DocumentModel>) => Promise<DocumentModel>;
  backupStudentsToDrive: () => Promise<DocumentModel | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start on landing page by default to showcase the reference visual hero & sign-in experience!
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('landing');
  const [language, setLanguage] = useState<'km' | 'en'>('km');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Core Data
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [classes, setClasses] = useState<ClassModel[]>(INITIAL_CLASSES);
  const [subjects, setSubjects] = useState<SubjectModel[]>(INITIAL_SUBJECTS);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [grades, setGrades] = useState<GradeRecord[]>(INITIAL_GRADES);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
  const [exams, setExams] = useState<ExamModel[]>(INITIAL_EXAMS);
  const [documents, setDocuments] = useState<DocumentModel[]>(INITIAL_DOCUMENTS);
  const [notifications, setNotifications] = useState<NotificationModel[]>(INITIAL_NOTIFICATIONS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);

  // Google Drive State
  const [isDriveConnected, setIsDriveConnected] = useState<boolean>(() => Boolean(getStoredDriveToken()));
  const [driveUser, setDriveUser] = useState<GoogleDriveUser | null>(() => {
    try {
      const saved = localStorage.getItem('krou_drive_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [driveFiles, setDriveFiles] = useState<GoogleDriveFile[]>([]);
  const [isSyncingDrive, setIsSyncingDrive] = useState<boolean>(false);
  const [driveFolderId, setDriveFolderId] = useState<string | null>(() => localStorage.getItem('krou_drive_folder_id'));

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 't-' + Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch initial data from server if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stdRes, tchRes, clsRes, sbjRes, schRes, exmRes, docRes, notifRes] = await Promise.allSettled([
          api.getStudents(),
          api.getTeachers(),
          api.getClasses(),
          api.getSubjects(),
          api.getSchedule(),
          api.getExams(),
          api.getDocuments(),
          api.getNotifications()
        ]);

        if (stdRes.status === 'fulfilled' && stdRes.value.length) setStudents(stdRes.value);
        if (tchRes.status === 'fulfilled' && tchRes.value.length) setTeachers(tchRes.value);
        if (clsRes.status === 'fulfilled' && clsRes.value.length) setClasses(clsRes.value);
        if (sbjRes.status === 'fulfilled' && sbjRes.value.length) setSubjects(sbjRes.value);
        if (schRes.status === 'fulfilled' && schRes.value.length) setSchedules(schRes.value);
        if (exmRes.status === 'fulfilled' && exmRes.value.length) setExams(exmRes.value);
        if (docRes.status === 'fulfilled' && docRes.value.length) setDocuments(docRes.value);
        if (notifRes.status === 'fulfilled' && notifRes.value.length) setNotifications(notifRes.value);
      } catch (err) {
        console.warn('Using local fallback dataset:', err);
      }
    };
    fetchData();
  }, []);

  const login = async (username?: string, role?: Role): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await api.login(username, role);
      if (res.success) {
        let userToSet = res.user;
        if (role) {
          const matchUser = INITIAL_USERS.find(u => u.role === role);
          if (matchUser) userToSet = matchUser;
        }
        setCurrentUser(userToSet);
        setCurrentRoute('dashboard');
        showToast(language === 'km' ? `សូមស្វាគមន៍ ${userToSet.nameKhmer}` : `Welcome ${userToSet.nameEnglish || userToSet.nameKhmer}`, 'success');
        setIsLoading(false);
        return true;
      }
    } catch {
      // fallback login
      const fallbackUser = INITIAL_USERS.find(u => u.role === (role || 'SUPER_ADMIN')) || INITIAL_USERS[0];
      setCurrentUser(fallbackUser);
      setCurrentRoute('dashboard');
      showToast(language === 'km' ? `សូមស្វាគមន៍ ${fallbackUser.nameKhmer}` : `Welcome ${fallbackUser.nameEnglish || fallbackUser.nameKhmer}`, 'success');
    }
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRoute('landing');
    showToast(language === 'km' ? 'បានចាកចេញដោយជោគជ័យ' : 'Logged out successfully', 'info');
  };

  const switchRole = (newRole: Role) => {
    const matched = INITIAL_USERS.find(u => u.role === newRole) || {
      id: 'usr-' + newRole,
      username: newRole.toLowerCase(),
      email: `${newRole.toLowerCase()}@kroudigital.edu.kh`,
      nameKhmer: newRole === 'SUPER_ADMIN' ? 'ឯកឧត្តម បណ្ឌិត ជា សុវណ្ណ' : newRole === 'ADMIN' ? 'លោក គឹម សុផល' : newRole === 'TEACHER' ? 'អ្នកគ្រូ ចាន់ សុខា' : newRole === 'STUDENT' ? 'សុខ ចាន់ដារ៉ា' : 'អ្នកស្រី កែវ ចាន់នី',
      nameEnglish: newRole,
      role: newRole
    };
    setCurrentUser(matched);
    showToast(language === 'km' ? `បានប្តូរទៅកាន់តួនាទី៖ ${newRole}` : `Switched role to: ${newRole}`, 'info');
  };

  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  // Student CRUD
  const addStudent = async (data: Partial<Student>) => {
    setIsLoading(true);
    try {
      const created = await api.createStudent(data);
      setStudents(prev => [created, ...prev]);
      showToast(language === 'km' ? 'បានបន្ថែមសិស្សដោយជោគជ័យ' : 'Student added successfully');
    } catch {
      const newStudent = normalizeStudentData(data, students.length + 1);
      setStudents(prev => [newStudent, ...prev]);
      showToast(language === 'km' ? 'បានបន្ថែមសិស្សដោយជោគជ័យ' : 'Student added successfully');
    }
    setIsLoading(false);
  };

  const updateStudent = async (id: string, data: Partial<Student>) => {
    setIsLoading(true);
    try {
      const updated = await api.updateStudent(id, data);
      setStudents(prev => prev.map(s => s.id === id ? updated : s));
      showToast(language === 'km' ? 'បានកែប្រែព័ត៌មានសិស្សជោគជ័យ' : 'Student updated successfully');
    } catch {
      setStudents(prev => prev.map(s => s.id === id ? normalizeStudentData({ ...s, ...data }, 1) : s));
      showToast(language === 'km' ? 'បានកែប្រែព័ត៌មានសិស្សជោគជ័យ' : 'Student updated successfully');
    }
    setIsLoading(false);
  };

  const deleteStudent = async (id: string) => {
    setIsLoading(true);
    try {
      await api.deleteStudent(id);
    } catch (e) {
      console.warn(e);
    }
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast(language === 'km' ? 'បានលុបទិន្នន័យសិស្សជោគជ័យ' : 'Student deleted successfully');
    setIsLoading(false);
  };

  const importStudents = async (studentList: Partial<Student>[]): Promise<number> => {
    setIsLoading(true);
    let count = 0;
    try {
      const res = await api.importStudents(studentList);
      if (res?.students && Array.isArray(res.students)) {
        setStudents(prev => [...res.students, ...prev]);
        count = res.students.length;
      }
    } catch {
      // Client-side fallback
      const newItems: Student[] = studentList.map((item, idx) =>
        normalizeStudentData(item, students.length + idx + 1)
      );
      setStudents(prev => [...newItems, ...prev]);
      count = newItems.length;
    }

    // Refresh classes to update counts
    try {
      const updatedClasses = await api.getClasses();
      if (updatedClasses?.length) setClasses(updatedClasses);
    } catch {
      // ignore
    }

    showToast(
      language === 'km' 
        ? `បាននាំចូលទិន្នន័យសិស្សចំនួន ${count} នាក់ដោយជោគជ័យ!` 
        : `Successfully imported ${count} students!`,
      'success'
    );
    setIsLoading(false);
    return count;
  };

  const clearAllStudents = async () => {
    setIsLoading(true);
    try {
      await api.clearAllStudents();
    } catch (e) {
      console.warn(e);
    }
    setStudents([]);
    setAttendances([]);
    setGrades([]);
    // Update class student counts to 0
    setClasses(prev => prev.map(c => ({ ...c, studentCount: 0 })));
    showToast(
      language === 'km' ? 'បានសម្អាតទិន្នន័យសិស្សទាំងអស់ជោគជ័យ' : 'All students cleared successfully',
      'info'
    );
    setIsLoading(false);
  };

  // Teacher CRUD
  const addTeacher = async (data: Partial<Teacher>) => {
    setIsLoading(true);
    try {
      const created = await api.createTeacher(data);
      setTeachers(prev => [created, ...prev]);
    } catch {
      const newTeacher: Teacher = {
        id: 'tch-' + (teachers.length + 1),
        teacherCode: `TCH-${(teachers.length + 1).toString().padStart(3, '0')}`,
        nameKhmer: data.nameKhmer || 'គ្រូថ្មី',
        nameEnglish: data.nameEnglish || 'New Teacher',
        gender: data.gender || 'MALE',
        email: data.email || 'teacher@kroudigital.edu.kh',
        phone: data.phone || '012 333 444',
        department: data.department || 'វិទ្យាសាស្ត្រ',
        subjects: data.subjects || ['ភាសាខ្មែរ'],
        degree: data.degree || 'បរិញ្ញាបត្រ',
        status: 'ACTIVE',
        joinedDate: new Date().toISOString().split('T')[0],
        assignedClassNames: data.assignedClassNames || ['ថ្នាក់ទី១២ ក']
      };
      setTeachers(prev => [newTeacher, ...prev]);
    }
    showToast(language === 'km' ? 'បានបន្ថែមគ្រូបង្រៀនថ្មីជោគជ័យ' : 'Teacher added successfully');
    setIsLoading(false);
  };

  const updateTeacher = async (id: string, data: Partial<Teacher>) => {
    try {
      await api.updateTeacher(id, data);
    } catch (e) {
      console.warn(e);
    }
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    showToast(language === 'km' ? 'បានកែប្រែព័ត៌មានគ្រូជោគជ័យ' : 'Teacher updated successfully');
  };

  const deleteTeacher = async (id: string) => {
    try {
      await api.deleteTeacher(id);
    } catch (e) {
      console.warn(e);
    }
    setTeachers(prev => prev.filter(t => t.id !== id));
    showToast(language === 'km' ? 'បានលុបព័ត៌មានគ្រូជោគជ័យ' : 'Teacher deleted successfully');
  };

  // Class CRUD
  const addClass = async (data: Partial<ClassModel>) => {
    try {
      const created = await api.createClass(data);
      setClasses(prev => [...prev, created]);
    } catch {
      const newClass: ClassModel = {
        id: 'cls-' + (classes.length + 1),
        name: data.name || `ថ្នាក់ទី${data.grade || 12} ថ្មី`,
        grade: Number(data.grade) || 12,
        academicYear: data.academicYear || '២០២៥-២០២៦',
        room: data.room || 'បន្ទប់ D401',
        teacherId: data.teacherId || 'tch-001',
        teacherName: data.teacherName || 'អ្នកគ្រូ ចាន់ សុខា',
        studentCount: 0,
        capacity: Number(data.capacity) || 35,
        shift: data.shift || 'MORNING'
      };
      setClasses(prev => [...prev, newClass]);
    }
    showToast(language === 'km' ? 'បានបង្កើតថ្នាក់រៀនថ្មីជោគជ័យ' : 'Class created successfully');
  };

  const updateClass = async (id: string, data: Partial<ClassModel>) => {
    try {
      await api.updateClass(id, data);
    } catch (e) {
      console.warn(e);
    }
    setClasses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    showToast(language === 'km' ? 'បានកែប្រែថ្នាក់រៀនជោគជ័យ' : 'Class updated successfully');
  };

  const deleteClass = async (id: string) => {
    try {
      await api.deleteClass(id);
    } catch (e) {
      console.warn(e);
    }
    setClasses(prev => prev.filter(c => c.id !== id));
    showToast(language === 'km' ? 'បានលុបថ្នាក់រៀនជោគជ័យ' : 'Class deleted successfully');
  };

  // Subject CRUD
  const addSubject = async (data: Partial<SubjectModel>) => {
    try {
      const created = await api.createSubject(data);
      setSubjects(prev => [...prev, created]);
    } catch {
      const newSubject: SubjectModel = {
        id: 'sbj-' + (subjects.length + 1),
        code: data.code || `SUB${subjects.length + 1}`,
        nameKhmer: data.nameKhmer || 'មុខវិជ្ជាថ្មី',
        nameEnglish: data.nameEnglish || 'New Subject',
        credits: Number(data.credits) || 3,
        hoursPerWeek: Number(data.hoursPerWeek) || 4,
        department: data.department || 'វិទ្យាសាស្ត្រ',
        teacherName: data.teacherName || 'អ្នកគ្រូ ចាន់ សុខា',
        applicableGrades: data.applicableGrades || [10, 11, 12]
      };
      setSubjects(prev => [...prev, newSubject]);
    }
    showToast(language === 'km' ? 'បានបង្កើតមុខវិជ្ជាជោគជ័យ' : 'Subject added successfully');
  };

  const updateSubject = async (id: string, data: Partial<SubjectModel>) => {
    try {
      await api.updateSubject(id, data);
    } catch (e) {
      console.warn(e);
    }
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
    showToast(language === 'km' ? 'បានកែប្រែមុខវិជ្ជាជោគជ័យ' : 'Subject updated successfully');
  };

  const deleteSubject = async (id: string) => {
    try {
      await api.deleteSubject(id);
    } catch (e) {
      console.warn(e);
    }
    setSubjects(prev => prev.filter(s => s.id !== id));
    showToast(language === 'km' ? 'បានលុបមុខវិជ្ជាជោគជ័យ' : 'Subject deleted successfully');
  };

  // Attendance
  const saveAttendanceRecords = async (records: AttendanceRecord[]) => {
    try {
      await api.saveAttendance(records);
    } catch (e) {
      console.warn(e);
    }
    setAttendances(prev => {
      const updated = [...prev];
      records.forEach(r => {
        const idx = updated.findIndex(item => item.studentId === r.studentId && item.date === r.date);
        if (idx !== -1) {
          updated[idx] = r;
        } else {
          updated.push(r);
        }
      });
      return updated;
    });
    showToast(language === 'km' ? 'បានរក្សាទុកវត្តមានដោយជោគជ័យ' : 'Attendance saved successfully');
  };

  // Grades
  const saveGradeRecords = async (newGrades: GradeRecord[]) => {
    try {
      await api.saveGrades(newGrades);
    } catch (e) {
      console.warn(e);
    }
    setGrades(prev => {
      const updated = [...prev];
      newGrades.forEach(g => {
        const idx = updated.findIndex(item => item.studentId === g.studentId && item.subjectId === g.subjectId);
        if (idx !== -1) {
          updated[idx] = g;
        } else {
          updated.push(g);
        }
      });
      return updated;
    });
    showToast(language === 'km' ? 'បានរក្សាទុកពិន្ទុដោយជោគជ័យ' : 'Grades saved successfully');
  };

  // Schedule
  const addScheduleItem = async (data: Partial<ScheduleItem>) => {
    try {
      const created = await api.createScheduleItem(data);
      setSchedules(prev => [...prev, created]);
    } catch {
      const newItem: ScheduleItem = {
        id: 'sch-' + Date.now(),
        dayOfWeek: Number(data.dayOfWeek) || 1,
        period: Number(data.period) || 1,
        startTime: data.startTime || '07:30',
        endTime: data.endTime || '08:20',
        classId: data.classId || 'cls-12a',
        className: data.className || 'ថ្នាក់ទី១២ ក',
        subjectId: data.subjectId || 'sbj-01',
        subjectName: data.subjectName || 'ភាសាខ្មែរ',
        teacherId: data.teacherId || 'tch-001',
        teacherName: data.teacherName || 'អ្នកគ្រូ ចាន់ សុខា',
        room: data.room || 'A101',
        color: data.color || 'bg-cyan-50 border-cyan-300 text-cyan-800'
      };
      setSchedules(prev => [...prev, newItem]);
    }
    showToast(language === 'km' ? 'បានបន្ថែមម៉ោងសិក្សាជោគជ័យ' : 'Schedule slot added');
  };

  const deleteScheduleItem = async (id: string) => {
    try {
      await api.deleteScheduleItem(id);
    } catch (e) {
      console.warn(e);
    }
    setSchedules(prev => prev.filter(s => s.id !== id));
    showToast(language === 'km' ? 'បានលុបម៉ោងសិក្សា' : 'Schedule item removed');
  };

  // Exams
  const addExam = async (data: Partial<ExamModel>) => {
    try {
      const created = await api.createExam(data);
      setExams(prev => [created, ...prev]);
    } catch {
      const newExam: ExamModel = {
        id: 'exm-' + Date.now(),
        titleKhmer: data.titleKhmer || 'ការប្រឡងថ្មី',
        titleEnglish: data.titleEnglish || 'New Exam',
        examType: data.examType || 'MIDTERM',
        subjectId: data.subjectId || 'sbj-01',
        subjectName: data.subjectName || 'ភាសាខ្មែរ',
        classId: data.classId || 'cls-12a',
        className: data.className || 'ថ្នាក់ទី១២ ក',
        date: data.date || '2026-10-01',
        startTime: data.startTime || '08:00',
        endTime: data.endTime || '10:00',
        durationMinutes: Number(data.durationMinutes) || 120,
        room: data.room || 'បន្ទប់ A101',
        totalMarks: Number(data.totalMarks) || 100,
        passMarks: Number(data.passMarks) || 50,
        status: 'SCHEDULED'
      };
      setExams(prev => [newExam, ...prev]);
    }
    showToast(language === 'km' ? 'បានបង្កើតកាលវិភាគប្រឡងជោគជ័យ' : 'Exam scheduled successfully');
  };

  const updateExam = async (id: string, data: Partial<ExamModel>) => {
    try {
      await api.updateExam(id, data);
    } catch (e) {
      console.warn(e);
    }
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    showToast(language === 'km' ? 'បានធ្វើបច្ចុប្បន្នភាពការប្រឡង' : 'Exam updated successfully');
  };

  const deleteExam = async (id: string) => {
    try {
      await api.deleteExam(id);
    } catch (e) {
      console.warn(e);
    }
    setExams(prev => prev.filter(e => e.id !== id));
    showToast(language === 'km' ? 'បានលុបការប្រឡងជោគជ័យ' : 'Exam deleted successfully');
  };

  // Documents
  const addDocument = async (data: Partial<DocumentModel>) => {
    try {
      const created = await api.uploadDocument(data);
      setDocuments(prev => [created, ...prev]);
    } catch {
      const newDoc: DocumentModel = {
        id: 'doc-' + Date.now(),
        title: data.title || 'ឯកសារថ្មី',
        category: (data.category as any) || 'CURRICULUM',
        fileType: data.fileType || 'PDF',
        fileSize: data.fileSize || '2.4 MB',
        uploadedBy: currentUser?.nameKhmer || 'អ្នកគ្រប់គ្រង',
        uploadedAt: new Date().toISOString().split('T')[0],
        downloadCount: 0,
        isStoredInDrive: data.isStoredInDrive,
        driveFileId: data.driveFileId,
        driveWebViewLink: data.driveWebViewLink,
        driveFolderName: data.driveFolderName
      };
      setDocuments(prev => [newDoc, ...prev]);
    }
    showToast(language === 'km' ? 'បានផ្ទុកឡើងឯកសារជោគជ័យ' : 'Document uploaded successfully');
  };

  const deleteDocument = async (id: string) => {
    const targetDoc = documents.find(d => d.id === id);
    try {
      await api.deleteDocument(id);
    } catch (e) {
      console.warn(e);
    }
    
    // If stored in Google Drive, attempt Drive deletion as well
    if (targetDoc?.driveFileId && isDriveConnected) {
      const token = getStoredDriveToken();
      if (token) {
        try {
          await deleteFileFromGoogleDrive(token, targetDoc.driveFileId);
        } catch (err) {
          console.warn('Could not delete file from Google Drive:', err);
        }
      }
    }

    setDocuments(prev => prev.filter(d => d.id !== id));
    setDriveFiles(prev => prev.filter(f => f.id !== targetDoc?.driveFileId));
    showToast(language === 'km' ? 'បានលុបឯកសារជោគជ័យ' : 'Document deleted successfully');
  };

  // Google Drive Handlers
  const syncGoogleDrive = async () => {
    const token = getStoredDriveToken();
    if (!token) {
      setIsDriveConnected(false);
      return;
    }
    setIsSyncingDrive(true);
    try {
      const user = await fetchGoogleDriveAbout(token);
      if (user) {
        setDriveUser(user);
        localStorage.setItem('krou_drive_user', JSON.stringify(user));
        setIsDriveConnected(true);
      }

      const folderId = await getOrCreateDriveFolder(token, KROU_FOLDER_NAME);
      setDriveFolderId(folderId);

      const files = await listGoogleDriveFiles(token, folderId);
      setDriveFiles(files);
    } catch (err: any) {
      console.warn('Drive sync error:', err);
    } finally {
      setIsSyncingDrive(false);
    }
  };

  // Auto sync Drive on mount if token exists
  useEffect(() => {
    const token = getStoredDriveToken();
    if (token) {
      syncGoogleDrive();
    }
  }, []);

  const connectGoogleDrive = async (): Promise<boolean> => {
    setIsSyncingDrive(true);
    try {
      // Set up GIS listener
      const initialized = await initGoogleDriveAuth(async (receivedToken) => {
        setIsDriveConnected(true);
        showToast(language === 'km' ? 'បានភ្ជាប់គណនី Google Drive ដោយជោគជ័យ!' : 'Google Drive connected successfully!');
        await syncGoogleDrive();
      }, (err) => {
        console.error('GIS authorization failed:', err);
        showToast(language === 'km' ? 'ការតភ្ជាប់ Google Drive មិនបានសម្រេច' : 'Google Drive connection failed', 'error');
        setIsSyncingDrive(false);
      });

      if (!initialized) {
        // Fallback: Check if user or preview can use direct OAuth request
        try {
          await requestGoogleDriveToken();
          return true;
        } catch (e: any) {
          showToast(
            language === 'km'
              ? 'សូមបញ្ចូល Client ID ឬអនុញ្ញាតឱ្យចូលប្រើប្រាស់ Google Drive'
              : 'Please authorize Google Drive or configure Client ID',
            'info'
          );
          setIsSyncingDrive(false);
          return false;
        }
      }

      await requestGoogleDriveToken();
      return true;
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error connecting to Google Drive', 'error');
      setIsSyncingDrive(false);
      return false;
    }
  };

  const disconnectGoogleDriveState = () => {
    const token = getStoredDriveToken();
    svcDisconnectDrive(token || undefined);
    setIsDriveConnected(false);
    setDriveUser(null);
    setDriveFiles([]);
    setDriveFolderId(null);
    showToast(language === 'km' ? 'បានផ្តាច់គណនី Google Drive' : 'Google Drive disconnected');
  };

  const uploadFileToDriveAndLibrary = async (
    file: File | Blob,
    docData: Partial<DocumentModel>
  ): Promise<DocumentModel> => {
    const token = getStoredDriveToken();
    let driveFileResult: GoogleDriveFile | null = null;
    let targetFolderId = driveFolderId;

    if (token) {
      try {
        if (!targetFolderId) {
          targetFolderId = await getOrCreateDriveFolder(token, KROU_FOLDER_NAME);
          setDriveFolderId(targetFolderId);
        }
        const fileName = (file as File).name || `${docData.title || 'Document'}.${(docData.fileType || 'pdf').toLowerCase()}`;
        const mimeType = (file as File).type || 'application/pdf';

        driveFileResult = await uploadFileToGoogleDrive(token, file, fileName, mimeType, targetFolderId);
      } catch (err) {
        console.warn('Direct Google Drive upload warning:', err);
      }
    }

    const fileSizeStr = (file as File).size ? formatBytes((file as File).size) : (docData.fileSize || '2.5 MB');

    const newDoc: DocumentModel = {
      id: 'doc-' + Date.now(),
      title: docData.title || (file as File).name || 'ឯកសារថ្មី',
      category: (docData.category as any) || 'CURRICULUM',
      fileType: docData.fileType || 'PDF',
      fileSize: fileSizeStr,
      uploadedBy: currentUser?.nameKhmer || 'អ្នកគ្រប់គ្រង',
      uploadedAt: new Date().toISOString().split('T')[0],
      downloadCount: 0,
      isStoredInDrive: true,
      driveFileId: driveFileResult?.id || 'gdrive-' + Date.now(),
      driveWebViewLink: driveFileResult?.webViewLink || `https://drive.google.com/file/d/demo-${Date.now()}/view`,
      driveFolderName: KROU_FOLDER_NAME
    };

    try {
      await api.uploadDocument(newDoc);
    } catch {
      // client fallback
    }

    setDocuments(prev => [newDoc, ...prev]);
    if (driveFileResult) {
      setDriveFiles(prev => [driveFileResult!, ...prev]);
    }
    showToast(
      language === 'km'
        ? `បានរក្សាទុកឯកសារ «${newDoc.title}» ក្នុង Google Drive ដោយជោគជ័យ!`
        : `Stored "${newDoc.title}" in Google Drive successfully!`
    );
    return newDoc;
  };

  const backupStudentsToDrive = async (): Promise<DocumentModel | null> => {
    try {
      const exportRows = students.map(s => ({
        khmer_name: s.khmer_name,
        english_name: s.english_name,
        sex: s.sex,
        age: s.age,
        grade: s.grade,
        date_of_birth: s.date_of_birth,
        rlc: s.rlc,
        phone_number: s.phone_number,
        contributions: s.contributions,
        remark: s.remark,
        orther: s.orther,
        books: s.books,
        time_study: s.time_study,
        status: s.status,
        semester: s.semester,
        payment_by: s.payment_by
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Students_16Fields');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const todayStr = new Date().toISOString().split('T')[0];
      const fileName = `បញ្ជីឈ្មោះសិស្ស_១៦វាល_${todayStr}.xlsx`;

      const doc = await uploadFileToDriveAndLibrary(blob, {
        title: `ទិន្នន័យបម្រុងទុកសិស្ស (១៦វាល) - ${todayStr}`,
        category: 'ADMINISTRATIVE',
        fileType: 'EXCEL',
        fileSize: formatBytes(blob.size),
        isStoredInDrive: true
      });

      return doc;
    } catch (err: any) {
      console.error('Backup error:', err);
      showToast(language === 'km' ? 'បរាជ័យក្នុងការបម្រុងទុកទិន្នន័យទៅ Google Drive' : 'Backup to Google Drive failed', 'error');
      return null;
    }
  };

  // Notifications
  const markNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
    } catch (e) {
      console.warn(e);
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const broadcastAnnouncement = async (title: string, message: string) => {
    try {
      const created = await api.createNotification({ title, message, type: 'ANNOUNCEMENT' });
      setNotifications(prev => [created, ...prev]);
    } catch {
      const newNotif: NotificationModel = {
        id: 'notif-' + Date.now(),
        title,
        message,
        type: 'ANNOUNCEMENT',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false,
        priority: 'HIGH'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
    showToast(language === 'km' ? 'បានផ្សព្វផ្សាយសេចក្តីជូនដំណឹងជាសាធារណៈ' : 'Announcement broadcasted successfully');
  };

  // Reset
  const resetAllData = async () => {
    try {
      await api.resetDemoData();
    } catch (e) {
      console.warn(e);
    }
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setAttendances(INITIAL_ATTENDANCE);
    setGrades(INITIAL_GRADES);
    setSchedules(INITIAL_SCHEDULE);
    setExams(INITIAL_EXAMS);
    setDocuments(INITIAL_DOCUMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivities(INITIAL_ACTIVITIES);
    showToast(language === 'km' ? 'បានកំណត់ទិន្នន័យគំរូដើមឡើងវិញជោគជ័យ' : 'Demo data reset to factory default', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || 'SUPER_ADMIN',
        language,
        currentRoute,
        sidebarCollapsed,
        toasts,
        students,
        teachers,
        classes,
        subjects,
        attendances,
        grades,
        schedules,
        exams,
        documents,
        notifications,
        activities,
        isLoading,
        login,
        logout,
        switchRole,
        setLanguage,
        navigate,
        toggleSidebar,
        showToast,
        addStudent,
        updateStudent,
        deleteStudent,
        importStudents,
        clearAllStudents,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addClass,
        updateClass,
        deleteClass,
        addSubject,
        updateSubject,
        deleteSubject,
        saveAttendanceRecords,
        saveGradeRecords,
        addScheduleItem,
        deleteScheduleItem,
        addExam,
        updateExam,
        deleteExam,
        addDocument,
        deleteDocument,
        markNotificationRead,
        broadcastAnnouncement,
        resetAllData,

        // Google Drive Integration
        isDriveConnected,
        driveUser,
        driveFiles,
        isSyncingDrive,
        driveFolderId,
        connectGoogleDrive,
        disconnectGoogleDriveState,
        syncGoogleDrive,
        uploadFileToDriveAndLibrary,
        backupStudentsToDrive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
