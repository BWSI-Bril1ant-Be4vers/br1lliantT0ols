import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'default' | 'signal' | 'cyan' | 'amber' | 'rose' | 'mint';

const tones: Record<Tone, string> = {
  default: 'bg-surface-hover text-fog border-line',
  signal: 'bg-signal-dim/30 text-signal border-signal-dim',
  cyan: 'bg-cyan/10 text-cyan border-cyan/30',
  amber: 'bg-amber/10 text-amber border-amber/30',
  rose: 'bg-rose/10 text-rose border-rose/30',
  mint: 'bg-mint/10 text-mint border-mint/30',
};

export function Badge({ tone = 'default', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium font-mono',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
