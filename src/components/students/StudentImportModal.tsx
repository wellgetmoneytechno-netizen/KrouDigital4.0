import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { normalizeStudentData, isRawStudentEmpty } from '../../lib/studentUtils';
import {
  Upload,
  X,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Trash2,
  Layers,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

interface StudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const StudentImportModal: React.FC<StudentImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { classes, importStudents, language, showToast } = useApp();
  const isKm = language === 'km';

  const [activeTab, setActiveTab] = useState<'FILE' | 'PASTE'>('FILE');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [targetClassId, setTargetClassId] = useState<string>('AUTO');
  const [parsedRows, setParsedRows] = useState<Partial<Student>[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Reset internal state
  const handleReset = () => {
    setSelectedFile(null);
    setPastedText('');
    setParsedRows([]);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Parse raw array of JSON objects into Student models
  const processRawData = (rawList: Record<string, unknown>[]) => {
    if (!rawList || rawList.length === 0) {
      setErrorMessage(isKm ? 'ឯកសារគ្មានទិន្នន័យឡើយ' : 'The file contains no data');
      setParsedRows([]);
      return;
    }

    const studentsList: Student[] = [];

    rawList.forEach((raw, idx) => {
      if (isRawStudentEmpty(raw)) return;

      // Normalize student using 16 fields engine
      const student = normalizeStudentData(raw, idx + 1);

      // Check if row has at least some meaningful information
      const hasMeaningfulContent = Boolean(
        (student.khmer_name && !student.khmer_name.startsWith('សិស្ស #')) ||
        student.english_name ||
        student.phone_number ||
        student.rlc
      );

      if (!hasMeaningfulContent && isRawStudentEmpty(raw)) {
        return; // Skip empty rows
      }

      studentsList.push(student);
    });

    if (studentsList.length === 0) {
      setErrorMessage(isKm ? 'រកមិនឃើញទិន្នន័យសិស្សត្រឹមត្រូវក្នុងឯកសារឡើយ សូមពិនិត្យក្បាលតារាង (Header: khmer_name, english_name, sex, age, grade, ...)' : 'No valid student rows found. Please check file headers.');
    } else {
      setErrorMessage(null);
    }
    setParsedRows(studentsList);
  };

  // Read file using XLSX
  const handleFileChange = async (file: File) => {
    setSelectedFile(file);
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Read rows as array of arrays to find header row even if there are title lines
      const sheetRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });
      let headerRowIndex = 0;
      for (let r = 0; r < Math.min(sheetRows.length, 10); r++) {
        const row = sheetRows[r];
        if (Array.isArray(row)) {
          const joined = row.map(cell => String(cell || '').toLowerCase()).join(' ');
          if (
            joined.includes('khmer') ||
            joined.includes('english') ||
            joined.includes('name') ||
            joined.includes('ឈ្មោះ') ||
            joined.includes('sex') ||
            joined.includes('gender') ||
            joined.includes('ភេទ') ||
            joined.includes('grade') ||
            joined.includes('ថ្នាក់') ||
            joined.includes('rlc') ||
            joined.includes('code') ||
            joined.includes('អត្តលេខ')
          ) {
            headerRowIndex = r;
            break;
          }
        }
      }

      let json: Record<string, unknown>[] = [];
      if (headerRowIndex > 0) {
        const headers = (sheetRows[headerRowIndex] || []).map((h: any) => String(h || '').trim());
        const dataRows = sheetRows.slice(headerRowIndex + 1);
        json = dataRows.map(row => {
          const obj: Record<string, unknown> = {};
          headers.forEach((h, colIdx) => {
            if (h) {
              obj[h] = row[colIdx] !== undefined ? row[colIdx] : '';
            }
          });
          return obj;
        });
      } else {
        json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });
      }

      processRawData(json);
    } catch (err) {
      console.error(err);
      setErrorMessage(isKm ? 'ការអានឯកសារមិនជោគជ័យ សូមផ្ទៀងផ្ទាត់ប្រភេទឯកសារ (.csv, .xlsx, .xls)' : 'Failed to read file. Please ensure it is a valid CSV or Excel file.');
      setParsedRows([]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };

  // Handle Direct Pasted Text (CSV or TSV from Excel)
  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setErrorMessage(isKm ? 'សូមបញ្ចូលទិន្នន័យអត្ថបទជាមុន' : 'Please paste some text first');
      return;
    }
    setIsProcessing(true);
    try {
      // Use XLSX to read plain CSV or tab-delimited text cleanly
      const workbook = XLSX.read(pastedText, { type: 'string' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, { defval: '' });

      processRawData(json);
    } catch (err) {
      console.error(err);
      setErrorMessage(isKm ? 'មិនអាចបម្លែងទិន្នន័យអត្ថបទបានទេ' : 'Could not parse the pasted text');
    } finally {
      setIsProcessing(false);
    }
  };

  // Execute Import
  const handleExecuteImport = async () => {
    if (parsedRows.length === 0) {
      showToast(isKm ? 'គ្មានទិន្នន័យសិស្សសម្រាប់នាំចូលឡើយ' : 'No students to import', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // If user selected a specific class override
      const finalPayload = targetClassId === 'AUTO' 
        ? parsedRows 
        : parsedRows.map(r => {
            const cls = classes.find(c => c.id === targetClassId);
            return {
              ...r,
              classId: targetClassId,
              className: cls?.name || r.className,
              grade: cls?.name || r.grade
            };
          });

      await importStudents(finalPayload);
      handleReset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      showToast(isKm ? 'ការនាំចូលមានបញ្ហា' : 'Failed to import students', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Sample CSV with exact 16 fields matching user schema
  const handleDownloadSampleCSV = () => {
    const sampleData = [
      ['khmer_name', 'english_name', 'sex', 'age', 'grade', 'date_of_birth', 'rlc', 'phone_number', 'contributions', 'remark', 'orther', 'books', 'time_study', 'status', 'semester', 'payment_by'],
      ['ចាន់ សុខុម', 'Chan Sokhum', 'ប្រុស', '17', 'ថ្នាក់ទី១២ ក', '2008-04-12', 'RLC-001', '012 334 455', '$50', 'សិស្សពូកែ', 'គ្មាន', 'បានទទួលរួច', '7:00 - 11:00 AM', 'កំពុងសិក្សា', 'ឆមាសទី១', 'ABA Bank'],
      ['ស៊ូ ស្រីពេជ្រ', 'Sou Sreypich', 'ស្រី', '17', 'ថ្នាក់ទី១២ ក', '2008-08-20', 'RLC-002', '098 776 655', '$50', 'ទៀងទាត់', 'គ្មាន', 'បានទទួលរួច', '7:00 - 11:00 AM', 'កំពុងសិក្សា', 'ឆមាសទី១', 'ACLEDA Bank'],
      ['ហេង វិបុល', 'Heng Vibul', 'ប្រុស', '16', 'ថ្នាក់ទី១១ ខ', '2009-02-15', 'RLC-003', '010 445 566', '$45', 'អាហារូបករណ៍', 'គ្មាន', 'បានទទួលរួច', '1:30 - 5:00 PM', 'កំពុងសិក្សា', 'ឆមាសទី១', 'សាច់ប្រាក់ (Cash)']
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SampleStudents');
    XLSX.writeFile(wb, 'KrouDigital_Student_Import_Template_16Fields.csv');
    showToast(isKm ? 'បានទាញយកគំរូ CSV (16 Fields) ជោគជ័យ' : 'Sample CSV (16 Fields) downloaded');
  };

  // Download Sample Excel (.xlsx) with exact 16 fields matching user schema
  const handleDownloadSampleExcel = () => {
    const sampleData = [
      ['khmer_name', 'english_name', 'sex', 'age', 'grade', 'date_of_birth', 'rlc', 'phone_number', 'contributions', 'remark', 'orther', 'books', 'time_study', 'status', 'semester', 'payment_by'],
      ['ចាន់ សុខុម', 'Chan Sokhum', 'ប្រុស', '17', 'ថ្នាក់ទី១២ ក', '2008-04-12', 'RLC-001', '012 334 455', '$50', 'សិស្សពូកែ', 'គ្មាន', 'បានទទួលរួច', '7:00 - 11:00 AM', 'កំពុងសិក្សា', 'ឆមាសទី១', 'ABA Bank'],
      ['ស៊ូ ស្រីពេជ្រ', 'Sou Sreypich', 'ស្រី', '17', 'ថ្នាក់ទី១២ ក', '2008-08-20', 'RLC-002', '098 776 655', '$50', 'ទៀងទាត់', 'គ្មាន', 'បានទទួលរួច', '7:00 - 11:00 AM', 'កំពុងសិក្សា', 'ឆមាសទី១', 'ACLEDA Bank'],
      ['ហេង វិបុល', 'Heng Vibul', 'ប្រុស', '16', 'ថ្នាក់ទី១១ ខ', '2009-02-15', 'RLC-003', '010 445 566', '$45', 'អាហារូបករណ៍', 'គ្មាន', 'បានទទួលរួច', '1:30 - 5:00 PM', 'កំពុងសិក្សា', 'ឆមាសទី១', 'សាច់ប្រាក់ (Cash)']
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ការគ្រប់គ្រងព័ត៌មានសិស្ស');
    XLSX.writeFile(wb, 'KrouDigital_Student_Import_Template_16Fields.xlsx');
    showToast(isKm ? 'បានទាញយកគំរូ Excel (16 Fields) ជោគជ័យ' : 'Sample Excel (16 Fields) downloaded');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-100 space-y-5 my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100/80 text-cyan-700 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {isKm ? 'នាំចូលទិន្នន័យសិស្ស (CSV / Excel)' : 'Import Students (CSV / Excel)'}
              </h3>
              <p className="text-xs text-slate-500">
                {isKm ? 'គាំទ្រឯកសារ .csv, .xlsx, .xls និងការបិទភ្ជាប់ផ្ទាល់' : 'Supports .csv, .xlsx, .xls and direct copy-paste'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Template Download Banner */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-50/80 p-2 rounded-2xl shrink-0">
          {/* Tabs */}
          <div className="flex items-center bg-white p-1 rounded-xl shadow-2xs border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('FILE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'FILE'
                  ? 'bg-cyan-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-cyan-700'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{isKm ? 'ផ្ទុកឡើងឯកសារ' : 'Upload File'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('PASTE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'PASTE'
                  ? 'bg-cyan-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-cyan-700'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>{isKm ? 'បិទភ្ជាប់អត្ថបទ' : 'Direct Paste'}</span>
            </button>
          </div>

          {/* Sample Templates */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-medium pl-1 hidden sm:inline">
              {isKm ? 'គំរូឯកសារ៖' : 'Templates:'}
            </span>
            <button
              type="button"
              onClick={handleDownloadSampleCSV}
              className="px-2.5 py-1.5 bg-white hover:bg-cyan-50 text-cyan-800 text-[11px] font-bold rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
              title="Download CSV Template"
            >
              <Download className="w-3 h-3 text-cyan-600" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadSampleExcel}
              className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
              title="Download Excel Template"
            >
              <Download className="w-3 h-3 text-emerald-600" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Target Class Assignment Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-cyan-50/50 rounded-2xl border border-cyan-100 shrink-0">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-700" />
            <span className="text-xs font-bold text-slate-800">
              {isKm ? 'ចាត់ចែងចូលថ្នាក់រៀន៖' : 'Assign to Class:'}
            </span>
          </div>
          <select
            value={targetClassId}
            onChange={(e) => setTargetClassId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-cyan-200 rounded-xl font-bold text-cyan-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="AUTO">
              {isKm ? '✨ កំណត់ស្វ័យប្រវត្តិតាមឯកសារ (Auto-detect from file)' : '✨ Auto-detect from file'}
            </option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content Area: Tab 1 File Upload or Tab 2 Paste */}
        <div className="overflow-y-auto flex-1 space-y-4 pr-1">
          {activeTab === 'FILE' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="file-upload-input"
              />

              {!selectedFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center space-y-3 cursor-pointer transition ${
                    isDragging
                      ? 'border-cyan-500 bg-cyan-100/50 ring-4 ring-cyan-500/10'
                      : 'border-cyan-300 hover:border-cyan-400 bg-cyan-50/30 hover:bg-cyan-50/60'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {isKm ? 'ទម្លាក់ឯកសារ CSV ឬ Excel នៅទីនេះ ឬចុចដើម្បីជ្រើសរើស' : 'Drag & drop CSV or Excel file here, or click to browse'}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {isKm ? 'គាំទ្រឯកសារ .csv, .xlsx, .xls រហូតដល់ 10MB' : 'Supports .csv, .xlsx, .xls up to 10MB'}
                    </div>
                  </div>
                  <div className="inline-block px-3 py-1 bg-white rounded-full text-[11px] text-slate-500 border border-cyan-200">
                    {isKm ? 'ក្បាលតារាងគាំទ្រទាំងខ្មែរ និងអង់គ្លេស៖ អត្តលេខ, ឈ្មោះ, ភេទ, ថ្នាក់, ថ្ងៃកំណើត, ទូរស័ព្ទ' : 'Headers support: StudentCode, NameKhmer, Gender, Class, DOB, Phone'}
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {selectedFile.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs text-cyan-700 hover:bg-cyan-50 font-semibold rounded-lg"
                    >
                      {isKm ? 'ប្តូរឯកសារ' : 'Change'}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Direct Paste Tab */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-600" />
                  <span>{isKm ? 'បិទភ្ជាប់ទិន្នន័យពី Excel ឬ Google Sheets៖' : 'Paste rows from Excel or Google Sheets:'}</span>
                </label>
                <button
                  type="button"
                  onClick={handleParsePastedText}
                  disabled={!pastedText.trim()}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition"
                >
                  {isKm ? 'វិភាគទិន្នន័យ' : 'Parse Rows'}
                </button>
              </div>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={5}
                placeholder={`StudentCode\tNameKhmer\tGender\tClassName\tPhone\nKD-001\tកែវ វិបុល\tប្រុស\tថ្នាក់ទី១២ ក\t012334455\nKD-002\tស៊ូ ស្រីនី\tស្រី\tថ្នាក់ទី១២ ក\t098776655`}
                className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          )}

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-700">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-slate-900">
                    {isKm ? `បានរកឃើញទិន្នន័យសិស្សចំនួន ${parsedRows.length} នាក់` : `Found ${parsedRows.length} student records`}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {isKm ? 'បង្ហាញគំរូ ៥ ជួរដំបូង' : 'Previewing first 5 rows'}
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto max-h-56">
                  <table className="w-full text-left text-[11px] border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-amber-100 text-amber-950 font-bold border-b border-amber-200">
                        <th className="py-2 px-3 w-10 text-center">#</th>
                        <th className="py-2 px-3 font-mono text-amber-900">khmer_name</th>
                        <th className="py-2 px-3 font-mono text-amber-900">english_name</th>
                        <th className="py-2 px-3 font-mono text-amber-900 text-center">sex</th>
                        <th className="py-2 px-3 font-mono text-amber-900 text-center">age</th>
                        <th className="py-2 px-3 font-mono text-amber-900">grade</th>
                        <th className="py-2 px-3 font-mono text-amber-900">date_of_birth</th>
                        <th className="py-2 px-3 font-mono text-amber-900">rlc</th>
                        <th className="py-2 px-3 font-mono text-amber-900">phone_number</th>
                        <th className="py-2 px-3 font-mono text-amber-900">contributions</th>
                        <th className="py-2 px-3 font-mono text-amber-900">remark</th>
                        <th className="py-2 px-3 font-mono text-amber-900">orther</th>
                        <th className="py-2 px-3 font-mono text-amber-900">books</th>
                        <th className="py-2 px-3 font-mono text-amber-900">time_study</th>
                        <th className="py-2 px-3 font-mono text-amber-900">status</th>
                        <th className="py-2 px-3 font-mono text-amber-900">semester</th>
                        <th className="py-2 px-3 font-mono text-amber-900">payment_by</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-normal">
                      {parsedRows.slice(0, 8).map((row, i) => (
                        <tr key={i} className="hover:bg-cyan-50/30 transition">
                          <td className="py-1.5 px-3 text-center text-slate-400 font-mono">{i + 1}</td>
                          <td className="py-1.5 px-3 font-bold text-slate-900">{row.khmer_name || row.nameKhmer}</td>
                          <td className="py-1.5 px-3 text-slate-700 font-medium">{row.english_name || row.nameEnglish}</td>
                          <td className="py-1.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              (row.sex === 'ស្រី' || row.gender === 'FEMALE') ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {row.sex || (row.gender === 'FEMALE' ? 'ស្រី' : 'ប្រុស')}
                            </span>
                          </td>
                          <td className="py-1.5 px-3 text-center font-mono text-slate-700">{row.age || '-'}</td>
                          <td className="py-1.5 px-3 font-semibold text-slate-800">{row.grade || row.className}</td>
                          <td className="py-1.5 px-3 font-mono text-slate-600">{row.date_of_birth || row.dob}</td>
                          <td className="py-1.5 px-3 font-mono font-bold text-cyan-800">{row.rlc || row.studentCode}</td>
                          <td className="py-1.5 px-3 font-mono text-slate-600">{row.phone_number || row.phone || '-'}</td>
                          <td className="py-1.5 px-3 font-semibold text-emerald-700">{row.contributions || '-'}</td>
                          <td className="py-1.5 px-3 text-slate-600">{row.remark || '-'}</td>
                          <td className="py-1.5 px-3 text-slate-500">{row.orther || '-'}</td>
                          <td className="py-1.5 px-3 text-slate-700">{row.books || '-'}</td>
                          <td className="py-1.5 px-3 text-slate-700">{row.time_study || '-'}</td>
                          <td className="py-1.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {row.status || 'កំពុងសិក្សា'}
                            </span>
                          </td>
                          <td className="py-1.5 px-3 text-slate-700">{row.semester || 'ឆមាសទី១'}</td>
                          <td className="py-1.5 px-3 font-medium text-slate-800">{row.payment_by || 'ABA Bank'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={() => {
              handleReset();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            {isKm ? 'បោះបង់' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleExecuteImport}
            disabled={parsedRows.length === 0 || isProcessing}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl shadow-md shadow-cyan-600/25 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{isKm ? 'កំពុងនាំចូល...' : 'Importing...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {isKm
                    ? `ដំណើរការនាំចូល (${parsedRows.length} នាក់)`
                    : `Execute Import (${parsedRows.length})`}
                </span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
