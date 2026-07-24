import {
  LayoutGrid, FolderKanban, Sparkles, Globe, Cpu, KeyRound, Fingerprint,
  Network, Wrench, Bot, StickyNote, Blocks, Settings, Terminal,
} from 'lucide-react';
import { cn } from '../../lib/cn';

export type ModuleId =
  | 'dashboard' | 'workspace' | 'analyzer' | 'web' | 'reveng' | 'crypto'
  | 'forensics' | 'networking' | 'utilities' | 'ai' | 'notes' | 'plugins' | 'settings';

const items: { id: ModuleId; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'workspace', label: 'Workspace', icon: FolderKanban },
  { id: 'analyzer', label: 'Smart Analyzer', icon: Sparkles },
  { id: 'web', label: 'Web Exploitation', icon: Globe },
  { id: 'reveng', label: 'Reverse Engineering', icon: Cpu },
  { id: 'crypto', label: 'Cryptography', icon: KeyRound },
  { id: 'forensics', label: 'Forensics', icon: Fingerprint },
  { id: 'networking', label: 'Networking', icon: Network },
  { id: 'utilities', label: 'Utilities', icon: Wrench },
  { id: 'ai', label: 'AI Assistant', icon: Bot },
  { id: 'notes', label: 'Notes', icon: StickyNote },
  { id: 'plugins', label: 'Plugins', icon: Blocks },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ active, onSelect }: { active: ModuleId; onSelect: (id: ModuleId) => void }) {
  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 border-r border-line bg-surface/60 flex flex-col">
      <div className="h-14 flex items-center gap-2 px-4 border-b border-line-soft">
        <div className="w-7 h-7 rounded-lg bg-signal/15 border border-signal-dim flex items-center justify-center">
          <Terminal size={15} className="text-signal" />
        </div>
        <span className="font-semibold text-[13px] tracking-tight">Br1lliant T0ols</span>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2 space-y-0.5">
        {items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              'w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
              active === id
                ? 'bg-signal/12 text-signal border border-signal-dim/60'
                : 'text-fog hover:text-paper hover:bg-surface-hover border border-transparent'
            )}
          >
            <Icon size={15} strokeWidth={2} />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-line-soft">
        <div className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-surface-hover cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-signal to-cyan flex items-center justify-center text-[11px] font-semibold text-ink">
            JD
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">j.doe</p>
            <p className="text-[11px] text-fog-dim truncate">Team Nullbyte</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
