'use client';

import type { Note } from '@/lib/models/note';

interface NoteCardProps {
  note: Note;
  onSelect?: (note: Note) => void;
}

export function NoteCard({ note, onSelect }: NoteCardProps) {
  const updated = note.updatedAt ?? note.createdAt ?? new Date().toISOString();

  return (
    <article
      className="space-y-1 rounded-lg border border-border p-3 hover:bg-muted/30"
      onClick={() => onSelect?.(note)}
    >
      <h3 className="text-base font-semibold">{note.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{note.excerpt ?? 'TODO: add note content'}</p>
      <p className="text-xs text-muted-foreground">
        Last updated: {new Date(updated).toLocaleString()}
      </p>
    </article>
  );
}
