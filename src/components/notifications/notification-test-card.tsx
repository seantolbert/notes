'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getSubscription, isPushSupported, requestNotificationPermission, subscribeToPush } from '@/lib/notifications/push';

export function NotificationTestCard() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [status, setStatus] = useState<string | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<string>('Not requested yet.');

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    } else {
      setPermission('denied');
    }
  }, []);

  const handleRequestPermission = async () => {
    setStatus('Requesting permission...');
    try {
      const result = await requestNotificationPermission();
      setPermission(result);
      setStatus(`Permission: ${result}`);
    } catch (error) {
      setStatus(`Permission request failed: ${(error as Error).message}`);
    }
  };

  const handleSubscribe = async () => {
    setStatus('Subscribing to push (stub)...');
    try {
      const subscription = await subscribeToPush();
      setSubscriptionDetails(JSON.stringify(subscription.toJSON(), null, 2));
      setStatus('Subscription stored locally.');
    } catch (error) {
      setStatus(`Subscription failed: ${(error as Error).message}`);
    }
  };

  const handleShowSubscription = async () => {
    setStatus('Loading stored subscription...');
    const stored = await getSubscription();
    setSubscriptionDetails(stored ? JSON.stringify(stored, null, 2) : 'No subscription saved yet.');
    setStatus('Subscription loaded.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Notifications</CardTitle>
        <CardDescription>
          {isPushSupported() ? 'This browser can use Push + Notifications.' : 'Push API not supported.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">Current permission: {permission}</p>
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
        <pre className="max-h-40 overflow-auto rounded bg-muted p-2 text-xs">{subscriptionDetails}</pre>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button onClick={handleRequestPermission} variant="outline">
          Request Permission
        </Button>
        <Button onClick={handleSubscribe} disabled={!isPushSupported()}>
          Subscribe to Push
        </Button>
        <Button onClick={handleShowSubscription} variant="secondary">
          Show Subscription
        </Button>
      </CardFooter>
    </Card>
  );
}
