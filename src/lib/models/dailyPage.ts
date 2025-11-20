export interface DailyPage {
  id: string;
  date: string; // ISO date string
  noteId?: string;
  taskIds?: string[];
  summary?: string;
}

// TODO: include journaling metadata and mood tracking once UX is defined.
