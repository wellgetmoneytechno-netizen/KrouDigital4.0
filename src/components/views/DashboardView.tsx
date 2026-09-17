import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  School,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowUpRight,
  Bell,
  Award,
  Sparkles,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    students,
    teachers,
    classes,
    subjects,
    attendances,
    activities,
    notifications,
    schedules,
    language,
    navigate
  } = useApp();

  const isKm = language === 'km';

  // Attendance metrics
  const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
  const attendanceRate = attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 96;

  // Recharts Data
  const enrollmentData = [
    { grade: isKm ? 'ថ្នាក់ទី១០' : 'Grade 10', count: 145, female: 78, male: 67 },
    { grade: isKm ? 'ថ្នាក់ទី១១' : 'Grade 11', count: 152, female: 84, male: 68 },
    { grade: isKm ? 'ថ្នាក់ទី១២' : 'Grade 12', count: 153, female: 86, male: 67 }
  ];

  const weeklyAttendanceData = [
    { day: isKm ? 'ច័ន្ទ' : 'Mon', rate: 98 },
    { day: isKm ? 'អង្គារ' : 'Tue', rate: 96 },
    { day: isKm ? 'ពុធ' : 'Wed', rate: 95 },
    { day: isKm ? 'ព្រហស្បតិ៍' : 'Thu', rate: 97 },
    { day: isKm ? 'សុក្រ' : 'Fri', rate: 94 },
    { day: isKm ? 'សៅរ៍' : 'Sat', rate: 92 }
  ];

  const gradeDistributionData = [
    { name: 'A (និទ្ទេសល្អប្រសើរ)', value: 35, color: '#06b6d4' },
    { name: 'B (និទ្ទេសល្អណាស់)', value: 28, color: '#3b82f6' },
    { name: 'C (និទ្ទេសល្អ)', value: 20, color: '#10b981' },
    { name: 'D (និទ្ទេសមធ្យម)', value: 12, color: '#f59e0b' },
    { name: 'E (និទ្ទេសខ្សោយ)', value: 5, color: '#ef4444' }
  ];

  // Today's classes
  const todayClasses = schedules.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white shadow-lg shadow-cyan-700/15 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-cyan-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>{isKm ? 'ឆ្នាំសិក្សា ២០២៥-២០២៦ • ឆមាសទី១' : 'Academic Year 2025-2026 • Semester 1'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isKm ? 'សូមស្វាគមន៍មកកាន់ប្រព័ន្ធ KrouDigital4.0' : 'Welcome to KrouDigital4.0 Platform'}
          </h2>
          <p className="text-sm text-cyan-100/90 leading-relaxed">
            {isKm 
              ? 'ទិន្នន័យសិក្សា វត្តមាន និងការវាយតម្លៃពិន្ទុសិស្សត្រូវបានធ្វើបច្ចុប្បន្នភាពតាមពេលវេលាជាក់ស្តែង។' 
              : 'School operations, attendance logging, and student gradebook calculations are active.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 z-10">
          <button
            onClick={() => navigate('students')}
            className="px-4 py-2.5 bg-white text-cyan-800 hover:bg-cyan-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isKm ? 'បន្ថែមសិស្ស' : 'Add Student'}</span>
          </button>
          <button
            onClick={() => navigate('attendance')}
            className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl backdrop-blur-md border border-white/20 transition flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isKm ? 'កត់ត្រាវត្តមាន' : 'Take Attendance'}</span>
          </button>
        </div>
      </div>

      {/* KPI Statistic Cards (Recreating reference layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Students */}
        <div 
          onClick={() => navigate('students')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{isKm ? 'ចំនួនសិស្សសរុប' : 'Total Students'}</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{students.length} {isKm ? 'នាក់' : ''}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +100% {isKm ? 'សកម្ម' : 'active'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isKm ? 'ស្រី ៥០% • ប្រុស ៥០%' : '50% Female • 50% Male'}
          </div>
        </div>

        {/* Card 2: Teachers */}
        <div 
          onClick={() => navigate('teachers')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{isKm ? 'ចំនួនគ្រូបង្រៀន' : 'Total Teachers'}</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{teachers.length} {isKm ? 'រូប' : ''}</span>
            <span className="text-xs font-semibold text-blue-600 flex items-center gap-0.5">
              {isKm ? 'ពេញម៉ោង' : 'Full-time'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isKm ? 'កម្រិតបរិញ្ញាបត្រ និងអនុបណ្ឌិត' : 'Certified Faculty'}
          </div>
        </div>

        {/* Card 3: Classes */}
        <div 
          onClick={() => navigate('classes')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-teal-200 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{isKm ? 'ចំនួនថ្នាក់រៀន' : 'Total Classes'}</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition">
              <School className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{classes.length} {isKm ? 'ថ្នាក់' : ''}</span>
            <span className="text-xs font-semibold text-teal-600">
              {isKm ? 'កម្រិត ១០-១២' : 'Grades 10-12'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isKm ? 'វេនព្រឹក & វេនរសៀល' : 'Morning & Afternoon shifts'}
          </div>
        </div>

        {/* Card 4: Attendance Rate */}
        <div 
          onClick={() => navigate('attendance')}
          className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">{isKm ? 'អត្រាវត្តមានថ្ងៃនេះ' : "Today's Attendance"}</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> {isKm ? 'ខ្ពស់' : 'Optimal'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {isKm ? 'កត់ត្រារួចរាល់ទាន់ពេលវេលា' : 'Recorded on schedule'}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Enrollment breakdown by grade */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isKm ? 'ស្ថិតិចំនួនសិស្សតាមកម្រិតថ្នាក់ (Enrollment by Grade)' : 'Student Enrollment by Grade'}
              </h3>
              <p className="text-xs text-slate-400">
                {isKm ? 'ទិន្នន័យបែងចែកតាមភេទ សិស្សស្រី និងសិស្សប្រុស' : 'Gender distribution across grades'}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-100">
              {isKm ? 'សរុប ៤៥០ នាក់' : 'Total 450'}
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="female" name={isKm ? 'សិស្សស្រី' : 'Female'} fill="#06b6d4" radius={[6, 6, 0, 0]} />
                <Bar dataKey="male" name={isKm ? 'សិស្សប្រុស' : 'Male'} fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Grade Performance Pie */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-600" />
              <span>{isKm ? 'សមាមាត្រនិទ្ទេសពិន្ទុ' : 'Grade Performance'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isKm ? 'ការវាយតម្លៃលទ្ធផលសិក្សាឆមាសទី១' : 'Semester 1 Grade Distribution'}
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {gradeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {gradeDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Classes Schedule + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isKm ? 'កាលវិភាគបង្រៀនថ្ងៃនេះ' : "Today's Timetable"}
              </h3>
            </div>
            <button
              onClick={() => navigate('schedule')}
              className="text-xs text-cyan-600 hover:text-cyan-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>{isKm ? 'មើលកាលវិភាគពេញលេញ' : 'View Full'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {todayClasses.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 py-1 bg-cyan-50 border border-cyan-200 rounded-lg text-center shrink-0">
                    <span className="text-[11px] font-bold text-cyan-800">{item.startTime}</span>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">{item.subjectName}</div>
                    <div className="text-xs text-slate-500">
                      {item.className} • {item.teacherName} • {item.room}
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 shrink-0">
                  {isKm ? 'ម៉ោងទី ' + item.period : 'Period ' + item.period}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities Feed */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isKm ? 'សកម្មភាពថ្មីៗក្នុងប្រព័ន្ធ' : 'Recent Activities'}
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 mt-0.5">
                  {act.type === 'ATTENDANCE' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> :
                   act.type === 'GRADE' ? <Award className="w-3.5 h-3.5 text-cyan-600" /> :
                   act.type === 'STUDENT' ? <Users className="w-3.5 h-3.5 text-blue-600" /> :
                   <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-800">
                    <span className="font-semibold">{act.userName}</span> {act.action} <span className="font-medium text-cyan-800">{act.target}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{act.timeAgo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
