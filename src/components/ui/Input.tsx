import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`flex h-10 w-full rounded-md border text-gray-900 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}
            ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? 'input-error' : undefined}
          {...props}
        />
        {error && (
          <p id="input-error" role="alert" className="text-sm text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
