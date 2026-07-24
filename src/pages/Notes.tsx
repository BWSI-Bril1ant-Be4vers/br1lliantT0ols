import { useState, useMemo, type ChangeEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Search, Plus, Trash2, Pin, StickyNote, Tag, Clock } from 'lucide-react';

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
    id: '1',
    title: 'CTF Flag Format & Rules',
    content: 'Remember that all flags follow the format `FLAG{...}` unless specified otherwise. Keep notes clean during the challenge!',
    tags: ['general', 'ctf'],
    pinned: true,
    updatedAt: '10m ago',
  },
  {
    id: '2',
    title: 'Vigenère Key Findings',
    content: 'Key appears to be "shadow". Shift pattern matches standard English letter frequency when decoded.',
    tags: ['crypto', 'vigenere'],
    pinned: false,
    updatedAt: '1h ago',
  },
];

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(initialNotes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagInput, setTagInput] = useState('');

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeNoteId) || null,
    [notes, activeNoteId]
  );

  const filteredNotes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return notes
      .filter((note) => {
        if (!q) return true;
        return (
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q) ||
          note.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [notes, searchQuery]);

  function handleCreateNote() {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: '',
      tags: [],
      pinned: false,
      updatedAt: 'just now',
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  }

  function handleUpdateActiveNote(fields: Partial<Note>) {
    if (!activeNoteId) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNoteId ? { ...n, ...fields, updatedAt: 'just now' } : n))
    );
  }

  function handleDeleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setActiveNoteId(remaining[0]?.id || null);
    }
  }

  function handleTogglePin(id: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  }

  function handleAddTag() {
    if (!tagInput.trim() || !activeNote) return;
    const tag = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (!activeNote.tags.includes(tag)) {
      handleUpdateActiveNote({ tags: [...activeNote.tags, tag] });
    }
    setTagInput('');
  }

  function handleRemoveTag(tagToRemove: string) {
    if (!activeNote) return;
    handleUpdateActiveNote({
      tags: activeNote.tags.filter((t) => t !== tagToRemove),
    });
  }

  return (
    <div className="p-6 grid grid-cols-3 gap-4 max-w-[1400px] h-[calc(100vh-4rem)]">
      {/* Sidebar List */}
      <div className="col-span-1 flex flex-col space-y-4 h-full overflow-hidden">
        <div className="flex items-center gap-2 justify-between">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-2.5 text-fog" />
            <Input
              placeholder="Search notes or tags..."
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>
          <Button variant="primary" size="sm" onClick={handleCreateNote} className="shrink-0 gap-1">
            <Plus size={14} /> New
          </Button>
        </div>

        <Card className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center text-fog text-xs">No notes found.</div>
          ) : (
            filteredNotes.map((note) => {
              const isActive = note.id === activeNoteId;
              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                    isActive
                      ? 'border-signal-dim bg-signal/10'
                      : 'border-transparent hover:bg-line/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {note.pinned && <Pin size={12} className="text-signal shrink-0 fill-signal" />}
                      <span className="font-medium text-xs text-paper truncate">
                        {note.title || 'Untitled Note'}
                      </span>
                    </div>
                    <span className="text-[10px] text-fog-dim shrink-0">{note.updatedAt}</span>
                  </div>
                  <p className="text-[11px] text-fog line-clamp-2 leading-relaxed">
                    {note.content || 'Empty note...'}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-2">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-line/60 text-fog font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </Card>
      </div>

      {/* Main Editor */}
      <div className="col-span-2 h-full overflow-hidden">
        {activeNote ? (
          <Card className="h-full flex flex-col p-4 space-y-4">
            {/* Header controls */}
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <StickyNote size={16} className="text-signal" />
                <span className="text-xs text-fog flex items-center gap-1 font-mono">
                  <Clock size={12} /> {activeNote.updatedAt}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePin(activeNote.id)}
                  className={`p-1.5 rounded border text-xs font-mono transition-colors ${
                    activeNote.pinned
                      ? 'border-signal-dim bg-signal/15 text-signal'
                      : 'border-line text-fog hover:text-paper'
                  }`}
                  title={activeNote.pinned ? 'Unpin note' : 'Pin note'}
                >
                  <Pin size={14} className={activeNote.pinned ? 'fill-signal' : ''} />
                </button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteNote(activeNote.id)}
                  className="text-red-400 hover:text-red-300 border-red-500/20 hover:bg-red-500/10"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            {/* Title Input */}
            <Input
              value={activeNote.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleUpdateActiveNote({ title: e.target.value })
              }
              placeholder="Note Title"
              className="text-base font-semibold border-none bg-transparent p-0 focus:ring-0 text-paper"
            />

            {/* Tags area */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <Tag size={13} className="text-fog" />
              {activeNote.tags.map((tag) => (
                <Badge
                  key={tag}
                  tone="mint"
                  className="cursor-pointer font-mono text-[10px] hover:line-through"
                  onClick={() => handleRemoveTag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
              <input
                type="text"
                placeholder="+ tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                className="bg-transparent border-none text-[11px] font-mono text-fog focus:outline-none w-16"
              />
            </div>

            {/* Content Textarea */}
            <Textarea
              value={activeNote.content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                handleUpdateActiveNote({ content: e.target.value })
              }
              placeholder="Write your note here..."
              className="flex-1 w-full text-xs font-mono resize-none leading-relaxed p-2"
            />
          </Card>
        ) : (
          <Card className="h-full flex flex-col items-center justify-center text-center p-6 text-fog">
            <StickyNote size={32} className="mb-2 opacity-40" />
            <p className="text-sm font-medium">No note selected</p>
            <p className="text-xs text-fog-dim mt-1">Select a note from the sidebar or create a new one.</p>
            <Button variant="primary" size="sm" onClick={handleCreateNote} className="mt-4 gap-1">
              <Plus size={14} /> Create Note
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
