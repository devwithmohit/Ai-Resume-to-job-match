import React from 'react';
import { UploadForm } from '@/components/upload/UploadForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export const metadata = {
  title: 'AI Resume Scorer - Upload',
  description: 'Upload candidate resumes against a job description',
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">AI Resume-to-Job Match</h1>
          <p className="mt-4 text-lg text-gray-500">
            Paste your job description and upload candidate resumes to instantly rank them using AI.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create Screening Session</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
