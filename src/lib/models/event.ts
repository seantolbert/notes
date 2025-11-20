export interface Event {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location?: string;
  tags?: string[];
  relatedNoteId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// TODO: add attendees and sync origin for calendar integrations.
