import React from 'react';
import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" className="text-blue-600" />
        {/* aria-live="polite" natively announces initialization events mapping UI spec accessibility demands */}
        <p className="text-sm font-medium text-gray-500" aria-live="polite">Loading interface...</p>
      </div>
    </div>
  );
}
