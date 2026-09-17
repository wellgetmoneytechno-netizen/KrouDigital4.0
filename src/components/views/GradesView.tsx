import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GradeRecord } from '../../types';
import {
  Award,
  Save,
  Download,
  Filter,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const GradesView: React.FC = () => {
  const { classes, subjects, students, grades, saveGradeRecords, language, showToast } = useApp();
  const isKm = language === 'km';

  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 'cls-12a');
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'sbj-01');
  const [localGrades, setLocalGrades] = useState<GradeRecord[]>([]);

  const classStudents = students.filter(s => s.classId === selectedClassId);

  // Helper to calculate grade letter
  const getLetterGrade = (total: number): string => {
    if (total >= 90) return 'A';
    if (total >= 80) return 'B';
    if (total >= 70) return 'C';
    if (total >= 60) return 'D';
    if (total >= 50) return 'E';
    return 'F';
  };

  // Helper for grade pill styling
  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C': return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'D': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'E': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-rose-100 text-rose-800 border-rose-300';
    }
  };

  useEffect(() => {
    const existing = grades.filter(g => g.classId === selectedClassId && g.subjectId === selectedSubjectId);
    const initialList: GradeRecord[] = classStudents.map(student => {
      const match = existing.find(e => e.studentId === student.id);
      if (match) return match;
      const hw = 18;
      const quiz = 17;
      const midterm = 27;
      const final = 28;
      const total = hw + quiz + midterm + final;
      return {
        id: `grd-${student.id}-${selectedSubjectId}`,
        studentId: student.id,
        studentNameKhmer: student.nameKhmer,
        studentCode: student.studentCode,
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        homeworkScore: hw,
        quizScore: quiz,
        midtermScore: midterm,
        finalScore: final,
        totalScore: total,
        gradeLetter: getLetterGrade(total)
      };
    });
    setLocalGrades(initialList);
  }, [selectedClassId, selectedSubjectId, students, grades]);

  // Handle score edit
  const handleScoreChange = (
    studentId: string,
    field: 'homeworkScore' | 'quizScore' | 'midtermScore' | 'finalScore',
    value: number
  ) => {
    setLocalGrades(prev =>
      prev.map(g => {
        if (g.studentId !== studentId) return g;
        const updated = { ...g, [field]: value };
        const total = (updated.homeworkScore || 0) + (updated.quizScore || 0) + (updated.midtermScore || 0) + (updated.finalScore || 0);
        return {
          ...updated,
          totalScore: total,
          gradeLetter: getLetterGrade(total)
        };
      })
    );
  };

  // Save all
  const handleSave = async () => {
    await saveGradeRecords(localGrades);
  };

  // Export Grade Sheet CSV
  const handleExportCSV = () => {
    const cls = classes.find(c => c.id === selectedClassId)?.name || 'Class';
    const sbj = subjects.find(s => s.id === selectedSubjectId)?.nameKhmer || 'Subject';
    const headers = ['Student ID', 'Khmer Name', 'Homework (20)', 'Quiz (20)', 'Midterm (30)', 'Final (30)', 'Total (100)', 'Grade'];
    const rows = localGrades.map(g => [
      g.studentCode,
      `"${g.studentNameKhmer}"`,
      g.homeworkScore,
      g.quizScore,
      g.midtermScore,
      g.finalScore,
      g.totalScore,
      g.gradeLetter
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GradeSheet_${cls}_${sbj}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isKm ? 'បានទាញយកតារាងពិន្ទុជាឯកសារ CSV ជោគជ័យ' : 'Grade sheet exported');
  };

  // Class Average
  const averageTotal = localGrades.length > 0
    ? Math.round(localGrades.reduce((sum, g) => sum + (g.totalScore || 0), 0) / localGrades.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'ការកត់ត្រា និងគណនាពិន្ទុ' : 'Academic Gradebook'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'បញ្ចូលពិន្ទុកិច្ចការ ស្ទង់ចំណេះដឹង ប្រឡងឆមាស និងគណនានិទ្ទេសដោយស្វ័យប្រវត្តិ' : 'Enter homework, quizzes, midterm & final exam scores with automated GPA calculation'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="export-grades-csv-btn"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{isKm ? 'ទាញយកតារាងពិន្ទុ' : 'Export Grade Sheet'}</span>
          </button>

          <button
            id="save-grades-btn"
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isKm ? 'រក្សាទុកពិន្ទុ' : 'Save Gradebook'}</span>
          </button>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
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

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">{isKm ? 'មុខវិជ្ជា' : 'Subject'}:</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-cyan-800"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.nameKhmer} ({s.code})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-cyan-50 text-cyan-900 rounded-xl border border-cyan-100 font-bold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-cyan-600" />
            <span>{isKm ? `មធ្យមភាគរួម៖ ${averageTotal}/១០០` : `Class Average: ${averageTotal}/100`}</span>
          </div>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="py-3 px-4 w-12">#</th>
                <th className="py-3 px-4">{isKm ? 'កូដសិស្ស' : 'Student ID'}</th>
                <th className="py-3 px-4">{isKm ? 'ឈ្មោះសិស្ស' : 'Student Name'}</th>
                <th className="py-3 px-3 text-center w-28">{isKm ? 'កិច្ចការ (20)' : 'Homework (20)'}</th>
                <th className="py-3 px-3 text-center w-28">{isKm ? 'តេស្តខ្លី (20)' : 'Quiz (20)'}</th>
                <th className="py-3 px-3 text-center w-28">{isKm ? 'ឆមាសទី១ (30)' : 'Midterm (30)'}</th>
                <th className="py-3 px-3 text-center w-28">{isKm ? 'ប្រឡងផ្តាច់ព្រ័ត្រ (30)' : 'Final (30)'}</th>
                <th className="py-3 px-3 text-center w-24">{isKm ? 'ពិន្ទុសរុប (100)' : 'Total (100)'}</th>
                <th className="py-3 px-4 text-center w-24">{isKm ? 'និទ្ទេស' : 'Grade'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {localGrades.length > 0 ? (
                localGrades.map((grd, idx) => (
                  <tr key={grd.studentId} className="hover:bg-cyan-50/20 transition">
                    <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-700">
                      {grd.studentCode}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {grd.studentNameKhmer}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={grd.homeworkScore}
                        onChange={(e) => handleScoreChange(grd.studentId, 'homeworkScore', Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={grd.quizScore}
                        onChange={(e) => handleScoreChange(grd.studentId, 'quizScore', Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={grd.midtermScore}
                        onChange={(e) => handleScoreChange(grd.studentId, 'midtermScore', Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={30}
                        value={grd.finalScore}
                        onChange={(e) => handleScoreChange(grd.studentId, 'finalScore', Number(e.target.value))}
                        className="w-16 px-2 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </td>
                    <td className="py-3 px-3 text-center font-extrabold text-sm text-slate-900">
                      {grd.totalScore}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-xs border ${getGradeColor(grd.gradeLetter || 'A')}`}>
                        {grd.gradeLetter}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    {isKm ? 'មិនមានទិន្នន័យសិស្ស' : 'No student records'}
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
