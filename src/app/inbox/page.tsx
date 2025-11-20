import { InboxItem } from '@/components/inbox/InboxItem';

const SAMPLE_INBOX = [
  {
    id: 'inbox-1',
    title: 'Email summary -> turn into tasks',
    source: 'task',
    capturedAt: new Date().toISOString()
  },
  {
    id: 'inbox-2',
    title: 'Meeting notes stub',
    source: 'note',
    capturedAt: new Date().toISOString()
  }
] as const;

export default function InboxPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Inbox</h2>
        <p className="text-sm text-muted-foreground">Raw captures waiting to be filed.</p>
      </div>

      <div className="space-y-2">
        {SAMPLE_INBOX.map((item) => (
          <InboxItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
