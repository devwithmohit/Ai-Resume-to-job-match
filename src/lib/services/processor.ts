import { startSessionProcessing, completeSession } from './session';
import { getPendingResumes, markResumeProcessing, updateResumeResult, recoverOrphanedResumes } from './resume';
import { extractTextFromPdf, PdfExtractionError } from '../pdf/extractor';
import { getMatchScore } from '../gemini/client';
import { downloadResumeBuffer } from '../s3/download';
import pino from 'pino';

const logger = pino();

/**
 * Orchestrates the processing of all pending resumes for a session lock.
 * Downloads from S3, parses PDFs natively, queries Gemini models,
 * and maintains atomic DB statuses.
 * 
 * @param sessionId The UUID of the session
 */
export async function processSession(sessionId: string): Promise<void> {
  try {
    // 1. Recover orphaned resumes first
    const orphans = await recoverOrphanedResumes(sessionId);
    if (orphans > 0) {
      logger.info({ sessionId, orphans }, 'Recovered orphaned resumes back to pending state');
    }

    // 2. Lock the session
    // Automatically enforces R001 idempotency and throws SessionConflictError if locked.
    const session = await startSessionProcessing(sessionId);
    const jobDescription = session.jobDescription;

    // 3. Collect pending resumes
    const pendingResumes = await getPendingResumes(sessionId);
    if (pendingResumes.length === 0) {
      await completeSession(sessionId, 'completed');
      logger.info({ sessionId }, 'No pending resumes found, session immediately marked complete');
      return;
    }

    // 4. Batch Processing Queue 
    // Emulates batched asynchronous orchestration natively (avoiding server timeouts where possible).
    const BATCH_SIZE = 10;
    
    for (let i = 0; i < pendingResumes.length; i += BATCH_SIZE) {
      const batch = pendingResumes.slice(i, i + BATCH_SIZE);
      
      await Promise.all(batch.map(async (resume) => {
        try {
          // Lock state machine
          await markResumeProcessing(resume.id);
          
          // Phase 2 Services workflow
          const fileBuffer = await downloadResumeBuffer(resume.s3Key);
          const resumeText = await extractTextFromPdf(fileBuffer);
          const { score, reasoning } = await getMatchScore(resumeText, jobDescription);
          
          await updateResumeResult(resume.id, 'processed', score, reasoning);
          logger.info({ resumeId: resume.id }, 'Successfully processed resume end-to-end');
          
        } catch (error: any) {
           let statusMessage = "Unknown error during processing";
           
           if (error instanceof PdfExtractionError) {
             statusMessage = error.message;
           } else if (error.name === 'GeminiApiError') {
             statusMessage = error.message;
           } else {
             logger.error({ err: error, resumeId: resume.id }, 'Unhandled catastrophic error during resume processing');
           }
           
           // Failsafe update protecting entire batch progression
           await updateResumeResult(resume.id, 'failed', null, statusMessage);
        }
      }));
    }

    // 5. Completion lock
    await completeSession(sessionId, 'completed');
    logger.info({ sessionId }, 'All pending resumes exhausted and session marked as complete');

  } catch (error: any) {
    if (error.name === 'SessionConflictError') {
      logger.info({ sessionId }, 'Processing strictly skipped - Session currently active elsewhere');
      throw error; // Let NextJS route handle 409
    }
    
    logger.error({ err: error, sessionId }, 'Fatal orchestrator crash during session lifecycle');
    await completeSession(sessionId, 'failed').catch(e => logger.error({ err: e }, 'Secondary crash unlocking failed session'));
    throw error;
  }
}
