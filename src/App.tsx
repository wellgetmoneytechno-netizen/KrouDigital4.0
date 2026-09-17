import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing/LandingPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './components/views/DashboardView';
import { StudentsView } from './components/views/StudentsView';
import { TeachersView } from './components/views/TeachersView';
import { ClassesView } from './components/views/ClassesView';
import { SubjectsView } from './components/views/SubjectsView';
import { AttendanceView } from './components/views/AttendanceView';
import { GradesView } from './components/views/GradesView';
import { ScheduleView } from './components/views/ScheduleView';
import { ExamsView } from './components/views/ExamsView';
import { DocumentsView } from './components/views/DocumentsView';
import { ReportsView } from './components/views/ReportsView';
import { NotificationsView } from './components/views/NotificationsView';
import { SettingsView } from './components/views/SettingsView';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, currentRoute, toast } = useApp();

  // If not logged in, or on the public landing page route
  if (!currentUser || currentRoute === 'landing') {
    return (
      <div className="relative">
        <LandingPage />
        {/* Toast Container */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
            <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold ${
              toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' :
              toast.type === 'error' ? 'bg-rose-600 text-white border-rose-500' :
              'bg-cyan-700 text-white border-cyan-600'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
               toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> :
               <Info className="w-4 h-4" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render current authenticated view
  const renderView = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'teachers':
        return <TeachersView />;
      case 'classes':
        return <ClassesView />;
      case 'subjects':
        return <SubjectsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'grades':
        return <GradesView />;
      case 'schedule':
        return <ScheduleView />;
      case 'exams':
        return <ExamsView />;
      case 'documents':
        return <DocumentsView />;
      case 'reports':
        return <ReportsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <AppLayout>
      {renderView()}

      {/* Global Toast System */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-2.5 text-xs font-semibold ${
            toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' :
            toast.type === 'error' ? 'bg-rose-600 text-white border-rose-500' :
            'bg-cyan-700 text-white border-cyan-600'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
             toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> :
             <Info className="w-4 h-4" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
