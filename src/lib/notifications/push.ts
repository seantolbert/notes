import { DEFAULT_STORE, getItem, setItem } from '@/lib/pwa/indexeddb';

const SUBSCRIPTION_KEY = 'pushSubscription';

function parseApplicationServerKey(applicationServerKey?: Uint8Array | string | null) {
  if (!applicationServerKey) {
    return undefined;
  }
  if (typeof applicationServerKey !== 'string') {
    return applicationServerKey;
  }
  const base64 = applicationServerKey.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const rawData = atob(padded);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported() {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
}

export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return 'denied';
  }
  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Real push delivery requires a trusted server that stores subscriptions and sends payloads via
 * Web Push (VAPID keys, payload encryption, etc). This shell purposefully stops at the boundary:
 * we expose subscription helpers and ship the service worker event handlers, but defer actual
 * delivery + key management to whatever backend eventually powers the product.
 */
export async function subscribeToPush(applicationServerKey?: Uint8Array | string | null) {
  if (!isPushSupported()) {
    throw new Error('Push is not supported in this browser.');
  }
  const permission = await requestNotificationPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission not granted.');
  }

  const registration = await navigator.serviceWorker.ready;
  const subscribeOptions: PushSubscriptionOptionsInit = {
    userVisibleOnly: true
  };
  const key = parseApplicationServerKey(applicationServerKey);
  if (key) {
    subscribeOptions.applicationServerKey = key;
  }
  const subscription = await registration.pushManager.subscribe(subscribeOptions);

  await setItem(DEFAULT_STORE, SUBSCRIPTION_KEY, subscription.toJSON());
  return subscription;
}

/**
 * Returns the last stored subscription snapshot. Consumers can also hit
 * `navigator.serviceWorker.ready.then(reg => reg.pushManager.getSubscription())`
 * if they need the live `PushSubscription` instance.
 */
export async function getSubscription() {
  return getItem<Record<string, unknown>>(DEFAULT_STORE, SUBSCRIPTION_KEY);
}
