import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Cloud,
  CheckCircle2,
  HelpCircle,
  Key
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { activateSimulatedGoogleDrive } from '../../lib/googleDriveService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleOAuthOriginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language, showToast, setIsDriveConnected, setDriveUser, syncGoogleDrive } = useApp();
  const isKm = language === 'km';

  const [copiedOrigin, setCopiedOrigin] = useState(false);
  const [copiedUri, setCopiedUri] = useState(false);
  const [customClientId, setCustomClientId] = useState(
    localStorage.getItem('krou_google_client_id') || ''
  );
  const [savedClientId, setSavedClientId] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://wellgetmoneytechno-netizen.github.io';

  const currentRedirectUri = typeof window !== 'undefined'
    ? window.location.href.split('?')[0].split('#')[0]
    : 'https://wellgetmoneytechno-netizen.github.io/KrouDigital4.0/';

  const handleCopyOrigin = () => {
    navigator.clipboard.writeText(currentOrigin);
    setCopiedOrigin(true);
    showToast(isKm ? 'បានចម្លង Authorized Origin រួចរាល់!' : 'Copied Authorized Origin!');
    setTimeout(() => setCopiedOrigin(false), 2000);
  };

  const handleCopyUri = () => {
    navigator.clipboard.writeText(currentRedirectUri);
    setCopiedUri(true);
    showToast(isKm ? 'បានចម្លង Redirect URI រួចរាល់!' : 'Copied Redirect URI!');
    setTimeout(() => setCopiedUri(false), 2000);
  };

  const handleSaveCustomClientId = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClientId.trim()) {
      localStorage.removeItem('krou_google_client_id');
      showToast(isKm ? 'បានលុប Custom Client ID' : 'Removed Custom Client ID', 'info');
    } else {
      localStorage.setItem('krou_google_client_id', customClientId.trim());
      showToast(isKm ? 'បានរក្សាទុក Google Client ID ថ្មីរួចរាល់!' : 'Saved custom Google Client ID!');
    }
    setSavedClientId(true);
    setTimeout(() => setSavedClientId(false), 2500);
  };

  const handleActivateSimulation = async () => {
    const { user } = activateSimulatedGoogleDrive();
    setIsDriveConnected(true);
    setDriveUser(user);
    showToast(
      isKm
        ? 'បានបើកដំណើរការ Cloud Drive គំរូ (Local Mode) ដោយជោគជ័យ! អ្នកអាចផ្ទុកឡើង និងបម្រុងទុកទិន្នន័យបានពេញលេញ។'
        : 'Activated Local Cloud Drive mode! You can now store files and backup data.',
      'info'
    );
    await syncGoogleDrive();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-snug">
                {isKm ? 'ដំណោះស្រាយ Error 400: origin_mismatch (Google OAuth)' : 'Fix Error 400: origin_mismatch (Google OAuth)'}
              </h2>
              <p className="text-xs text-blue-100 mt-0.5">
                {isKm
                  ? 'ការកំណត់បន្ថែម Domain ក្នុង Google Cloud Console ឬប្រើប្រាស់ Local Mode'
                  : 'Add authorized domain to Google Cloud Console or activate Local Mode'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Root cause notice */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs leading-relaxed space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isKm ? 'មូលហេតុនៃបញ្ហា' : 'Why this error happened'}</span>
            </div>
            <p>
              {isKm ? (
                <>
                  Google OAuth តម្រូវឱ្យចុះឈ្មោះ Domain របស់គេហទំព័រជាមុនសិន។ ដោយសារតែគេហទំព័រនេះដំណើរការលើ <strong>{currentOrigin}</strong> ដែលជា Domain ថ្មីលើ GitHub Pages ដូច្នេះ Google ទាមទារឱ្យបញ្ចូល Domain នេះក្នុង <strong>Authorized JavaScript origins</strong> នៃ Google Cloud Console។
                </>
              ) : (
                <>
                  Google OAuth blocks domains not listed in the OAuth Client ID configuration. Since this app is running on <strong>{currentOrigin}</strong>, you must whitelist it in the Google Cloud Console credentials.
                </>
              )}
            </p>
          </div>

          {/* Quick Option 1: Instant Local Simulation */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white uppercase tracking-wider mb-1.5">
                  {isKm ? 'ដំណោះស្រាយភ្លាមៗ (ណែនាំ)' : 'Instant Fix (Recommended)'}
                </span>
                <h3 className="text-sm font-bold text-emerald-950">
                  {isKm ? 'បើកដំណើរការ Cloud Storage គំរូ (Local Drive Simulation)' : 'Activate Local Cloud Storage Mode'}
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  {isKm
                    ? 'ដំណើរការដូច Google Drive ពិតប្រាកដ ១០០% ដោយមិនចាំបាច់រៀបចំ Google Cloud Console ឡើយ។ អាចរក្សាទុកឯកសារ និងបម្រុងទុកសិស្សទាំង ១៦ វាលបានភ្លាមៗ!'
                    : 'Provides 100% full Drive features locally without configuring Google Cloud Console. Store docs & backup all 16 student fields.'}
                </p>
              </div>
              <button
                onClick={handleActivateSimulation}
                className="shrink-0 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isKm ? 'បើកប្រើភ្លាមៗ' : 'Activate Now'}</span>
              </button>
            </div>
          </div>

          {/* Option 2: Whitelist in Google Cloud Console */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
              <span>{isKm ? 'ជំហាន Whitelist Domain ក្នុង Google Cloud Console' : 'Whitelist Domain in Google Cloud Console'}</span>
            </h3>

            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside pl-1">
              <li>
                {isKm ? 'ចូលទៅកាន់ ' : 'Visit '}
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                >
                  <span>Google Cloud Console Credentials</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                {isKm
                  ? 'ចុចលើឈ្មោះ OAuth 2.0 Client ID របស់អ្នក'
                  : 'Click on your OAuth 2.0 Client ID name'}
              </li>
              <li>
                {isKm
                  ? 'នៅត្រង់ Authorized JavaScript origins សូមចុច + ADD URI រួចបិទភ្ជាប់ (Paste) តម្លៃខាងក្រោម៖'
                  : 'Under Authorized JavaScript origins, click + ADD URI and paste:'}
              </li>
            </ol>

            {/* Origin Copy Box */}
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
              <div className="flex-1 font-mono text-xs text-slate-800 select-all truncate">
                {currentOrigin}
              </div>
              <button
                onClick={handleCopyOrigin}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedOrigin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedOrigin ? (isKm ? 'បានចម្លង' : 'Copied') : (isKm ? 'ចម្លង URI' : 'Copy URI')}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              {isKm
                ? '* ចំណាំ៖ បន្ទាប់ពី Save ក្នុង Google Cloud Console រួច សូមរង់ចាំប្រហែល ២ ទៅ ៥ នាទីទើប Google ធ្វើបច្ចុប្បន្នភាពរួចរាល់។'
                : '* Note: It can take 2-5 minutes for Google Cloud changes to propagate globally.'}
            </p>
          </div>

          {/* Option 3: Use Custom Google Client ID */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-600" />
              <span>{isKm ? 'ប្រើប្រាស់ Google Client ID ផ្ទាល់ខ្លួន (ប្រសិនបើមាន)' : 'Use Custom Google Client ID (Optional)'}</span>
            </h3>

            <form onSubmit={handleSaveCustomClientId} className="flex gap-2">
              <input
                type="text"
                placeholder="xxxx.apps.googleusercontent.com"
                value={customClientId}
                onChange={(e) => setCustomClientId(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                {savedClientId ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : null}
                <span>{savedClientId ? (isKm ? 'បានរក្សាទុក' : 'Saved') : (isKm ? 'រក្សាទុក' : 'Save')}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {isKm ? 'KrouDigital 4.0 • ប្រព័ន្ធគ្រប់គ្រងសាលារៀនឌីជីថល' : 'KrouDigital 4.0 • Khmer School Platform'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer"
          >
            {isKm ? 'បិទផ្ទាំង' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
