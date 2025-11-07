import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      fullWidth = true,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'px-4 py-3 rounded-lg border bg-white text-base',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'min-h-[44px] touch-manipulation',
            error
              ? 'border-danger focus:ring-danger'
              : 'border-neutral-border',
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-sm text-danger">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
