import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentModel } from '../../types';
import {
  FolderClosed,
  Plus,
  Download,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  HardDrive,
  Cloud,
  FileText,
  FileSpreadsheet,
  AlertCircle,
  Database,
  ArrowUpRight
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    addDocument,
    deleteDocument,
    language,
    showToast,
    isDriveConnected,
    driveUser,
    driveFiles,
    isSyncingDrive,
    connectGoogleDrive,
    disconnectGoogleDriveState,
    syncGoogleDrive,
    uploadFileToDriveAndLibrary,
    backupStudentsToDrive
  } = useApp();

  const isKm = language === 'km';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [storeInDrive, setStoreInDrive] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const [formData, setFormData] = useState<Partial<DocumentModel>>({
    title: '',
    category: 'CURRICULUM',
    fileType: 'PDF',
    fileSize: '2.5 MB'
  });

  const categories = [
    { key: 'ALL', labelKm: 'ទាំងអស់', labelEn: 'All' },
    { key: 'CURRICULUM', labelKm: 'កម្មវិធីសិក្សា', labelEn: 'Curriculum' },
    { key: 'POLICY', labelKm: 'គោលការណ៍ណែនាំ', labelEn: 'Policies' },
    { key: 'WORKSHEET', labelKm: 'សន្លឹកកិច្ចការ', labelEn: 'Worksheets' },
    { key: 'ADMINISTRATIVE', labelKm: 'លិខិតរដ្ឋបាល', labelEn: 'Admin' },
    { key: 'GDRIVE', labelKm: 'Google Drive', labelEn: 'Google Drive' }
  ];

  const matchesCategory = (doc: DocumentModel, catKey: string) => {
    if (catKey === 'ALL') return true;
    if (catKey === 'GDRIVE') return Boolean(doc.isStoredInDrive);
    if (catKey === 'POLICY') return doc.category === 'POLICY' || doc.category === 'REGULATION';
    if (catKey === 'WORKSHEET') return doc.category === 'WORKSHEET' || doc.category === 'EXAM_PAPER';
    if (catKey === 'ADMINISTRATIVE') return doc.category === 'ADMINISTRATIVE' || doc.category === 'FORM' || doc.category === 'LESSON_PLAN';
    return doc.category === catKey;
  };

  const getCategoryCount = (catKey: string) => {
    return documents.filter(d => matchesCategory(d, catKey)).length;
  };

  const filteredDocs = documents.filter(d => matchesCategory(d, selectedCategory));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFormData(prev => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        fileType: ext === 'XLSX' || ext === 'XLS' || ext === 'CSV' ? 'EXCEL' : ext === 'DOCX' || ext === 'DOC' ? 'WORD' : 'PDF',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      }));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast(isKm ? 'សូមបញ្ចូលឈ្មោះឯកសារ' : 'Document title required', 'error');
      return;
    }

    setIsUploading(true);
    try {
      if (selectedFile && storeInDrive) {
        await uploadFileToDriveAndLibrary(selectedFile, formData);
      } else if (selectedFile) {
        // Local upload without drive
        await addDocument({
          ...formData,
          fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
        });
      } else {
        await addDocument(formData);
      }
      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (err: any) {
      showToast(err.message || 'Error uploading document', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = (doc: DocumentModel) => {
    if (doc.driveWebViewLink) {
      window.open(doc.driveWebViewLink, '_blank', 'noopener,noreferrer');
      showToast(isKm ? `កំពុងបើកឯកសារពី Google Drive៖ ${doc.title}` : `Opening from Google Drive: ${doc.title}`);
      return;
    }

    // Generate sample text blob for download
    const blob = new Blob([`KrouDigital4.0 Document: ${doc.title}\nCategory: ${doc.category}\nUploaded on: ${doc.uploadedAt}`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.title}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(isKm ? `បានទាញយកឯកសារ៖ ${doc.title}` : `Downloaded: ${doc.title}`);
  };

  const handleBackupStudents = async () => {
    setIsBackingUp(true);
    try {
      const doc = await backupStudentsToDrive();
      if (doc) {
        showToast(
          isKm
            ? 'បានបម្រុងទុកទិន្នន័យសិស្សទាំង ១៦ វាល ទៅ Google Drive រួចរាល់!'
            : 'Backed up 16-field Student data to Google Drive!'
        );
      }
    } finally {
      setIsBackingUp(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <FolderClosed className="w-6 h-6 text-cyan-600" />
            <span>{isKm ? 'បណ្ណាល័យឯកសារ និងកម្មវិធីសិក្សា' : 'Digital Document Library'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isKm ? 'ផ្ទុកឡើង ទាញយក និងចែករំលែកសៀវភៅសិក្សា គោលការណ៍ណែនាំ និងកិច្ចការសិស្ស' : 'Centralized repository for curriculum guidelines, syllabus, and official forms'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleBackupStudents}
            disabled={isBackingUp}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title={isKm ? 'បម្រុងទុកបញ្ជីសិស្ស ១៦ វាល ទៅ Google Drive' : 'Backup 16-field students to Google Drive'}
          >
            {isBackingUp ? (
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            ) : (
              <Database className="w-4 h-4 text-emerald-600" />
            )}
            <span>{isKm ? 'បម្រុងទុកសិស្ស (១៦វាល) ទៅ Drive' : 'Backup Students (16 Fields) to Drive'}</span>
          </button>

          <button
            onClick={() => {
              setFormData({
                title: '',
                category: 'CURRICULUM',
                fileType: 'PDF',
                fileSize: '2.5 MB'
              });
              setSelectedFile(null);
              setShowUploadModal(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isKm ? 'ផ្ទុកឡើងឯកសារ' : 'Upload Document'}</span>
          </button>
        </div>
      </div>

      {/* Google Drive Integration Status Card */}
      <div className="bg-gradient-to-br from-white to-cyan-50/40 rounded-2xl p-4 sm:p-5 border border-cyan-100 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-cyan-600/10 border border-cyan-200 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {isKm ? 'ការផ្ទុកទិន្នន័យជាមួយ Google Drive' : 'Google Drive Cloud Storage'}
                </h3>
                {isDriveConnected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{isKm ? 'បានភ្ជាប់រួចរាល់' : 'Connected'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>{isKm ? 'មិនទាន់ភ្ជាប់' : 'Not Connected'}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-0.5">
                {isDriveConnected
                  ? (isKm
                      ? `គណនី៖ ${driveUser?.emailAddress || 'wellgetmoneytechno@gmail.com'} • ថត៖ KrouDigital 4.0 - បណ្ណាល័យសាលា`
                      : `Account: ${driveUser?.emailAddress || 'wellgetmoneytechno@gmail.com'} • Folder: KrouDigital 4.0 - School Library`)
                  : (isKm
                      ? 'ផ្ទុកឡើងសៀវភៅសិក្សា ឯកសាររដ្ឋបាល និងបម្រុងទុកបញ្ជីសិស្សទាំង ១៦ វាល ដោយស្វ័យប្រវត្តិក្នុ​ង Google Drive'
                      : 'Store documents, curriculum, and 16-field student backups directly in your Google Drive')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
            {isDriveConnected ? (
              <>
                <button
                  onClick={syncGoogleDrive}
                  disabled={isSyncingDrive}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncingDrive ? 'animate-spin' : ''}`} />
                  <span>{isKm ? 'ធ្វើសមកាលកម្ម' : 'Sync Drive'}</span>
                </button>

                <button
                  onClick={disconnectGoogleDriveState}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl border border-slate-200 hover:border-rose-200 transition cursor-pointer"
                >
                  {isKm ? 'ផ្តាច់ការតភ្ជាប់' : 'Disconnect'}
                </button>
              </>
            ) : (
              <button
                onClick={connectGoogleDrive}
                disabled={isSyncingDrive}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSyncingDrive ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Cloud className="w-4 h-4" />
                )}
                <span>{isKm ? 'ភ្ជាប់ជាមួយ Google Drive' : 'Connect Google Drive'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => {
          const count = getCategoryCount(c.key);
          const isSelected = selectedCategory === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedCategory(c.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-cyan-600 text-white shadow-xs shadow-cyan-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{isKm ? c.labelKm : c.labelEn}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Document Cards */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-100 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center mx-auto">
            <FolderClosed className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">
              {isKm ? 'រកមិនឃើញឯកសារក្នុងប្រភេទនេះទេ' : 'No documents found in this category'}
            </h4>
            <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              {isKm
                ? 'សូមចុចប៊ូតុងខាងក្រោមដើម្បីបន្ថែមឯកសារ ឬបម្រុងទុកទិន្នន័យសិស្សទាំង ១៦ វាល ទៅ Google Drive។'
                : 'Click below to upload a new document or backup 16-field student data to Google Drive.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => {
                const targetCat = (selectedCategory === 'ALL' || selectedCategory === 'GDRIVE') ? 'CURRICULUM' : selectedCategory;
                setFormData({
                  title: '',
                  category: targetCat as any,
                  fileType: 'PDF',
                  fileSize: '2.5 MB'
                });
                setSelectedFile(null);
                setStoreInDrive(selectedCategory === 'GDRIVE');
                setShowUploadModal(true);
              }}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-xs shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isKm ? 'ផ្ទុកឡើងឯកសារ' : 'Upload Document'}</span>
            </button>

            <button
              onClick={handleBackupStudents}
              disabled={isBackingUp}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isBackingUp ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Database className="w-3.5 h-3.5" />
              )}
              <span>{isKm ? 'បម្រុងទុកសិស្សទៅ Drive' : 'Backup Students to Drive'}</span>
            </button>

            {selectedCategory !== 'ALL' && (
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                {isKm ? 'មើលឯកសារទាំងអស់' : 'View All'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-cyan-200 transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs border ${
                    doc.fileType === 'EXCEL' || doc.fileType === 'XLSX'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : doc.fileType === 'WORD' || doc.fileType === 'DOCX'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-cyan-50 text-cyan-700 border-cyan-100'
                  }`}>
                    {doc.fileType}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {doc.isStoredInDrive && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <Cloud className="w-2.5 h-2.5" />
                        <span>Google Drive</span>
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {doc.fileSize}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">{doc.title}</h3>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>{isKm ? 'ផ្ទុកឡើងដោយ៖ ' : 'By: '} {doc.uploadedBy} • {doc.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-cyan-700 font-medium">
                  {doc.category}
                </span>

                <div className="flex items-center gap-1.5">
                  {doc.driveWebViewLink && (
                    <a
                      href={doc.driveWebViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title={isKm ? 'បើកក្នុង Google Drive' : 'Open in Google Drive'}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDownload(doc)}
                    className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isKm ? 'ទាញយក' : 'Download'}</span>
                  </button>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title={isKm ? 'លុបឯកសារ' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'ផ្ទុកឡើងឯកសារថ្មី' : 'Upload Document'}</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {isKm ? 'ចំណងជើងឯកសារ *' : 'Document Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ឧ. កម្មវិធីសិក្សាថ្នាក់ទី១២ ឆ្នាំ២០២៦"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isKm ? 'ប្រភេទទិន្នន័យ' : 'Category'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500"
                  >
                    <option value="CURRICULUM">{isKm ? 'កម្មវិធីសិក្សា' : 'Curriculum'}</option>
                    <option value="POLICY">{isKm ? 'គោលការណ៍ណែនាំ' : 'Policy'}</option>
                    <option value="WORKSHEET">{isKm ? 'សន្លឹកកិច្ចការ' : 'Worksheet'}</option>
                    <option value="ADMINISTRATIVE">{isKm ? 'លិខិតរដ្ឋបាល' : 'Administrative'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {isKm ? 'ទម្រង់ឯកសារ' : 'File Format'}
                  </label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500"
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="WORD">Word (.docx)</option>
                    <option value="EXCEL">Excel (.xlsx)</option>
                  </select>
                </div>
              </div>

              {/* File upload drag & drop dropzone */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-cyan-200 hover:border-cyan-400 rounded-2xl p-4 text-center bg-cyan-50/30 hover:bg-cyan-50/50 transition cursor-pointer"
              >
                <Upload className="w-6 h-6 text-cyan-600 mx-auto" />
                <div className="text-[11px] font-bold text-slate-700 mt-1">
                  {selectedFile ? selectedFile.name : (isKm ? 'ជ្រើសរើសឯកសារពីកុំព្យូទ័រ' : 'Select file from computer')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {selectedFile
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                    : (isKm ? 'គាំទ្រ PDF, Word, Excel, CSV (អតិបរមា 25MB)' : 'PDF, Word, Excel, CSV (Max 25MB)')}
                </div>
              </div>

              {/* Store in Google Drive Checkbox */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={storeInDrive}
                  onChange={(e) => setStoreInDrive(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-800">
                    {isKm ? 'រក្សាទុកក្នុង Google Drive ដោយស្វ័យប្រវត្តិ' : 'Auto-store in Google Drive'}
                  </span>
                  <p className="text-[10px] text-slate-500">
                    {isKm
                      ? 'ឯកសារនឹងត្រូវផ្ទុកឡើងទៅកាន់ថត «KrouDigital 4.0 - បណ្ណាល័យសាលា»'
                      : 'File will be uploaded to "KrouDigital 4.0 - School Library"'}
                  </p>
                </div>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {isKm ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-md shadow-cyan-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isUploading ? (isKm ? 'កំពុងផ្ទុកឡើង...' : 'Uploading...') : (isKm ? 'ផ្ទុកឡើង' : 'Upload')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
