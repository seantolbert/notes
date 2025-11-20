export interface InboxItemData {
  id: string;
  title: string;
  source: 'note' | 'task' | 'event' | 'unknown';
  capturedAt: string;
}

interface InboxItemProps {
  item: InboxItemData;
}

export function InboxItem({ item }: InboxItemProps) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-sm font-medium">{item.title}</p>
      <p className="text-xs text-muted-foreground">
        Captured {new Date(item.capturedAt).toLocaleString()} • {item.source}
      </p>
    </div>
  );
}
