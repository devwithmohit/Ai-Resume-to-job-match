import { NextRequest, NextResponse } from 'next/server';
import { createSessionSchema } from '@/lib/api/validation';
import { createSession } from '@/lib/services/session';
import { handleApiError } from '@/lib/api/error-handler';
import type { CreateSessionResponse } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    let body;
    try {
      body = bodyText ? JSON.parse(bodyText) : {};
    } catch {
      body = {};
    }
    
    // Explicit 400 error format requested by API_CONTRACT.md Edge-cases
    if (!body.jobDescription) {
      return NextResponse.json({ error: 'jobDescription is required.' }, { status: 400 });
    }

    const validation = createSessionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.errors[0].message 
      }, { status: 400 });
    }

    const session = await createSession(validation.data.jobDescription);

    return NextResponse.json<CreateSessionResponse>({
      sessionId: session.id,
      message: 'Session created successfully.'
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'POST /api/sessions');
  }
}
