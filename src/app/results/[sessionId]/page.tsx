'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useResults } from '@/hooks/useResults';
import { Card, CardContent } from '@/components/ui/Card';
import { ResultsTable } from '@/components/results/ResultsTable';
import { ExportButton } from '@/components/results/ExportButton';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Progress } from '@/components/ui/Progress';

export default function ResultsPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  
  const { data, isLoading, error } = useResults(sessionId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 max-w-4xl mx-auto">
        <Alert variant="error" title="Failed to load results" description={error || 'Unknown error'} />
      </div>
    );
  }

  const { session, resumes } = data;
  
  const isProcessing = session.status === 'processing' || session.status === 'pending';
  const total = resumes.length;
  const processed = resumes.filter(r => r.status === 'processed' || r.status === 'failed').length;
  const progressPercent = total === 0 ? 0 : Math.round((processed / total) * 100);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Session Results</h1>
            <p className="mt-1 text-sm text-gray-500">ID: {session.id}</p>
          </div>
          <ExportButton sessionId={session.id} />
        </div>

        {isProcessing && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex justify-between text-sm font-medium text-blue-900 mb-2">
                <span aria-live="polite">AI is analyzing {total} resumes...</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </CardContent>
          </Card>
        )}

        {session.status === 'failed' && (
          <Alert variant="error" title="Session Failed" description="A fatal error occurred validating these documents." />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 border-r border-gray-200 pr-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-lg">Job Description</h3>
            <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-md h-[400px] overflow-auto whitespace-pre-wrap">
              {session.jobDescription}
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <Card className="overflow-hidden shadow-sm">
              <ResultsTable resumes={resumes} />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
