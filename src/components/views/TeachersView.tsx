import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';
import {
  UserCheck,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  School,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

export const TeachersView: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, language, showToast } = useApp();
  const isKm = language === 'km';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState<Partial<Teacher>>({
    nameKhmer: '',
    nameEnglish: '',
    gender: 'MALE',
    email: '',
    phone: '',
    department: 'វិទ្យាសាស្ត្រ',
    subjects: ['គណិតវិទ្យា'],
    degree: 'បរិញ្ញាបត្រគរុកោសល្យ',
    assignedClassNames: ['ថ្នាក់ទី១២ ក']
  });

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch =
      t.nameKhmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teacherCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || t.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(teachers.map(t => t.department)));

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameKhmer) {
      showToast(isKm ? 'សូមបញ្ចូលឈ្មោះគ្រូ' : 'Teacher name is required', 'error');
      return;
    }
    await addTeacher(formData);
    setShowAddModal(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;
    await updateTeacher(selectedTeacher.id, formData);
    setShowEditModal(false);
    setSelectedTeacher(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTeacher) return;
    await deleteTeacher(selectedTeacher.id);
    setShowDeleteModal(false);
    setSelectedTeacher(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'ការគ្រប់គ្រងព័ត៌មានគ្រូបង្រៀន' : 'Teacher Management'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'បញ្ជីឈ្មោះសាស្ត្រាចារ្យ លោកគ្រូអ្នកគ្រូ ដេប៉ាតឺម៉ង់ និងមុខវិជ្ជាបង្រៀន' : 'Faculty directory, academic departments, and assigned teaching subjects'}
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              nameKhmer: '',
              nameEnglish: '',
              gender: 'FEMALE',
              email: 'teacher@kroudigital.edu.kh',
              phone: '012 555 666',
              department: 'វិទ្យាសាស្ត្រ',
              subjects: ['គណិតវិទ្យា'],
              degree: 'បរិញ្ញាបត្រគរុកោសល្យ',
              assignedClassNames: ['ថ្នាក់ទី១២ ក', 'ថ្នាក់ទី១១ ខ']
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isKm ? 'បន្ថែមគ្រូបង្រៀន' : 'Add Teacher'}</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isKm ? 'ស្វែងរកឈ្មោះគ្រូ កូដ ឬមុខវិជ្ជា...' : 'Search teacher name, code, subject...'}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
        >
          <option value="ALL">{isKm ? 'ដេប៉ាតឺម៉ង់ទាំងអស់' : 'All Departments'}</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {teacher.nameKhmer.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{teacher.nameKhmer}</h3>
                    <div className="text-xs text-slate-400">{teacher.nameEnglish} • {teacher.teacherCode}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setFormData({ ...teacher });
                      setShowEditModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setShowDeleteModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Department & Degree Pills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-100">
                  {teacher.department}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-100">
                  {teacher.degree}
                </span>
              </div>

              {/* Contacts */}
              <div className="mt-3.5 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{teacher.phone}</span>
                </div>
              </div>
            </div>

            {/* Teaching Subjects & Classes */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-cyan-600" />
                <span>{isKm ? 'មុខវិជ្ជាបង្រៀន' : 'Teaching Subjects'}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {teacher.subjects.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium">
                    {s}
                  </span>
                ))}
              </div>

              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 pt-1">
                <School className="w-3 h-3 text-blue-600" />
                <span>{isKm ? 'ថ្នាក់ទទួលបន្ទុក' : 'Assigned Classes'}</span>
              </div>
              <div className="text-xs font-semibold text-slate-800">
                {teacher.assignedClassNames?.join(', ') || 'មិនទាន់ចាត់តាំង'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TEACHER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'បន្ថែមគ្រូបង្រៀនថ្មី' : 'Add New Teacher'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឈ្មោះខ្មែរ *' : 'Khmer Name *'}</label>
                  <input
                    type="text"
                    required
                    value={formData.nameKhmer || ''}
                    onChange={(e) => setFormData({ ...formData, nameKhmer: e.target.value })}
                    placeholder="អ្នកគ្រូ ស៊ឹម សុភា"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឈ្មោះឡាតាំង' : 'English Name'}</label>
                  <input
                    type="text"
                    value={formData.nameEnglish || ''}
                    onChange={(e) => setFormData({ ...formData, nameEnglish: e.target.value })}
                    placeholder="Sim Sophear"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'អ៊ីមែល' : 'Email'}</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="teacher@kroudigital.edu.kh"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'លេខទូរស័ព្ទ' : 'Phone'}</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="012 888 777"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ដេប៉ាតឺម៉ង់' : 'Department'}</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="វិទ្យាសាស្ត្រពិត"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'កម្រិតសញ្ញាបត្រ' : 'Degree'}</label>
                  <input
                    type="text"
                    value={formData.degree || ''}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="អនុបណ្ឌិត"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {isKm ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md shadow-cyan-600/20"
                >
                  {isKm ? 'រក្សាទុក' : 'Save Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {showDeleteModal && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isKm ? 'តើអ្នកពិតជាចង់លុបទិន្នន័យគ្រូបង្រៀននេះ?' : 'Delete teacher profile?'}
            </h3>
            <p className="text-xs text-slate-500">
              {selectedTeacher.nameKhmer} ({selectedTeacher.teacherCode})
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
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
    </div>
  );
};
