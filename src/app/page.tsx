'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { EventCard } from '@/components/calendar/EventCard';
import { NoteCard } from '@/components/notes/NoteCard';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskQuickAdd } from '@/components/tasks/TaskQuickAdd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEvents } from '@/lib/hooks/useEvents';
import { useNotes } from '@/lib/hooks/useNotes';
import { useTasks } from '@/lib/hooks/useTasks';
import { useTodayPlan } from '@/lib/hooks/useTodayPlan';
import { getToday } from '@/lib/utils/dates';

const today = getToday();

const listVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  const todayPlan = useTodayPlan();
  const tasks = useTasks();
  const events = useEvents();
  const notes = useNotes();

  const handleSync = async () => {
    await Promise.all([tasks.sync(), events.sync(), notes.sync(), todayPlan.sync()]);
  };

  const todayNotes = notes.data.filter((note) => (note.createdAt ?? '').startsWith(today));

  const handleQuickAdd = async (title: string) => {
    await tasks.create({
      title,
      status: 'pending',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-[480px] flex-col gap-6 px-4 py-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Today</p>
          <h1 className="text-xl font-semibold">{today}</h1>
          <p className="text-xs text-muted-foreground">
            {todayPlan.data.tasks.length} tasks • {todayPlan.data.events.length} events •{' '}
            {todayPlan.data.notes.length} notes
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={handleSync}>
          Sync
        </Button>
      </header>

      {/* TODO: add AI daily summary surface here once available. */}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Today&apos;s Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <AnimatePresence initial={false}>
            {events.data.length === 0 ? (
              <p className="text-sm text-muted-foreground">No events scheduled. Add calendar sources to see more.</p>
            ) : (
              events.data.map((event) => (
                <motion.div key={event.id} initial="hidden" animate="visible" exit="hidden" variants={listVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Today&apos;s Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TaskQuickAdd onAdd={handleQuickAdd} />
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {tasks.data.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tasks for today. Capture one above to get started.
                </p>
              ) : (
                tasks.data.map((task) => (
                  <motion.div key={task.id} initial="hidden" animate="visible" exit="hidden" variants={listVariants}>
                    <TaskItem task={task} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Today&apos;s Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <AnimatePresence initial={false}>
            {todayNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No notes linked to today. Create a note to capture thoughts.
              </p>
            ) : (
              todayNotes.map((note) => (
                <motion.div key={note.id} initial="hidden" animate="visible" exit="hidden" variants={listVariants}>
                  <NoteCard note={note} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
