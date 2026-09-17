import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { STUDENT_FIELDS_CONFIG, normalizeStudentData } from '../../lib/studentUtils';
import { StudentImportModal } from '../students/StudentImportModal';
import { ProfilePhotoUploader } from '../common/ProfilePhotoUploader';
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertCircle,
  FileSpreadsheet,
  Calendar,
  Phone,
  BookOpen,
  DollarSign,
  Clock,
  Sparkles,
  Cloud,
  RefreshCw
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    clearAllStudents,
    backupStudentsToDrive,
    language,
    showToast
  } = useApp();
  const isKm = language === 'km';
  const [isBackingUpDrive, setIsBackingUpDrive] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form State adhering strictly to the 16 fields
  const [formData, setFormData] = useState<Partial<Student>>({
    khmer_name: '',
    english_name: '',
    sex: 'ប្រុស',
    age: '17',
    grade: classes[0]?.name || 'ថ្នាក់ទី១២ ក',
    date_of_birth: '2008-01-01',
    rlc: '',
    phone_number: '',
    contributions: '$50',
    remark: 'សិស្សពូកែ',
    orther: '',
    books: 'បានទទួលរួច',
    time_study: '7:00 - 11:00 AM',
    status: 'កំពុងសិក្សា',
    semester: 'ឆមាសទី១',
    payment_by: 'ABA Bank',
    avatarUrl: ''
  });

  // Filtered students
  const filteredStudents = students.filter(s => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q ||
      (s.khmer_name && s.khmer_name.toLowerCase().includes(q)) ||
      (s.nameKhmer && s.nameKhmer.toLowerCase().includes(q)) ||
      (s.english_name && s.english_name.toLowerCase().includes(q)) ||
      (s.nameEnglish && s.nameEnglish.toLowerCase().includes(q)) ||
      (s.rlc && s.rlc.toLowerCase().includes(q)) ||
      (s.studentCode && s.studentCode.toLowerCase().includes(q)) ||
      (s.grade && s.grade.toLowerCase().includes(q)) ||
      (s.className && s.className.toLowerCase().includes(q)) ||
      (s.phone_number && s.phone_number.includes(q)) ||
      (s.phone && s.phone.includes(q)) ||
      (s.remark && s.remark.toLowerCase().includes(q)) ||
      (s.orther && s.orther.toLowerCase().includes(q)) ||
      (s.payment_by && s.payment_by.toLowerCase().includes(q));

    const sGrade = s.grade || s.className || '';
    const matchesGrade = selectedGrade === 'ALL' || sGrade === selectedGrade || s.classId === selectedGrade;
    const sStatus = s.status || 'កំពុងសិក្សា';
    const matchesStatus = selectedStatus === 'ALL' || sStatus === selectedStatus;

    return matchesSearch && matchesGrade && matchesStatus;
  });

  // Unique grades list for filter dropdown
  const uniqueGrades = Array.from(new Set([
    ...classes.map(c => c.name),
    ...students.map(s => s.grade || s.className).filter(Boolean)
  ]));

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handlers
  const openCreateModal = () => {
    const currentYear = new Date().getFullYear();
    const nextSeq = (students.length + 1).toString().padStart(3, '0');
    setFormData({
      khmer_name: '',
      english_name: '',
      sex: 'ប្រុស',
      age: '17',
      grade: classes[0]?.name || 'ថ្នាក់ទី១២ ក',
      date_of_birth: '2008-05-15',
      rlc: `RLC-${currentYear}-${nextSeq}`,
      phone_number: '012 888 999',
      contributions: '$50',
      remark: 'សិស្សពូកែ',
      orther: '',
      books: 'បានទទួលរួច',
      time_study: '7:00 - 11:00 AM',
      status: 'កំពុងសិក្សា',
      semester: 'ឆមាសទី១',
      payment_by: 'ABA Bank',
      avatarUrl: ''
    });
    setShowAddModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.khmer_name && !formData.nameKhmer) {
      showToast(isKm ? 'សូមបញ្ចូលឈ្មោះខ្មែរ (khmer_name)' : 'khmer_name is required', 'error');
      return;
    }
    const studentData = normalizeStudentData(formData, students.length + 1);
    await addStudent(studentData);
    setShowAddModal(false);
    showToast(isKm ? 'បានចុះឈ្មោះសិស្សថ្មីជោគជ័យ' : 'Student added successfully');
  };

  const openEditModal = (s: Student) => {
    setSelectedStudent(s);
    setFormData({
      ...s,
      khmer_name: s.khmer_name || s.nameKhmer || '',
      english_name: s.english_name || s.nameEnglish || '',
      sex: s.sex || (s.gender === 'FEMALE' ? 'ស្រី' : 'ប្រុស'),
      age: s.age || '17',
      grade: s.grade || s.className || '',
      date_of_birth: s.date_of_birth || s.dob || '2008-01-01',
      rlc: s.rlc || s.studentCode || '',
      phone_number: s.phone_number || s.phone || '',
      contributions: s.contributions || '',
      remark: s.remark || '',
      orther: s.orther || '',
      books: s.books || 'បានទទួលរួច',
      time_study: s.time_study || '7:00 - 11:00 AM',
      status: s.status || 'កំពុងសិក្សា',
      semester: s.semester || 'ឆមាសទី១',
      payment_by: s.payment_by || 'ABA Bank',
      avatarUrl: s.avatarUrl || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    const studentData = normalizeStudentData({ ...selectedStudent, ...formData }, 1);
    await updateStudent(selectedStudent.id, studentData);
    setShowEditModal(false);
    setSelectedStudent(null);
    showToast(isKm ? 'បានកែប្រែទិន្នន័យសិស្សជោគជ័យ' : 'Student updated successfully');
  };

  const openDeleteModal = (s: Student) => {
    setSelectedStudent(s);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;
    await deleteStudent(selectedStudent.id);
    setShowDeleteModal(false);
    setSelectedStudent(null);
    showToast(isKm ? 'បានលុបទិន្នន័យសិស្សជោគជ័យ' : 'Student deleted successfully');
  };

  const openViewModal = (s: Student) => {
    setSelectedStudent(s);
    setShowViewModal(true);
  };

  // Export CSV with exact 16 field names
  const handleExportCSV = () => {
    const headers = [
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
    ];

    const rows = filteredStudents.map(s => [
      `"${s.khmer_name || s.nameKhmer || ''}"`,
      `"${s.english_name || s.nameEnglish || ''}"`,
      `"${s.sex || (s.gender === 'FEMALE' ? 'ស្រី' : 'ប្រុស')}"`,
      `"${s.age || ''}"`,
      `"${s.grade || s.className || ''}"`,
      `"${s.date_of_birth || s.dob || ''}"`,
      `"${s.rlc || s.studentCode || ''}"`,
      `"${s.phone_number || s.phone || ''}"`,
      `"${s.contributions || ''}"`,
      `"${s.remark || ''}"`,
      `"${s.orther || ''}"`,
      `"${s.books || ''}"`,
      `"${s.time_study || ''}"`,
      `"${s.status || 'កំពុងសិក្សា'}"`,
      `"${s.semester || 'ឆមាសទី១'}"`,
      `"${s.payment_by || 'ABA Bank'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KrouDigital_Students_16Fields_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isKm ? 'បានទាញយកទិន្នន័យជាឯកសារ CSV (16 Fields) ជោគជ័យ' : 'CSV exported successfully');
  };

  // Export Excel (.xlsx) with exact 16 field names
  const handleExportExcel = () => {
    const headers = [
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
    ];

    const dataRows = filteredStudents.map(s => [
      s.khmer_name || s.nameKhmer || '',
      s.english_name || s.nameEnglish || '',
      s.sex || (s.gender === 'FEMALE' ? 'ស្រី' : 'ប្រុស'),
      s.age || '',
      s.grade || s.className || '',
      s.date_of_birth || s.dob || '',
      s.rlc || s.studentCode || '',
      s.phone_number || s.phone || '',
      s.contributions || '',
      s.remark || '',
      s.orther || '',
      s.books || '',
      s.time_study || '',
      s.status || 'កំពុងសិក្សា',
      s.semester || 'ឆមាសទី១',
      s.payment_by || 'ABA Bank'
    ]);

    const aoa = [headers, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ការគ្រប់គ្រងព័ត៌មានសិស្ស');
    XLSX.writeFile(wb, `KrouDigital_Students_16Fields_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast(isKm ? 'បានទាញយកទិន្នន័យជាឯកសារ Excel (16 Fields) ជោគជ័យ' : 'Excel (.xlsx) exported successfully');
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'ការគ្រប់គ្រងព័ត៌មានសិស្ស' : 'Student Information Management'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm
              ? 'គ្រប់គ្រងទិន្នន័យសិស្សានុសិស្សតាមរចនាសម្ព័ន្ធ ១៦ វាល (khmer_name, english_name, sex, age, grade, date_of_birth, rlc, phone_number, contributions, remark, orther, books, time_study, status, semester, payment_by)'
              : 'Student information management structured by the 16 standard fields'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {students.length > 0 && (
            <button
              id="clear-all-students-btn"
              onClick={() => setShowClearAllModal(true)}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
              title={isKm ? 'សម្អាតទិន្នន័យសិស្សទាំងអស់' : 'Clear all students'}
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>{isKm ? 'សម្អាតទាំងអស់' : 'Clear All'}</span>
            </button>
          )}

          <button
            id="export-students-csv-btn"
            onClick={handleExportCSV}
            disabled={students.length === 0}
            className="px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>CSV</span>
          </button>

          <button
            id="export-students-excel-btn"
            onClick={handleExportExcel}
            disabled={students.length === 0}
            className="px-3 py-2 bg-white hover:bg-emerald-50 disabled:opacity-40 text-emerald-800 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Excel</span>
          </button>

          <button
            id="backup-students-drive-btn"
            onClick={async () => {
              setIsBackingUpDrive(true);
              try {
                const doc = await backupStudentsToDrive();
                if (doc) {
                  showToast(
                    isKm
                      ? 'បានបម្រុងទុកទិន្នន័យសិស្សទាំង ១៦ វាល ទៅកាន់ Google Drive ដោយជោគជ័យ'
                      : '16-field student data backed up to Google Drive'
                  );
                }
              } finally {
                setIsBackingUpDrive(false);
              }
            }}
            disabled={students.length === 0 || isBackingUpDrive}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-700 text-xs font-semibold rounded-xl border border-blue-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            title={isKm ? 'បម្រុងទុកទិន្នន័យ ១៦ វាល ទៅ Google Drive' : 'Backup 16 fields to Google Drive'}
          >
            {isBackingUpDrive ? (
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            ) : (
              <Cloud className="w-4 h-4 text-blue-600" />
            )}
            <span>Google Drive</span>
          </button>

          <button
            id="import-students-btn"
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{isKm ? 'នាំចូល (CSV / Excel)' : 'Import (CSV / Excel)'}</span>
          </button>

          <button
            id="add-student-modal-btn"
            onClick={openCreateModal}
            className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isKm ? 'បន្ថែមសិស្សថ្មី' : 'Add Student'}</span>
          </button>
        </div>
      </div>

      {/* 16-Field Schema Banner matching user specification */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200/80 rounded-2xl p-3 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-200 text-amber-900 rounded-md font-bold text-xs">
              <FileSpreadsheet className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-extrabold text-amber-950">
                {isKm ? 'រចនាសម្ព័ន្ធទិន្នន័យ ១៦ វាល' : '16 Standard Fields Schema'}
              </span>
              <span className="text-[11px] text-amber-800 ml-2 hidden sm:inline">
                ({isKm ? 'ត្រូវគ្នានឹងតារាង Excel គំរូ' : 'Matched with Excel table format'})
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono text-amber-900">
            {STUDENT_FIELDS_CONFIG.map(f => (
              <span key={f.key} className="px-1.5 py-0.5 bg-amber-100/90 border border-amber-300/60 rounded text-amber-900 font-semibold" title={`${f.labelKm} (${f.labelEn})`}>
                {f.key}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Zero State if empty */}
      {students.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-100 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-slate-800">
              {isKm ? 'មិនទាន់មានទិន្នន័យសិស្សនៅឡើយទេ' : 'No Students Available'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {isKm 
                ? 'លោកអ្នកអាចចាប់ផ្តើមដោយនាំចូលបញ្ជីសិស្សតាមរយៈឯកសារ CSV ឬ Excel (16 វាល) ឬចុចបន្ថែមសិស្សថ្មីម្តងមួយៗ។' 
                : 'You can start by importing your student list using the 16-field CSV or Excel template, or add students individually.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{isKm ? 'នាំចូលទិន្នន័យ (CSV / Excel)' : 'Import Students (CSV / Excel)'}</span>
            </button>
            <button
              onClick={openCreateModal}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-600" />
              <span>{isKm ? 'បន្ថែមសិស្សថ្មី' : 'Add Student'}</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="student-table-search"
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder={isKm ? 'ស្វែងរកតាម khmer_name, english_name, rlc, grade, phone, remark...' : 'Search khmer_name, english_name, rlc, grade, phone...'}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Grade filter */}
              <select
                id="grade-filter-select"
                value={selectedGrade}
                onChange={(e) => { setSelectedGrade(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-700"
              >
                <option value="ALL">{isKm ? 'ថ្នាក់ទាំងអស់ (grade)' : 'All Grades'}</option>
                {uniqueGrades.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>

              {/* Status filter */}
              <select
                id="status-filter-select"
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-700"
              >
                <option value="ALL">{isKm ? 'ស្ថានភាពទាំងអស់ (status)' : 'All Status'}</option>
                <option value="កំពុងសិក្សា">{isKm ? 'កំពុងសិក្សា (Active)' : 'Active'}</option>
                <option value="ព្យួរការសិក្សា">{isKm ? 'ព្យួរការសិក្សា (Suspended)' : 'Suspended'}</option>
                <option value="បានបញ្ចប់ការសិក្សា">{isKm ? 'បានបញ្ចប់ការសិក្សា (Graduated)' : 'Graduated'}</option>
              </select>
            </div>
          </div>

          {/* Students Data Table with all 16 Fields */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-200">
                    <th className="py-2.5 px-3 text-center w-10">#</th>
                    <th className="py-2.5 px-3 font-mono">khmer_name</th>
                    <th className="py-2.5 px-3 font-mono">english_name</th>
                    <th className="py-2.5 px-3 font-mono text-center">sex</th>
                    <th className="py-2.5 px-3 font-mono text-center">age</th>
                    <th className="py-2.5 px-3 font-mono">grade</th>
                    <th className="py-2.5 px-3 font-mono">date_of_birth</th>
                    <th className="py-2.5 px-3 font-mono">rlc</th>
                    <th className="py-2.5 px-3 font-mono">phone_number</th>
                    <th className="py-2.5 px-3 font-mono">contributions</th>
                    <th className="py-2.5 px-3 font-mono">remark</th>
                    <th className="py-2.5 px-3 font-mono">orther</th>
                    <th className="py-2.5 px-3 font-mono">books</th>
                    <th className="py-2.5 px-3 font-mono">time_study</th>
                    <th className="py-2.5 px-3 font-mono">status</th>
                    <th className="py-2.5 px-3 font-mono">semester</th>
                    <th className="py-2.5 px-3 font-mono">payment_by</th>
                    <th className="py-2.5 px-3 text-center sticky right-0 bg-amber-100 shadow-l">{isKm ? 'សកម្មភាព' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal">
                  {paginatedStudents.length > 0 ? (
                    paginatedStudents.map((student, idx) => {
                      const rowNum = (currentPage - 1) * pageSize + idx + 1;
                      const khmerName = student.khmer_name || student.nameKhmer || '';
                      const englishName = student.english_name || student.nameEnglish || '';
                      const sex = student.sex || (student.gender === 'FEMALE' ? 'ស្រី' : 'ប្រុស');
                      const age = student.age || '-';
                      const grade = student.grade || student.className || '';
                      const dob = student.date_of_birth || student.dob || '';
                      const rlc = student.rlc || student.studentCode || '';
                      const phone = student.phone_number || student.phone || '';
                      const contributions = student.contributions || '';
                      const remark = student.remark || '';
                      const orther = student.orther || '';
                      const books = student.books || '';
                      const timeStudy = student.time_study || '';
                      const status = student.status || 'កំពុងសិក្សា';
                      const semester = student.semester || 'ឆមាសទី១';
                      const paymentBy = student.payment_by || 'ABA Bank';

                      return (
                        <tr key={student.id} className="hover:bg-cyan-50/30 transition">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{rowNum}</td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              {student.avatarUrl ? (
                                <img
                                  src={student.avatarUrl}
                                  alt=""
                                  className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                />
                              ) : (
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-1 ring-slate-200 shrink-0 ${
                                  sex === 'ស្រី' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {khmerName.charAt(0) || 'ស'}
                                </div>
                              )}
                              <span className="font-bold text-slate-900">{khmerName}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-700">{englishName}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              sex === 'ស្រី' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {sex}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-700">{age}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{grade}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{dob}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-cyan-800">{rlc}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{phone || '-'}</td>
                          <td className="py-2.5 px-3 font-semibold text-emerald-700">{contributions || '-'}</td>
                          <td className="py-2.5 px-3 text-slate-600 max-w-[150px] truncate" title={remark}>{remark || '-'}</td>
                          <td className="py-2.5 px-3 text-slate-500 max-w-[120px] truncate" title={orther}>{orther || '-'}</td>
                          <td className="py-2.5 px-3 text-slate-700">{books || '-'}</td>
                          <td className="py-2.5 px-3 text-slate-700">{timeStudy || '-'}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">{semester}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{paymentBy}</td>
                          <td className="py-2.5 px-3 sticky right-0 bg-white/95 backdrop-blur-xs border-l border-slate-100">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => openViewModal(student)}
                                className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition cursor-pointer"
                                title={isKm ? 'មើលព័ត៌មានលម្អិត' : 'View Details'}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openEditModal(student)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title={isKm ? 'កែប្រែ' : 'Edit'}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(student)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title={isKm ? 'លុប' : 'Delete'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={18} className="py-8 text-center text-slate-400">
                        {isKm ? 'រកមិនឃើញទិន្នន័យសិស្សតាមការស្វែងរកឡើយ' : 'No students found matching your criteria'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination bar */}
            <div className="p-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                {isKm 
                  ? `បង្ហាញ ${(currentPage - 1) * pageSize + 1} ដល់ ${Math.min(currentPage * pageSize, filteredStudents.length)} នៃ ${filteredStudents.length} សិស្ស` 
                  : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filteredStudents.length)} of ${filteredStudents.length}`}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 font-semibold text-slate-700">{currentPage} / {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CREATE STUDENT MODAL (16 Fields) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 space-y-4 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'ចុះឈ្មោះសិស្សថ្មី (១៦ វាល)' : 'Add New Student (16 Fields)'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              {/* Profile Photo Uploader */}
              <ProfilePhotoUploader
                currentPhotoUrl={formData.avatarUrl}
                name={formData.khmer_name || formData.english_name}
                gender={formData.sex === 'ស្រី' ? 'FEMALE' : 'MALE'}
                onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                isKm={isKm}
              />

              {/* Section 1: Basic Identity */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>១. ព័ត៌មានអត្តសញ្ញាណ (Identity)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ឈ្មោះខ្មែរ' : 'Khmer Name'} <span className="text-rose-500">*</span>
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">khmer_name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.khmer_name || ''}
                      onChange={(e) => setFormData({ ...formData, khmer_name: e.target.value })}
                      placeholder="ឧ. ចាន់ សុខុម"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ឈ្មោះឡាតាំង' : 'English Name'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">english_name</span>
                    </label>
                    <input
                      type="text"
                      value={formData.english_name || ''}
                      onChange={(e) => setFormData({ ...formData, english_name: e.target.value })}
                      placeholder="Chan Sokhum"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ភេទ' : 'Gender'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">sex</span>
                    </label>
                    <select
                      value={formData.sex || 'ប្រុស'}
                      onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    >
                      <option value="ប្រុស">{isKm ? 'ប្រុស (Male)' : 'Male'}</option>
                      <option value="ស្រី">{isKm ? 'ស្រី (Female)' : 'Female'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'អាយុ' : 'Age'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">age</span>
                    </label>
                    <input
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="17"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ថ្ងៃខែឆ្នាំកំណើត' : 'DOB'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">date_of_birth</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth || ''}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Academic & Placement */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>២. ព័ត៌មានសិក្សា និងថ្នាក់ (Academic)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ថ្នាក់រៀន' : 'Grade / Class'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">grade</span>
                    </label>
                    <input
                      type="text"
                      value={formData.grade || ''}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="ថ្នាក់ទី១២ ក"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'កូដសិស្ស RLC' : 'RLC Code'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">rlc</span>
                    </label>
                    <input
                      type="text"
                      value={formData.rlc || ''}
                      onChange={(e) => setFormData({ ...formData, rlc: e.target.value })}
                      placeholder="RLC-001"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ម៉ោងសិក្សា' : 'Study Time'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">time_study</span>
                    </label>
                    <input
                      type="text"
                      value={formData.time_study || ''}
                      onChange={(e) => setFormData({ ...formData, time_study: e.target.value })}
                      placeholder="7:00 - 11:00 AM"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ឆមាស' : 'Semester'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">semester</span>
                    </label>
                    <input
                      type="text"
                      value={formData.semester || ''}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      placeholder="ឆមាសទី១"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Contact & Financial */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>៣. ទំនាក់ទំនង និងការទូទាត់ (Financial & Contact)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">phone_number</span>
                    </label>
                    <input
                      type="text"
                      value={formData.phone_number || ''}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      placeholder="012 345 678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'វិភាគទាន' : 'Contributions'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">contributions</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contributions || ''}
                      onChange={(e) => setFormData({ ...formData, contributions: e.target.value })}
                      placeholder="$50"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'បង់ប្រាក់តាម' : 'Payment Method'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">payment_by</span>
                    </label>
                    <input
                      type="text"
                      value={formData.payment_by || ''}
                      onChange={(e) => setFormData({ ...formData, payment_by: e.target.value })}
                      placeholder="ABA Bank / ACLEDA / Cash"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'សៀវភៅ' : 'Books'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">books</span>
                    </label>
                    <input
                      type="text"
                      value={formData.books || ''}
                      onChange={(e) => setFormData({ ...formData, books: e.target.value })}
                      placeholder="បានទទួលរួច"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Remarks & Status */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-cyan-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>៤. ចំណាំ និងស្ថានភាព (Remarks & Status)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ស្ថានភាព' : 'Status'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">status</span>
                    </label>
                    <select
                      value={formData.status || 'កំពុងសិក្សា'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    >
                      <option value="កំពុងសិក្សា">{isKm ? 'កំពុងសិក្សា (Active)' : 'Active'}</option>
                      <option value="ព្យួរការសិក្សា">{isKm ? 'ព្យួរការសិក្សា (Suspended)' : 'Suspended'}</option>
                      <option value="បានបញ្ចប់ការសិក្សា">{isKm ? 'បានបញ្ចប់ការសិក្សា (Graduated)' : 'Graduated'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ចំណាំ' : 'Remark'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">remark</span>
                    </label>
                    <input
                      type="text"
                      value={formData.remark || ''}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                      placeholder="សិស្សពូកែ"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ផ្សេងៗ' : 'Other'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">orther</span>
                    </label>
                    <input
                      type="text"
                      value={formData.orther || ''}
                      onChange={(e) => setFormData({ ...formData, orther: e.target.value })}
                      placeholder="ព័ត៌មានបន្ថែម"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  {isKm ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md shadow-cyan-600/20 cursor-pointer"
                >
                  {isKm ? 'រក្សាទុកសិស្ស' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL (16 Fields) */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 space-y-4 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <span>{isKm ? 'កែប្រែព័ត៌មានសិស្ស (១៦ វាល)' : 'Edit Student Details (16 Fields)'}</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              {/* Profile Photo Uploader */}
              <ProfilePhotoUploader
                currentPhotoUrl={formData.avatarUrl}
                name={formData.khmer_name || formData.english_name}
                gender={formData.sex === 'ស្រី' ? 'FEMALE' : 'MALE'}
                onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                isKm={isKm}
              />

              {/* Section 1: Basic Identity */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>១. ព័ត៌មានអត្តសញ្ញាណ (Identity)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ឈ្មោះខ្មែរ' : 'Khmer Name'} <span className="text-rose-500">*</span>
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">khmer_name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.khmer_name || ''}
                      onChange={(e) => setFormData({ ...formData, khmer_name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ឈ្មោះឡាតាំង' : 'English Name'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">english_name</span>
                    </label>
                    <input
                      type="text"
                      value={formData.english_name || ''}
                      onChange={(e) => setFormData({ ...formData, english_name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ភេទ' : 'Gender'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">sex</span>
                    </label>
                    <select
                      value={formData.sex || 'ប្រុស'}
                      onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="ប្រុស">{isKm ? 'ប្រុស' : 'Male'}</option>
                      <option value="ស្រី">{isKm ? 'ស្រី' : 'Female'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'អាយុ' : 'Age'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">age</span>
                    </label>
                    <input
                      type="number"
                      value={formData.age || ''}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ថ្ងៃខែឆ្នាំកំណើត' : 'DOB'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">date_of_birth</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth || ''}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Academic & Placement */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>២. ព័ត៌មានសិក្សា និងថ្នាក់ (Academic)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ថ្នាក់រៀន' : 'Grade / Class'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">grade</span>
                    </label>
                    <input
                      type="text"
                      value={formData.grade || ''}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'កូដសិស្ស RLC' : 'RLC Code'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">rlc</span>
                    </label>
                    <input
                      type="text"
                      value={formData.rlc || ''}
                      onChange={(e) => setFormData({ ...formData, rlc: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ម៉ោងសិក្សា' : 'Study Time'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">time_study</span>
                    </label>
                    <input
                      type="text"
                      value={formData.time_study || ''}
                      onChange={(e) => setFormData({ ...formData, time_study: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ឆមាស' : 'Semester'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">semester</span>
                    </label>
                    <input
                      type="text"
                      value={formData.semester || ''}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Contact & Financial */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>៣. ទំនាក់ទំនង និងការទូទាត់ (Financial & Contact)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'លេខទូរស័ព្ទ' : 'Phone Number'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">phone_number</span>
                    </label>
                    <input
                      type="text"
                      value={formData.phone_number || ''}
                      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'វិភាគទាន' : 'Contributions'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">contributions</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contributions || ''}
                      onChange={(e) => setFormData({ ...formData, contributions: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'បង់ប្រាក់តាម' : 'Payment Method'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">payment_by</span>
                    </label>
                    <input
                      type="text"
                      value={formData.payment_by || ''}
                      onChange={(e) => setFormData({ ...formData, payment_by: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'សៀវភៅ' : 'Books'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">books</span>
                    </label>
                    <input
                      type="text"
                      value={formData.books || ''}
                      onChange={(e) => setFormData({ ...formData, books: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Remarks & Status */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>៤. ចំណាំ និងស្ថានភាព (Remarks & Status)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ស្ថានភាព' : 'Status'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">status</span>
                    </label>
                    <select
                      value={formData.status || 'កំពុងសិក្សា'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <option value="កំពុងសិក្សា">{isKm ? 'កំពុងសិក្សា' : 'Active'}</option>
                      <option value="ព្យួរការសិក្សា">{isKm ? 'ព្យួរការសិក្សា' : 'Suspended'}</option>
                      <option value="បានបញ្ចប់ការសិក្សា">{isKm ? 'បានបញ្ចប់ការសិក្សា' : 'Graduated'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ចំណាំ' : 'Remark'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">remark</span>
                    </label>
                    <input
                      type="text"
                      value={formData.remark || ''}
                      onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {isKm ? 'ផ្សេងៗ' : 'Other'}
                      <span className="ml-1 text-[10px] font-mono text-amber-800 bg-amber-100 px-1 py-0.2 rounded">orther</span>
                    </label>
                    <input
                      type="text"
                      value={formData.orther || ''}
                      onChange={(e) => setFormData({ ...formData, orther: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  {isKm ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  {isKm ? 'រក្សាទុកការកែប្រែ' : 'Update Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW STUDENT PROFILE DETAIL MODAL (Displays all 16 Fields) */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 space-y-4 my-auto max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'ប្រវត្តិរូបសិស្ស (១៦ វាល)' : 'Student Dossier (16 Fields)'}</span>
              </h3>
              <button onClick={() => setShowViewModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Header Card */}
            <div className="flex items-center gap-3.5 bg-gradient-to-r from-amber-50 to-cyan-50/50 p-4 rounded-2xl border border-amber-200/60 shrink-0">
              {selectedStudent.avatarUrl ? (
                <img
                  src={selectedStudent.avatarUrl}
                  alt={selectedStudent.khmer_name || selectedStudent.nameKhmer}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-sm shrink-0"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              ) : (
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl ring-4 ring-white shadow-sm shrink-0 ${
                  (selectedStudent.sex === 'ស្រី' || selectedStudent.gender === 'FEMALE') ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {(selectedStudent.khmer_name || selectedStudent.nameKhmer || 'ស').charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-slate-900">{selectedStudent.khmer_name || selectedStudent.nameKhmer}</div>
                <div className="text-xs text-slate-500">{selectedStudent.english_name || selectedStudent.nameEnglish} • {selectedStudent.rlc || selectedStudent.studentCode}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-600 text-white">
                    {selectedStudent.grade || selectedStudent.className}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {selectedStudent.status || 'កំពុងសិក្សា'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  openEditModal(selectedStudent);
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-blue-600 border border-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isKm ? 'កែប្រែ' : 'Edit'}</span>
              </button>
            </div>

            {/* 16 Fields Grid Display */}
            <div className="overflow-y-auto pr-1 space-y-2 flex-1 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">khmer_name</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedStudent.khmer_name || selectedStudent.nameKhmer || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">english_name</span>
                  <span className="font-medium text-slate-800 text-xs">{selectedStudent.english_name || selectedStudent.nameEnglish || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">sex</span>
                  <span className="font-semibold text-slate-800 text-xs">{selectedStudent.sex || (selectedStudent.gender === 'FEMALE' ? 'ស្រី' : 'ប្រុស')}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">age</span>
                  <span className="font-mono font-semibold text-slate-800 text-xs">{selectedStudent.age || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">grade</span>
                  <span className="font-semibold text-slate-800 text-xs">{selectedStudent.grade || selectedStudent.className || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">date_of_birth</span>
                  <span className="font-mono text-slate-800 text-xs">{selectedStudent.date_of_birth || selectedStudent.dob || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">rlc</span>
                  <span className="font-mono font-bold text-cyan-800 text-xs">{selectedStudent.rlc || selectedStudent.studentCode || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">phone_number</span>
                  <span className="font-mono text-slate-800 text-xs">{selectedStudent.phone_number || selectedStudent.phone || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">contributions</span>
                  <span className="font-semibold text-emerald-700 text-xs">{selectedStudent.contributions || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">remark</span>
                  <span className="text-slate-800 text-xs">{selectedStudent.remark || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">orther</span>
                  <span className="text-slate-600 text-xs">{selectedStudent.orther || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">books</span>
                  <span className="text-slate-800 text-xs">{selectedStudent.books || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">time_study</span>
                  <span className="text-slate-800 text-xs">{selectedStudent.time_study || '-'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">status</span>
                  <span className="font-semibold text-emerald-700 text-xs">{selectedStudent.status || 'កំពុងសិក្សា'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-mono text-amber-800 block">semester</span>
                  <span className="text-slate-800 text-xs">{selectedStudent.semester || 'ឆមាសទី១'}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-mono text-amber-800 block">payment_by</span>
                  <span className="font-medium text-slate-800 text-xs">{selectedStudent.payment_by || 'ABA Bank'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 shrink-0">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isKm ? 'បិទ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isKm ? 'តើអ្នកប្រាកដជាចង់លុបទិន្នន័យសិស្សនេះ?' : 'Are you sure you want to delete this student?'}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedStudent.khmer_name || selectedStudent.nameKhmer} ({selectedStudent.rlc || selectedStudent.studentCode})
            </p>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {isKm ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/20 cursor-pointer"
              >
                {isKm ? 'យល់ព្រមលុប' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAR ALL CONFIRMATION DIALOG */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isKm ? 'តើអ្នកប្រាកដជាចង់សម្អាតទិន្នន័យសិស្សទាំងអស់?' : 'Clear All Student Data?'}
            </h3>
            <p className="text-xs text-slate-500">
              {isKm 
                ? `ទិន្នន័យសិស្សទាំងអស់ចំនួន ${students.length} នាក់ នឹងត្រូវបានលុបចេញពីប្រព័ន្ធ។`
                : `All ${students.length} students will be deleted from the system.`}
            </p>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setShowClearAllModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {isKm ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                onClick={async () => {
                  await clearAllStudents();
                  setShowClearAllModal(false);
                }}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/20 cursor-pointer"
              >
                {isKm ? 'យល់ព្រមសម្អាត' : 'Yes, Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV / EXCEL IMPORT MODAL (16 Fields) */}
      <StudentImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          setCurrentPage(1);
        }}
      />
    </div>
  );
};
