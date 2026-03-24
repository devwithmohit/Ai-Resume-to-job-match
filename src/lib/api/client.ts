import { CreateSessionRequest, CreateSessionResponse, UploadResumeResponse, ProcessSessionResponse, GetResultsResponse } from '@/types';

class ApiClientError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
    this.name = 'ApiClientError';
  }
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  
  if (response.ok) {
    if (response.headers.get('content-type')?.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    return response.text() as unknown as T;
  }

  let errorData;
  try {
    errorData = await response.json();
  } catch {
    errorData = { error: { message: 'An unknown error occurred' } };
  }

  const message = errorData.error?.message || errorData.error || 'API Request Failed';
  const code = errorData.error?.code || 'UNKNOWN_ERROR';
  throw new ApiClientError(response.status, code, message as string);
}

export const apiClient = {
  createSession: (data: CreateSessionRequest) => 
    fetchApi<CreateSessionResponse>('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  uploadResume: (sessionId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return fetchApi<UploadResumeResponse>(`/api/sessions/${sessionId}/resumes`, {
      method: 'POST',
      body: formData,
    });
  },

  processSession: (sessionId: string) => 
    fetchApi<ProcessSessionResponse>(`/api/sessions/${sessionId}/process`, {
      method: 'POST',
    }),

  getResults: (sessionId: string, limit = 100, offset = 0) => 
    fetchApi<GetResultsResponse>(`/api/sessions/${sessionId}/results?limit=${limit}&offset=${offset}`, {
      method: 'GET',
    }),
};
