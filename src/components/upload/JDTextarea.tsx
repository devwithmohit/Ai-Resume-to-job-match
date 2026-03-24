import React from 'react';
import { MIN_JOB_DESCRIPTION_LENGTH, MAX_JOB_DESCRIPTION_LENGTH } from '@/constants';

interface JDTextareaProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
}

export function JDTextarea({ value, onChange, error, disabled }: JDTextareaProps) {
  const wordCount = value.length;
  
  return (
    <div className="space-y-2">
      <label htmlFor="jd" className="text-sm font-medium text-gray-900">Job Description</label>
      <textarea
        id="jd"
        placeholder="Paste the full job description here..."
        className={`flex min-h-[200px] w-full rounded-md border text-gray-900 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={MAX_JOB_DESCRIPTION_LENGTH}
        aria-invalid={!!error}
        aria-describedby={error ? 'jd-error' : undefined}
      />
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span id="jd-error" className="text-red-500">{error}</span>
        <span>
          {wordCount}/{MAX_JOB_DESCRIPTION_LENGTH} characters
        </span>
      </div>
    </div>
  );
}
