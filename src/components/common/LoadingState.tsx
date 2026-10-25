import React from 'react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Loading campus reuse data...' }) => {
  return (
    <div className="py-16 flex flex-col items-center justify-center space-y-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-800 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-500 animate-pulse">{message}</p>
    </div>
  );
};
