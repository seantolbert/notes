'use client';

import { useEffect, useState } from 'react';

import type { TodayPlan } from '@/lib/services/plannerService';
import { loadTodayPlan } from '@/lib/services/plannerService';

const EMPTY_PLAN: TodayPlan = { notes: [], tasks: [], events: [] };

export function useTodayPlan() {
  const [plan, setPlan] = useState<TodayPlan>(EMPTY_PLAN);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await loadTodayPlan();
      setPlan(data);
    } finally {
      setLoading(false);
    }
  };

  return { plan, loading, refresh };
}
