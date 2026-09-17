import React, { useRef, useState } from 'react';
import { Camera, Trash2, Upload, User as UserIcon, Sparkles } from 'lucide-react';

interface ProfilePhotoUploaderProps {
  currentPhotoUrl?: string;
  name?: string;
  gender?: 'MALE' | 'FEMALE';
  onChange: (photoUrl: string) => void;
  isKm?: boolean;
}

// Preset modern student avatars if user wants to pick one quickly
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80'
];

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  currentPhotoUrl,
  name,
  gender,
  onChange,
  isKm = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resize and compress image client-side to ensure lightweight base64 dataURL
  const processAndSetImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(isKm ? 'សូមជ្រើសរើសឯកសាររូបភាព (JPG, PNG, WEBP)' : 'Please select a valid image file');
      return;
    }

    setError(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to crop square and compress
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 360;
        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          onChange(event.target?.result as string);
          setIsProcessing(false);
          return;
        }

        // Center crop square
        const minDimension = Math.min(img.width, img.height);
        const startX = (img.width - minDimension) / 2;
        const startY = (img.height - minDimension) / 2;

        ctx.drawImage(
          img,
          startX,
          startY,
          minDimension,
          minDimension,
          0,
          0,
          MAX_SIZE,
          MAX_SIZE
        );

        // Convert to optimized JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onChange(dataUrl);
        setIsProcessing(false);
      };

      img.onerror = () => {
        setError(isKm ? 'មិនអាចបើករូបភាពបានទេ' : 'Failed to read image');
        setIsProcessing(false);
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setError(isKm ? 'មានបញ្ហាក្នុងការអានឯកសារ' : 'Error reading file');
      setIsProcessing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processAndSetImage(file);
    }
  };

  const handleRemovePhoto = () => {
    // Reset to empty so default initial/placeholder shows
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const initialLetter = name ? name.trim().charAt(0) : (gender === 'FEMALE' ? 'ស' : 'ស');

  return (
    <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/80 space-y-3">
      <div className="flex items-center gap-4">
        {/* Avatar Circle with Drop Target & Hover Overlay */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative group w-18 h-18 rounded-2xl overflow-hidden border-2 cursor-pointer transition shadow-xs shrink-0 flex items-center justify-center ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-slate-200 hover:border-blue-400 bg-white'
          }`}
          title={isKm ? 'ចុចដើម្បីប្តូររូបថត' : 'Click to change photo'}
        >
          {currentPhotoUrl ? (
            <img
              src={currentPhotoUrl}
              alt={name || 'Profile'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder on error
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center font-bold text-xl ${
              gender === 'FEMALE' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {initialLetter || <UserIcon className="w-8 h-8 text-slate-400" />}
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-slate-900/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-[1px]">
            <Camera className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-bold">{isKm ? 'ប្តូររូប' : 'Change'}</span>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Action Buttons & Info */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>{isKm ? 'រូបថតប្រវត្តិរូបសិស្ស' : 'Student Profile Photo'}</span>
            </span>
            {currentPhotoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-[11px] text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                title={isKm ? 'លុបរូបថត' : 'Remove photo'}
              >
                <Trash2 className="w-3 h-3" />
                <span>{isKm ? 'លុបរូប' : 'Remove'}</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-tight">
            {isKm 
              ? 'ទម្លាក់រូបភាពនៅទីនេះ ឬចុចប៊ូតុងខាងក្រោមដើម្បីជ្រើសរើស (JPG, PNG, WEBP)'
              : 'Drag & drop image here or browse from device (JPG, PNG, WEBP)'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <button
              type="button"
              id="upload-profile-btn"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 text-[11px] font-semibold rounded-lg border border-slate-300 shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>{isKm ? 'ជ្រើសរើសរូបថត...' : 'Upload Photo...'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-medium rounded-lg transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{isKm ? 'រូបគំរូ' : 'Presets'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Presets popdown */}
      {showPresets && (
        <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-[10px] font-semibold text-slate-500">
            {isKm ? 'ជ្រើសរើសរូបថតគំរូស្វ័យប្រវត្តិ៖' : 'Or select a quick avatar:'}
          </div>
          <div className="flex items-center gap-2">
            {PRESET_AVATARS.map((url, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onChange(url);
                  setShowPresets(false);
                }}
                className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition hover:scale-105 shrink-0 ${
                  currentPhotoUrl === url ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-[11px] text-rose-600 font-medium bg-rose-50 px-2.5 py-1 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};
