'use client';

import { useEffect, useState } from 'react';

import { listEvents } from '@/lib/db/repositories/eventsRepo';
import type { Event } from '@/lib/models/event';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    void refresh();
  }, []);

  const refresh = async () => {
    const data = await listEvents();
    setEvents(data);
  };

  return { events, refresh };
}
