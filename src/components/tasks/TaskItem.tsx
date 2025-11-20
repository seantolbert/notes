'use client';

import type { Task } from '@/lib/models/task';

interface TaskItemProps {
  task: Task;
  onToggle?: (task: Task) => void;
}

export function TaskItem({ task, onToggle }: TaskItemProps) {
  const isDone = task.status === 'completed';

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border px-3 py-2">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-primary"
        checked={isDone}
        onChange={() => onToggle?.(task)}
      />
      <div className="flex-1 space-y-1">
        <p className={`text-sm font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
        {task.dueAt ? <p className="text-xs text-muted-foreground">Due {task.dueAt}</p> : null}
      </div>
    </div>
  );
}
