import { NoteCard } from '@/components/notes/NoteCard';
import type { Note } from '@/lib/models/note';

interface NoteListProps {
  notes: Note[];
  emptyState?: React.ReactNode;
}

export function NoteList({ notes, emptyState }: NoteListProps) {
  if (!notes.length) {
    return (
      <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
        {emptyState ?? 'No notes yet. TODO: wire note creation.'}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
