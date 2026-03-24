import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/services/session';
import { createResume } from '@/lib/services/resume';
import { uploadResumeToS3 } from '@/lib/s3/upload';
import { handleApiError } from '@/lib/api/error-handler';
import { uuidSchema } from '@/lib/api/validation';
import { MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES } from '@/constants';
import type { UploadResumeResponse } from '@/types';
import { supabase } from '@/lib/supabase/client';

export async function POST(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    const sessionIdValidation = uuidSchema.safeParse(sessionId);
    if (!sessionIdValidation.success) {
      return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
    }

    try {
      await getSession(sessionId);
    } catch (e: any) {
      if (e.name === 'SessionNotFoundError') {
        return NextResponse.json({ error: 'Session not found.' }, { status: 404 });
      }
      throw e;
    }

    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: 'Form data is required.' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'File is required.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type) || !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF files are allowed.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File exceeds 5MB limit.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.length < 4 || buffer[0] !== 0x25 || buffer[1] !== 0x50 || buffer[2] !== 0x44 || buffer[3] !== 0x46) {
      return NextResponse.json({ error: 'Invalid or corrupted PDF file.' }, { status: 400 });
    }

    let originalFilename = file.name.replace(/[\/\\]/g, ''); // Path traversal mitigation
    if (!originalFilename) originalFilename = 'unnamed_resume.pdf';

    const resumeId = crypto.randomUUID();
    const s3Key = `uploads/${sessionId}/${resumeId}`;

    await uploadResumeToS3(sessionId, resumeId, buffer, file.type);

    let finalResumeId = resumeId;
    let statusCode = 201;

    try {
      await createResume(sessionId, originalFilename, s3Key);
    } catch (e: any) {
      if (e.name === 'DuplicateResumeError') {
        statusCode = 200;
        // On constraint violation, upload service returns the existing resumeId with 200 OK
        const { data: existing } = await supabase
          .from('resumes')
          .select('id')
          .eq('session_id', sessionId)
          .eq('original_filename', originalFilename)
          .single();
        if (existing) {
          finalResumeId = existing.id;
        }
      } else {
        throw e;
      }
    }

    return NextResponse.json<UploadResumeResponse>({
      resumeId: finalResumeId,
      message: 'Resume uploaded successfully and is pending processing.'
    }, { status: statusCode });
  } catch (error) {
    return handleApiError(error, `POST resumes ${params.sessionId}`);
  }
}
