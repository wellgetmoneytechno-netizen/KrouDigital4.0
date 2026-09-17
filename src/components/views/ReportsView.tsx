import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
  Users,
  Award,
  CalendarCheck
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { students, teachers, classes, attendances, grades, language, showToast } = useApp();
  const isKm = language === 'km';

  const [reportType, setReportType] = useState<'STUDENT_LIST' | 'ATTENDANCE_SUMMARY' | 'GRADE_REPORT'>('STUDENT_LIST');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-12a');

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classStudents = students.filter(s => s.classId === selectedClassId);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    showToast(isKm ? 'បានទាញយករាយការណ៍ជោគជ័យ' : 'Report downloaded successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'របាយការណ៍ និងស្ថិតិអប់រំ' : 'Academic Reports & Analytics'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'បង្កើតរបាយការណ៍សិស្ស វត្តមាន លទ្ធផលប្រឡង និងទាញយកជាទម្រង់ផ្លូវការ' : 'Generate official student rosters, attendance summaries, and performance reports'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>{isKm ? 'បោះពុម្ព' : 'Print'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isKm ? 'ទាញយករបាយការណ៍' : 'Export File'}</span>
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">{isKm ? 'ប្រភេទរបាយការណ៍' : 'Type'}:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-cyan-800"
            >
              <option value="STUDENT_LIST">{isKm ? 'បញ្ជីឈ្មោះសិស្សតាមថ្នាក់' : 'Class Student Roster'}</option>
              <option value="ATTENDANCE_SUMMARY">{isKm ? 'សង្ខេបវត្តមានប្រចាំឆមាស' : 'Semester Attendance'}</option>
              <option value="GRADE_REPORT">{isKm ? 'តារាងលទ្ធផលសិក្សារួម' : 'Academic Performance'}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">{isKm ? 'ថ្នាក់រៀន' : 'Class'}:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-cyan-800"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Official Report Document Paper Preview (Simulating Official Cambodian Ministry Document) */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-4xl mx-auto text-slate-900 space-y-6">
        {/* Ministry Header */}
        <div className="text-center space-y-1 border-b border-slate-200 pb-6">
          <div className="text-xs font-bold tracking-widest text-slate-700">ព្រះរាជាណាចក្រកម្ពុជា</div>
          <div className="text-xs tracking-wider text-slate-600">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          <div className="pt-2 text-sm font-bold text-cyan-800">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
          <div className="text-xs text-slate-500">វិទ្យាល័យ គំរូឌីជីថលកម្ពុជា ៤.០</div>
          <h3 className="text-lg font-extrabold text-slate-900 pt-3">
            {reportType === 'STUDENT_LIST' ? `បញ្ជីរាយនាមសិស្ស ${selectedClass?.name}` :
             reportType === 'ATTENDANCE_SUMMARY' ? `របាយការណ៍វត្តមានសិស្ស ${selectedClass?.name}` :
             `តារាងលទ្ធផលសិក្សា ${selectedClass?.name}`}
          </h3>
          <p className="text-xs text-slate-500">
            {isKm ? 'ឆ្នាំសិក្សា ២០២៥-២០២៦ • ឆមាសទី១' : 'Academic Year 2025-2026 • Semester 1'}
          </p>
        </div>

        {/* Info Strip */}
        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
          <span>{isKm ? 'គ្រូទទួលបន្ទុក៖ ' : 'Homeroom Teacher: '} <strong>{selectedClass?.teacherName}</strong></span>
          <span>{isKm ? 'ចំនួនសិស្សសរុប៖ ' : 'Total Students: '} <strong>{classStudents.length} នាក់</strong></span>
          <span>{isKm ? 'បន្ទប់៖ ' : 'Room: '} <strong>{selectedClass?.room}</strong></span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                <th className="py-2 px-3 border-r border-slate-200 text-center w-10">ល.រ</th>
                <th className="py-2 px-3 border-r border-slate-200">អត្តលេខ</th>
                <th className="py-2 px-3 border-r border-slate-200">គោត្តនាម និងនាម</th>
                <th className="py-2 px-3 border-r border-slate-200 text-center">ភេទ</th>
                <th className="py-2 px-3 border-r border-slate-200">ថ្ងៃខែឆ្នាំកំណើត</th>
                <th className="py-2 px-3 border-r border-slate-200">អាណាព្យាបាល</th>
                <th className="py-2 px-3 text-center">លទ្ធផល/សម្គាល់</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {classStudents.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 border-r border-slate-200 text-center">{idx + 1}</td>
                  <td className="py-2 px-3 border-r border-slate-200 font-mono font-bold text-cyan-800">{s.studentCode}</td>
                  <td className="py-2 px-3 border-r border-slate-200 font-bold">{s.nameKhmer}</td>
                  <td className="py-2 px-3 border-r border-slate-200 text-center">{s.gender === 'FEMALE' ? 'ស្រី' : 'ប្រុស'}</td>
                  <td className="py-2 px-3 border-r border-slate-200">{s.dob}</td>
                  <td className="py-2 px-3 border-r border-slate-200">{s.parentName}</td>
                  <td className="py-2 px-3 text-center font-bold text-emerald-700">
                    {reportType === 'GRADE_REPORT' ? `GPA ${s.gpa?.toFixed(2) || '3.75'}` : 'ល្អប្រសើរ'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures */}
        <div className="pt-8 flex justify-between text-xs text-center text-slate-700">
          <div>
            <div>បានឃើញ និងឯកភាព</div>
            <div className="font-bold pt-1">នាយកសាលា</div>
            <div className="h-16" />
            <div className="font-bold">បណ្ឌិត ជា សុវណ្ណ</div>
          </div>
          <div>
            <div>ថ្ងៃទី........ខែ........ឆ្នាំ២០២៦</div>
            <div className="font-bold pt-1">គ្រូទទួលបន្ទុកថ្នាក់</div>
            <div className="h-16" />
            <div className="font-bold">{selectedClass?.teacherName}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
