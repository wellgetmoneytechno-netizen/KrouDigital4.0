import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  Save,
  Sparkles,
  Calendar,
  Filter
} from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { classes, students, attendances, saveAttendanceRecords, language, showToast } = useApp();
  const isKm = language === 'km';

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-12a');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [localRecords, setLocalRecords] = useState<AttendanceRecord[]>([]);

  // Filter students for the selected class
  const classStudents = students.filter(s => s.classId === selectedClassId);

  // Initialize or load local records for selected class & date
  useEffect(() => {
    const existing = attendances.filter(a => a.classId === selectedClassId && a.date === selectedDate);
    const initialList: AttendanceRecord[] = classStudents.map(student => {
      const match = existing.find(e => e.studentId === student.id);
      return match || {
        id: `att-${student.id}-${selectedDate}`,
        studentId: student.id,
        studentNameKhmer: student.nameKhmer,
        studentCode: student.studentCode,
        classId: selectedClassId,
        date: selectedDate,
        status: 'PRESENT' as AttendanceStatus,
        remarks: ''
      };
    });
    setLocalRecords(initialList);
  }, [selectedClassId, selectedDate, students, attendances]);

  // Status metrics
  const presentCount = localRecords.filter(r => r.status === 'PRESENT').length;
  const absentCount = localRecords.filter(r => r.status === 'ABSENT').length;
  const lateCount = localRecords.filter(r => r.status === 'LATE').length;
  const excusedCount = localRecords.filter(r => r.status === 'EXCUSED').length;
  const totalCount = localRecords.length || 1;
  const presentRate = Math.round((presentCount / totalCount) * 100);

  // Toggle single student status
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setLocalRecords(prev =>
      prev.map(r => r.studentId === studentId ? { ...r, status } : r)
    );
  };

  // Remark change
  const handleRemarkChange = (studentId: string, remarks: string) => {
    setLocalRecords(prev =>
      prev.map(r => r.studentId === studentId ? { ...r, remarks } : r)
    );
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    setLocalRecords(prev => prev.map(r => ({ ...r, status: 'PRESENT' })));
    showToast(isKm ? 'បានកំណត់វត្តមានទាំងអស់' : 'Marked all students present', 'info');
  };

  // Save to backend
  const handleSave = async () => {
    await saveAttendanceRecords(localRecords);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'កត់ត្រាវត្តមានប្រចាំថ្ងៃ' : 'Daily Attendance Register'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'ពិនិត្យ និងកត់ត្រាវត្តមានសិស្សតាមកាលបរិច្ឆេទ ថ្នាក់រៀន និងមូលហេតុអវត្តមាន' : 'Log and track student attendance records, tardiness, and excused leaves'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="mark-all-present-btn"
            onClick={handleMarkAllPresent}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>{isKm ? 'វត្តមានទាំងអស់' : 'All Present'}</span>
          </button>

          <button
            id="save-attendance-btn"
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isKm ? 'រក្សាទុកវត្តមាន' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>

      {/* Class & Date Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">{isKm ? 'ថ្នាក់រៀន' : 'Class'}:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">{isKm ? 'កាលបរិច្ឆេទ' : 'Date'}:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
            >
            </input>
          </div>
        </div>

        {/* Stats Pill Strip */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            {isKm ? 'វត្តមាន' : 'Present'}: {presentCount}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold border border-rose-200">
            {isKm ? 'អវត្តមាន' : 'Absent'}: {absentCount}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold border border-amber-200">
            {isKm ? 'យឺត' : 'Late'}: {lateCount}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200">
            {isKm ? 'ច្បាប់' : 'Excused'}: {excusedCount}
          </span>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">{isKm ? 'កូដសិស្ស' : 'Student ID'}</th>
                <th className="py-3 px-4">{isKm ? 'ឈ្មោះសិស្ស' : 'Student Name'}</th>
                <th className="py-3 px-4 text-center">{isKm ? 'ស្ថានភាពវត្តមាន' : 'Attendance Status'}</th>
                <th className="py-3 px-4">{isKm ? 'មូលហេតុ / ចំណាំ' : 'Remarks'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {localRecords.length > 0 ? (
                localRecords.map((rec, index) => {
                  const student = students.find(s => s.id === rec.studentId);
                  return (
                    <tr key={rec.studentId} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4 text-slate-400 font-mono">{index + 1}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-cyan-700">
                        {rec.studentCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="font-bold text-slate-900">{rec.studentNameKhmer}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(rec.studentId, 'PRESENT')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                              rec.status === 'PRESENT'
                                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isKm ? 'វត្តមាន' : 'Present'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(rec.studentId, 'ABSENT')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                              rec.status === 'ABSENT'
                                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>{isKm ? 'អវត្តមាន' : 'Absent'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(rec.studentId, 'LATE')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                              rec.status === 'LATE'
                                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{isKm ? 'មកយឺត' : 'Late'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(rec.studentId, 'EXCUSED')}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1 ${
                              rec.status === 'EXCUSED'
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                            }`}
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>{isKm ? 'មានច្បាប់' : 'Excused'}</span>
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={rec.remarks || ''}
                          onChange={(e) => handleRemarkChange(rec.studentId, e.target.value)}
                          placeholder={isKm ? 'មូលហេតុ ឬសម្គាល់...' : 'Reason or notes...'}
                          className="w-full px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    {isKm ? 'មិនមានសិស្សក្នុងថ្នាក់នេះទេ' : 'No students found in this class'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
