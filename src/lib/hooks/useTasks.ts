'use client';

import { useEffect, useState } from 'react';

import { listTasks } from '@/lib/db/repositories/tasksRepo';
import type { Task } from '@/lib/models/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    void refresh();
  }, []);

  const refresh = async () => {
    const data = await listTasks();
    setTasks(data);
  };

  return { tasks, refresh };
}
