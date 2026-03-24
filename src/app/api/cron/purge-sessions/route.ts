import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import pino from 'pino';

const logger = pino();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Validate standard Vercel Cron auth (optional for local, but best practice)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Exactly 7 days ago
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Supabase JS Delete using logic: deleted if last_accessed_at is strictly older
    // than 7 days threshold, falling back to created_at bounds if it's null natively.
    const { data, error, count } = await supabase
      .from('sessions')
      .delete({ count: 'exact' })
      .or(`last_accessed_at.lt.${cutoffDate},and(last_accessed_at.is.null,created_at.lt.${cutoffDate})`);

    if (error) {
      logger.error({ err: error }, 'Failed to purge old sessions');
      return NextResponse.json({ error: 'Failed to purge' }, { status: 500 });
    }

    logger.info({ deletedCount: count }, 'Successfully purged old sessions automatically');
    
    return NextResponse.json({ success: true, purged: count });

  } catch (error) {
    logger.error({ err: error }, 'Cron execution failed completely');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
