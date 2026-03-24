'use client';

import React, { useEffect } from 'react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';

export default function ErrorBoundaryPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // NextJS global handler captures and logs routing and server component boundary cascades.
    console.error('Next.js Page Route Error caught:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center">
        <Alert 
          variant="error" 
          title="Application Navigation Error" 
          description={error.message || 'We could not load this page properly.'} 
        />
        <Button onClick={() => reset()} variant="primary" className="w-full">
          Try again safely
        </Button>
      </div>
    </main>
  );
}
