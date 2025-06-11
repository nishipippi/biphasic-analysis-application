
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      <p className="ml-4 text-xl text-teal-300">Calculating...</p>
    </div>
  );
};
