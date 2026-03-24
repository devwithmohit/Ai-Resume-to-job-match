import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

interface UploadState {
  progress: number;
  isUploading: boolean;
  error: string | null;
}

export function useResumeUpload(sessionId: string) {
  const [uploadState, setUploadState] = useState<UploadState>({ progress: 0, isUploading: false, error: null });

  const uploadFiles = async (files: File[]) => {
    if (!sessionId) return false;
    
    setUploadState({ progress: 0, isUploading: true, error: null });
    
    let successCount = 0;
    let failedCount = 0;
    
    for (let i = 0; i < files.length; i++) {
        try {
            await apiClient.uploadResume(sessionId, files[i]);
            successCount++;
        } catch (error: any) {
            failedCount++;
            console.error('Failed to upload', files[i].name, error);
        }
        
        setUploadState({ 
            progress: Math.round(((i + 1) / files.length) * 100), 
            isUploading: true, 
            error: null 
        });
    }

    setUploadState({ 
        progress: 100, 
        isUploading: false, 
        error: failedCount > 0 ? `Failed to upload ${failedCount} files.` : null 
    });

    return failedCount === 0;
  };

  const startProcessing = async () => {
    try {
        await apiClient.processSession(sessionId);
        return true;
    } catch (error: any) {
        setUploadState(prev => ({ ...prev, error: error.message || 'Failed to start processing' }));
        return false;
    }
  };

  return { uploadFiles, startProcessing, ...uploadState };
}
