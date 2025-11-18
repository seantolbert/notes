/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    sw.skipWaiting();
  }
});

sw.addEventListener('push', (event) => {
  let payload = {
    title: 'PWA Shell',
    body: 'You have a new notification.'
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text() || payload.body;
    }
  }

  event.waitUntil(
    sw.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icon-192x192.png'
    })
  );
});

sw.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    sw.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const focused = clientList.find((client) => 'focus' in client);
      if (focused) {
        return focused.focus();
      }
      return sw.clients.openWindow('/');
    })
  );
});
