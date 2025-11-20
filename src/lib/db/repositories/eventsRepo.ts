import type { Event } from '@/lib/models/event';

// TODO: wire to real calendar data sources.
export async function listEvents(): Promise<Event[]> {
  return [];
}

export async function getEventById(id: string): Promise<Event | null> {
  void id;
  return null;
}

export async function saveEvent(event: Event): Promise<void> {
  void event;
}

export async function deleteEvent(id: string): Promise<void> {
  void id;
}
