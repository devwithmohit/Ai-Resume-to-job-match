import React from 'react';

export function Progress({ value, max = 100, className = '' }: { value: number; max?: number; className?: string }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={`relative h-4 w-full overflow-hidden rounded-full border border-gray-200 bg-gray-100 ${className}`}>
      <div
        className="h-full w-full bg-blue-600 transition-all duration-300"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
