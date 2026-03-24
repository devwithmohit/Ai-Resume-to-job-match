import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';
import type { GetResultsResponse } from '@/types';

export function useResults(sessionId: string) {
  const [data, setData] = useState<GetResultsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    if (!sessionId) return;
    try {
      const response = await apiClient.getResults(sessionId);
      setData(response);
      setError(null);
    } catch (err: any) {
      if (err.status === 404) {
          setError('Session not found.');
      } else {
          setError(err.message || 'Failed to load results.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchResults();

    let intervalId: NodeJS.Timeout;
    
    // Poll recursively while active
    if (data?.session.status === 'processing' || data === null) {
      intervalId = setInterval(() => {
        fetchResults();
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sessionId, data?.session.status, fetchResults]);

  return { data, isLoading, error, refetch: fetchResults };
}
