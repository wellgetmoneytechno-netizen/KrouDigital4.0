import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScheduleItem } from '../../types';
import {
  Calendar,
  Plus,
  Printer,
  Trash2,
  Clock,
  MapPin,
  User,
  X
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { classes, subjects, teachers, schedules, addScheduleItem, deleteScheduleItem, language, showToast } = useApp();
  const isKm = language === 'km';

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-12a');
  const [showAddModal, setShowAddModal] = useState(false);

  const daysOfWeek = [
    { day: 1, labelKm: 'ច័ន្ទ', labelEn: 'Monday' },
    { day: 2, labelKm: 'អង្គារ', labelEn: 'Tuesday' },
    { day: 3, labelKm: 'ពុធ', labelEn: 'Wednesday' },
    { day: 4, labelKm: 'ព្រហស្បតិ៍', labelEn: 'Thursday' },
    { day: 5, labelKm: 'សុក្រ', labelEn: 'Friday' },
    { day: 6, labelKm: 'សៅរ៍', labelEn: 'Saturday' }
  ];

  const periods = [
    { p: 1, time: '07:30 - 08:20' },
    { p: 2, time: '08:25 - 09:15' },
    { p: 3, time: '09:30 - 10:20' },
    { p: 4, time: '10:25 - 11:15' },
    { p: 5, time: '14:00 - 14:50' }
  ];

  const filteredSchedule = schedules.filter(s => s.classId === selectedClassId);

  // Form State
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({
    dayOfWeek: 1,
    period: 1,
    startTime: '07:30',
    endTime: '08:20',
    classId: selectedClassId,
    subjectId: subjects[0]?.id || '',
    teacherId: teachers[0]?.id || '',
    room: 'បន្ទប់ A101'
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === formData.subjectId);
    const tch = teachers.find(t => t.id === formData.teacherId);
    const cls = classes.find(c => c.id === selectedClassId);
    const periodObj = periods.find(p => p.p === Number(formData.period));
    const [start, end] = (periodObj?.time || '07:30 - 08:20').split(' - ');

    await addScheduleItem({
      ...formData,
      classId: selectedClassId,
      className: cls?.name,
      subjectName: sub?.nameKhmer,
      teacherName: tch?.nameKhmer,
      startTime: start,
      endTime: end
    });
    setShowAddModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'កាលវិភាគបង្រៀន និងរៀនប្រចាំសប្តាហ៍' : 'Weekly Timetable'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'តារាងបែងចែកម៉ោងបង្រៀនតាមថ្ងៃ មុខវិជ្ជា បន្ទប់សិក្សា និងលោកគ្រូអ្នកគ្រូ' : 'Master timetable grid sorted by days, periods, classrooms, and teachers'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{isKm ? 'បោះពុម្ពកាលវិភាគ' : 'Print Timetable'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isKm ? 'បន្ថែមម៉ោងសិក្សា' : 'Add Slot'}</span>
          </button>
        </div>
      </div>

      {/* Class Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600">{isKm ? 'ជ្រើសរើសថ្នាក់រៀន' : 'Select Class'}:</label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-cyan-800"
          >
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-400 font-medium hidden sm:block">
          {isKm ? 'ម៉ោងសិក្សាព្រឹក៖ ០៧:៣០ ដល់ ១១:១៥' : 'Morning Shift: 07:30 - 11:15'}
        </div>
      </div>

      {/* Timetable Weekly Matrix */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {daysOfWeek.map(d => {
            const daySchedules = filteredSchedule
              .filter(s => s.dayOfWeek === d.day)
              .sort((a, b) => a.period - b.period);

            return (
              <div key={d.day} className="bg-slate-50/70 rounded-2xl p-3 border border-slate-200/60 flex flex-col space-y-3">
                {/* Day Header */}
                <div className="text-center py-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="text-xs font-bold text-slate-900">{isKm ? d.labelKm : d.labelEn}</div>
                </div>

                {/* Slots */}
                <div className="space-y-2.5 flex-1">
                  {periods.map(p => {
                    const slot = daySchedules.find(s => s.period === p.p);
                    return (
                      <div
                        key={p.p}
                        className={`p-2.5 rounded-xl border transition text-xs relative group ${
                          slot
                            ? 'bg-white border-cyan-200 shadow-xs'
                            : 'border-dashed border-slate-200 bg-white/40 text-slate-400 flex items-center justify-center min-h-[85px]'
                        }`}
                      >
                        {slot ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-cyan-700 font-mono font-bold">
                              <span>ម៉ោង {p.p}</span>
                              <button
                                onClick={() => deleteScheduleItem(slot.id)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition"
                                title="លុប"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="font-bold text-slate-900 text-xs truncate">{slot.subjectName}</div>
                            <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                              <User className="w-2.5 h-2.5 text-cyan-600" />
                              <span>{slot.teacherName}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-0.5 border-t border-slate-100">
                              <span>{slot.startTime}</span>
                              <span className="font-medium text-slate-600">{slot.room}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px]">{isKm ? 'ទំនេរ' : 'Free'}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD SCHEDULE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'បន្ថែមម៉ោងបង្រៀន' : 'Add Timetable Slot'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ថ្ងៃនៃសប្តាហ៍' : 'Day'}</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {daysOfWeek.map(d => (
                      <option key={d.day} value={d.day}>{d.labelKm} ({d.labelEn})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ម៉ោងទី (Period)' : 'Period'}</label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {periods.map(p => (
                      <option key={p.p} value={p.p}>ម៉ោង {p.p} ({p.time})</option>
                    ))}
                  </select>
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'គ្រូបង្រៀន' : 'Teacher'}</label>
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
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'បន្ទប់រៀន' : 'Room'}</label>
                  <input
                    type="text"
                    value={formData.room || ''}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
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
                  {isKm ? 'រក្សាទុក' : 'Save Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
