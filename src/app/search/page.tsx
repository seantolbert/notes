'use client';

import { useState } from 'react';

import { SearchBar } from '@/components/search/SearchBar';
import { SearchResultsList, type SearchResultItem } from '@/components/search/SearchResultsList';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);

  const handleSearch = () => {
    // TODO: swap with real search that spans notes, tasks, events.
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setResults([
      {
        id: 'search-1',
        type: 'note',
        title: `Placeholder result for "${query}"`,
        snippet: 'Replace with real search results.'
      }
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Search</h2>
        <p className="text-sm text-muted-foreground">Find notes, tasks, and events.</p>
      </div>

      <SearchBar query={query} onQueryChange={setQuery} onSubmit={handleSearch} />
      <SearchResultsList results={results} />
    </div>
  );
}
