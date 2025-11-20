'use client';

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit?: () => void;
}

export function SearchBar({ query, onQueryChange, onSubmit }: SearchBarProps) {
  return (
    <div className="flex gap-2">
      <Input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search notes, tasks, events"
        aria-label="Search planner"
      />
      <Button type="button" onClick={onSubmit}>
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </div>
  );
}
