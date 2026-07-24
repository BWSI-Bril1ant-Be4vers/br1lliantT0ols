import { useEffect, useState } from "react";

import { Sidebar, type ModuleId } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { CommandPalette } from "./components/layout/CommandPalette";

import { Dashboard } from "./pages/Dashboard";
import { SmartAnalyzer } from "./pages/SmartAnalyzer";
import { Cryptography } from "./pages/Cryptography";
import { Forensics } from "./pages/Forensics";
import { Utilities } from "./pages/Utilities";
import { WebExploitation } from "./pages/WebExploitation";
import { ReverseEngineering } from "./pages/ReverseEngineering";
import { Workspace } from "./pages/Workspace";
import { Plugins } from "./pages/Plugins";
import { Notes } from "./pages/Notes";

import { StubPage } from "./components/StubPage";

import {
  Network,
  Bot,
  Settings,
} from "lucide-react";


export default function App() {
  const [active, setActive] = useState<ModuleId>("dashboard");
  const [paletteOpen, setPaletteOpen] = useState(false);


  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }


    window.addEventListener(
      "keydown",
      onKey
    );


    return () => {
      window.removeEventListener(
        "keydown",
        onKey
      );
    };
  }, []);



  function renderPage() {
    switch (active) {
      case "dashboard":
        return <Dashboard />;

      case "analyzer":
        return <SmartAnalyzer />;

      case "crypto":
        return <Cryptography />;

      case "forensics":
        return <Forensics />;

      case "utilities":
        return <Utilities />;

      case "web":
        return <WebExploitation />;

      case "reveng":
        return <ReverseEngineering />;

      case "workspace":
        return <Workspace />;

      case "plugins":
        return <Plugins />;

      case "notes":
        return <Notes />;

      case "networking":
        return (
          <StubPage
            icon={Network}
            title="Networking utilities"
            description="CIDR calculators, subnet splitters, and whois lookups live here. Full module coming soon."
          />
        );

      case "ai":
        return (
          <StubPage
            icon={Bot}
            title="AI Assistant"
            description="Ask questions about your current analysis and get contextual suggestions as you work."
          />
        );

      case "settings":
        return (
          <StubPage
            icon={Settings}
            title="Settings"
            description="Theme, shortcuts, AI preferences, and integrations."
          />
        );

      default:
        return <Dashboard />;
    }
  }



  return (
    <div className="flex bg-ink text-paper min-h-screen">

      <Sidebar
        active={active}
        onSelect={setActive}
      />


      <div className="flex-1 min-w-0">

        <Topbar
          active={active}
          onPalette={() =>
            setPaletteOpen(true)
          }
        />


        <main>
          {renderPage()}
        </main>

      </div>


      <CommandPalette
        open={paletteOpen}
        onClose={() =>
          setPaletteOpen(false)
        }
        onNavigate={setActive}
      />

    </div>
  );
}
