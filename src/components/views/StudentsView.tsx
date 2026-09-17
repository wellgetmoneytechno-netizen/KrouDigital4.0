import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  MapPin,
  UserCheck,
  Award,
  AlertCircle
} from 'lucide-react';

export const StudentsView: React.FC = () => {
  const { students, classes, grades, attendances, addStudent, updateStudent, deleteStudent, language, showToast } = useApp();
  const isKm = language === 'km';

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Student>>({
    nameKhmer: '',
    nameEnglish: '',
    gender: 'MALE',
    dob: '2008-01-01',
    classId: classes[0]?.id || 'cls-12a',
    phone: '',
    parentName: '',
    parentPhone: '',
    parentRelationship: 'ឪពុក',
    address: 'ភ្នំពេញ',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  // Filtered students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.nameKhmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.phone && s.phone.includes(searchTerm));
    const matchesClass = selectedClass === 'ALL' || s.classId === selectedClass;
    const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;
    return matchesSearch && matchesClass && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handlers
  const openCreateModal = () => {
    setFormData({
      nameKhmer: '',
      nameEnglish: '',
      gender: 'MALE',
      dob: '2008-05-15',
      classId: classes[0]?.id || 'cls-12a',
      phone: '012 888 999',
      parentName: 'លោក សុខ ផល',
      parentPhone: '012 333 444',
      parentRelationship: 'ឪពុក',
      address: 'សង្កាត់ទឹកថ្លា ខណ្ឌសែនសុខ ភ្នំពេញ',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });
    setShowAddModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameKhmer) {
      showToast(isKm ? 'សូមបញ្ចូលឈ្មោះសិស្សជាភាសាខ្មែរ' : 'Khmer name is required', 'error');
      return;
    }
    await addStudent(formData);
    setShowAddModal(false);
  };

  const openEditModal = (s: Student) => {
    setSelectedStudent(s);
    setFormData({ ...s });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    await updateStudent(selectedStudent.id, formData);
    setShowEditModal(false);
    setSelectedStudent(null);
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
  };

  const openViewModal = (s: Student) => {
    setSelectedStudent(s);
    setShowViewModal(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Student ID', 'Khmer Name', 'English Name', 'Gender', 'Class', 'DOB', 'Phone', 'Parent Name', 'Parent Phone', 'GPA'];
    const rows = filteredStudents.map(s => [
      s.studentCode,
      `"${s.nameKhmer}"`,
      `"${s.nameEnglish}"`,
      s.gender,
      `"${s.className}"`,
      s.dob,
      s.phone || '',
      `"${s.parentName}"`,
      s.parentPhone || '',
      s.gpa || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KrouDigital_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isKm ? 'បានទាញយកទិន្នន័យជាឯកសារ CSV ជោគជ័យ' : 'CSV exported successfully');
  };

  // Import mock CSV handler
  const handleImportSampleData = () => {
    showToast(isKm ? 'បាននាំចូលទិន្នន័យសិស្សថ្មីចំនួន ៣ នាក់ដោយជោគជ័យ' : 'Imported 3 sample students successfully');
    setShowImportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'ការគ្រប់គ្រងព័ត៌មានសិស្ស' : 'Student Management'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'បញ្ជីឈ្មោះសិស្សានុសិស្ស ថ្នាក់រៀន ព័ត៌មានអាណាព្យាបាល និងប្រវត្តិការសិក្សា' : 'Manage student profiles, enrollments, parents, and academic history'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="export-students-csv-btn"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{isKm ? 'ទាញយក CSV' : 'Export CSV'}</span>
          </button>

          <button
            id="import-students-btn"
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>{isKm ? 'នាំចូល CSV' : 'Import'}</span>
          </button>

          <button
            id="add-student-modal-btn"
            onClick={openCreateModal}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isKm ? 'បន្ថែមសិស្សថ្មី' : 'Add Student'}</span>
          </button>
        </div>
      </div>

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
            placeholder={isKm ? 'ស្វែងរកតាមឈ្មោះ កូដសិស្ស ឬលេខទូរស័ព្ទ...' : 'Search name, student code, phone...'}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class filter */}
          <select
            id="class-filter-select"
            value={selectedClass}
            onChange={(e) => { setSelectedClass(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-700"
          >
            <option value="ALL">{isKm ? 'ថ្នាក់ទាំងអស់' : 'All Classes'}</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            id="status-filter-select"
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-700"
          >
            <option value="ALL">{isKm ? 'ស្ថានភាពទាំងអស់' : 'All Status'}</option>
            <option value="ACTIVE">{isKm ? 'កំពុងសិក្សា (Active)' : 'Active'}</option>
            <option value="SUSPENDED">{isKm ? 'ព្យួរការសិក្សា (Suspended)' : 'Suspended'}</option>
            <option value="GRADUATED">{isKm ? 'បានបញ្ចប់ការសិក្សា (Graduated)' : 'Graduated'}</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="py-3 px-4">{isKm ? 'កូដសិស្ស' : 'Student ID'}</th>
                <th className="py-3 px-4">{isKm ? 'ឈ្មោះខ្មែរ & អង់គ្លេស' : 'Student Name'}</th>
                <th className="py-3 px-4">{isKm ? 'ភេទ' : 'Gender'}</th>
                <th className="py-3 px-4">{isKm ? 'ថ្នាក់រៀន' : 'Class'}</th>
                <th className="py-3 px-4">{isKm ? 'ថ្ងៃខែឆ្នាំកំណើត' : 'DOB'}</th>
                <th className="py-3 px-4">{isKm ? 'អាណាព្យាបាល' : 'Parent'}</th>
                <th className="py-3 px-4">{isKm ? 'និទ្ទេស' : 'GPA'}</th>
                <th className="py-3 px-4">{isKm ? 'ស្ថានភាព' : 'Status'}</th>
                <th className="py-3 px-4 text-center">{isKm ? 'សកម្មភាព' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-cyan-50/30 transition">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-700">
                      {student.studentCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{student.nameKhmer}</div>
                          <div className="text-[11px] text-slate-400">{student.nameEnglish}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                        student.gender === 'FEMALE' ? 'bg-pink-50 text-pink-700 border border-pink-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {student.gender === 'FEMALE' ? (isKm ? 'ស្រី' : 'F') : (isKm ? 'ប្រុស' : 'M')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {student.className}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {student.dob}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{student.parentName}</div>
                      <div className="text-[11px] text-slate-400">{student.parentPhone}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-cyan-800">
                      {student.gpa?.toFixed(2) || '3.50'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {isKm ? 'កំពុងសិក្សា' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openViewModal(student)}
                          className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                          title={isKm ? 'មើលព័ត៌មានលម្អិត' : 'View Details'}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title={isKm ? 'កែប្រែ' : 'Edit'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(student)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title={isKm ? 'លុប' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    {isKm ? 'រកមិនឃើញទិន្នន័យសិស្សឡើយ' : 'No students found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            {isKm 
              ? `បង្ហាញ ${(currentPage - 1) * pageSize + 1} ដល់ ${Math.min(currentPage * pageSize, filteredStudents.length)} នៃ ${filteredStudents.length} សិស្ស` 
              : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filteredStudents.length)} of ${filteredStudents.length}`}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CREATE STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'ចុះឈ្មោះសិស្សថ្មី' : 'Add New Student'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឈ្មោះជាភាសាខ្មែរ *' : 'Khmer Name *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.nameKhmer || ''}
                    onChange={(e) => setFormData({ ...formData, nameKhmer: e.target.value })}
                    placeholder="ឧ. សុខ ចាន់ដារ៉ា"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឈ្មោះជាឡាតាំង' : 'English Name'}</label>
                  <input
                    type="text"
                    value={formData.nameEnglish || ''}
                    onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                    placeholder="Sok Chandara"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ភេទ' : 'Gender'}</label>
                  <select
                    value={formData.gender || 'MALE'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'MALE' | 'FEMALE' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="MALE">{isKm ? 'ប្រុស' : 'Male'}</option>
                    <option value="FEMALE">{isKm ? 'ស្រី' : 'Female'}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ថ្ងៃខែឆ្នាំកំណើត' : 'DOB'}</label>
                  <input
                    type="date"
                    value={formData.dob || ''}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ថ្នាក់រៀន' : 'Class'}</label>
                  <select
                    value={formData.classId || classes[0]?.id}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឈ្មោះអាណាព្យាបាល' : 'Parent Name'}</label>
                  <input
                    type="text"
                    value={formData.parentName || ''}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="ឈ្មោះឪពុក ឬម្តាយ"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ទូរស័ព្ទអាណាព្យាបាល' : 'Parent Phone'}</label>
                  <input
                    type="text"
                    value={formData.parentPhone || ''}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="012 345 678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'អាសយដ្ឋានបច្ចុប្បន្ន' : 'Address'}</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="រាជធានីភ្នំពេញ"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  {isKm ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md shadow-cyan-600/20"
                >
                  {isKm ? 'រក្សាទុក' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STUDENT MODAL */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                <span>{isKm ? 'កែប្រែព័ត៌មានសិស្ស' : 'Edit Student Details'}</span>
              </h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឈ្មោះខ្មែរ' : 'Khmer Name'}</label>
                  <input
                    type="text"
                    required
                    value={formData.nameKhmer || ''}
                    onChange={(e) => setFormData({ ...formData, nameKhmer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឈ្មោះឡាតាំង' : 'English Name'}</label>
                  <input
                    type="text"
                    value={formData.nameEnglish || ''}
                    onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ថ្នាក់រៀន' : 'Class'}</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'លេខទូរស័ព្ទ' : 'Phone'}</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'អាណាព្យាបាល' : 'Parent Name'}</label>
                  <input
                    type="text"
                    value={formData.parentName || ''}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ទូរស័ព្ទអាណាព្យាបាល' : 'Parent Phone'}</label>
                  <input
                    type="text"
                    value={formData.parentPhone || ''}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  {isKm ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20"
                >
                  {isKm ? 'រក្សាទុកការកែប្រែ' : 'Update Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW STUDENT PROFILE DETAIL MODAL */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'ប្រវត្តិរូបសិស្សានុសិស្ស' : 'Student Profile Dossier'}</span>
              </h3>
              <button onClick={() => setShowViewModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Header */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-cyan-50 to-teal-50/40 p-4 rounded-2xl border border-cyan-100/60">
              <img
                src={selectedStudent.avatarUrl}
                alt=""
                className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-slate-900">{selectedStudent.nameKhmer}</div>
                <div className="text-xs text-slate-500">{selectedStudent.nameEnglish} • {selectedStudent.studentCode}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-600 text-white">
                    {selectedStudent.className}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    GPA: {selectedStudent.gpa?.toFixed(2) || '3.85'}
                  </span>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">{isKm ? 'ភេទ' : 'Gender'}</span>
                <span className="font-semibold text-slate-800">{selectedStudent.gender === 'FEMALE' ? 'ស្រី' : 'ប្រុស'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">{isKm ? 'ថ្ងៃខែឆ្នាំកំណើត' : 'Birth Date'}</span>
                <span className="font-semibold text-slate-800">{selectedStudent.dob}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">{isKm ? 'អាណាព្យាបាល' : 'Parent'}</span>
                <span className="font-semibold text-slate-800">{selectedStudent.parentName} ({selectedStudent.parentPhone})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">{isKm ? 'កាលបរិច្ឆេទចុះឈ្មោះ' : 'Enrolled'}</span>
                <span className="font-semibold text-slate-800">{selectedStudent.enrolledDate}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <span className="text-slate-400 block">{isKm ? 'អាសយដ្ឋានបច្ចុប្បន្ន' : 'Address'}</span>
              <span className="font-semibold text-slate-800">{selectedStudent.address}</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
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
              {selectedStudent.nameKhmer} ({selectedStudent.studentCode})
            </p>
            <div className="flex items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {isKm ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/20"
              >
                {isKm ? 'យល់ព្រមលុប' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT CSV MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'នាំចូលទិន្នន័យសិស្ស (CSV / Excel)' : 'Import Students (CSV)'}</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="border-2 border-dashed border-cyan-200 rounded-2xl p-6 text-center space-y-2 bg-cyan-50/30">
              <Upload className="w-8 h-8 text-cyan-600 mx-auto" />
              <div className="text-xs font-bold text-slate-800">
                {isKm ? 'ទម្លាក់ឯកសារ CSV នៅទីនេះ ឬចុចដើម្បីជ្រើសរើស' : 'Drag & drop your CSV file here, or click to browse'}
              </div>
              <div className="text-[11px] text-slate-400">
                គំរូទម្រង់៖ StudentCode, NameKhmer, Gender, ClassId, DOB, Phone
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {isKm ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                onClick={handleImportSampleData}
                className="px-4 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-md shadow-cyan-600/20"
              >
                {isKm ? 'ដំណើរការនាំចូល' : 'Run Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
