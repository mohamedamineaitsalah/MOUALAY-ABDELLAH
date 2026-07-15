import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-sand-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
