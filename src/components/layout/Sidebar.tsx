import {
  LayoutGrid,
  FolderKanban,
  Sparkles,
  Globe,
  Cpu,
  KeyRound,
  Fingerprint,
  Network,
  Wrench,
  Bot,
  StickyNote,
  Blocks,
  Settings,
  Terminal,
} from "lucide-react";

import { cn } from "../../lib/cn";


export type ModuleId =
  | "dashboard"
  | "workspace"
  | "analyzer"
  | "web"
  | "crypto"
  | "notes"
  | "settings"
  | "reveng"
  | "forensics"
  | "networking"
  | "utilities"
  | "ai"
  | "plugins";


const items: {
  id: ModuleId;
  label: string;
  icon: typeof LayoutGrid;
  disabled?: boolean;
}[] = [

  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutGrid,
  },

  {
    id: "workspace",
    label: "Workspace",
    icon: FolderKanban,
  },

  {
    id: "analyzer",
    label: "Smart Analyzer",
    icon: Sparkles,
  },

  {
    id: "web",
    label: "Web Exploitation",
    icon: Globe,
  },

  {
    id: "crypto",
    label: "Cryptography",
    icon: KeyRound,
  },


  // Coming soon modules

  {
    id: "reveng",
    label: "Coming Soon",
    icon: Cpu,
    disabled: true,
  },

  {
    id: "forensics",
    label: "Coming Soon",
    icon: Fingerprint,
    disabled: true,
  },

  {
    id: "networking",
    label: "Coming Soon",
    icon: Network,
    disabled: true,
  },

  {
    id: "utilities",
    label: "Coming Soon",
    icon: Wrench,
    disabled: true,
  },

  {
    id: "ai",
    label: "Coming Soon",
    icon: Bot,
    disabled: true,
  },

  {
    id: "plugins",
    label: "Coming Soon",
    icon: Blocks,
    disabled: true,
  },


  {
    id: "notes",
    label: "Notes",
    icon: StickyNote,
  },

  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },

];



export function Sidebar({
  active,
  onSelect,
}: {
  active: ModuleId;
  onSelect: (id: ModuleId) => void;
}) {

  return (

    <aside className="w-60 shrink-0 h-screen sticky top-0 border-r border-line bg-surface/60 flex flex-col">


      <div className="h-14 flex items-center gap-2 px-4 border-b border-line-soft">

        <div className="w-7 h-7 rounded-lg bg-signal/15 border border-signal-dim flex items-center justify-center">

          <Terminal
            size={15}
            className="text-signal"
          />

        </div>

        <span className="font-semibold text-[13px]">
          Br1lliant T0ols
        </span>

      </div>



      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">

        {items.map(
          ({
            id,
            label,
            icon: Icon,
            disabled,
          }) => (

          <button

            key={id}

            disabled={disabled}

            onClick={() => {
              if (!disabled) {
                onSelect(id);
              }
            }}

            className={cn(

              "w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",

              disabled
                ? "text-fog-dim opacity-50 cursor-not-allowed"
                : active === id
                  ? "bg-signal/12 text-signal border border-signal-dim/60"
                  : "text-fog hover:text-paper hover:bg-surface-hover border border-transparent"

            )}

          >

            <Icon
              size={15}
              strokeWidth={2}
            />

            <span className="truncate">
              {label}
            </span>


          </button>

        ))}

      </nav>



      <div className="p-3 border-t border-line-soft">

        <div className="flex items-center gap-2 rounded-lg px-2 py-2">

          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-signal to-cyan flex items-center justify-center text-[11px] font-semibold text-ink">
            JD
          </div>

          <div>
            <p className="text-xs font-medium">
              j.doe
            </p>

            <p className="text-[11px] text-fog-dim">
              Team Nullbyte
            </p>

          </div>

        </div>

      </div>


    </aside>

  );
}
