"use client";
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <motion.input
      ref={ref}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      animate={{ boxShadow: focused ? '0 0 0 4px rgba(10,132,255,0.25)' : '0 0 0 0 rgba(0,0,0,0)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'h-11 w-full rounded-xl border border-apple-gray-200 bg-white/70 px-4 text-[15px] shadow-elev-1 placeholder:text-apple-gray-500 focus:outline-none',
        className
      )}
      {...props}
    />
  );
});
Input.displayName = 'Input';

