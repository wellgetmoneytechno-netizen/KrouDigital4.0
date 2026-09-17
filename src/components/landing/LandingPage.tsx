import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';
import { 
  GraduationCap, 
  Eye, 
  EyeOff, 
  Lock, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  BookOpen, 
  ArrowRight,
  HelpCircle,
  X,
  School
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login, language, setLanguage, showToast } = useApp();
  
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('SUPER_ADMIN');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const isKm = language === 'km';

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await login(username, selectedRole);
    setIsSubmitting(false);
  };

  const handleQuickLogin = async (role: Role, userCode: string) => {
    setSelectedRole(role);
    setUsername(userCode);
    setIsSubmitting(true);
    await login(userCode, role);
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    await login('google_user@kroudigital.edu.kh', selectedRole);
    setIsSubmitting(false);
  };

  const handleTelegramLogin = async () => {
    setIsSubmitting(true);
    await login('telegram_user@kroudigital.edu.kh', selectedRole);
    setIsSubmitting(false);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast(isKm ? 'សូមបញ្ចូលអ៊ីមែល ឬឈ្មោះអ្នកប្រើប្រាស់' : 'Please enter your email or username', 'error');
      return;
    }
    showToast(isKm ? 'តំណភ្ជាប់កំណត់ពាក្យសម្ងាត់ថ្មីត្រូវបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នក' : 'Password reset link sent to your email', 'success');
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E0F7FA] via-[#F0FDF4]/50 to-[#E8F4FD] flex flex-col justify-between relative overflow-hidden text-slate-800">
      {/* Decorative subtle ambient gradient orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-300/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 ring-4 ring-white/60">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">KrouDigital<span className="text-cyan-600">4.0</span></span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-cyan-100 text-cyan-800 rounded-full border border-cyan-200/60">
                {isKm ? 'ជំនាន់ ២០២៦' : 'v4.0 Pro'}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              {isKm ? 'ប្រព័ន្ធគ្រប់គ្រងសាលារៀន និងការអប់រំឌីជីថលកម្ពុជា' : 'Cambodian Digital Education Platform'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            id="lang-switcher-btn"
            onClick={() => setLanguage(isKm ? 'en' : 'km')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm hover:bg-white text-slate-700 transition"
            title="ប្តូរភាសា / Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-600" />
            <span>{isKm ? 'ភាសាខ្មែរ (KM)' : 'English (EN)'}</span>
          </button>

          <a
            href="#demo-credentials"
            className="text-xs font-semibold text-cyan-700 hover:text-cyan-800 bg-cyan-50/80 px-3 py-1.5 rounded-full border border-cyan-200/50 transition hidden md:inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isKm ? 'គណនីសាកល្បង' : 'Demo Accounts'}</span>
          </a>
        </div>
      </header>

      {/* Main Content: Split Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* Left Side: Hero Brand & Dashboard Live Preview */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/70 border border-cyan-200 text-cyan-800 text-xs font-semibold w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {isKm ? 'ស្តង់ដារអប់រំសតវត្សរ៍ទី២១ នៃព្រះរាជាណាចក្រកម្ពុជា' : 'Cambodian 21st Century Education Standard'}
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.25] tracking-tight">
              {isKm ? (
                <>
                  ប្រព័ន្ធគ្រប់គ្រងសាលារៀន <br className="hidden sm:block" />
                  និងការអប់រំឌីជីថល <span className="text-cyan-600 underline decoration-cyan-400 decoration-wavy decoration-2">KrouDigital4.0</span>
                </>
              ) : (
                <>
                  Khmer Digital School Management <br className="hidden sm:block" />
                  & Education Platform <span className="text-cyan-600">4.0</span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              {isKm 
                ? 'ដំណោះស្រាយបច្ចេកវិទ្យាពេញលេញសម្រាប់គណៈគ្រប់គ្រង លោកគ្រូអ្នកគ្រូ សិស្សានុសិស្ស និងអាណាព្យាបាល៖ តាមដានវត្តមាន កត់ត្រាពិន្ទុ កាលវិភាគ និងវិភាគលទ្ធផលសិក្សាដោយស្វ័យប្រវត្តិ។' 
                : 'A comprehensive, modern cloud solution for school leadership, teachers, students, and parents: automated attendance tracking, instant gradebook calculations, timetable scheduling, and performance analytics.'}
            </p>
          </div>

          {/* Live Interactive Hero Dashboard Card (Replicating the reference preview) */}
          <div className="relative rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-xl border border-white/80 p-5 sm:p-6 shadow-xl shadow-cyan-900/5 space-y-4 ring-1 ring-cyan-100/50">
            {/* Top Bar of Preview */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-semibold text-slate-500">
                  {isKm ? 'ផ្ទាំងបញ្ជាទិន្នន័យផ្ទាល់ (Live Demo View)' : 'Live School Dashboard'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {isKm ? 'ប្រព័ន្ធដំណើរការប្រក្រតី' : 'All Services Active'}
              </div>
            </div>

            {/* Quick Metrics in preview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-cyan-50 to-white p-3 rounded-xl border border-cyan-100/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{isKm ? 'សិស្សសរុប' : 'Students'}</span>
                  <Users className="w-4 h-4 text-cyan-600" />
                </div>
                <div className="text-xl font-bold text-slate-800 mt-1">៤៥០+</div>
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> +12% {isKm ? 'ឆ្នាំនេះ' : 'this year'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-xl border border-blue-100/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{isKm ? 'អត្រាវត្តមាន' : 'Attendance'}</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-slate-800 mt-1">៩៦.៨%</div>
                <div className="text-[11px] text-blue-600 font-medium mt-0.5">
                  {isKm ? 'កម្រិតខ្ពស់' : 'High rate'}
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-white p-3 rounded-xl border border-teal-100/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{isKm ? 'កម្រិតពិន្ទុ' : 'Pass Rate'}</span>
                  <BookOpen className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-xl font-bold text-slate-800 mt-1">៩៨.២%</div>
                <div className="text-[11px] text-teal-600 font-medium mt-0.5">
                  A & B: 74%
                </div>
              </div>
            </div>

            {/* Timetable Snippet in Preview */}
            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-xs">
                  A1
                </div>
                <div>
                  <div className="font-semibold text-slate-800">
                    {isKm ? 'ថ្នាក់ទី១២ ក • ភាសាខ្មែរ (បន្ទប់ A101)' : 'Grade 12A • Khmer (Room A101)'}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    {isKm ? 'អ្នកគ្រូ ចាន់ សុខា • ម៉ោង ០៧:៣០ - ០៨:២០' : 'Chan Sokha • 07:30 - 08:20'}
                  </div>
                </div>
              </div>
              <span className="px-2 py-1 rounded-md bg-cyan-100 text-cyan-800 font-medium text-[11px]">
                {isKm ? 'កំពុងបង្រៀន' : 'Ongoing'}
              </span>
            </div>
          </div>

          {/* Demo account fast access pill row */}
          <div id="demo-credentials" className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              {isKm ? 'ចុចចូលភ្លាមៗជាមួយគណនីគំរូ (One-Click Demo Login):' : 'Instant One-Click Demo Logins:'}
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('SUPER_ADMIN', 'superadmin')}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 rounded-lg border border-slate-200 hover:border-cyan-300 shadow-sm transition flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                {isKm ? 'អភិបាលកំពូល (Super Admin)' : 'Super Admin'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('TEACHER', 'teacher.sokha')}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 rounded-lg border border-slate-200 hover:border-cyan-300 shadow-sm transition flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                {isKm ? 'គ្រូបង្រៀន (អ្នកគ្រូ ចាន់ សុខា)' : 'Teacher (Chan Sokha)'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('STUDENT', 'student.dara')}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 rounded-lg border border-slate-200 hover:border-cyan-300 shadow-sm transition flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                {isKm ? 'សិស្ស (សុខ ចាន់ដារ៉ា)' : 'Student (Sok Chandara)'}
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('PARENT', 'parent.channy')}
                className="px-3 py-1.5 text-xs font-medium bg-white hover:bg-cyan-50 text-slate-700 hover:text-cyan-700 rounded-lg border border-slate-200 hover:border-cyan-300 shadow-sm transition flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {isKm ? 'អាណាព្យាបាល (អ្នកស្រី ចាន់នី)' : 'Parent (Mrs. Channy)'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Modern Khmer Login Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-900/10 border border-slate-100 ring-1 ring-cyan-100">
            {/* Card Header */}
            <div className="text-center space-y-1.5 mb-6">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-2 border border-cyan-100">
                <School className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {isKm ? 'ចូលប្រើប្រព័ន្ធ' : 'Sign In'}
              </h2>
              <p className="text-xs text-slate-500">
                {isKm ? 'សូមបញ្ចូលឈ្មោះគណនី ឬអ៊ីមែលរបស់អ្នក' : 'Enter your credentials to access the platform'}
              </p>
            </div>

            {/* Role Switcher Pills */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isKm ? 'ជ្រើសរើសតួនាទីរបស់អ្នក' : 'Select your role'}
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setSelectedRole('SUPER_ADMIN'); setUsername('superadmin'); }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                    selectedRole === 'SUPER_ADMIN' || selectedRole === 'ADMIN'
                      ? 'bg-white text-cyan-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isKm ? 'អភិបាល' : 'Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRole('TEACHER'); setUsername('teacher.sokha'); }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                    selectedRole === 'TEACHER'
                      ? 'bg-white text-cyan-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isKm ? 'គ្រូបង្រៀន' : 'Teacher'}
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRole('STUDENT'); setUsername('student.dara'); }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition ${
                    selectedRole === 'STUDENT'
                      ? 'bg-white text-cyan-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isKm ? 'សិស្ស' : 'Student'}
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  {isKm ? 'ឈ្មោះគណនី ឬ អ៊ីមែល' : 'Username or Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    id="login-username-input"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isKm ? 'ឧ. superadmin ឬ admin@kroudigital.edu.kh' : 'e.g. superadmin'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isKm ? 'ពាក្យសម្ងាត់' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-cyan-600 hover:text-cyan-700 hover:underline font-medium"
                  >
                    {isKm ? 'ភ្លេចពាក្យសម្ងាត់?' : 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Primary Turquoise Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-600/20 hover:shadow-cyan-600/30 transition duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isKm ? 'ចូលប្រើ' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400 font-medium">
                  {isKm ? 'ឬចូលប្រើជាមួយ' : 'or continue with'}
                </span>
              </div>
            </div>

            {/* Social Logins: Google & Telegram */}
            <div className="space-y-2.5">
              <button
                id="google-login-btn"
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isKm ? 'ចូលប្រើជាមួយ Google' : 'Continue with Google'}</span>
              </button>

              <button
                id="telegram-login-btn"
                type="button"
                onClick={handleTelegramLogin}
                className="w-full py-2.5 px-4 bg-[#229ED9]/10 hover:bg-[#229ED9]/15 border border-[#229ED9]/30 rounded-xl text-xs font-semibold text-[#0088cc] shadow-sm transition flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-2.02 1.29-5.7 3.77-.54.37-1.03.55-1.47.54-.48-.01-1.4-.27-2.09-.49-.84-.27-1.51-.42-1.45-.88.03-.24.38-.49 1.03-.75 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.65-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.22z"/>
                </svg>
                <span>{isKm ? 'ចូលប្រើជាមួយ Telegram' : 'Continue with Telegram'}</span>
              </button>
            </div>

            {/* Footer Notice */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                {isKm ? 'ប្រព័ន្ធការពារសុវត្ថិភាព 256-bit' : '256-bit SSL Encrypted'}
              </span>
              <span className="hover:text-slate-600 cursor-pointer">
                {isKm ? 'ជំនួយបច្ចេកទេស' : 'Support'}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-600" />
                {isKm ? 'កំណត់ពាក្យសម្ងាត់ថ្មី' : 'Reset Password'}
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {isKm 
                ? 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក។ យើងនឹងផ្ញើតំណភ្ជាប់ដើម្បីបង្កើតពាក្យសម្ងាត់ថ្មី។' 
                : 'Enter your registered email address and we will send you a password recovery link.'}
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isKm ? 'អ៊ីមែល ឬ ឈ្មោះអ្នកប្រើប្រាស់' : 'Email or Username'}
                </label>
                <input
                  type="text"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@kroudigital.edu.kh"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  {isKm ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-md shadow-cyan-600/20 transition"
                >
                  {isKm ? 'ផ្ញើតំណភ្ជាប់' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-500 z-10 border-t border-cyan-100/60 bg-white/40 backdrop-blur-xs">
        <p>
          © 2026 <span className="font-semibold text-slate-700">KrouDigital4.0</span> — {isKm ? 'រក្សាសិទ្ធិគ្រប់យ៉ាងដោយក្រសួងអប់រំ និងដៃគូបច្ចេកវិទ្យាឌីជីថល' : 'All rights reserved. Khmer Digital Education Platform.'}
        </p>
      </footer>
    </div>
  );
};
