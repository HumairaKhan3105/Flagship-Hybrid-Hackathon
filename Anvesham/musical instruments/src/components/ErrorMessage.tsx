import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Heritage Connection Paused',
  message = 'Unable to reach the museum database right now. Please check your connection and retry.',
  onRetry,
}) => {
  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-amber-50/80 border border-amber-200/80 rounded-2xl shadow-sm text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-serif font-bold text-amber-950 mb-1">{title}</h3>
      <p className="text-sm text-stone-600 mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
