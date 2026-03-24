import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Intercept explicit API session paths checking session presence format mapped in API Contracts
  const sessionMatch = pathname.match(/^\/api\/sessions\/([^\/]+)(?:\/|$)/);
  if (sessionMatch) {
    const sessionId = sessionMatch[1];
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    // Check if what looks like an ID fails the precise Version 4 UUID matching
    if (!uuidRegex.test(sessionId)) {
      return NextResponse.json({ error: 'Invalid or missing Session ID format.' }, { status: 404 });
    }
  }

  return NextResponse.next();
}

/**
 * Configure matching limits preventing full asset interception runs
 */
export const config = {
  matcher: ['/api/sessions/:path*'],
};
