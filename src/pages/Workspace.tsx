import { useState } from "react";
import {
  FolderKanban,
  Plus,
  Trash2,
  FolderOpen,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface Case {
  id: string;
  name: string;
  status: "Active" | "Completed";
  evidence: number;
  notes: number;
  updated: string;
}

const initialCases: Case[] = [
  {
    id: "1",
    name: "Black Vault Investigation",
    status: "Active",
    evidence: 12,
    notes: 5,
    updated: "2 min ago",
  },
  {
    id: "2",
    name: "Malware Sample",
    status: "Completed",
    evidence: 21,
    notes: 11,
    updated: "Yesterday",
  },
];

export function Workspace() {
  const [cases, setCases] = useState(initialCases);
  const [selected, setSelected] = useState(initialCases[0].id);

  const activeCase = cases.find((c) => c.id === selected);

  function createCase() {
    const name = prompt("Case name");

    if (!name?.trim()) return;

    const newCase: Case = {
      id: crypto.randomUUID(),
      name,
      status: "Active",
      evidence: 0,
      notes: 0,
      updated: "Just now",
    };

    setCases((prev) => [newCase, ...prev]);
    setSelected(newCase.id);
  }

  function deleteCase(id: string) {
    const remaining = cases.filter((c) => c.id !== id);

    setCases(remaining);

    if (selected === id) {
      setSelected(remaining[0]?.id ?? "");
    }
  }

  return (
    <div className="p-6 h-full flex gap-6">

      {/* Sidebar */}

      <div className="w-80 rounded-xl border border-line bg-panel flex flex-col">

        <div className="flex items-center justify-between p-4 border-b border-line">

          <div className="flex items-center gap-2">
            <FolderKanban size={18} />
            <h2 className="font-semibold">
              Cases
            </h2>
          </div>

          <button
            onClick={createCase}
            className="p-2 rounded hover:bg-line"
          >
            <Plus size={16} />
          </button>

        </div>

        <div className="overflow-auto">

          {cases.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`p-4 border-b border-line cursor-pointer transition ${
                selected === item.id
                  ? "bg-signal/10"
                  : "hover:bg-line/40"
              }`}
            >
              <div className="flex justify-between">

                <div>

                  <div className="font-medium">
                    {item.name}
                  </div>

                  <div className="text-xs text-fog mt-1">
                    {item.status}
                  </div>

                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCase(item.id);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>

      {/* Main */}

      <div className="flex-1 rounded-xl border border-line bg-panel p-6">

        {activeCase ? (
          <>
            <div className="flex justify-between items-start">

              <div>

                <h1 className="text-3xl font-bold">
                  {activeCase.name}
                </h1>

                <div className="flex gap-6 mt-3 text-sm text-fog">

                  <span>
                    📁 {activeCase.evidence} Evidence
                  </span>

                  <span>
                    📝 {activeCase.notes} Notes
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {activeCase.updated}
                  </span>

                </div>

              </div>

              <FolderOpen size={42} />

            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-8">

              <div className="rounded-lg border border-line p-4">
                <h3 className="font-semibold mb-3">
                  Investigation Checklist
                </h3>

                <div className="space-y-2 text-sm">

                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    Evidence Collected
                  </div>

                  <div className="flex items-center gap-2">
                    ☐ Analyze Files
                  </div>

                  <div className="flex items-center gap-2">
                    ☐ Extract IOCs
                  </div>

                  <div className="flex items-center gap-2">
                    ☐ Write Report
                  </div>

                </div>
              </div>

              <div className="rounded-lg border border-line p-4">

                <h3 className="font-semibold mb-3">
                  Recent Activity
                </h3>

                <div className="space-y-2 text-sm text-fog">

                  <div>• Added memory.dmp</div>

                  <div>• Created investigation notes</div>

                  <div>• Imported PCAP</div>

                  <div>• Generated SHA256 hashes</div>

                </div>

              </div>

              <div className="rounded-lg border border-line p-4">

                <h3 className="font-semibold mb-3">
                  Quick Actions
                </h3>

                <div className="space-y-2">

                  <button className="w-full rounded border border-line p-2 hover:bg-line">
                    Upload Evidence
                  </button>

                  <button className="w-full rounded border border-line p-2 hover:bg-line">
                    Open Notes
                  </button>

                  <button className="w-full rounded border border-line p-2 hover:bg-line">
                    Run Smart Analyzer
                  </button>

                  <button className="w-full rounded border border-line p-2 hover:bg-line">
                    Export Case
                  </button>

                </div>

              </div>

            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-fog">
            No case selected.
          </div>
        )}

      </div>

    </div>
  );
}
