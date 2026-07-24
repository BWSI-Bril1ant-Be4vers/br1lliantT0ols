import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full h-9 rounded-lg border border-line bg-surface-raised px-3 text-sm text-paper placeholder:text-fog-dim outline-none focus:border-signal transition-colors',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-lg border border-line bg-surface-raised px-3 py-2.5 text-sm font-mono text-paper placeholder:text-fog-dim outline-none focus:border-signal transition-colors resize-none',
        className
      )}
      {...props}
    />
  );
}
