import React from 'react';

interface AlertProps {
  title?: string;
  description: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  className?: string;
}

export function Alert({ title, description, variant = 'default', className = '' }: AlertProps) {
  const variants = {
    default: "bg-gray-100 text-gray-900 border-gray-200",
    success: "bg-green-50 text-green-900 border-green-200",
    error: "bg-red-50 text-red-900 border-red-200",
    warning: "bg-amber-50 text-amber-900 border-amber-200"
  };

  return (
    <div className={`relative w-full rounded-lg border p-4 ${variants[variant]} ${className}`} role="alert">
      {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
      <div className="text-sm opacity-90">{description}</div>
    </div>
  );
}
