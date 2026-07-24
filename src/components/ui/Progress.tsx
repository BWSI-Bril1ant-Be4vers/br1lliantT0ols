import { cn } from '../../lib/cn';

export function Progress({ value, tone = 'signal', className }: { value: number; tone?: 'signal' | 'cyan' | 'amber' | 'rose' | 'mint'; className?: string }) {
  const toneMap = {
    signal: 'bg-signal',
    cyan: 'bg-cyan',
    amber: 'bg-amber',
    rose: 'bg-rose',
    mint: 'bg-mint',
  };
  return (
    <div className={cn('h-1.5 w-full rounded-full bg-surface-hover overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', toneMap[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
