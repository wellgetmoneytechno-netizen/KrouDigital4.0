import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentModel } from '../../types';
import {
  FolderClosed,
  Plus,
  Download,
  FileText,
  FileSpreadsheet,
  FileCode,
  Trash2,
  X,
  Upload,
  CheckCircle2
} from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { documents, addDocument, language, showToast } = useApp();
  const isKm = language === 'km';

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState<Partial<DocumentModel>>({
    title: '',
    category: 'CURRICULUM',
    fileType: 'PDF',
    fileSize: '3.5 MB'
  });

  const categories = [
    { key: 'ALL', labelKm: 'ទាំងអស់', labelEn: 'All' },
    { key: 'CURRICULUM', labelKm: 'កម្មវិធីសិក្សា', labelEn: 'Curriculum' },
    { key: 'POLICY', labelKm: 'គោលការណ៍ណែនាំ', labelEn: 'Policies' },
    { key: 'WORKSHEET', labelKm: 'សន្លឹកកិច្ចការ', labelEn: 'Worksheets' },
    { key: 'ADMINISTRATIVE', labelKm: 'លិខិតរដ្ឋបាល', labelEn: 'Admin' }
  ];

  const filteredDocs = documents.filter(d => {
    return selectedCategory === 'ALL' || d.category === selectedCategory;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast(isKm ? 'សូមបញ្ចូលឈ្មោះឯកសារ' : 'Document title required', 'error');
      return;
    }
    await addDocument(formData);
    setShowUploadModal(false);
  };

  const handleDownload = (doc: DocumentModel) => {
    // Generate sample text blob for realistic download experience
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

        <button
          onClick={() => {
            setFormData({
              title: '',
              category: 'CURRICULUM',
              fileType: 'PDF',
              fileSize: '2.5 MB'
            });
            setShowUploadModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-600/20 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isKm ? 'ផ្ទុកឡើងឯកសារ' : 'Upload Document'}</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedCategory(c.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              selectedCategory === c.key
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {isKm ? c.labelKm : c.labelEn}
          </button>
        ))}
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-cyan-200 transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs border border-cyan-100">
                  {doc.fileType}
                </div>

                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-600">
                  {doc.fileSize}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2">{doc.title}</h3>
                <div className="text-[11px] text-slate-400 mt-1">
                  {isKm ? 'ផ្ទុកឡើងដោយ៖ ' : 'By: '} {doc.uploadedBy} • {doc.uploadedAt}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-cyan-700 font-medium">
                {doc.category}
              </span>

              <button
                onClick={() => handleDownload(doc)}
                className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isKm ? 'ទាញយក' : 'Download'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-600" />
                <span>{isKm ? 'ផ្ទុកឡើងឯកសារថ្មី' : 'Upload Document'}</span>
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ចំណងជើងឯកសារ *' : 'Document Title *'}</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ឧ. កម្មវិធីសិក្សាថ្នាក់ទី១២ ឆ្នាំ២០២៦"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ប្រភេទទិន្នន័យ' : 'Category'}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="CURRICULUM">{isKm ? 'កម្មវិធីសិក្សា' : 'Curriculum'}</option>
                    <option value="POLICY">{isKm ? 'គោលការណ៍ណែនាំ' : 'Policy'}</option>
                    <option value="WORKSHEET">{isKm ? 'សន្លឹកកិច្ចការ' : 'Worksheet'}</option>
                    <option value="ADMINISTRATIVE">{isKm ? 'លិខិតរដ្ឋបាល' : 'Administrative'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isKm ? 'ទម្រង់ឯកសារ' : 'File Format'}</label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="PDF">PDF</option>
                    <option value="WORD">Word (.docx)</option>
                    <option value="EXCEL">Excel (.xlsx)</option>
                  </select>
                </div>
              </div>

              <div className="border-2 border-dashed border-cyan-200 rounded-2xl p-4 text-center bg-cyan-50/20 cursor-pointer">
                <Upload className="w-6 h-6 text-cyan-600 mx-auto" />
                <div className="text-[11px] font-semibold text-slate-700 mt-1">
                  {isKm ? 'ជ្រើសរើសឯកសារពីកុំព្យូទ័រ (អតិបរមា 25MB)' : 'Select file (Max 25MB)'}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  {isKm ? 'បោះបង់' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl shadow-md shadow-cyan-600/20"
                >
                  {isKm ? 'ផ្ទុកឡើង' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
