import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Plus,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Clock,
  Send,
  X
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, broadcastAnnouncement, language, showToast } = useApp();
  const isKm = language === 'km';

  const [selectedType, setSelectedType] = useState('ALL');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');

  const filtered = notifications.filter(n => selectedType === 'ALL' || n.type === selectedType);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle || !announcementMessage) {
      showToast(isKm ? 'សូមបញ្ចូលចំណងជើង និងខ្លឹមសារសេចក្តីជូនដំណឹង' : 'Title and message required', 'error');
      return;
    }
    await broadcastAnnouncement(announcementTitle, announcementMessage);
    setShowBroadcastModal(false);
    setAnnouncementTitle('');
    setAnnouncementMessage('');
  };

  const handleMarkAllRead = () => {
    notifications.forEach(n => markNotificationRead(n.id));
    showToast(isKm ? 'បានសម្គាល់ថាបានអានទាំងអស់' : 'All notifications marked as read', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'ការជូនដំណឹង និងសេចក្តីប្រកាស' : 'Notifications & Announcements'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'តាមដានព័ត៌មានពីប្រព័ន្ធ សេចក្តីជូនដំណឹងសាលា និងការប្រកាសជាសាធារណៈ' : 'System updates, alerts, and public school broadcasts'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition cursor-pointer"
          >
            {isKm ? 'សម្គាល់ថាបានអានទាំងអស់' : 'Mark all as read'}
          </button>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Megaphone className="w-4 h-4" />
            <span>{isKm ? 'ផ្សាយសេចក្តីជូនដំណឹង' : 'Broadcast'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: 'ALL', labelKm: 'ទាំងអស់' },
          { key: 'ANNOUNCEMENT', labelKm: 'សេចក្តីប្រកាស' },
          { key: 'ATTENDANCE', labelKm: 'វត្តមាន' },
          { key: 'EXAM', labelKm: 'ការប្រឡង' },
          { key: 'SYSTEM', labelKm: 'ប្រព័ន្ធ' }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setSelectedType(t.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedType === t.key
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {t.labelKm}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`p-4 sm:p-5 flex items-start gap-4 transition cursor-pointer hover:bg-cyan-50/20 ${
              !n.read ? 'bg-cyan-50/40' : ''
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              n.type === 'ANNOUNCEMENT' ? 'bg-purple-100 text-purple-700' :
              n.type === 'EXAM' ? 'bg-amber-100 text-amber-700' :
              n.type === 'ATTENDANCE' ? 'bg-emerald-100 text-emerald-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {n.type === 'ANNOUNCEMENT' ? <Megaphone className="w-5 h-5" /> :
               n.type === 'EXAM' ? <AlertCircle className="w-5 h-5" /> :
               n.type === 'ATTENDANCE' ? <CheckCircle2 className="w-5 h-5" /> :
               <Bell className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{n.title}</h4>
                <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{n.createdAt}</span>
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                  {n.type}
                </span>
                {!n.read && (
                  <span className="text-[10px] font-bold text-cyan-700">
                    {isKm ? '• មិនទាន់អាន' : '• Unread'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BROADCAST MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'ផ្សាយសេចក្តីជូនដំណឹងថ្មី' : 'Broadcast Announcement'}</span>
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ចំណងជើងសេចក្តីជូនដំណឹង *' : 'Title *'}</label>
                <input
                  type="text"
                  required
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="ឧ. កាលវិភាគប្រឡងសាកល្បងថ្នាក់ជាតិ"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ខ្លឹមសារលម្អិត *' : 'Message *'}</label>
                <textarea
                  rows={4}
                  required
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  placeholder="សូមជម្រាបជូនលោកគ្រូអ្នកគ្រូ សិស្សានុសិស្ស..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {isKm ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md shadow-cyan-600/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isKm ? 'ផ្សព្វផ្សាយ' : 'Broadcast Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
