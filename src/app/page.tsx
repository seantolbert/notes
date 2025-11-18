export default function HomePage() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Welcome to the PWA Shell</h2>
        <p className="text-muted-foreground text-sm">
          This starter demonstrates how to wire up theming, offline detection, push notifications, and other
          progressive enhancement features without forcing a specific product direction.
        </p>
      </div>
      <div className="space-y-2 rounded-lg border border-dashed border-border p-4">
        <p className="text-sm font-medium">What&apos;s included?</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Installable PWA setup via next-pwa</li>
          <li>Offline awareness + service worker caching</li>
          <li>Push notification subscription helpers</li>
          <li>Composable UI primitives powered by ShadCN</li>
        </ul>
      </div>
      <p className="text-sm text-muted-foreground">
        Use the bottom navigation to explore settings, test push subscriptions, and clear IndexedDB storage. The rest
        of the experience is ready for you to layer on product-specific flows.
      </p>
    </div>
  );
}
