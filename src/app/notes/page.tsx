import { NoteList } from '@/components/notes/NoteList';
import type { Note } from '@/lib/models/note';

const SAMPLE_NOTES: Note[] = [
  {
    id: 'note-2',
    title: 'Daily log',
    content: 'Capture highlights from today',
    excerpt: 'Capture highlights from today',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function NotesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Notes</h2>
        <p className="text-sm text-muted-foreground">
          TODO: plug in notes repository, tag filters, and search.
        </p>
      </div>
      <NoteList notes={SAMPLE_NOTES} />
    </div>
  );
}
