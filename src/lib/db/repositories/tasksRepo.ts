import type { Task } from '@/lib/models/task';

// TODO: implement IndexedDB/Supabase storage for tasks.
export async function listTasks(): Promise<Task[]> {
  return [];
}

export async function getTaskById(id: string): Promise<Task | null> {
  void id;
  return null;
}

export async function saveTask(task: Task): Promise<void> {
  void task;
}

export async function deleteTask(id: string): Promise<void> {
  void id;
}
