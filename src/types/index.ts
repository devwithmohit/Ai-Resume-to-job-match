import { Database } from './database';

// -----------------------------------------------------------------------------
// Database Row Types (Alias)
// -----------------------------------------------------------------------------
export type SessionRow = Database['public']['Tables']['sessions']['Row'];
export type SessionInsert = Database['public']['Tables']['sessions']['Insert'];
export type SessionUpdate = Database['public']['Tables']['sessions']['Update'];

export type ResumeRow = Database['public']['Tables']['resumes']['Row'];
export type ResumeInsert = Database['public']['Tables']['resumes']['Insert'];
export type ResumeUpdate = Database['public']['Tables']['resumes']['Update'];

// -----------------------------------------------------------------------------
// Domain Types (Camel Case for Frontend / Applcation Code)
// -----------------------------------------------------------------------------
export type SessionStatus = SessionRow['status'];
export type ResumeStatus = ResumeRow['status'];

export interface Session {
  id: string;
  jobDescription: string;
  status: SessionStatus;
  createdAt: string;
  processingStartedAt?: string | null;
  completedAt?: string | null;
  lastAccessedAt?: string | null;
}

export interface Resume {
  id: string;
  sessionId: string;
  originalFilename: string;
  s3Key: string;
  status: ResumeStatus;
  score?: number | null;
  reasoning?: string | null;
  processingStartedAt?: string | null;
  processedAt?: string | null;
}

// -----------------------------------------------------------------------------
// API Request & Response Contracts
// -----------------------------------------------------------------------------

// POST /api/sessions
export interface CreateSessionRequest {
  jobDescription: string;
}

export interface CreateSessionResponse {
  sessionId: string;
  message: string;
}

// POST /api/sessions/{sessionId}/resumes
// Uses multipart/form-data for request
export interface UploadResumeResponse {
  resumeId: string;
  message: string;
}

// POST /api/sessions/{sessionId}/process
export interface ProcessSessionResponse {
  message: string;
}

// GET /api/sessions/{sessionId}/results
export interface GetResultsResponse {
  session: {
    id: string;
    status: SessionStatus;
    jobDescription: string;
  };
  resumes: Array<{
    id: string;
    originalFilename: string;
    status: ResumeStatus;
    score: number | null;
    reasoning: string | null;
  }>;
}

// Standard Error Response format for 4xx and 5xx
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
