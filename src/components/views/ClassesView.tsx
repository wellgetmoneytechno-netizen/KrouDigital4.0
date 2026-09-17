import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClassModel } from '../../types';
import {
  School,
  Plus,
  Users,
  UserCheck,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  X,
  AlertCircle
} from 'lucide-react';

export const ClassesView: React.FC = () => {
  const { classes, teachers, students, addClass, updateClass, deleteClass, language, showToast } = useApp();
  const isKm = language === 'km';

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassModel | null>(null);

  const [formData, setFormData] = useState<Partial<ClassModel>>({
    name: '',
    grade: 12,
    academicYear: '២០២៥-២០២៦',
    room: 'បន្ទប់ A101',
    teacherId: teachers[0]?.id || '',
    teacherName: teachers[0]?.nameKhmer || '',
    capacity: 35,
    shift: 'MORNING'
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      showToast(isKm ? 'សូមបញ្ចូលឈ្មោះថ្នាក់រៀន' : 'Class name is required', 'error');
      return;
    }
    const teacher = teachers.find(t => t.id === formData.teacherId);
    await addClass({
      ...formData,
      teacherName: teacher?.nameKhmer || formData.teacherName
    });
    setShowAddModal(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    const teacher = teachers.find(t => t.id === formData.teacherId);
    await updateClass(selectedClass.id, {
      ...formData,
      teacherName: teacher?.nameKhmer || formData.teacherName
    });
    setShowEditModal(false);
    setSelectedClass(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClass) return;
    await deleteClass(selectedClass.id);
    setShowDeleteModal(false);
    setSelectedClass(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <School className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'ការគ្រប់គ្រងបន្ទប់ និងថ្នាក់រៀន' : 'Classroom Management'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'គ្រប់គ្រងកម្រិតថ្នាក់ បន្ទប់រៀន គ្រូទទួលបន្ទុកថ្នាក់ និងវេនសិក្សា' : 'Manage grades, homeroom teachers, room assignments, and shifts'}
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: 'ថ្នាក់ទី១២ ថ្មី',
              grade: 12,
              academicYear: '២០២៥-២០២៦',
              room: 'បន្ទប់ B202',
              teacherId: teachers[0]?.id || '',
              teacherName: teachers[0]?.nameKhmer || '',
              capacity: 35,
              shift: 'MORNING'
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isKm ? 'បង្កើតថ្នាក់ថ្មី' : 'Create Class'}</span>
        </button>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map((cls) => {
          const currentStudentCount = students.filter(s => s.classId === cls.id).length || cls.studentCount || 35;
          const percentage = Math.min(100, Math.round((currentStudentCount / cls.capacity) * 100));

          return (
            <div
              key={cls.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 font-extrabold text-lg flex items-center justify-center border border-cyan-100">
                      {cls.grade}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{cls.name}</h3>
                      <div className="text-xs text-slate-400">{cls.academicYear}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedClass(cls);
                        setFormData({ ...cls });
                        setShowEditModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedClass(cls);
                        setShowDeleteModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <UserCheck className="w-3.5 h-3.5 text-cyan-600" />
                      {isKm ? 'គ្រូប្រចាំថ្នាក់' : 'Homeroom Teacher'}
                    </span>
                    <span className="font-semibold text-slate-800">{cls.teacherName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      {isKm ? 'ទីតាំងបន្ទប់' : 'Room Location'}
                    </span>
                    <span className="font-semibold text-slate-800">{cls.room}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {isKm ? 'វេនសិក្សា' : 'Shift'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-800">
                      {cls.shift === 'MORNING' ? (isKm ? 'វេនព្រឹក' : 'Morning') : (isKm ? 'វេនរសៀល' : 'Afternoon')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {isKm ? 'ចំនួនសិស្សក្នុងថ្នាក់' : 'Student Enrollment'}
                  </span>
                  <span className="font-bold text-slate-800">
                    {currentStudentCount} / {cls.capacity}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      percentage >= 90 ? 'bg-amber-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE CLASS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'បង្កើតថ្នាក់រៀនថ្មី' : 'Create Class'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឈ្មោះថ្នាក់រៀន *' : 'Class Name *'}</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ឧ. ថ្នាក់ទី១២ គ"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'កម្រិតថ្នាក់' : 'Grade Level'}</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value={10}>{isKm ? 'ថ្នាក់ទី១០' : 'Grade 10'}</option>
                    <option value={11}>{isKm ? 'ថ្នាក់ទី១១' : 'Grade 11'}</option>
                    <option value={12}>{isKm ? 'ថ្នាក់ទី១២' : 'Grade 12'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'បន្ទប់រៀន' : 'Room'}</label>
                  <input
                    type="text"
                    value={formData.room || ''}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="បន្ទប់ C301"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'គ្រូប្រចាំថ្នាក់' : 'Homeroom Teacher'}</label>
                  <select
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.nameKhmer}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'វេនសិក្សា' : 'Shift'}</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value as 'MORNING' | 'AFTERNOON' })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="MORNING">{isKm ? 'វេនព្រឹក (07:00 - 11:30)' : 'Morning'}</option>
                    <option value="AFTERNOON">{isKm ? 'វេនរសៀល (13:00 - 17:30)' : 'Afternoon'}</option>
                  </select>
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
                  {isKm ? 'រក្សាទុក' : 'Save Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {showDeleteModal && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isKm ? 'តើអ្នកប្រាកដជាចង់លុបថ្នាក់រៀននេះ?' : 'Delete Class?'}
            </h3>
            <p className="text-xs text-slate-500">{selectedClass.name}</p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {isKm ? 'បោះបង់' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
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
