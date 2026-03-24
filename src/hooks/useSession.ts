import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

export function useSession() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = async (jobDescription: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.createSession({ jobDescription });
      return response.sessionId;
    } catch (err: any) {
      setError(err.message || 'Failed to create session');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createSession, isLoading, error };
}
