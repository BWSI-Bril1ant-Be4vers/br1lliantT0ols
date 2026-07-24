import { useEffect, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import type { ModuleId } from './Sidebar';

const commands: { label: string; group: string; target: ModuleId }[] = [
  { label: 'Go to Dashboard', group: 'Navigate', target: 'dashboard' },
  { label: 'Open Smart Analyzer', group: 'Navigate', target: 'analyzer' },
  { label: 'Open Cryptography workbench', group: 'Navigate', target: 'crypto' },
  { label: 'Open Digital Forensics', group: 'Navigate', target: 'forensics' },
  { label: 'Open Web Exploitation', group: 'Navigate', target: 'web' },
  { label: 'Open Reverse Engineering', group: 'Navigate', target: 'reveng' },
  { label: 'Browse Utilities', group: 'Navigate', target: 'utilities' },
  { label: 'Ask AI Assistant', group: 'Navigate', target: 'ai' },
  { label: 'Open Notes', group: 'Navigate', target: 'notes' },
  { label: 'Browse Plugins', group: 'Navigate', target: 'plugins' },
  { label: 'Open Settings', group: 'Navigate', target: 'settings' },
];

export function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: ModuleId) => void;
}) {
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!open) setQ('');
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-line bg-surface shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 px-4 h-12 border-b border-line-soft">
          <Search size={15} className="text-fog-dim" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command or search…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-fog-dim"
          />
          <kbd className="text-[10px] text-fog-dim border border-line rounded px-1.5 py-0.5">esc</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto scrollbar-thin py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-fog-dim">No matching commands.</p>
          )}
          {filtered.map((c) => (
            <button
              key={c.label}
              onClick={() => {
                onNavigate(c.target);
                onClose();
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-paper hover:bg-surface-hover transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wide text-fog-dim font-mono">{c.group}</span>
                {c.label}
              </span>
              <ArrowRight size={13} className="text-fog-dim" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
