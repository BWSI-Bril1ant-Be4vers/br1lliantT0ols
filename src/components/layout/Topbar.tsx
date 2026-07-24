import { Search, Bell, Command } from 'lucide-react';

const titles: Record<string, { title: string; sub: string }> = {
  dashboard: { title: 'Dashboard', sub: 'Overview of your workspace' },
  workspace: { title: 'Workspace', sub: 'Active investigation' },
  analyzer: { title: 'Smart Analyzer', sub: 'Drop anything, get a lead' },
  web: { title: 'Web Exploitation', sub: 'Request/response workbench' },
  reveng: { title: 'Reverse Engineering', sub: 'Binary analysis IDE' },
  crypto: { title: 'Cryptography', sub: 'Cipher & hash workbench' },
  forensics: { title: 'Digital Forensics', sub: 'File & artifact inspection' },
  networking: { title: 'Networking', sub: 'Traffic & host utilities' },
  utilities: { title: 'Utilities', sub: '60+ everyday CTF tools' },
  ai: { title: 'AI Assistant', sub: 'Context-aware guidance' },
  notes: { title: 'Notes', sub: 'Your investigation notebook' },
  plugins: { title: 'Plugins', sub: 'Extend the workbench' },
  settings: { title: 'Settings', sub: 'Preferences & integrations' },
};

export function Topbar({ active, onPalette }: { active: string; onPalette: () => void }) {
  const info = titles[active] ?? titles.dashboard;
  return (
    <header className="h-14 border-b border-line bg-ink/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between px-6 gap-4">
      <div>
        <h1 className="text-[13px] font-semibold leading-none">{info.title}</h1>
        <p className="text-[11px] text-fog-dim mt-1">{info.sub}</p>
      </div>

      <button
        onClick={onPalette}
        className="flex-1 max-w-md flex items-center gap-2 rounded-lg border border-line bg-surface px-3 h-8 text-fog-dim text-xs hover:border-fog-dim/60 transition-colors"
      >
        <Search size={13} />
        <span className="flex-1 text-left">Search files, tools, workspaces…</span>
        <kbd className="flex items-center gap-0.5 text-[10px] bg-surface-raised border border-line rounded px-1.5 py-0.5">
          <Command size={10} />K
        </kbd>
      </button>

      <div className="flex items-center gap-3">
        <button className="relative text-fog hover:text-paper transition-colors">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose" />
        </button>
        <div className="flex items-center gap-1.5 text-[11px] text-mint font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse-dot" />
          sandbox online
        </div>
      </div>
    </header>
  );
}
