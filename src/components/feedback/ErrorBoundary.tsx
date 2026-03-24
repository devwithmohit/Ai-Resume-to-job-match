'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from '../ui/Alert';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Secure client-side logging preventing browser crash cascades.
    // In production, sync to Sentry/DataDog via analytics.ts
    console.error('Uncaught component boundary error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center w-full min-h-[50vh]">
          <div className="max-w-lg w-full">
            <Alert 
              variant="error" 
              title="Component rendering failure" 
              description={this.state.error?.message || 'An unexpected application rendering error occurred. Please refresh.'} 
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
