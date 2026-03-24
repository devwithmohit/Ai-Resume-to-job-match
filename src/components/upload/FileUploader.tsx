import React, { useCallback, useState } from 'react';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '@/constants';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

export function FileUploader({ onFilesSelected, disabled }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateAndProcessFiles = (filesList: FileList | null) => {
    if (!filesList) return;
    const files = Array.from(filesList);
    setError(null);

    const validFiles: File[] = [];
    let hasError = false;

    for (const file of files) {
      if (!ALLOWED_MIME_TYPES.includes(file.type) || !file.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF files are allowed.');
        hasError = true;
        break;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setError(`File ${file.name} exceeds the 5MB limit.`);
        hasError = true;
        break;
      }
      validFiles.push(file);
    }

    if (!hasError && validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    validateAndProcessFiles(e.dataTransfer.files);
  }, [disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndProcessFiles(e.target.files);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-900">Upload Resumes (PDF Only)</label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-12 text-center rounded-xl border-2 border-dashed transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' : 'cursor-pointer hover:bg-gray-50 hover:border-blue-400'}
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}`}
      >
        <input
          type="file"
          multiple
          accept=".pdf,application/pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={handleChange}
          disabled={disabled}
        />
        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
        <p className="text-xs text-gray-500">PDF up to 5MB</p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
