import { Student, STUDENT_FIELD_KEYS, StudentFieldKey } from '../types';

export interface FieldConfig {
  key: StudentFieldKey;
  labelKm: string;
  labelEn: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  required?: boolean;
  width?: string;
}

export const STUDENT_FIELDS_CONFIG: FieldConfig[] = [
  { key: 'khmer_name', labelKm: 'ឈ្មោះខ្មែរ', labelEn: 'Khmer Name', placeholder: 'កែវ វិបុល', required: true, width: 'min-w-[140px]' },
  { key: 'english_name', labelKm: 'ឈ្មោះឡាតាំង', labelEn: 'English Name', placeholder: 'Keo Vibol', required: true, width: 'min-w-[140px]' },
  { key: 'sex', labelKm: 'ភេទ', labelEn: 'Sex', type: 'select', options: ['ប្រុស', 'ស្រី'], required: true, width: 'min-w-[80px]' },
  { key: 'age', labelKm: 'អាយុ', labelEn: 'Age', type: 'number', placeholder: '17', width: 'min-w-[70px]' },
  { key: 'grade', labelKm: 'ថ្នាក់/កម្រិត', labelEn: 'Grade', placeholder: 'ថ្នាក់ទី១២ ក', width: 'min-w-[120px]' },
  { key: 'date_of_birth', labelKm: 'ថ្ងៃខែឆ្នាំកំណើត', labelEn: 'Date of Birth', type: 'date', placeholder: '2008-01-15', width: 'min-w-[120px]' },
  { key: 'rlc', labelKm: 'RLC', labelEn: 'RLC Code', placeholder: 'RLC-001', width: 'min-w-[100px]' },
  { key: 'phone_number', labelKm: 'លេខទូរស័ព្ទ', labelEn: 'Phone Number', placeholder: '012 345 678', width: 'min-w-[120px]' },
  { key: 'contributions', labelKm: 'ការចូលរួម/វិភាគទាន', labelEn: 'Contributions', placeholder: '$50', width: 'min-w-[110px]' },
  { key: 'remark', labelKm: 'ចំណាំ', labelEn: 'Remark', placeholder: 'សិស្សពូកែ', width: 'min-w-[110px]' },
  { key: 'orther', labelKm: 'ផ្សេងៗ', labelEn: 'Other', placeholder: 'ព័ត៌មានបន្ថែម', width: 'min-w-[110px]' },
  { key: 'books', labelKm: 'សៀវភៅ', labelEn: 'Books', placeholder: 'បានទទួលកញ្ចប់សៀវភៅ', width: 'min-w-[110px]' },
  { key: 'time_study', labelKm: 'ម៉ោងសិក្សា', labelEn: 'Study Time', placeholder: '7:00 - 11:00 AM', width: 'min-w-[120px]' },
  { key: 'status', labelKm: 'ស្ថានភាព', labelEn: 'Status', type: 'select', options: ['កំពុងសិក្សា', 'សុំច្បាប់', 'ព្យួរការសិក្សា', 'បញ្ចប់ការសិក្សា'], width: 'min-w-[110px]' },
  { key: 'semester', labelKm: 'ឆមាស', labelEn: 'Semester', type: 'select', options: ['ឆមាសទី១', 'ឆមាសទី២'], width: 'min-w-[90px]' },
  { key: 'payment_by', labelKm: 'បង់ប្រាក់តាម', labelEn: 'Payment By', placeholder: 'ABA Bank', width: 'min-w-[120px]' }
];

export function normalizeStudentData(raw: Partial<Student> & Record<string, any>, index = 1): Student {
  const currentYear = new Date().getFullYear();
  const defaultRlc = `RLC-${currentYear}-${index.toString().padStart(3, '0')}`;

  const khmer_name = (
    raw.khmer_name ||
    raw.nameKhmer ||
    raw['ឈ្មោះខ្មែរ'] ||
    raw['ឈ្មោះ'] ||
    raw['khmer name'] ||
    raw['Khmer Name'] ||
    raw['Khmer_Name'] ||
    'សិស្សថ្មី'
  ).toString().trim();

  const english_name = (
    raw.english_name ||
    raw.nameEnglish ||
    raw['ឈ្មោះឡាតាំង'] ||
    raw['ឈ្មោះអង់គ្លេស'] ||
    raw['english name'] ||
    raw['English Name'] ||
    raw['English_Name'] ||
    raw['Name'] ||
    khmer_name
  ).toString().trim();

  const rawSex = String(
    raw.sex ||
    raw.gender ||
    raw['ភេទ'] ||
    raw['Sex'] ||
    raw['Gender'] ||
    'ប្រុស'
  ).trim();

  let sex = 'ប្រុស';
  if (
    rawSex === 'ស្រី' ||
    rawSex.toUpperCase() === 'FEMALE' ||
    rawSex.toUpperCase() === 'F' ||
    rawSex.toLowerCase() === 'female'
  ) {
    sex = 'ស្រី';
  } else if (
    rawSex === 'ប្រុស' ||
    rawSex.toUpperCase() === 'MALE' ||
    rawSex.toUpperCase() === 'M' ||
    rawSex.toLowerCase() === 'male'
  ) {
    sex = 'ប្រុស';
  } else {
    sex = rawSex || 'ប្រុស';
  }

  const rawAge = raw.age !== undefined && raw.age !== null ? raw.age : raw['អាយុ'] || raw['Age'];
  const age = rawAge ? String(rawAge).trim() : '';

  const grade = (
    raw.grade ||
    raw.className ||
    raw['ថ្នាក់'] ||
    raw['ថ្នាក់/កម្រិត'] ||
    raw['ថ្នាក់រៀន'] ||
    raw['Grade'] ||
    raw['Class'] ||
    'ថ្នាក់ទី១២ ក'
  ).toString().trim();

  const date_of_birth = (
    raw.date_of_birth ||
    raw.dob ||
    raw['ថ្ងៃខែឆ្នាំកំណើត'] ||
    raw['ថ្ងៃកំណើត'] ||
    raw['Date of Birth'] ||
    raw['DOB'] ||
    '2008-01-01'
  ).toString().trim();

  const rlc = (
    raw.rlc ||
    raw.studentCode ||
    raw['RLC'] ||
    raw['អត្តលេខ'] ||
    raw['កូដសិស្ស'] ||
    raw['StudentCode'] ||
    defaultRlc
  ).toString().trim();

  const phone_number = (
    raw.phone_number ||
    raw.phone ||
    raw['លេខទូរស័ព្ទ'] ||
    raw['ទូរស័ព្ទ'] ||
    raw['Phone'] ||
    raw['Phone_Number'] ||
    ''
  ).toString().trim();

  const contributions = (
    raw.contributions !== undefined && raw.contributions !== null ? raw.contributions :
    raw['contributions'] || raw['Contributions'] || raw['ការចូលរួម'] || raw['វិភាគទាន'] || raw['ថ្លៃសិក្សា'] || ''
  ).toString().trim();

  const remark = (
    raw.remark !== undefined && raw.remark !== null ? raw.remark :
    raw['remark'] || raw['Remark'] || raw['ចំណាំ'] || ''
  ).toString().trim();

  const orther = (
    raw.orther !== undefined && raw.orther !== null ? raw.orther :
    raw.other !== undefined && raw.other !== null ? raw.other :
    raw['orther'] || raw['other'] || raw['Other'] || raw['ផ្សេងៗ'] || ''
  ).toString().trim();

  const books = (
    raw.books !== undefined && raw.books !== null ? raw.books :
    raw['books'] || raw['Books'] || raw['សៀវភៅ'] || ''
  ).toString().trim();

  const time_study = (
    raw.time_study ||
    raw['time_study'] ||
    raw['Time Study'] ||
    raw['Time_Study'] ||
    raw['ម៉ោងសិក្សា'] ||
    raw['ម៉ោង'] ||
    '7:00 - 11:00 AM'
  ).toString().trim();

  const status = (
    raw.status ||
    raw['status'] ||
    raw['Status'] ||
    raw['ស្ថានភាព'] ||
    'កំពុងសិក្សា'
  ).toString().trim();

  const semester = (
    raw.semester ||
    raw['semester'] ||
    raw['Semester'] ||
    raw['ឆមាស'] ||
    'ឆមាសទី១'
  ).toString().trim();

  const payment_by = (
    raw.payment_by ||
    raw['payment_by'] ||
    raw['Payment By'] ||
    raw['Payment_By'] ||
    raw['បង់ប្រាក់តាម'] ||
    raw['ការបង់ប្រាក់'] ||
    'ABA Bank'
  ).toString().trim();

  const id = raw.id || `std-${Date.now()}-${index}`;

  return {
    id,
    // 16 Exact Fields:
    khmer_name,
    english_name,
    sex,
    age,
    grade,
    date_of_birth,
    rlc,
    phone_number,
    contributions,
    remark,
    orther,
    books,
    time_study,
    status,
    semester,
    payment_by,

    // Aliases for compatibility
    studentCode: rlc,
    nameKhmer: khmer_name,
    nameEnglish: english_name,
    gender: sex === 'ស្រី' ? 'FEMALE' : 'MALE',
    dob: date_of_birth,
    className: grade,
    classId: raw.classId || 'cls-12a',
    phone: phone_number,
    parentName: raw.parentName || 'អាណាព្យាបាល',
    parentPhone: raw.parentPhone || phone_number,
    parentRelationship: raw.parentRelationship || 'ឪពុក/ម្តាយ',
    address: raw.address || 'រាជធានីភ្នំពេញ',
    avatarUrl: raw.avatarUrl || '',
    enrolledDate: raw.enrolledDate || new Date().toISOString().split('T')[0],
    gpa: typeof raw.gpa === 'number' ? raw.gpa : 3.85
  };
}
