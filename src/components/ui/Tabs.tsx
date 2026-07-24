import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export function Tabs({
  tabs,
  defaultTab,
  children,
}: {
  tabs: string[];
  defaultTab?: string;
  children: (active: string) => ReactNode;
}) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]);
  return (
    <div>
      <div className="flex items-center gap-1 border-b border-line-soft px-2 overflow-x-auto scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={cn(
              'relative px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors',
              active === tab ? 'text-paper' : 'text-fog hover:text-paper'
            )}
          >
            {tab}
            {active === tab && (
              <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-signal" />
            )}
          </button>
        ))}
      </div>
      <div>{children(active)}</div>
    </div>
  );
}
