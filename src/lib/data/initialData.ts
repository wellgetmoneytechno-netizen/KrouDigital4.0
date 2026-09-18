import { User, Student, Teacher, ClassModel, SubjectModel, AttendanceRecord, GradeRecord, ScheduleItem, ExamModel, DocumentModel, NotificationModel, ActivityItem } from '../../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-001',
    username: 'superadmin',
    email: 'admin@kroudigital.edu.kh',
    nameKhmer: 'ឯកឧត្តម បណ្ឌិត ជា សុវណ្ណ',
    nameEnglish: 'Dr. Chea Sovann',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+855 12 888 999'
  },
  {
    id: 'usr-002',
    username: 'schooladmin',
    email: 'director@kroudigital.edu.kh',
    nameKhmer: 'លោក គឹម សុផល',
    nameEnglish: 'Kim Sophal',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+855 17 777 666'
  },
  {
    id: 'usr-003',
    username: 'teacher.sokha',
    email: 'sokha.chan@kroudigital.edu.kh',
    nameKhmer: 'អ្នកគ្រូ ចាន់ សុខា',
    nameEnglish: 'Chan Sokha',
    role: 'TEACHER',
    teacherId: 'tch-001',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+855 70 334 455'
  },
  {
    id: 'usr-004',
    username: 'student.dara',
    email: 'dara.sok@student.kroudigital.edu.kh',
    nameKhmer: 'សុខ ចាន់ដារ៉ា',
    nameEnglish: 'Sok Chandara',
    role: 'STUDENT',
    studentId: 'std-001',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    phone: '+855 98 112 233'
  },
  {
    id: 'usr-005',
    username: 'parent.channy',
    email: 'channy.parent@gmail.com',
    nameKhmer: 'អ្នកស្រី កែវ ចាន់នី',
    nameEnglish: 'Keo Channy',
    role: 'PARENT',
    parentId: 'par-001',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+855 12 334 455'
  }
];

export const INITIAL_CLASSES: ClassModel[] = [
  {
    id: 'cls-12a',
    name: 'ថ្នាក់ទី១២ ក (វិទ្យាសាស្ត្រពិត)',
    grade: 12,
    academicYear: '២០២៥-២០២៦',
    room: 'បន្ទប់ A101 (អគារវិទ្យាសាស្ត្រ)',
    teacherId: 'tch-001',
    teacherName: 'អ្នកគ្រូ ចាន់ សុខា',
    studentCount: 0,
    capacity: 35,
    shift: 'MORNING'
  },
  {
    id: 'cls-11b',
    name: 'ថ្នាក់ទី១១ ខ (វិទ្យាសាស្ត្រសង្គម)',
    grade: 11,
    academicYear: '២០២៥-២០២៦',
    room: 'បន្ទប់ B202 (អគារពហុបំណង)',
    teacherId: 'tch-002',
    teacherName: 'លោកគ្រូ ហេង វណ្ណា',
    studentCount: 0,
    capacity: 35,
    shift: 'MORNING'
  },
  {
    id: 'cls-10c',
    name: 'ថ្នាក់ទី១០ គ (ចំណេះទូទៅ)',
    grade: 10,
    academicYear: '២០២៥-២០២៦',
    room: 'បន្ទប់ C301 (អគារសិក្សាថ្មី)',
    teacherId: 'tch-003',
    teacherName: 'លោកគ្រូ ស៊ិន ពិសិដ្ឋ',
    studentCount: 0,
    capacity: 40,
    shift: 'AFTERNOON'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-001',
    teacherCode: 'TCH-001',
    nameKhmer: 'អ្នកគ្រូ ចាន់ សុខា',
    nameEnglish: 'Chan Sokha',
    gender: 'FEMALE',
    email: 'sokha.chan@kroudigital.edu.kh',
    phone: '012 345 678',
    department: 'ភាសាខ្មែរ និងអក្សរសាស្ត្រ',
    subjects: ['ភាសាខ្មែរ', 'អក្សរសិល្ប៍ទស្សនៈ'],
    degree: 'បរិញ្ញាបត្រជាន់ខ្ពស់ អក្សរសាស្ត្រខ្មែរ (RUPP)',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2019-09-01',
    assignedClassNames: ['ថ្នាក់ទី១២ ក', 'ថ្នាក់ទី១១ ខ']
  },
  {
    id: 'tch-002',
    teacherCode: 'TCH-002',
    nameKhmer: 'លោកគ្រូ ហេង វណ្ណា',
    nameEnglish: 'Heng Vanna',
    gender: 'MALE',
    email: 'vanna.heng@kroudigital.edu.kh',
    phone: '098 765 432',
    department: 'គណិតវិទ្យា និងរូបវិទ្យា',
    subjects: ['គណិតវិទ្យា', 'រូបវិទ្យា'],
    degree: 'បរិញ្ញាបត្រជាន់ខ្ពស់ គណិតវិទ្យាអនុវត្ត (ITC)',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2020-10-15',
    assignedClassNames: ['ថ្នាក់ទី១២ ក', 'ថ្នាក់ទី១០ គ']
  },
  {
    id: 'tch-003',
    teacherCode: 'TCH-003',
    nameKhmer: 'លោកគ្រូ ស៊ិន ពិសិដ្ឋ',
    nameEnglish: 'Sin Piseth',
    gender: 'MALE',
    email: 'piseth.sin@kroudigital.edu.kh',
    phone: '010 445 566',
    department: 'បច្ចេកវិទ្យា និងភាសាបរទេស',
    subjects: ['ព័ត៌មានវិទ្យា', 'ភាសាអង់គ្លេស'],
    degree: 'បរិញ្ញាបត្រ វិស្វកម្មកុំព្យូទ័រ និង TESOL',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2022-01-10',
    assignedClassNames: ['ថ្នាក់ទី១១ ខ', 'ថ្នាក់ទី១០ គ']
  }
];

export const INITIAL_SUBJECTS: SubjectModel[] = [
  {
    id: 'sbj-01',
    code: 'KHM101',
    nameKhmer: 'ភាសាខ្មែរ និងអក្សរសិល្ប៍',
    nameEnglish: 'Khmer Literature',
    credits: 4,
    hoursPerWeek: 5,
    department: 'វិទ្យាសាស្ត្រសង្គម',
    teacherName: 'អ្នកគ្រូ ចាន់ សុខា',
    applicableGrades: [10, 11, 12]
  },
  {
    id: 'sbj-02',
    code: 'MAT101',
    nameKhmer: 'គណិតវិទ្យា (ពីជគណិត & ធរណីមាត្រ)',
    nameEnglish: 'Mathematics',
    credits: 5,
    hoursPerWeek: 6,
    department: 'វិទ្យាសាស្ត្រពិត',
    teacherName: 'លោកគ្រូ ហេង វណ្ណា',
    applicableGrades: [10, 11, 12]
  },
  {
    id: 'sbj-03',
    code: 'PHY101',
    nameKhmer: 'រូបវិទ្យាពិសោធន៍',
    nameEnglish: 'Applied Physics',
    credits: 3,
    hoursPerWeek: 4,
    department: 'វិទ្យាសាស្ត្រពិត',
    teacherName: 'លោកគ្រូ ហេង វណ្ណា',
    applicableGrades: [11, 12]
  },
  {
    id: 'sbj-04',
    code: 'ENG101',
    nameKhmer: 'ភាសាអង់គ្លេសទូទៅ (Oxford Pathway)',
    nameEnglish: 'English Language',
    credits: 3,
    hoursPerWeek: 4,
    department: 'ភាសាបរទេស',
    teacherName: 'លោកគ្រូ ស៊ិន ពិសិដ្ឋ',
    applicableGrades: [10, 11, 12]
  },
  {
    id: 'sbj-05',
    code: 'INF101',
    nameKhmer: 'ព័ត៌មានវិទ្យា និងឌីជីថល (ICT)',
    nameEnglish: 'Computer Science & ICT',
    credits: 3,
    hoursPerWeek: 3,
    department: 'បច្ចេកវិទ្យាព័ត៌មាន',
    teacherName: 'លោកគ្រូ ស៊ិន ពិសិដ្ឋ',
    applicableGrades: [10, 11, 12]
  }
];

// Students data - starts completely empty (Demo students removed)
export const INITIAL_STUDENTS: Student[] = [];

// Attendance Records - starts empty
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

// Grade records - starts empty
export const INITIAL_GRADES: GradeRecord[] = [];

// Weekly Timetable
export const INITIAL_SCHEDULE: ScheduleItem[] = [
  // Monday (dayOfWeek = 1)
  { id: 'sch-01', dayOfWeek: 1, period: 1, startTime: '07:30', endTime: '08:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-01', subjectName: 'ភាសាខ្មែរ', teacherId: 'tch-001', teacherName: 'អ្នកគ្រូ ចាន់ សុខា', room: 'A101', color: 'bg-cyan-50 border-cyan-300 text-cyan-800' },
  { id: 'sch-02', dayOfWeek: 1, period: 2, startTime: '08:30', endTime: '09:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-02', subjectName: 'គណិតវិទ្យា', teacherId: 'tch-002', teacherName: 'លោកគ្រូ ហេង វណ្ណា', room: 'A101', color: 'bg-blue-50 border-blue-300 text-blue-800' },
  { id: 'sch-03', dayOfWeek: 1, period: 3, startTime: '09:40', endTime: '10:30', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-03', subjectName: 'រូបវិទ្យា', teacherId: 'tch-002', teacherName: 'លោកគ្រូ ហេង វណ្ណា', room: 'Lab 1', color: 'bg-teal-50 border-teal-300 text-teal-800' },
  { id: 'sch-04', dayOfWeek: 1, period: 4, startTime: '10:40', endTime: '11:30', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-04', subjectName: 'ភាសាអង់គ្លេស', teacherId: 'tch-003', teacherName: 'លោកគ្រូ ស៊ិន ពិសិដ្ឋ', room: 'A101', color: 'bg-indigo-50 border-indigo-300 text-indigo-800' },

  // Tuesday (dayOfWeek = 2)
  { id: 'sch-05', dayOfWeek: 2, period: 1, startTime: '07:30', endTime: '08:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-02', subjectName: 'គណិតវិទ្យា', teacherId: 'tch-002', teacherName: 'លោកគ្រូ ហេង វណ្ណា', room: 'A101', color: 'bg-blue-50 border-blue-300 text-blue-800' },
  { id: 'sch-06', dayOfWeek: 2, period: 2, startTime: '08:30', endTime: '09:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-05', subjectName: 'ព័ត៌មានវិទ្យា (ICT)', teacherId: 'tch-003', teacherName: 'លោកគ្រូ ស៊ិន ពិសិដ្ឋ', room: 'Computer Lab 2', color: 'bg-purple-50 border-purple-300 text-purple-800' },
  { id: 'sch-07', dayOfWeek: 2, period: 3, startTime: '09:40', endTime: '10:30', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-01', subjectName: 'ភាសាខ្មែរ', teacherId: 'tch-001', teacherName: 'អ្នកគ្រូ ចាន់ សុខា', room: 'A101', color: 'bg-cyan-50 border-cyan-300 text-cyan-800' },

  // Wednesday (dayOfWeek = 3)
  { id: 'sch-08', dayOfWeek: 3, period: 1, startTime: '07:30', endTime: '08:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-03', subjectName: 'រូបវិទ្យា', teacherId: 'tch-002', teacherName: 'លោកគ្រូ ហេង វណ្ណា', room: 'A101', color: 'bg-teal-50 border-teal-300 text-teal-800' },
  { id: 'sch-09', dayOfWeek: 3, period: 2, startTime: '08:30', endTime: '09:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-04', subjectName: 'ភាសាអង់គ្លេស', teacherId: 'tch-003', teacherName: 'លោកគ្រូ ស៊ិន ពិសិដ្ឋ', room: 'A101', color: 'bg-indigo-50 border-indigo-300 text-indigo-800' },
  { id: 'sch-10', dayOfWeek: 3, period: 3, startTime: '09:40', endTime: '10:30', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-02', subjectName: 'គណិតវិទ្យា', teacherId: 'tch-002', teacherName: 'លោកគ្រូ ហេង វណ្ណា', room: 'A101', color: 'bg-blue-50 border-blue-300 text-blue-800' },

  // Thursday (dayOfWeek = 4)
  { id: 'sch-11', dayOfWeek: 4, period: 1, startTime: '07:30', endTime: '08:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-05', subjectName: 'ព័ត៌មានវិទ្យា (ICT)', teacherId: 'tch-003', teacherName: 'លោកគ្រូ ស៊ិន ពិសិដ្ឋ', room: 'Computer Lab 2', color: 'bg-purple-50 border-purple-300 text-purple-800' },
  { id: 'sch-12', dayOfWeek: 4, period: 2, startTime: '08:30', endTime: '09:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-01', subjectName: 'ភាសាខ្មែរ', teacherId: 'tch-001', teacherName: 'អ្នកគ្រូ ចាន់ សុខា', room: 'A101', color: 'bg-cyan-50 border-cyan-300 text-cyan-800' },
  { id: 'sch-13', dayOfWeek: 4, period: 3, startTime: '09:40', endTime: '10:30', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-02', subjectName: 'គណិតវិទ្យា', teacherId: 'tch-002', teacherName: 'លោកគ្រូ ហេង វណ្ណា', room: 'A101', color: 'bg-blue-50 border-blue-300 text-blue-800' },

  // Friday (dayOfWeek = 5)
  { id: 'sch-14', dayOfWeek: 5, period: 1, startTime: '07:30', endTime: '08:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-04', subjectName: 'ភាសាអង់គ្លេស', teacherId: 'tch-003', teacherName: 'លោកគ្រូ ស៊ិន ពិសិដ្ឋ', room: 'A101', color: 'bg-indigo-50 border-indigo-300 text-indigo-800' },
  { id: 'sch-15', dayOfWeek: 5, period: 2, startTime: '08:30', endTime: '09:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-03', subjectName: 'រូបវិទ្យា', teacherId: 'tch-002', teacherName: 'លោកគ្រូ ហេង វណ្ណា', room: 'A101', color: 'bg-teal-50 border-teal-300 text-teal-800' },

  // Saturday (dayOfWeek = 6)
  { id: 'sch-16', dayOfWeek: 6, period: 1, startTime: '07:30', endTime: '08:20', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-01', subjectName: 'ភាសាខ្មែរ (តែងសេចក្តី)', teacherId: 'tch-001', teacherName: 'អ្នកគ្រូ ចាន់ សុខា', room: 'A101', color: 'bg-cyan-50 border-cyan-300 text-cyan-800' },
  { id: 'sch-17', dayOfWeek: 6, period: 2, startTime: '08:30', endTime: '10:00', classId: 'cls-12a', className: 'ថ្នាក់ទី១២ ក', subjectId: 'sbj-02', subjectName: 'គណិតវិទ្យា (វិញ្ញាសាត្រៀមបាក់ឌុប)', teacherId: 'tch-002', teacherName: 'លោកគ្រូ ហេង វណ្ណា', room: 'A101', color: 'bg-blue-50 border-blue-300 text-blue-800' }
];

// Exams
export const INITIAL_EXAMS: ExamModel[] = [
  {
    id: 'exm-01',
    titleKhmer: 'ការប្រឡងឆមាសទី១ មុខវិជ្ជាគណិតវិទ្យា',
    titleEnglish: 'Semester 1 Final Exam - Mathematics',
    examType: 'FINAL',
    subjectId: 'sbj-02',
    subjectName: 'គណិតវិទ្យា',
    classId: 'cls-12a',
    className: 'ថ្នាក់ទី១២ ក',
    date: '2026-09-28',
    startTime: '08:00',
    endTime: '10:30',
    durationMinutes: 150,
    room: 'សាលប្រឡងធំ (អគារ A)',
    totalMarks: 100,
    passMarks: 50,
    status: 'SCHEDULED'
  },
  {
    id: 'exm-02',
    titleKhmer: 'ការប្រឡងវាស់ស្ទង់សមត្ថភាពប្រចាំខែកញ្ញា - ភាសាខ្មែរ',
    titleEnglish: 'September Monthly Assessment - Khmer Literature',
    examType: 'MONTHLY',
    subjectId: 'sbj-01',
    subjectName: 'ភាសាខ្មែរ',
    classId: 'cls-12a',
    className: 'ថ្នាក់ទី១២ ក',
    date: '2026-09-22',
    startTime: '08:00',
    endTime: '09:30',
    durationMinutes: 90,
    room: 'A101',
    totalMarks: 50,
    passMarks: 25,
    status: 'SCHEDULED'
  },
  {
    id: 'exm-03',
    titleKhmer: 'តេស្តត្រៀមប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ (បាក់ឌុប) - រូបវិទ្យា',
    titleEnglish: 'National Exam Mock Test - Physics',
    examType: 'NATIONAL_PREP',
    subjectId: 'sbj-03',
    subjectName: 'រូបវិទ្យា',
    classId: 'cls-12a',
    className: 'ថ្នាក់ទី១២ ក',
    date: '2026-10-05',
    startTime: '14:00',
    endTime: '16:00',
    durationMinutes: 120,
    room: 'A101',
    totalMarks: 75,
    passMarks: 38,
    status: 'SCHEDULED'
  }
];

// Digital Documents
export const INITIAL_DOCUMENTS: DocumentModel[] = [
  {
    id: 'doc-01',
    title: 'សៀវភៅគោល កម្មវិធីសិក្សាជាតិកម្រិតមធ្យមសិក្សាទុតិយភូមិ ២០២៥-២០២៦',
    category: 'CURRICULUM',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    uploadedBy: 'ក្រសួងអប់រំ យុវជន និងកីឡា',
    uploadedAt: '2025-08-20',
    downloadCount: 342,
    isStoredInDrive: true,
    driveWebViewLink: 'https://drive.google.com/file/d/demo-curriculum-2025/view',
    driveFolderName: 'KrouDigital 4.0 - បណ្ណាល័យសាលា'
  },
  {
    id: 'doc-02',
    title: 'បទបញ្ជាផ្ទៃក្នុងសាលារៀន និងក្រមសីលធម៌សិស្សានុសិស្ស KrouDigital4.0',
    category: 'POLICY',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    uploadedBy: 'គណៈគ្រប់គ្រងសាលា',
    uploadedAt: '2025-09-01',
    downloadCount: 189
  },
  {
    id: 'doc-03',
    title: 'វិញ្ញាសាគំរូ ត្រៀមប្រឡងសញ្ញាបត្របាក់ឌុប មុខវិជ្ជាគណិតវិទ្យា និងគន្លឹះដោះស្រាយ',
    category: 'WORKSHEET',
    fileType: 'PDF',
    fileSize: '3.1 MB',
    uploadedBy: 'លោកគ្រូ ហេង វណ្ណា',
    uploadedAt: '2025-09-10',
    downloadCount: 520
  },
  {
    id: 'doc-04',
    title: 'គំរូកិច្ចតែងការបង្រៀនតាមបែបស្ថាបនា និងបច្ចេកវិទ្យាឌីជីថល (ICT Integrated)',
    category: 'ADMINISTRATIVE',
    fileType: 'DOCX',
    fileSize: '890 KB',
    uploadedBy: 'អ្នកគ្រូ ចាន់ សុខា',
    uploadedAt: '2025-09-05',
    downloadCount: 114
  },
  {
    id: 'doc-05',
    title: 'គោលការណ៍ណែនាំស្តីពីការវាយតម្លៃលទ្ធផលសិក្សា និងការគណនាពិន្ទុមធ្យមភាគ',
    category: 'POLICY',
    fileType: 'PDF',
    fileSize: '1.8 MB',
    uploadedBy: 'ការិយាល័យសិក្សាធិការ',
    uploadedAt: '2025-09-02',
    downloadCount: 230
  },
  {
    id: 'doc-06',
    title: 'សន្លឹកកិច្ចការលំហាត់ប្រចាំសប្តាហ៍ មុខវិជ្ជារូបវិទ្យា និងគីមីវិទ្យា ថ្នាក់ទី១២',
    category: 'WORKSHEET',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    uploadedBy: 'គណៈកម្មការបច្ចេកទេសវិទ្យាសាស្ត្រ',
    uploadedAt: '2025-09-12',
    downloadCount: 410
  },
  {
    id: 'doc-07',
    title: 'ទម្រង់បែបបទស្នើសុំច្បាប់ឈប់សម្រាក និងលិខិតបញ្ជាក់ការសិក្សារបស់សិស្ស',
    category: 'ADMINISTRATIVE',
    fileType: 'DOCX',
    fileSize: '650 KB',
    uploadedBy: 'លេខាធិការដ្ឋានសាលា',
    uploadedAt: '2025-09-08',
    downloadCount: 175
  },
  {
    id: 'doc-08',
    title: 'ទិន្នន័យបម្រុងទុកបញ្ជីសិស្ស (១៦ វាល) ក្នុង Google Drive - KrouDigital4.0',
    category: 'ADMINISTRATIVE',
    fileType: 'EXCEL',
    fileSize: '2.1 MB',
    uploadedBy: 'ប្រព័ន្ធស្វ័យប្រវត្តិ (Google Drive Cloud)',
    uploadedAt: '2025-09-15',
    downloadCount: 88,
    isStoredInDrive: true,
    driveWebViewLink: 'https://drive.google.com/file/d/demo-backup-students/view',
    driveFolderName: 'KrouDigital 4.0 - បណ្ណាល័យសាលា'
  }
];

// Notifications
export const INITIAL_NOTIFICATIONS: NotificationModel[] = [
  {
    id: 'notif-01',
    title: 'ស្វាគមន៍មកកាន់ឆ្នាំសិក្សាថ្មី ២០២៥-២០២៦!',
    message: 'ប្រព័ន្ធគ្រប់គ្រងសាលារៀន KrouDigital4.0 បានដាក់ឱ្យដំណើរការជាផ្លូវការដើម្បីគាំទ្រការសិក្សា ការតាមដានវត្តមាន និងការវាយតម្លៃពិន្ទុដោយស្វ័យប្រវត្តិ។',
    type: 'ANNOUNCEMENT',
    createdAt: '2026-09-16 08:00',
    read: false,
    priority: 'HIGH'
  },
  {
    id: 'notif-02',
    title: 'ការជូនដំណឹងអំពីកាលវិភាគប្រឡងពាក់កណ្តាលឆមាស',
    message: 'កាលវិភាគប្រឡងពាក់កណ្តាលឆមាសទី១ ត្រូវបានផ្សព្វផ្សាយ។ សូមលោកគ្រូ អ្នកគ្រូ និងសិស្សានុសិស្សពិនិត្យមើលក្នុងផ្នែក "ការប្រឡង"។',
    type: 'EXAM',
    createdAt: '2026-09-15 14:30',
    read: false,
    priority: 'NORMAL'
  },
  {
    id: 'notif-03',
    title: 'របាយការណ៍វត្តមានប្រចាំថ្ងៃបានធ្វើបច្ចុប្បន្នភាព',
    message: 'អត្រាវត្តមានសរុបប្រចាំថ្ងៃរបស់សាលាសម្រេចបាន ៩៦.៨%។ អរគុណលោកគ្រូ អ្នកគ្រូដែលបានកត់ត្រាវត្តមានទាន់ពេលវេលា។',
    type: 'ATTENDANCE',
    createdAt: '2026-09-16 11:30',
    read: true,
    priority: 'NORMAL'
  },
  {
    id: 'notif-04',
    title: 'ការធ្វើបច្ចុប្បន្នភាពប្រព័ន្ធសុវត្ថិភាពទិន្នន័យ (Cloud Backup)',
    message: 'ទិន្នន័យទាំងអស់ត្រូវបានរក្សាទុកដោយសុវត្ថិភាពនៅម៉ោង ០២:០០ ទៀបភ្លឺ។',
    type: 'SYSTEM',
    createdAt: '2026-09-16 02:00',
    read: true,
    priority: 'LOW'
  }
];

// Activity Feed
export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-01',
    action: 'បានកត់ត្រាវត្តមានសម្រាប់',
    target: 'ថ្នាក់ទី១២ ក (វត្តមាន ៩/១០ សិស្ស)',
    userName: 'អ្នកគ្រូ ចាន់ សុខា',
    timeAgo: '១៥ នាទីមុន',
    type: 'ATTENDANCE'
  },
  {
    id: 'act-02',
    action: 'បានបញ្ចូលពិន្ទុកិច្ចការស្រាវជ្រាវសម្រាប់',
    target: 'មុខវិជ្ជាភាសាខ្មែរ ថ្នាក់ទី១២ ក',
    userName: 'អ្នកគ្រូ ចាន់ សុខា',
    timeAgo: '៤៥ នាទីមុន',
    type: 'GRADE'
  },
  {
    id: 'act-03',
    action: 'បានចុះឈ្មោះសិស្សថ្មី',
    target: 'សុខ ចាន់ដារ៉ា (KD-2025-001)',
    userName: 'លោក គឹម សុផល',
    timeAgo: '២ ម៉ោងមុន',
    type: 'STUDENT'
  },
  {
    id: 'act-04',
    action: 'បានកំណត់កាលវិភាគប្រឡង',
    target: 'ការប្រឡងឆមាសទី១ គណិតវិទ្យា',
    userName: 'លោក គឹម សុផល',
    timeAgo: '៤ ម៉ោងមុន',
    type: 'EXAM'
  },
  {
    id: 'act-05',
    action: 'បានទាញយករបាយការណ៍ស្ថិតិ',
    target: 'របាយការណ៍សិស្សប្រចាំឆមាស (PDF)',
    userName: 'ឯកឧត្តម បណ្ឌិត ជា សុវណ្ណ',
    timeAgo: 'ម្សិលមិញ',
    type: 'SYSTEM'
  }
];
