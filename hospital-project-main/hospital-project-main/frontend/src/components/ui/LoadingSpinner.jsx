import React from 'react';

const LoadingSpinner = ({ label = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-6 text-slate-300">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
