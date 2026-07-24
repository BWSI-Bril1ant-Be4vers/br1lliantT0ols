import { useEffect, useState } from 'react';
import { Sidebar, type ModuleId } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CommandPalette } from './components/layout/CommandPalette';
import { Dashboard } from './pages/Dashboard';
import { SmartAnalyzer } from './pages/SmartAnalyzer';
import { Cryptography } from './pages/Cryptography';
import { Forensics } from './pages/Forensics';
import { Utilities } from './pages/Utilities';
import { WebExploitation } from './pages/WebExploitation';
import { ReverseEngineering } from './pages/ReverseEngineering';
import { Workspace } from './pages/Workspace';
import { Plugins } from './pages/Plugins';
import { Notes } from './pages/Notes';

import { StubPage } from './components/StubPage';
import { FolderKanban, Network, Bot, StickyNote, Settings } from 'lucide-react';

export default function App() {
  const [active, setActive] = useState<ModuleId>('dashboard');
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex bg-ink text-paper min-h-screen">
      <Sidebar active={active} onSelect={setActive} />
      <div className="flex-1 min-w-0">
        <Topbar active={active} onPalette={() => setPaletteOpen(true)} />
        <main>
          {active === 'dashboard' && <Dashboard />}
          {active === 'analyzer' && <SmartAnalyzer />}
          {active === 'crypto' && <Cryptography />}
          {active === 'forensics' && <Forensics />}
          {active === 'utilities' && <Utilities />}
          {active === 'web' && <WebExploitation />}
          {active === 'reveng' && <ReverseEngineering />}
          {active === 'plugins' && <Plugins />}
          {active === 'notes' && <Notes />}
          {active === 'workspace' && <Workspace />}
          {active === 'networking' && (
            <StubPage icon={Network} title="Networking utilities" description="CIDR calculators, subnet splitters, and whois lookups live here. Full module coming soon." />
          )}
          {active === 'ai' && (
            <StubPage icon={Bot} title="AI Assistant" description="Ask questions about your current analysis and get contextual suggestions as you work." />
          )}
          {active === 'settings' && (
            <StubPage icon={Settings} title="Settings" description="Theme, shortcuts, AI preferences, and integrations." />
          )}
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onNavigate={setActive} />
    </div>
  );
}
