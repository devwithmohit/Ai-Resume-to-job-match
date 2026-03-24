'use client';

import React from 'react';
import { Button } from '../ui/Button';

export function ExportButton({ sessionId }: { sessionId: string }) {
  const handleExport = () => {
    // Navigating explicitly to the /api endpoint acts as an automatic file download
    window.open(`/api/sessions/${sessionId}/export`, '_blank');
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      Export CSV
    </Button>
  );
}
