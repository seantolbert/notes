'use client';

import { useEffect, useState } from 'react';

import type { DailyPage } from '@/lib/models/dailyPage';
import { toIsoDate } from '@/lib/utils/dates';

export function useDailyPage(date: Date | string = new Date()) {
  const [dailyPage, setDailyPage] = useState<DailyPage | null>(null);

  useEffect(() => {
    const iso = toIsoDate(date);
    // TODO: load persisted daily page content.
    setDailyPage({
      id: iso,
      date: iso,
      summary: 'Plan your day here.',
      taskIds: []
    });
  }, [date]);

  const refresh = async () => {
    // Placeholder refresh until persistence is wired.
    const iso = toIsoDate(date);
    setDailyPage((prev) => prev ?? { id: iso, date: iso });
  };

  return { dailyPage, refresh };
}
