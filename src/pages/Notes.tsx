import { useMemo, useState } from "react";
import { Card } from "../components/ui/Card";
import { Input, Textarea } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import {
  Search,
  Plus,
  Trash2,
  Pin,
  StickyNote,
  Tag,
  Clock,
} from "lucide-react";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  updatedAt: string;
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "CTF Flag Format & Rules",
    content:
      "Remember that all flags follow the format FLAG{...} unless specified otherwise.",
    tags: ["general", "ctf"],
    pinned: true,
    updatedAt: "10m ago",
  },
  {
    id: "2",
    title: "Vigenère Key Findings",
    content:
      'Key appears to be "shadow". Shift pattern matches standard English frequency.',
    tags: ["crypto", "vigenere"],
    pinned: false,
    updatedAt: "1h ago",
  },
];

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(
    initialNotes[0]?.id ?? null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [tagInput, setTagInput] = useState("");

  const activeNote = useMemo(() => {
    return notes.find((note) => note.id === activeNoteId) ?? null;
  }, [notes, activeNoteId]);


  const filteredNotes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return notes
      .filter((note) => {
        if (!query) return true;

        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some((tag) =>
            tag.toLowerCase().includes(query)
          )
        );
      })
      .sort(
        (a, b) =>
          Number(b.pinned) - Number(a.pinned)
      );
  }, [notes, searchQuery]);


  function updateNote(fields: Partial<Note>) {
    if (!activeNoteId) return;

    setNotes((current) =>
      current.map((note) =>
        note.id === activeNoteId
          ? {
              ...note,
              ...fields,
              updatedAt: "just now",
            }
          : note
      )
    );
  }


  function createNote() {
    const note: Note = {
      id: crypto.randomUUID(),
      title: "New Note",
      content: "",
      tags: [],
      pinned: false,
      updatedAt: "just now",
    };

    setNotes((current) => [note, ...current]);
    setActiveNoteId(note.id);
  }


  function deleteNote(id: string) {
    setNotes((current) => {
      const remaining = current.filter(
        (note) => note.id !== id
      );

      if (activeNoteId === id) {
        setActiveNoteId(
          remaining[0]?.id ?? null
        );
      }

      return remaining;
    });
  }


  function togglePin() {
    if (!activeNote) return;

    updateNote({
      pinned: !activeNote.pinned,
    });
  }


  function addTag() {
    if (!activeNote) return;

    const tag = tagInput
      .trim()
      .replace("#", "")
      .toLowerCase();

    if (!tag) return;

    if (!activeNote.tags.includes(tag)) {
      updateNote({
        tags: [
          ...activeNote.tags,
          tag,
        ],
      });
    }

    setTagInput("");
  }


  function removeTag(tag: string) {
    if (!activeNote) return;

    updateNote({
      tags: activeNote.tags.filter(
        (t) => t !== tag
      ),
    });
  }


  return (
    <div className="p-6 grid grid-cols-3 gap-4 h-[calc(100vh-4rem)]">

      {/* Notes List */}
      <div className="flex flex-col gap-4 overflow-hidden">

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-2 top-2.5"
            />

            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="pl-7"
            />
          </div>


          <Button
            onClick={createNote}
            size="sm"
          >
            <Plus size={14}/>
            New
          </Button>
        </div>


        <Card className="flex-1 overflow-auto p-2">

          {filteredNotes.map((note)=>(
            <div
              key={note.id}
              onClick={() =>
                setActiveNoteId(note.id)
              }
              className="p-3 rounded cursor-pointer hover:bg-line/40"
            >

              <div className="flex justify-between">

                <span className="text-sm flex gap-1">
                  {note.pinned &&
                    <Pin size={12}/>
                  }

                  {note.title}
                </span>

                <span className="text-xs">
                  {note.updatedAt}
                </span>

              </div>


              <p className="text-xs text-fog">
                {note.content || "Empty"}
              </p>


              <div className="flex gap-1 mt-2">

                {note.tags.map(tag=>(
                  <Badge
                    key={tag}
                    tone="mint"
                  >
                    #{tag}
                  </Badge>
                ))}

              </div>

            </div>
          ))}

        </Card>

      </div>



      {/* Editor */}

      <div className="col-span-2">

        {activeNote ? (

          <Card className="h-full p-4 flex flex-col gap-4">


            <div className="flex justify-between">

              <div className="flex gap-2 items-center">
                <StickyNote size={16}/>
                <Clock size={12}/>
                {activeNote.updatedAt}
              </div>


              <div className="flex gap-2">

                <Button
                  size="sm"
                  onClick={togglePin}
                >
                  <Pin size={14}/>
                </Button>


                <Button
                  size="sm"
                  onClick={() =>
                    deleteNote(activeNote.id)
                  }
                >
                  <Trash2 size={14}/>
                </Button>

              </div>

            </div>



            <Input
              value={activeNote.title}
              onChange={(e)=>
                updateNote({
                  title:e.target.value
                })
              }
            />



            <div className="flex gap-2 items-center">

              <Tag size={14}/>

              {activeNote.tags.map(tag=>(
                <span
                  key={tag}
                  onClick={() =>
                    removeTag(tag)
                  }
                  className="cursor-pointer"
                >
                  <Badge tone="mint">
                    #{tag}
                  </Badge>
                </span>
              ))}


              <input
                value={tagInput}
                onChange={(e)=>
                  setTagInput(e.target.value)
                }
                onKeyDown={(e)=>{
                  if(e.key==="Enter")
                    addTag();
                }}
                placeholder="+tag"
                className="bg-transparent outline-none"
              />

            </div>



            <Textarea
              value={activeNote.content}
              onChange={(e)=>
                updateNote({
                  content:e.target.value
                })
              }
              className="flex-1"
            />


          </Card>

        ) : (

          <Card className="h-full flex items-center justify-center">

            <div className="text-center">
              <StickyNote/>
              <p>No note selected</p>

              <Button
                onClick={createNote}
              >
                Create Note
              </Button>
            </div>

          </Card>

        )}

      </div>

    </div>
  );
}
