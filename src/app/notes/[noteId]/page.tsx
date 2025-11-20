import type { Note } from '@/lib/models/note';

interface NoteDetailPageProps {
  params: { noteId: string };
}

const PLACEHOLDER_NOTE: Note = {
  id: 'note-detail',
  title: 'Note detail placeholder',
  content: 'TODO: load note content and backlinks.',
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export default function NoteDetailPage({ params }: NoteDetailPageProps) {
  const note = { ...PLACEHOLDER_NOTE, id: params.noteId };

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">{note.title}</h1>
      <p className="text-sm text-muted-foreground">Note ID: {note.id}</p>
      <div className="rounded-lg border border-border p-4">
        <p className="text-sm leading-6">
          {typeof note.content === 'string' ? note.content : JSON.stringify(note.content)}
        </p>
      </div>
    </div>
  );
}
