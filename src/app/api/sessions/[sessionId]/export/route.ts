import { NextRequest, NextResponse } from 'next/server';
import { getSessionResumes } from '@/lib/services/resume';
import { getSession } from '@/lib/services/session';
import { handleApiError } from '@/lib/api/error-handler';
import { uuidSchema } from '@/lib/api/validation';

/**
 * Mitigates Excel/Google Sheets formula injection vectors explicitly matching MVP docs.
 */
function sanitizeCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  let strValue = String(value);

  // Formula injection prevention ('=', '+', '-', '@')
  if (/^[=+\-@]/.test(strValue)) {
    strValue = "'" + strValue;
  }

  // Escape explicit quotes & delimiters
  if (strValue.includes('"') || strValue.includes(',') || strValue.includes('\n')) {
    strValue = `"${strValue.replace(/"/g, '""')}"`;
  }

  return strValue;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    if (!uuidSchema.safeParse(sessionId).success) {
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

    const resumes = await getSessionResumes(sessionId, 10000, 0);

    const headers = ['Rank', 'Filename', 'Score', 'Reasoning'];
    let csvData = headers.join(', ') + '\n';

    let rank = 1;
    for (const resume of resumes) {
      if (resume.status === 'processed') {
        const row = [
          rank,
          sanitizeCsvCell(resume.originalFilename),
          sanitizeCsvCell(resume.score),
          sanitizeCsvCell(resume.reasoning)
        ];
        csvData += row.join(', ') + '\n';
        rank++;
      } else {
         const row = [
          'N/A',
          sanitizeCsvCell(resume.originalFilename),
          'N/A',
          sanitizeCsvCell(resume.reasoning || resume.status)
        ];
        csvData += row.join(', ') + '\n';
      }
    }

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        // Instructs browser handling standard attachment mechanisms natively
        'Content-Disposition': `attachment; filename="session_results_${sessionId}.csv"`
      }
    });

  } catch (error) {
    return handleApiError(error, `GET export ${params.sessionId}`);
  }
}
