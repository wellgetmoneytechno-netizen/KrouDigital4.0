import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Save,
  RotateCcw,
  School,
  Globe,
  ShieldCheck,
  CheckCircle2,
  Database
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { resetAllData, language, setLanguage, showToast } = useApp();
  const isKm = language === 'km';

  const [schoolNameKm, setSchoolNameKm] = useState('វិទ្យាល័យ គំរូឌីជីថលកម្ពុជា ៤.០');
  const [schoolNameEn, setSchoolNameEn] = useState('Cambodia Digital Model High School 4.0');
  const [academicYear, setAcademicYear] = useState('២០២៥-២០២៦');
  const [semester, setSemester] = useState('ឆមាសទី១');
  const [passingMark, setPassingMark] = useState(50);
  const [principalName, setPrincipalName] = useState('ឯកឧត្តម បណ្ឌិត ជា សុវណ្ណ');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(isKm ? 'បានរក្សាទុកការកំណត់ប្រព័ន្ធដោយជោគជ័យ' : 'Settings saved successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-600" />
          <span>{isKm ? 'ការកំណត់ប្រព័ន្ធទូទៅ' : 'System Settings & School Config'}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isKm ? 'គ្រប់គ្រងព័ត៌មានគ្រឹះស្ថានសិក្សា ឆ្នាំសិក្សា ឆមាស និងការកំណត់មូលដ្ឋាន' : 'Configure school branding, academic calendars, pass thresholds, and localization'}
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* School Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <School className="w-4 h-4 text-cyan-600" />
            <span>{isKm ? 'ព័ត៌មានគ្រឹះស្ថានសិក្សា' : 'School Profile'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឈ្មោះគ្រឹះស្ថាន (ភាសាខ្មែរ)' : 'School Name (Khmer)'}</label>
              <input
                type="text"
                value={schoolNameKm}
                onChange={(e) => setSchoolNameKm(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឈ្មោះគ្រឹះស្ថាន (អង់គ្លេស)' : 'School Name (English)'}</label>
              <input
                type="text"
                value={schoolNameEn}
                onChange={(e) => setSchoolNameEn(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'នាយកសាលា' : 'Principal Name'}</label>
              <input
                type="text"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ទីតាំងរដ្ឋបាល' : 'Location'}</label>
              <input
                type="text"
                defaultValue="រាជធានីភ្នំពេញ ព្រះរាជាណាចក្រកម្ពុជា"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Academic Rules */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>{isKm ? 'ឆ្នាំសិក្សា និងការវាយតម្លៃ' : 'Academic Rules & Grading'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឆ្នាំសិក្សាសកម្ម' : 'Academic Year'}</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ឆមាសបច្ចុប្បន្ន' : 'Current Semester'}</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ពិន្ទុជាប់អប្បបរមា (%)' : 'Passing Mark (%)'}</label>
              <input
                type="number"
                value={passingMark}
                onChange={(e) => setPassingMark(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-cyan-600" />
            <span>{isKm ? 'ភាសាប្រព័ន្ធ (System Language)' : 'System Language'}</span>
          </h3>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLanguage('km')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                language === 'km' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span>ភាសាខ្មែរ (Khmer - First)</span>
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                language === 'en' ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span>English (Optional)</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetAllData}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isKm ? 'កំណត់ទិន្នន័យដើមឡើងវិញ (Reset Data)' : 'Reset Factory Demo Data'}</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isKm ? 'រក្សាទុកការកំណត់' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
