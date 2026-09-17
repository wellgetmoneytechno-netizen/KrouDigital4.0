import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectModel } from '../../types';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
  GraduationCap,
  Clock,
  Layers,
  AlertCircle
} from 'lucide-react';

export const SubjectsView: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, language, showToast } = useApp();
  const isKm = language === 'km';

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectModel | null>(null);

  const [formData, setFormData] = useState<Partial<SubjectModel>>({
    code: '',
    nameKhmer: '',
    nameEnglish: '',
    credits: 3,
    hoursPerWeek: 4,
    department: 'វិទ្យាសាស្ត្រ',
    teacherName: 'លោកគ្រូ សុខ ផល',
    applicableGrades: [10, 11, 12]
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameKhmer) {
      showToast(isKm ? 'សូមបញ្ចូលឈ្មោះមុខវិជ្ជា' : 'Subject name is required', 'error');
      return;
    }
    await addSubject(formData);
    setShowAddModal(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    await updateSubject(selectedSubject.id, formData);
    setShowEditModal(false);
    setSelectedSubject(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSubject) return;
    await deleteSubject(selectedSubject.id);
    setShowDeleteModal(false);
    setSelectedSubject(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'មុខវិជ្ជា និងកម្មវិធីសិក្សា' : 'Subject Curriculum'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'បញ្ជីមុខវិជ្ជាស្នូល ក្រេឌីត ម៉ោងបង្រៀនប្រចាំសប្តាហ៍ និងគ្រូទទួលបន្ទុក' : 'Academic curriculum, credit units, and weekly teaching allocations'}
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              code: `SUB-0${subjects.length + 1}`,
              nameKhmer: '',
              nameEnglish: '',
              credits: 3,
              hoursPerWeek: 4,
              department: 'វិទ្យាសាស្ត្រពិត',
              teacherName: 'អ្នកគ្រូ ចាន់ សុខា',
              applicableGrades: [10, 11, 12]
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isKm ? 'បន្ថែមមុខវិជ្ជា' : 'Add Subject'}</span>
        </button>
      </div>

      {/* Grid of Subjects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((subj) => (
          <div
            key={subj.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-extrabold text-sm border border-cyan-100">
                    {subj.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{subj.nameKhmer}</h3>
                    <div className="text-xs text-slate-400">{subj.nameEnglish}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedSubject(subj);
                      setFormData({ ...subj });
                      setShowEditModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubject(subj);
                      setShowDeleteModal(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">{isKm ? 'ក្រេឌីត' : 'Credits'}</span>
                  <span className="font-bold text-cyan-800">{subj.credits}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">{isKm ? 'ម៉ោង/សប្តាហ៍' : 'Hrs/Week'}</span>
                  <span className="font-bold text-slate-800">{subj.hoursPerWeek}h</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isKm ? 'ដេប៉ាតឺម៉ង់' : 'Department'}:</span>
                  <span className="font-semibold text-slate-800">{subj.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isKm ? 'គ្រូទទួលបន្ទុក' : 'Instructor'}:</span>
                  <span className="font-semibold text-slate-800">{subj.teacherName}</span>
                </div>
              </div>
            </div>

            {/* Applicable Grades */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">{isKm ? 'បង្រៀនសម្រាប់' : 'For Grades'}:</span>
              <div className="flex gap-1">
                {subj.applicableGrades?.map(g => (
                  <span key={g} className="px-2 py-0.5 rounded-md bg-cyan-100/70 text-cyan-800 font-bold">
                    ថ្នាក់ទី{g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD SUBJECT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'បន្ថែមមុខវិជ្ជាថ្មី' : 'Add New Subject'}</span>
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
                    placeholder="គីមីវិទ្យា"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'កូដសម្គាល់' : 'Code'}</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="CHM101"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ចំនួនក្រេឌីត' : 'Credits'}</label>
                  <input
                    type="number"
                    value={formData.credits || 3}
                    onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ម៉ោង/សប្តាហ៍' : 'Hours/Week'}</label>
                  <input
                    type="number"
                    value={formData.hoursPerWeek || 4}
                    onChange={(e) => setFormData({ ...formData, hoursPerWeek: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

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
                  {isKm ? 'រក្សាទុក' : 'Save Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {showDeleteModal && selectedSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isKm ? 'តើអ្នកប្រាកដជាចង់លុបមុខវិជ្ជានេះ?' : 'Delete Subject?'}
            </h3>
            <p className="text-xs text-slate-500">{selectedSubject.nameKhmer} ({selectedSubject.code})</p>
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
