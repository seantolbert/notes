export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueAt?: string;
  tags?: string[];
  noteId?: string;
  createdAt: string;
  updatedAt: string;
}

// TODO: add recurrence rules, reminders, and sorting weights.
