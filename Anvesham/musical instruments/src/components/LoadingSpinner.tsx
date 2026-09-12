import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Loading instruments and heritage tales...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-25"></div>
        <div className="w-14 h-14 rounded-full border-4 border-amber-800 border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-amber-900 font-serif font-bold text-xs">
          ॐ
        </div>
      </div>
      <p className="mt-4 text-amber-950 font-medium tracking-wide text-sm animate-pulse">
        {message}
      </p>
    </div>
  );
};
