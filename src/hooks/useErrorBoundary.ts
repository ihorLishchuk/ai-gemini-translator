import { useState, useEffect } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export const useErrorBoundary = () => {
  const [errorState, setErrorState] = useState<ErrorBoundaryState>({ hasError: false });

  useEffect(() => {
    const handleError = (error: Error, errorInfo: any) => {
      console.error('Error caught by boundary:', error, errorInfo);
      setErrorState({ hasError: true, error });
    };

    window.addEventListener('error', (event) => {
      handleError(event.error, event);
    });

    window.addEventListener('unhandledrejection', (event) => {
      handleError(new Error(event.reason), event);
    });

    return () => {
      window.removeEventListener('error', (event) => {
        handleError(event.error, event);
      });
      window.removeEventListener('unhandledrejection', (event) => {
        handleError(new Error(event.reason), event);
      });
    };
  }, []);

  return errorState;
}; 