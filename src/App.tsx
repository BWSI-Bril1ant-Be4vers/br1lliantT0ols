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
          {active === 'nots' && <Notes />}
          {active === 'workspace' && (
            <StubPage icon={FolderKanban} title="No active workspace" description="Start an analysis from the Smart Analyzer, or open a saved case to see notes, evidence, and the artifact graph here." />
          )}
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
