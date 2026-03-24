import { NextRequest, NextResponse } from 'next/server';
import { processSession } from '@/lib/services/processor';
import { getSession } from '@/lib/services/session';
import { getPendingResumes } from '@/lib/services/resume';
import { handleApiError } from '@/lib/api/error-handler';
import { uuidSchema } from '@/lib/api/validation';
import type { ProcessSessionResponse } from '@/types';

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    if (!uuidSchema.safeParse(sessionId).success) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
    }

    let session;
    try {
      session = await getSession(sessionId);
    } catch (e: any) {
      if (e.name === 'SessionNotFoundError') {
        return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
      }
      throw e;
    }

    // Atomic pre-check. True locking implemented via processor sequentially inside try{} bounds.
    if (session.status === 'processing') {
      return NextResponse.json({
        error: {
          code: "PROCESSING_ALREADY_ACTIVE",
          message: "Processing is already in progress for this session. Please wait for it to complete."
        }
      }, { status: 409 });
    }

    const pending = await getPendingResumes(sessionId);
    
    // Fire and forget asynchronous processing. Processor logs orchestrator fallbacks internally.
    processSession(sessionId).catch(() => {});

    return NextResponse.json<ProcessSessionResponse>({
      message: `Processing started for ${pending.length} resumes.`
    }, { status: 202 });

  } catch (error) {
    return handleApiError(error, `POST process ${params.sessionId}`);
  }
}
