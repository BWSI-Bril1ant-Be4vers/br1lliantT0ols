import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import {
  FolderKanban,
  Plus,
  Trash2,
  FilePlus2,
  CheckSquare,
} from "lucide-react";

interface Task {
  id: string;
  text: string;
  done: boolean;
}

interface WorkspaceCase {
  id: string;
  title: string;
  description: string;
  evidence: string[];
  tasks: Task[];
}

const STORAGE_KEY = "cyber-workspace";

export function Workspace() {
  const [cases, setCases] = useState<WorkspaceCase[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const [newEvidence, setNewEvidence] = useState("");
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed: WorkspaceCase[] = JSON.parse(saved);
      setCases(parsed);

      if (parsed.length) setSelected(parsed[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  }, [cases]);

  const activeCase = useMemo(
    () => cases.find((c) => c.id === selected) ?? null,
    [cases, selected]
  );

  function updateCase(update: Partial<WorkspaceCase>) {
    if (!selected) return;

    setCases((prev) =>
      prev.map((c) =>
        c.id === selected ? { ...c, ...update } : c
      )
    );
  }

  function createCase() {
    const c: WorkspaceCase = {
      id: crypto.randomUUID(),
      title: "New Investigation",
      description: "",
      evidence: [],
      tasks: [],
    };

    setCases((p) => [c, ...p]);
    setSelected(c.id);
  }

  function deleteCase(id: string) {
    const remaining = cases.filter((c) => c.id !== id);
    setCases(remaining);

    if (selected === id) {
      setSelected(remaining[0]?.id ?? null);
    }
  }

  function addEvidence() {
    if (!activeCase || !newEvidence.trim()) return;

    updateCase({
      evidence: [...activeCase.evidence, newEvidence.trim()],
    });

    setNewEvidence("");
  }

  function removeEvidence(index: number) {
    if (!activeCase) return;

    updateCase({
      evidence: activeCase.evidence.filter((_, i) => i !== index),
    });
  }

  function addTask() {
    if (!activeCase || !newTask.trim()) return;

    updateCase({
      tasks: [
        ...activeCase.tasks,
        {
          id: crypto.randomUUID(),
          text: newTask.trim(),
          done: false,
        },
      ],
    });

    setNewTask("");
  }

  function toggleTask(id: string) {
    if (!activeCase) return;

    updateCase({
      tasks: activeCase.tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    });
  }

  function deleteTask(id: string) {
    if (!activeCase) return;

    updateCase({
      tasks: activeCase.tasks.filter((t) => t.id !== id),
    });
  }

  return (
    <div className="p-6 grid grid-cols-[280px_1fr] gap-6 h-[calc(100vh-4rem)]">

      {/* Sidebar */}

      <Card className="flex flex-col overflow-hidden">

        <div className="flex items-center justify-between p-4 border-b border-line">

          <div className="flex items-center gap-2">
            <FolderKanban size={18} />
            <span className="font-semibold">
              Workspace
            </span>
          </div>

          <Button size="sm" onClick={createCase}>
            <Plus size={14}/>
          </Button>

        </div>

        <div className="flex-1 overflow-auto">

          {cases.length === 0 && (
            <div className="p-4 text-sm text-fog">
              No investigations yet.
            </div>
          )}

          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c.id)}
              className={`p-4 border-b border-line cursor-pointer ${
                selected === c.id
                  ? "bg-signal/10"
                  : "hover:bg-line/40"
              }`}
            >
              <div className="flex justify-between">

                <div>

                  <div className="font-medium">
                    {c.title}
                  </div>

                  <div className="text-xs text-fog">
                    {c.evidence.length} evidence • {c.tasks.length} tasks
                  </div>

                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCase(c.id);
                  }}
                >
                  <Trash2
                    size={14}
                    className="text-red-400"
                  />
                </button>

              </div>

            </div>
          ))}

        </div>

      </Card>

      {/* Main */}

      <Card className="p-6 overflow-auto">

        {!activeCase ? (
          <div className="h-full flex items-center justify-center text-fog">
            Create an investigation to begin.
          </div>
        ) : (
          <div className="space-y-6">

            <div>

              <Input
                value={activeCase.title}
                onChange={(e) =>
                  updateCase({
                    title: e.target.value,
                  })
                }
                className="text-xl font-bold"
              />

              <Textarea
                value={activeCase.description}
                onChange={(e) =>
                  updateCase({
                    description: e.target.value,
                  })
                }
                placeholder="Investigation description..."
                className="mt-3"
              />

            </div>

            {/* Evidence */}

            <div>

              <h2 className="font-semibold mb-2">
                Evidence
              </h2>

              <div className="flex gap-2">

                <Input
                  value={newEvidence}
                  placeholder="memory.dmp"
                  onChange={(e) =>
                    setNewEvidence(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && addEvidence()
                  }
                />

                <Button onClick={addEvidence}>
                  <FilePlus2 size={14}/>
                </Button>

              </div>

              <div className="mt-3 space-y-2">

                {activeCase.evidence.map((file, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center border border-line rounded p-2"
                  >
                    <span>{file}</span>

                    <button
                      onClick={() =>
                        removeEvidence(i)
                      }
                    >
                      <Trash2
                        size={14}
                        className="text-red-400"
                      />
                    </button>

                  </div>
                ))}

              </div>

            </div>

            {/* Tasks */}

            <div>

              <h2 className="font-semibold mb-2">
                Investigation Checklist
              </h2>

              <div className="flex gap-2">

                <Input
                  value={newTask}
                  placeholder="Analyze PCAP"
                  onChange={(e) =>
                    setNewTask(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" && addTask()
                  }
                />

                <Button onClick={addTask}>
                  <Plus size={14}/>
                </Button>

              </div>

              <div className="mt-3 space-y-2">

                {activeCase.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border border-line rounded p-2"
                  >

                    <div
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() =>
                        toggleTask(task.id)
                      }
                    >
                      <CheckSquare
                        size={18}
                        className={
                          task.done
                            ? "text-green-500"
                            : ""
                        }
                      />

                      <span
                        className={
                          task.done
                            ? "line-through text-fog"
                            : ""
                        }
                      >
                        {task.text}
                      </span>

                    </div>

                    <button
                      onClick={() =>
                        deleteTask(task.id)
                      }
                    >
                      <Trash2
                        size={14}
                        className="text-red-400"
                      />
                    </button>

                  </div>
                ))}

              </div>

            </div>

          </div>
        )}

      </Card>

    </div>
  );
}
