import { NextResponse } from 'next/server';
import pino from 'pino';
import { ApiErrorResponse } from '@/types';

const logger = pino();

export function createErrorResponse(
  code: string,
  message: string,
  status: number = 500,
  details?: Record<string, unknown>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json({
    error: { code, message, details }
  }, { status });
}

export function handleApiError(error: unknown, context?: string): NextResponse {
  logger.error({ err: error, context }, 'Unhandled API Error');
  return createErrorResponse('SERVER_ERROR', 'An internal server error occurred.', 500);
}
