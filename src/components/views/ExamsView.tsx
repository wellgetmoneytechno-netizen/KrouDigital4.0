import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamModel } from '../../types';
import {
  ClipboardCheck,
  Plus,
  Calendar,
  Clock,
  MapPin,
  Award,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const ExamsView: React.FC = () => {
  const { exams, classes, subjects, addExam, updateExam, deleteExam, language, showToast } = useApp();
  const isKm = language === 'km';

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamModel | null>(null);

  const [formData, setFormData] = useState<Partial<ExamModel>>({
    titleKhmer: '',
    titleEnglish: '',
    examType: 'MIDTERM',
    subjectId: subjects[0]?.id || '',
    classId: classes[0]?.id || '',
    date: '2026-10-15',
    startTime: '08:00',
    endTime: '10:00',
    durationMinutes: 120,
    room: 'សាលប្រឡង A1',
    totalMarks: 100,
    passMarks: 50,
    status: 'SCHEDULED'
  });

  const filteredExams = exams.filter(e => {
    return selectedStatus === 'ALL' || e.status === selectedStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleKhmer) {
      showToast(isKm ? 'សូមបញ្ចូលចំណងជើងការប្រឡង' : 'Exam title is required', 'error');
      return;
    }
    const sub = subjects.find(s => s.id === formData.subjectId);
    const cls = classes.find(c => c.id === formData.classId);
    await addExam({
      ...formData,
      subjectName: sub?.nameKhmer,
      className: cls?.name
    });
    setShowAddModal(false);
  };

  const handleToggleStatus = async (exam: ExamModel) => {
    const nextStatus = exam.status === 'SCHEDULED' ? 'IN_PROGRESS' : exam.status === 'IN_PROGRESS' ? 'COMPLETED' : 'SCHEDULED';
    await updateExam(exam.id, { status: nextStatus });
  };

  const handleDeleteConfirm = async () => {
    if (!selectedExam) return;
    await deleteExam(selectedExam.id);
    setShowDeleteModal(false);
    setSelectedExam(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'ការគ្រប់គ្រងសម័យប្រឡង' : 'Examination Schedules'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'កាលវិភាគប្រឡងឆមាស បន្ទប់ប្រឡង ពិន្ទុអប្បបរមា និងស្ថានភាពដំណើរការ' : 'Manage midterm, final, and test sessions, exam rooms, and status'}
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              titleKhmer: 'ការប្រឡងប្រចាំឆមាសទី១',
              titleEnglish: 'Semester 1 Final Exam',
              examType: 'MIDTERM',
              subjectId: subjects[0]?.id || '',
              classId: classes[0]?.id || '',
              date: '2026-10-20',
              startTime: '08:00',
              endTime: '10:00',
              durationMinutes: 120,
              room: 'បន្ទប់ A101',
              totalMarks: 100,
              passMarks: 50,
              status: 'SCHEDULED'
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isKm ? 'បង្កើតកាលវិភាគប្រឡង' : 'Schedule Exam'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedStatus === st
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {st === 'ALL' ? (isKm ? 'ទាំងអស់' : 'All') :
             st === 'SCHEDULED' ? (isKm ? 'គ្រោងទុក' : 'Scheduled') :
             st === 'IN_PROGRESS' ? (isKm ? 'កំពុងប្រឡង' : 'In Progress') :
             (isKm ? 'បានបញ្ចប់' : 'Completed')}
          </button>
        ))}
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold ${
                  exam.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  exam.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' :
                  'bg-cyan-50 text-cyan-700 border border-cyan-200'
                }`}>
                  {exam.status === 'COMPLETED' ? (isKm ? 'បានបញ្ចប់' : 'Completed') :
                   exam.status === 'IN_PROGRESS' ? (isKm ? 'កំពុងប្រឡង' : 'In Progress') :
                   (isKm ? 'គ្រោងទុក' : 'Scheduled')}
                </span>

                <button
                  onClick={() => {
                    setSelectedExam(exam);
                    setShowDeleteModal(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-base text-slate-900 leading-snug">{exam.titleKhmer}</h3>
                <div className="text-xs text-slate-400 mt-0.5">{exam.titleEnglish}</div>
              </div>

              {/* Details */}
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isKm ? 'មុខវិជ្ជា' : 'Subject'}:</span>
                  <span className="font-bold text-slate-800">{exam.subjectName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isKm ? 'ថ្នាក់រៀន' : 'Class'}:</span>
                  <span className="font-semibold text-cyan-800">{exam.className}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {isKm ? 'កាលបរិច្ឆេទ' : 'Date'}:
                  </span>
                  <span className="font-semibold text-slate-800">{exam.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {isKm ? 'ម៉ោងប្រឡង' : 'Time'}:
                  </span>
                  <span className="font-semibold text-slate-800">{exam.startTime} - {exam.endTime} ({exam.durationMinutes} នាទី)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {isKm ? 'បន្ទប់ប្រឡង' : 'Room'}:
                  </span>
                  <span className="font-semibold text-slate-800">{exam.room}</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Switcher */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                {isKm ? `ពិន្ទុសរុប៖ ${exam.totalMarks}` : `Total Marks: ${exam.totalMarks}`}
              </div>
              <button
                onClick={() => handleToggleStatus(exam)}
                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 cursor-pointer"
              >
                {isKm ? 'ប្តូរស្ថានភាព' : 'Change Status'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE EXAM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'រៀបចំកាលវិភាគប្រឡង' : 'Schedule Examination'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ចំណងជើងការប្រឡង (ខ្មែរ) *' : 'Exam Title (Khmer) *'}</label>
                <input
                  type="text"
                  required
                  value={formData.titleKhmer || ''}
                  onChange={(e) => setFormData({ ...formData, titleKhmer: e.target.value })}
                  placeholder="ការប្រឡងឆមាសទី១ គណិតវិទ្យា"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'មុខវិជ្ជា' : 'Subject'}</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.nameKhmer}</option>
                    ))}
                  </select>
                </div>

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
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'កាលបរិច្ឆេទ' : 'Date'}</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ចាប់ផ្តើម' : 'Start'}</label>
                  <input
                    type="text"
                    value={formData.startTime || '08:00'}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'បញ្ចប់' : 'End'}</label>
                  <input
                    type="text"
                    value={formData.endTime || '10:00'}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'បន្ទប់ប្រឡង' : 'Room'}</label>
                  <input
                    type="text"
                    value={formData.room || ''}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="បន្ទប់ A101"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ពិន្ទុសរុប' : 'Total Marks'}</label>
                  <input
                    type="number"
                    value={formData.totalMarks || 100}
                    onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
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
                  {isKm ? 'រក្សាទុក' : 'Save Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {showDeleteModal && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {isKm ? 'តើអ្នកប្រាកដជាចង់លុបការប្រឡងនេះ?' : 'Delete Examination?'}
            </h3>
            <p className="text-xs text-slate-500">{selectedExam.titleKhmer}</p>
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
