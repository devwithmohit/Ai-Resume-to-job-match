import { supabase } from '@/lib/supabase/client';
import type { Resume, ResumeInsert, ResumeUpdate } from '@/types';
import pino from 'pino';

const logger = pino();

export class DuplicateResumeError extends Error {
  constructor(filename: string) {
    super(`Resume ${filename} already exists in this session.`);
    this.name = 'DuplicateResumeError';
  }
}

/**
 * Creates a new placeholder resume record associated with a session.
 */
export async function createResume(
  sessionId: string,
  originalFilename: string,
  s3Key: string
): Promise<Resume> {
  const payload: ResumeInsert = {
    session_id: sessionId,
    original_filename: originalFilename,
    s3_key: s3Key,
    status: 'pending',
  };

  const { data, error } = await supabase
    .from('resumes')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505') { // Postgres unique constraint violation
      logger.warn({ sessionId, originalFilename }, 'Duplicate resume upload attempted');
      throw new DuplicateResumeError(originalFilename);
    }
    logger.error({ err: error, sessionId }, 'Failed to insert resume');
    throw new Error('Database error while creating resume record');
  }

  return mapResume(data);
}

/**
 * Fetches all resumes for a session with standard pagination
 */
export async function getSessionResumes(
  sessionId: string,
  limit: number = 100,
  offset: number = 0
): Promise<Resume[]> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('session_id', sessionId)
    .order('score', { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (error) {
    logger.error({ err: error, sessionId }, 'Failed to fetch session resumes');
    throw new Error('Failed to retrieve resumes');
  }

  return (data || []).map(mapResume);
}

/**
 * Gets all processing pending resumes for a session
 */
export async function getPendingResumes(sessionId: string): Promise<Resume[]> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('session_id', sessionId)
    .eq('status', 'pending');

  if (error) {
    logger.error({ err: error, sessionId }, 'Failed to fetch pending resumes');
    throw new Error('Failed to retrieve pending resumes');
  }

  return (data || []).map(mapResume);
}

/**
 * Updates a resume's processing status and score
 */
export async function updateResumeResult(
  resumeId: string,
  status: 'processed' | 'failed',
  score?: number | null,
  reasoning?: string | null
): Promise<void> {
  const payload: ResumeUpdate = {
    status,
    processed_at: new Date().toISOString()
  };

  if (score !== undefined) payload.score = score;
  if (reasoning !== undefined) payload.reasoning = reasoning;

  const { error } = await supabase
    .from('resumes')
    .update(payload)
    .eq('id', resumeId);

  if (error) {
    logger.error({ err: error, resumeId }, 'Failed to update resume result');
    throw new Error('Database error while updating resume score');
  }
}

/**
 * Marks a resume as currently processing
 */
export async function markResumeProcessing(resumeId: string): Promise<void> {
  const { error } = await supabase
    .from('resumes')
    .update({
      status: 'processing',
      processing_started_at: new Date().toISOString()
    })
    .eq('id', resumeId);

  if (error) {
    logger.error({ err: error, resumeId }, 'Failed to mark resume as processing');
    throw new Error('Database error while marking resume processing');
  }
}

/**
 * Recovers orphaned resumes (stuck in processing for > 10 mins)
 */
export async function recoverOrphanedResumes(sessionId: string): Promise<number> {
  const tenMinutesAgoMs = Date.now() - 10 * 60 * 1000;
  const tenMinutesAgo = new Date(tenMinutesAgoMs).toISOString();
  
  const { data, error } = await supabase
    .from('resumes')
    .update({
      status: 'pending',
      processing_started_at: null
    })
    .eq('session_id', sessionId)
    .eq('status', 'processing')
    .lt('processing_started_at', tenMinutesAgo)
    .select('id');

  if (error) {
    logger.error({ err: error, sessionId }, 'Failed to recover orphaned resumes');
    return 0; // Soft fail
  }

  return data ? data.length : 0;
}

// Utility mapper matching our core Domain types
function mapResume(data: any): Resume {
  return {
    id: data.id,
    sessionId: data.session_id,
    originalFilename: data.original_filename,
    s3Key: data.s3_key,
    status: data.status,
    score: data.score,
    reasoning: data.reasoning,
    processingStartedAt: data.processing_started_at,
    processedAt: data.processed_at,
  };
}
