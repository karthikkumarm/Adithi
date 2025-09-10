import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "cyber-input flex h-12 w-full rounded-lg border border-border-secondary bg-background-secondary px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent-cyan focus:outline-none focus:ring-2 focus:ring-accent-cyan/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };