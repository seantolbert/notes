'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TaskQuickAddProps {
  onAdd?: (title: string) => Promise<void> | void;
}

export function TaskQuickAdd({ onAdd }: TaskQuickAddProps) {
  const [title, setTitle] = useState('');

  const handleAdd = async () => {
    if (!title.trim()) return;
    await onAdd?.(title.trim());
    setTitle('');
  };

  return (
    <div className="flex gap-2">
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Quick add a task"
        aria-label="Quick add task"
      />
      <Button type="button" onClick={handleAdd}>
        Add
      </Button>
    </div>
  );
}
