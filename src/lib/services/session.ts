import { supabase } from '@/lib/supabase/client';
import type { Session, SessionInsert } from '@/types';
import pino from 'pino';

const logger = pino();

export class SessionNotFoundError extends Error {
  constructor(sessionId: string) {
    super(`Session ${sessionId} not found.`);
    this.name = 'SessionNotFoundError';
  }
}

export class SessionConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionConflictError';
  }
}

/**
 * Creates a new session with the given job description.
 */
export async function createSession(jobDescription: string): Promise<Session> {
  const payload: SessionInsert = {
    job_description: jobDescription,
    status: 'pending',
  };

  const { data, error } = await supabase
    .from('sessions')
    .insert(payload)
    .select('*')
    .single();

  if (error || !data) {
    logger.error({ err: error }, 'Failed to create session');
    throw new Error('Failed to create session in database.');
  }

  return {
    id: data.id,
    jobDescription: data.job_description,
    status: data.status,
    createdAt: data.created_at,
    processingStartedAt: data.processing_started_at,
    completedAt: data.completed_at,
    lastAccessedAt: data.last_accessed_at,
  };
}

/**
 * Retrieves a session by its ID. Updates last_accessed_at per rule R003.
 */
export async function getSession(id: string): Promise<Session> {
  // Update last accessed immediately
  await updateSessionAccessTime(id);

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    logger.error({ err: error, sessionId: id }, 'Failed to fetch session');
    throw new SessionNotFoundError(id);
  }

  return {
    id: data.id,
    jobDescription: data.job_description,
    status: data.status,
    createdAt: data.created_at,
    processingStartedAt: data.processing_started_at,
    completedAt: data.completed_at,
    lastAccessedAt: data.last_accessed_at,
  };
}

/**
 * Updates a session's last_accessed_at timestamp.
 */
async function updateSessionAccessTime(id: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({ last_accessed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    logger.warn({ err: error, sessionId: id }, 'Could not update session last_accessed_at');
  }
}

/**
 * Atomically marks a session as processing if it is not already.
 * Enforces Rule R001. Returns the updated session or throws conflict.
 */
export async function startSessionProcessing(id: string): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .update({
      status: 'processing',
      processing_started_at: new Date().toISOString()
    })
    .eq('id', id)
    .is('processing_started_at', null)
    .select('*')
    .single();

  if (error) {
     if (error.code === 'PGRST116') {
         // No rows returned because condition processing_started_at IS NULL failed
         throw new SessionConflictError('Processing is already in progress for this session. Please wait for it to complete.');
     }
     logger.error({ err: error, sessionId: id }, 'Failed to start session processing check');
     throw new Error('Database error while attempting to start processing');
  }

  return {
    id: data.id,
    jobDescription: data.job_description,
    status: data.status,
    createdAt: data.created_at,
    processingStartedAt: data.processing_started_at,
    completedAt: data.completed_at,
    lastAccessedAt: data.last_accessed_at,
  };
}

/**
 * Marks session as completed or failed based on resumes execution.
 */
export async function completeSession(id: string, status: 'completed' | 'failed'): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .update({
      status,
      completed_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    logger.error({ err: error, sessionId: id }, `Failed to mark session as ${status}`);
    throw new Error('Database error while completing session');
  }
}
