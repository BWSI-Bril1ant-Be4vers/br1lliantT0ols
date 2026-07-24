import { FolderKanban, FileText, Shield, Clock } from "lucide-react";

const cases = [
  {
    name: "Black Vault Investigation",
    type: "CTF Case",
    status: "Active",
    updated: "2 minutes ago",
  },
  {
    name: "Malware Analysis Sample",
    type: "Reverse Engineering",
    status: "Paused",
    updated: "1 hour ago",
  },
];

export function Workspace() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FolderKanban />
          Workspace
        </h1>
        <p className="text-gray-400">
          Manage investigations, evidence, notes, and artifacts.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <Shield className="mb-3" />
          <h2 className="font-semibold">Active Cases</h2>
          <p className="text-3xl">2</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <FileText className="mb-3" />
          <h2 className="font-semibold">Artifacts</h2>
          <p className="text-3xl">24</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <Clock className="mb-3" />
          <h2 className="font-semibold">Recent Activity</h2>
          <p className="text-sm text-gray-400">
            Last analysis 2 minutes ago
          </p>
        </div>
      </div>


      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Investigations
        </h2>

        {cases.map((item) => (
          <div
            key={item.name}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between"
          >
            <div>
              <h3 className="font-medium">
                {item.name}
              </h3>
              <p className="text-sm text-gray-400">
                {item.type}
              </p>
            </div>

            <div className="text-right">
              <p className="text-green-400">
                {item.status}
              </p>
              <p className="text-xs text-gray-500">
                {item.updated}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
