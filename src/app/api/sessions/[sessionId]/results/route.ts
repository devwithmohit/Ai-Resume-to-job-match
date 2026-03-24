import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/services/session';
import { getSessionResumes } from '@/lib/services/resume';
import { handleApiError } from '@/lib/api/error-handler';
import { uuidSchema } from '@/lib/api/validation';
import type { GetResultsResponse } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    if (!uuidSchema.safeParse(sessionId).success) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
    }

    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    const offsetParam = url.searchParams.get('offset');
    
    const limit = limitParam ? parseInt(limitParam, 10) : 100;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

    let session;
    try {
      session = await getSession(sessionId);
    } catch (e: any) {
      if (e.name === 'SessionNotFoundError') {
        return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
      }
      throw e;
    }

    const resumes = await getSessionResumes(sessionId, limit, offset);

    return NextResponse.json<GetResultsResponse>({
      session: {
        id: session.id,
        status: session.status,
        jobDescription: session.jobDescription
      },
      resumes: resumes.map(r => ({
        id: r.id,
        originalFilename: r.originalFilename,
        status: r.status,
        score: r.score ?? null,
        reasoning: r.reasoning ?? null
      }))
    }, { status: 200 });

  } catch (error) {
    return handleApiError(error, `GET results ${params.sessionId}`);
  }
}
