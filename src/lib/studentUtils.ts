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

function cleanKey(str: string): string {
  return str.toString().trim().toLowerCase().replace(/[\s_\-"'()[\]{}#]/g, '');
}

export function parseDateValue(val: any): string {
  if (val === undefined || val === null || val === '') return '2008-01-01';
  if (val instanceof Date) {
    if (!isNaN(val.getTime())) {
      return val.toISOString().split('T')[0];
    }
  }
  if (typeof val === 'number') {
    // Excel serial date number conversion (1900 date system)
    if (val > 1000 && val < 60000) {
      const d = new Date(Math.round((val - 25569) * 86400 * 1000));
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
    }
  }
  const str = String(val).trim();
  // Check DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const ddmmyyyy = str.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/);
  if (ddmmyyyy) {
    const day = ddmmyyyy[1].padStart(2, '0');
    const month = ddmmyyyy[2].padStart(2, '0');
    const year = ddmmyyyy[3];
    return `${year}-${month}-${day}`;
  }
  // Check YYYY/MM/DD or YYYY-MM-DD
  const yyyymmdd = str.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})/);
  if (yyyymmdd) {
    const year = yyyymmdd[1];
    const month = yyyymmdd[2].padStart(2, '0');
    const day = yyyymmdd[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return str || '2008-01-01';
}

export function parseSexValue(val: any): 'ប្រុស' | 'ស្រី' {
  if (!val) return 'ប្រុស';
  const s = String(val).trim().toLowerCase();
  if (
    s === 'ស្រី' ||
    s === 'female' ||
    s === 'f' ||
    s === 'girl' ||
    s === 'woman' ||
    s === 'ស្រី្ត' ||
    s === 'ស'
  ) {
    return 'ស្រី';
  }
  return 'ប្រុស';
}

export function isRawStudentEmpty(raw: Record<string, any>): boolean {
  if (!raw || typeof raw !== 'object') return true;
  const values = Object.values(raw);
  if (values.length === 0) return true;
  return values.every(v => v === undefined || v === null || String(v).trim() === '');
}

export function normalizeStudentData(raw: Partial<Student> & Record<string, any>, index = 1): Student {
  const currentYear = new Date().getFullYear();
  const defaultRlc = `RLC-${currentYear}-${index.toString().padStart(3, '0')}`;

  // Build a normalized lookup map of all keys in raw object
  const map: Record<string, any> = {};
  if (raw && typeof raw === 'object') {
    for (const [k, v] of Object.entries(raw)) {
      if (v !== undefined && v !== null && v !== '') {
        const cleaned = cleanKey(k);
        map[cleaned] = v;
      }
    }
  }

  // 1. Khmer Name
  const rawKhmerName =
    raw.khmer_name ||
    raw.nameKhmer ||
    map['khmername'] ||
    map['namekhmer'] ||
    map['ឈ្មោះខ្មែរ'] ||
    map['ឈ្មោះ'] ||
    map['គោត្តនាមនិងនាម'] ||
    map['គោត្តនាម-នាម'] ||
    map['គោត្តនាម'] ||
    map['ឈ្មោះសិស្ស'] ||
    map['ឈ្មោះពេញ'] ||
    map['ឈ្មោះភាសាខ្មែរ'] ||
    map['khmer'] ||
    raw.english_name ||
    raw.nameEnglish ||
    map['englishname'] ||
    map['name'] ||
    '';

  const khmer_name = (rawKhmerName || `សិស្ស #${index}`).toString().trim();

  // 2. English Name
  const rawEnglishName =
    raw.english_name ||
    raw.nameEnglish ||
    map['englishname'] ||
    map['nameenglish'] ||
    map['latinname'] ||
    map['name'] ||
    map['fullname'] ||
    map['ឈ្មោះឡាតាំង'] ||
    map['ឈ្មោះអង់គ្លេស'] ||
    map['អក្សរឡាតាំង'] ||
    map['ឈ្មោះជាភាសាអង់គ្លេស'] ||
    map['english'] ||
    '';

  const english_name = (rawEnglishName || khmer_name).toString().trim();

  // 3. Sex
  const rawSex =
    raw.sex ||
    raw.gender ||
    map['sex'] ||
    map['gender'] ||
    map['ភេទ'] ||
    map['gendersex'] ||
    '';
  const sex = parseSexValue(rawSex);

  // 4. Age
  const rawAge =
    raw.age !== undefined && raw.age !== null
      ? raw.age
      : map['age'] || map['អាយុ'] || '';
  const age = rawAge ? String(rawAge).trim() : '17';

  // 5. Grade
  const rawGrade =
    raw.grade ||
    raw.className ||
    map['grade'] ||
    map['gradelevel'] ||
    map['class'] ||
    map['classname'] ||
    map['classid'] ||
    map['ថ្នាក់'] ||
    map['ថ្នាក់រៀន'] ||
    map['កម្រិត'] ||
    map['ថ្នាក់កម្រិត'] ||
    '';
  const grade = (rawGrade || 'ថ្នាក់ទី១២ ក').toString().trim();

  // 6. Date of Birth
  const rawDob =
    raw.date_of_birth ||
    raw.dob ||
    map['dateofbirth'] ||
    map['dob'] ||
    map['birthdate'] ||
    map['ថ្ងៃខែឆ្នាំកំណើត'] ||
    map['ថ្ងៃកំណើត'] ||
    map['កាលបរិច្ឆេទកំណើត'] ||
    '';
  const date_of_birth = parseDateValue(rawDob);

  // 7. RLC (Student Code)
  const rawRlc =
    raw.rlc ||
    raw.studentCode ||
    map['rlc'] ||
    map['studentcode'] ||
    map['code'] ||
    map['id'] ||
    map['studentid'] ||
    map['អត្តលេខ'] ||
    map['កូដសិស្ស'] ||
    map['កូដ'] ||
    '';
  const rlc = (rawRlc || defaultRlc).toString().trim();

  // 8. Phone Number
  const rawPhone =
    raw.phone_number ||
    raw.phone ||
    map['phonenumber'] ||
    map['phone'] ||
    map['tel'] ||
    map['telephone'] ||
    map['mobile'] ||
    map['លេខទូរស័ព្ទ'] ||
    map['ទូរស័ព្ទ'] ||
    map['ទូរស័ព្ទសិស្ស'] ||
    '';
  const phone_number = String(rawPhone || '').trim();

  // 9. Contributions
  const rawContrib =
    raw.contributions !== undefined && raw.contributions !== null
      ? raw.contributions
      : map['contributions'] ||
        map['contribution'] ||
        map['fee'] ||
        map['tuition'] ||
        map['វិភាគទាន'] ||
        map['ការចូលរួម'] ||
        map['ថ្លៃសិក្សា'] ||
        '';
  const contributions = String(rawContrib || '').trim();

  // 10. Remark
  const rawRemark =
    raw.remark !== undefined && raw.remark !== null
      ? raw.remark
      : map['remark'] ||
        map['remarks'] ||
        map['note'] ||
        map['notes'] ||
        map['comment'] ||
        map['ចំណាំ'] ||
        map['សម្គាល់'] ||
        '';
  const remark = String(rawRemark || '').trim();

  // 11. Orther (Other)
  const rawOrther =
    raw.orther !== undefined && raw.orther !== null
      ? raw.orther
      : raw.other !== undefined && raw.other !== null
      ? raw.other
      : map['orther'] ||
        map['other'] ||
        map['others'] ||
        map['ផ្សេងៗ'] ||
        map['ផ្សេងទៀត'] ||
        map['ព័ត៌មានបន្ថែម'] ||
        '';
  const orther = String(rawOrther || '').trim();

  // 12. Books
  const rawBooks =
    raw.books !== undefined && raw.books !== null
      ? raw.books
      : map['books'] ||
        map['book'] ||
        map['textbook'] ||
        map['textbooks'] ||
        map['សៀវភៅ'] ||
        map['សៀវភៅពុម្ព'] ||
        '';
  const books = String(rawBooks || 'បានទទួលរួច').trim();

  // 13. Time Study
  const rawTimeStudy =
    raw.time_study ||
    map['timestudy'] ||
    map['studytime'] ||
    map['shift'] ||
    map['session'] ||
    map['time'] ||
    map['ម៉ោងសិក្សា'] ||
    map['វេនសិក្សា'] ||
    map['ម៉ោង'] ||
    '';
  const time_study = (rawTimeStudy || '7:00 - 11:00 AM').toString().trim();

  // 14. Status
  const rawStatus =
    raw.status ||
    map['status'] ||
    map['state'] ||
    map['ស្ថានភាព'] ||
    map['ស្ថានភាពសិក្សា'] ||
    '';
  const status = (rawStatus || 'កំពុងសិក្សា').toString().trim();

  // 15. Semester
  const rawSemester =
    raw.semester ||
    map['semester'] ||
    map['term'] ||
    map['ឆមាស'] ||
    map['វគ្គ'] ||
    '';
  const semester = (rawSemester || 'ឆមាសទី១').toString().trim();

  // 16. Payment By
  const rawPaymentBy =
    raw.payment_by ||
    map['paymentby'] ||
    map['payment'] ||
    map['method'] ||
    map['paymentmethod'] ||
    map['បង់ប្រាក់តាម'] ||
    map['ការបង់ប្រាក់'] ||
    map['វិធីបង់ប្រាក់'] ||
    map['ធនាគារ'] ||
    '';
  const payment_by = (rawPaymentBy || 'ABA Bank').toString().trim();

  // Unique ID
  const id = raw.id || `std-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`;

  return {
    id,
    // 16 Exact Schema Fields:
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
