'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JDTextarea } from './JDTextarea';
import { FileUploader } from './FileUploader';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Progress } from '../ui/Progress';
import { useSession } from '@/hooks/useSession';
import { MIN_JOB_DESCRIPTION_LENGTH } from '@/constants';

export function UploadForm() {
  const router = useRouter();
  const [jd, setJd] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [jdError, setJdError] = useState<string>();
  
  const { createSession, isLoading: isCreatingSession, error: sessionError } = useSession();

  const [uploadActive, setUploadActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleFiles = (newFiles: File[]) => {
    // Only append new files mitigating exact dupes optionally 
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (jd.length < MIN_JOB_DESCRIPTION_LENGTH) {
      setJdError('Job description must be at least 20 characters.');
      return;
    }
    if (files.length === 0) {
      setGlobalError('Please upload at least one resume.');
      return;
    }

    setJdError(undefined);
    setGlobalError(null);
    setUploadActive(true);

    try {
      const sessionId = await createSession(jd);
      if (!sessionId) {
        setUploadActive(false);
        return; // Hook catches errors locally
      }

      // Late import pattern isolating window logic
      const { apiClient } = await import('@/lib/api/client');
      
      let failed = 0;
      for (let i = 0; i < files.length; i++) {
        try {
          await apiClient.uploadResume(sessionId, files[i]);
        } catch {
          failed++;
        }
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      if (failed === files.length) {
        setGlobalError('All file uploads failed. Please try again.');
        setUploadActive(false);
        return;
      }

      await apiClient.processSession(sessionId);
      router.push(`/results/${sessionId}`);

    } catch (err: any) {
      setGlobalError(err.message || 'An unexpected error occurred.');
      setUploadActive(false);
    }
  };

  return (
    <div className="space-y-6">
      {(sessionError || globalError) && (
        <Alert variant="error" description={sessionError || globalError || ''} />
      )}
      
      <JDTextarea value={jd} onChange={setJd} error={jdError} disabled={uploadActive} />
      
      <FileUploader onFilesSelected={handleFiles} disabled={uploadActive} />
      
      {files.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Resumes ({files.length})</h4>
          <ul className="space-y-2 max-h-40 overflow-auto">
            {files.map((f, i) => (
              <li key={i} className="flex justify-between items-center text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                <span className="truncate">{f.name}</span>
                {!uploadActive && (
                  <button onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700">Remove</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {uploadActive && (
        <div className="space-y-2" aria-live="polite">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        loading={isCreatingSession || uploadActive}
        disabled={isCreatingSession || uploadActive || files.length === 0}
      >
        {uploadActive ? 'Uploading & Processing...' : 'Score Resumes'}
      </Button>
    </div>
  );
}
