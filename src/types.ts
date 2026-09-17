export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface User {
  id: string;
  username: string;
  email: string;
  nameKhmer: string;
  nameEnglish: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  teacherId?: string;
  studentId?: string;
  parentId?: string;
}

export interface Student {
  id: string;
  // 16 Exact Fields from specification:
  khmer_name: string;
  english_name: string;
  sex: string; // 'ប្រុស' | 'ស្រី' | 'MALE' | 'FEMALE'
  age: number | string;
  grade: string;
  date_of_birth: string;
  rlc: string;
  phone_number: string;
  contributions: string;
  remark: string;
  orther: string; // matches user's exact specification 'orther'
  books: string;
  time_study: string;
  status: string;
  semester: string;
  payment_by: string;

  // Compatibility & extended system fields
  studentCode?: string;
  nameKhmer?: string;
  nameEnglish?: string;
  gender?: 'MALE' | 'FEMALE' | string;
  dob?: string;
  classId?: string;
  className?: string;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  parentRelationship?: string;
  address?: string;
  avatarUrl?: string;
  enrolledDate?: string;
  gpa?: number;
}

export const STUDENT_FIELD_KEYS = [
  'khmer_name',
  'english_name',
  'sex',
  'age',
  'grade',
  'date_of_birth',
  'rlc',
  'phone_number',
  'contributions',
  'remark',
  'orther',
  'books',
  'time_study',
  'status',
  'semester',
  'payment_by'
] as const;

export type StudentFieldKey = typeof STUDENT_FIELD_KEYS[number];

export interface Teacher {
  id: string;
  teacherCode: string; // e.g. TCH-012
  nameKhmer: string;
  nameEnglish: string;
  gender: 'MALE' | 'FEMALE';
  email: string;
  phone: string;
  department: string;
  subjects: string[]; // subject names or codes
  degree: string;
  status: 'ACTIVE' | 'LEAVE' | 'INACTIVE';
  avatarUrl?: string;
  joinedDate: string;
  assignedClassNames?: string[];
}

export interface ClassModel {
  id: string;
  name: string; // e.g. ថ្នាក់ទី១២ក
  grade: number; // 10, 11, 12
  academicYear: string; // 2025-2026
  room: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  capacity: number;
  shift: 'MORNING' | 'AFTERNOON' | 'FULLDAY';
}

export interface SubjectModel {
  id: string;
  code: string; // e.g. KHM101
  nameKhmer: string;
  nameEnglish: string;
  credits: number;
  hoursPerWeek: number;
  department: string;
  teacherName?: string;
  applicableGrades: number[]; // [10, 11, 12]
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentNameKhmer: string;
  studentCode: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentNameKhmer: string;
  studentCode: string;
  classId: string;
  subjectId: string;
  subjectName: string;
  academicYear: string;
  semester: 'SEMESTER_1' | 'SEMESTER_2';
  homeworkScore: number; // Max 20
  quizScore: number; // Max 20
  midtermScore: number; // Max 30
  finalScore: number; // Max 30
  totalScore: number; // Max 100
  average: number;
  gradeLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  remarks?: string;
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: number; // 1 = Monday, ..., 6 = Saturday
  period: number; // 1 to 8
  startTime: string;
  endTime: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  color: string; // Tailwind color class or hex
}

export interface ExamModel {
  id: string;
  titleKhmer: string;
  titleEnglish: string;
  examType: 'MIDTERM' | 'FINAL' | 'MONTHLY' | 'NATIONAL_PREP';
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  room: string;
  totalMarks: number;
  passMarks: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface DocumentModel {
  id: string;
  title: string;
  category: 'CURRICULUM' | 'REGULATION' | 'EXAM_PAPER' | 'LESSON_PLAN' | 'FORM' | 'POLICY' | 'WORKSHEET' | 'ADMINISTRATIVE';
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'WORD' | 'EXCEL' | string;
  fileSize: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
  // Google Drive integration attributes
  isStoredInDrive?: boolean;
  driveFileId?: string;
  driveWebViewLink?: string;
  driveDownloadUrl?: string;
  driveIconLink?: string;
  driveFolderId?: string;
  driveFolderName?: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string | number;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  parents?: string[];
}

export interface GoogleDriveUser {
  displayName?: string;
  emailAddress?: string;
  photoLink?: string;
  storageQuota?: {
    limit?: string;
    usage?: string;
    usageInDrive?: string;
  };
}

export interface NotificationModel {
  id: string;
  title: string;
  message: string;
  type: 'SYSTEM' | 'ATTENDANCE' | 'EXAM' | 'ANNOUNCEMENT';
  createdAt: string;
  read: boolean;
  targetRole?: Role | 'ALL';
  priority?: 'HIGH' | 'NORMAL' | 'LOW';
}

export interface ActivityItem {
  id: string;
  action: string;
  target: string;
  userName: string;
  timeAgo: string;
  type: 'STUDENT' | 'GRADE' | 'ATTENDANCE' | 'SYSTEM' | 'EXAM';
}
