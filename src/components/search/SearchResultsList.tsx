export type SearchResultType = 'note' | 'task' | 'event' | 'inbox';

export interface SearchResultItem {
  id: string;
  type: SearchResultType;
  title: string;
  snippet?: string;
  href?: string;
}

interface SearchResultsListProps {
  results: SearchResultItem[];
}

export function SearchResultsList({ results }: SearchResultsListProps) {
  if (!results.length) {
    return (
      <div className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
        No results yet. TODO: connect search provider.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((result) => (
        <a
          key={result.id}
          href={result.href ?? '#'}
          className="block rounded-lg border border-border p-3 hover:bg-muted/40"
        >
          <p className="text-xs uppercase text-muted-foreground">{result.type}</p>
          <p className="text-sm font-semibold">{result.title}</p>
          {result.snippet ? <p className="text-xs text-muted-foreground">{result.snippet}</p> : null}
        </a>
      ))}
    </div>
  );
}
