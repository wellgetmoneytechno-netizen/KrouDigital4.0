import React, { useState } from 'react';
import { useApp, AppRoute } from '../../context/AppContext';
import { Role } from '../../types';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCheck,
  School,
  BookOpen,
  CalendarCheck,
  Award,
  Calendar,
  ClipboardCheck,
  FolderClosed,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Globe,
  Check,
  Sparkles,
  ExternalLink,
  Shield
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const {
    currentUser,
    role,
    language,
    currentRoute,
    sidebarCollapsed,
    notifications,
    students,
    teachers,
    classes,
    navigate,
    toggleSidebar,
    logout,
    switchRole,
    setLanguage,
    markNotificationRead
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const isKm = language === 'km';
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: { route: AppRoute; labelKm: string; labelEn: string; icon: React.ElementType; badge?: number }[] = [
    { route: 'dashboard', labelKm: 'ផ្ទាំងគ្រប់គ្រង', labelEn: 'Dashboard', icon: LayoutDashboard },
    { route: 'students', labelKm: 'សិស្ស', labelEn: 'Students', icon: Users, badge: students.length },
    { route: 'teachers', labelKm: 'គ្រូបង្រៀន', labelEn: 'Teachers', icon: UserCheck, badge: teachers.length },
    { route: 'classes', labelKm: 'ថ្នាក់រៀន', labelEn: 'Classes', icon: School, badge: classes.length },
    { route: 'subjects', labelKm: 'មុខវិជ្ជា', labelEn: 'Subjects', icon: BookOpen },
    { route: 'attendance', labelKm: 'វត្តមាន', labelEn: 'Attendance', icon: CalendarCheck },
    { route: 'grades', labelKm: 'ពិន្ទុ', labelEn: 'Grades', icon: Award },
    { route: 'schedule', labelKm: 'កាលវិភាគ', labelEn: 'Schedule', icon: Calendar },
    { route: 'exams', labelKm: 'ការប្រឡង', labelEn: 'Exams', icon: ClipboardCheck },
    { route: 'documents', labelKm: 'ឯកសារ', labelEn: 'Documents', icon: FolderClosed },
    { route: 'reports', labelKm: 'របាយការណ៍', labelEn: 'Reports', icon: BarChart3 },
    { route: 'notifications', labelKm: 'ការជូនដំណឹង', labelEn: 'Notifications', icon: Bell, badge: unreadCount },
    { route: 'settings', labelKm: 'ការកំណត់', labelEn: 'Settings', icon: Settings }
  ];

  // Quick search filter
  const searchResults = searchQuery.trim()
    ? students
        .filter(s => s.nameKhmer.includes(searchQuery) || s.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) || s.studentCode.includes(searchQuery))
        .slice(0, 4)
    : [];

  return (
    <div className="min-h-screen bg-[#F0F9FF] flex flex-col antialiased text-slate-800">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <div className="flex flex-1 w-full min-h-screen relative">
        {/* LEFT SIDEBAR (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen z-50 bg-white/95 backdrop-blur-xl border-r border-cyan-100 flex flex-col justify-between transition-all duration-300 shadow-sm ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-cyan-50 flex items-center justify-between">
            <div
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-3 cursor-pointer overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-cyan-600/20 shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              {!sidebarCollapsed && (
                <div className="transition-opacity duration-200">
                  <div className="font-bold text-slate-900 tracking-tight leading-tight">
                    KrouDigital<span className="text-cyan-600">4.0</span>
                  </div>
                  <div className="text-[10px] text-cyan-700 font-medium truncate">
                    {isKm ? 'ការអប់រំឌីជីថល' : 'School System'}
                  </div>
                </div>
              )}
            </div>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 items-center justify-center transition cursor-pointer"
              title={sidebarCollapsed ? 'ពង្រីក' : 'បង្រួញ'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  id={`nav-link-${item.route}`}
                  onClick={() => {
                    navigate(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-teal-500/10 text-cyan-800 font-semibold border-l-4 border-cyan-500 shadow-xs'
                      : 'text-slate-600 hover:bg-cyan-50/60 hover:text-cyan-900'
                  }`}
                  title={isKm ? item.labelKm : item.labelEn}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left truncate">
                      {isKm ? item.labelKm : item.labelEn}
                    </span>
                  )}
                  {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer User Card & Logout */}
          <div className="p-3 border-t border-cyan-50 bg-slate-50/50">
            {!sidebarCollapsed ? (
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-100 shadow-xs">
                <img
                  src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {currentUser?.nameKhmer || 'អ្នកគ្រប់គ្រង'}
                  </div>
                  <div className="text-[10px] text-cyan-600 font-medium uppercase tracking-wider truncate">
                    {role}
                  </div>
                </div>
                <button
                  id="sidebar-logout-btn"
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title={isKm ? 'ចាកចេញ' : 'Logout'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-200"
                />
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title={isKm ? 'ចាកចេញ' : 'Logout'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* TOP NAVBAR */}
          <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-cyan-100/80 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="បើកបញ្ជីជ្រើសរើស"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {navItems.find(i => i.route === currentRoute)?.[isKm ? 'labelKm' : 'labelEn']}
                </h1>
                <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5">
                  <span>KrouDigital4.0</span>
                  <span>/</span>
                  <span className="text-cyan-700 font-medium capitalize">{currentRoute}</span>
                </div>
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="relative flex-1 max-w-xs sm:max-w-md hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="global-search-input"
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isKm ? 'ស្វែងរកសិស្ស គ្រូ ឬកូដសម្គាល់...' : 'Search student, teacher, or ID...'}
                  className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition"
                />
              </div>

              {/* Instant Search Results Dropdown */}
              {searchFocused && searchQuery.trim() && (
                <div
                  onMouseLeave={() => setSearchFocused(false)}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in"
                >
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1">
                    {isKm ? 'លទ្ធផលស្វែងរកសិស្ស' : 'Student Search Results'}
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map(s => (
                      <div
                        key={s.id}
                        onClick={() => {
                          navigate('students');
                          setSearchQuery('');
                          setSearchFocused(false);
                        }}
                        className="px-3 py-2 rounded-xl hover:bg-cyan-50 flex items-center justify-between cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2">
                          <img src={s.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <div className="text-xs font-semibold text-slate-800">{s.nameKhmer}</div>
                            <div className="text-[10px] text-slate-500">{s.studentCode} • {s.className}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-cyan-600 font-medium">{isKm ? 'មើលព័ត៌មាន' : 'View'}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 text-center py-3">
                      {isKm ? 'រកមិនឃើញទិន្នន័យ' : 'No matching results'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Language Switch */}
              <button
                id="topbar-lang-toggle"
                onClick={() => setLanguage(isKm ? 'en' : 'km')}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5"
                title="ប្តូរភាសា / Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-600" />
                <span className="hidden sm:inline">{isKm ? 'ខ្មែរ' : 'EN'}</span>
              </button>

              {/* Notifications Popover */}
              <div className="relative">
                <button
                  id="notifications-popover-btn"
                  onClick={() => setShowNotifMenu(!showNotifMenu)}
                  className="relative p-2 rounded-xl text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 transition cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {showNotifMenu && (
                  <div
                    onMouseLeave={() => setShowNotifMenu(false)}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-cyan-600" />
                        <span>{isKm ? 'ការជូនដំណឹងថ្មីៗ' : 'Recent Notifications'}</span>
                      </div>
                      <button
                        onClick={() => navigate('notifications')}
                        className="text-xs text-cyan-600 hover:underline font-medium"
                      >
                        {isKm ? 'មើលទាំងអស់' : 'View All'}
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                      {notifications.slice(0, 4).map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`py-2.5 px-1 flex items-start gap-2.5 cursor-pointer hover:bg-slate-50 rounded-lg transition ${
                            !n.read ? 'bg-cyan-50/40' : ''
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-cyan-500' : 'bg-transparent'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-800 leading-snug">{n.title}</div>
                            <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.message}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{n.createdAt}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Demo Role Switcher Trigger */}
              <div className="relative">
                <button
                  id="role-switcher-dropdown-btn"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200/80 hover:bg-cyan-100 transition cursor-pointer text-slate-800"
                >
                  <img
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-bold leading-tight">{currentUser?.nameKhmer || 'អភិបាល'}</div>
                    <div className="text-[10px] text-cyan-700 font-semibold">{role}</div>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600 ml-1" />
                </button>

                {/* Role Switch Dropdown */}
                {showRoleMenu && (
                  <div
                    onMouseLeave={() => setShowRoleMenu(false)}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in"
                  >
                    <div className="text-xs font-bold text-slate-500 px-2 py-1 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{isKm ? 'ប្តូរតួនាទីសាកល្បង (RBAC Demo)' : 'Switch Role (RBAC Demo)'}</span>
                    </div>
                    <div className="space-y-1 mt-2">
                      {[
                        { r: 'SUPER_ADMIN' as Role, labelKm: 'អភិបាលកំពូល (Super Admin)', desc: 'សិទ្ធិពេញលេញលើប្រព័ន្ធទាំងមូល' },
                        { r: 'ADMIN' as Role, labelKm: 'អភិបាលសាលា (School Admin)', desc: 'គ្រប់គ្រងគ្រូ សិស្ស និងថ្នាក់' },
                        { r: 'TEACHER' as Role, labelKm: 'គ្រូបង្រៀន (Teacher)', desc: 'កត់ត្រាវត្តមាន ពិន្ទុ និងកាលវិភាគ' },
                        { r: 'STUDENT' as Role, labelKm: 'សិស្សានុសិស្ស (Student)', desc: 'មើលកាលវិភាគ វត្តមាន និងពិន្ទុ' },
                        { r: 'PARENT' as Role, labelKm: 'អាណាព្យាបាល (Parent)', desc: 'តាមដានការសិក្សារបស់កូន' }
                      ].map((item) => (
                        <button
                          key={item.r}
                          onClick={() => {
                            switchRole(item.r);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between cursor-pointer ${
                            role === item.r ? 'bg-cyan-50 text-cyan-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div>
                            <div>{item.labelKm}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{item.desc}</div>
                          </div>
                          {role === item.r && <Check className="w-4 h-4 text-cyan-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* MAIN VIEWPORT */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
