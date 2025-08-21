import React, { ReactNode } from 'react';
import { useErrorBoundary } from '../hooks/useErrorBoundary';

interface Props {
  children: ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const { hasError } = useErrorBoundary();

  const errorComponent = (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-red-50 text-red-600">
        <h2 className="mb-4 text-2xl font-bold">Something went wrong.</h2>
        <p className="mb-8 text-gray-600">Please refresh the page and try again.</p>
        <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 text-white border-none rounded-lg text-base cursor-pointer transition-colors hover:bg-red-700"
        >
          Refresh Page
        </button>
      </div>
  )

  return hasError ? errorComponent : <>{children}</>;
};

export default ErrorBoundary; 