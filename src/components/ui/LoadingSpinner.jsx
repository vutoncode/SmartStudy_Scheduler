import React from 'react';

export const LoadingSpinner = ({ size = 'md', color = 'primary', className = '' }) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4 border-2';
      case 'md': return 'w-8 h-8 border-3';
      case 'lg': return 'w-12 h-12 border-4';
      default: return 'w-8 h-8 border-3';
    }
  };

  const getColor = () => {
    switch (color) {
      case 'primary': return 'border-t-[var(--color-primary)] border-r-transparent border-b-transparent border-l-transparent';
      case 'accent': return 'border-t-[var(--color-accent)] border-r-transparent border-b-transparent border-l-transparent';
      case 'white': return 'border-t-white border-r-transparent border-b-transparent border-l-transparent';
      case 'current': return 'border-t-current border-r-transparent border-b-transparent border-l-transparent';
      default: return 'border-t-[var(--color-primary)] border-r-transparent border-b-transparent border-l-transparent';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`
          animate-spin rounded-full border-solid border-[rgba(255,255,255,0.1)]
          ${getSize()}
          ${getColor()}
        `}
      />
    </div>
  );
};

export default LoadingSpinner;
