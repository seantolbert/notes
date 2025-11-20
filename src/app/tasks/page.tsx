import { TaskList } from '@/components/tasks/TaskList';
import { TaskQuickAdd } from '@/components/tasks/TaskQuickAdd';
import type { Task } from '@/lib/models/task';
import { formatShortDate, toIsoDate } from '@/lib/utils/dates';

const todayIso = toIsoDate(new Date());

const SAMPLE_TASKS: Task[] = [
  {
    id: 'task-2',
    title: 'Wire task list UI',
    description: 'Feed from repo once available.',
    status: 'pending',
    dueAt: todayIso,
    createdAt: todayIso,
    updatedAt: todayIso
  },
  {
    id: 'task-3',
    title: 'Draft smart capture plan',
    status: 'in_progress',
    createdAt: todayIso,
    updatedAt: todayIso
  }
];

export default function TasksPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <p className="text-sm text-muted-foreground">
          Placeholder tasks for {formatShortDate(new Date())}. TODO: connect hooks to repositories.
        </p>
      </div>

      <TaskQuickAdd />
      <TaskList tasks={SAMPLE_TASKS} />
    </div>
  );
}
