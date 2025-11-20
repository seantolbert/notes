import type { Note } from '@/lib/models/note';

// TODO: replace placeholders with IndexedDB/Supabase-backed persistence.
export async function listNotes(): Promise<Note[]> {
  return [];
}

export async function getNoteById(id: string): Promise<Note | null> {
  void id;
  return null;
}

export async function saveNote(note: Note): Promise<void> {
  void note;
}

export async function deleteNote(id: string): Promise<void> {
  void id;
}
