declare global {
  interface Window {
    workbox?: {
      register: () => void;
    };
  }
}

export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    if (window.workbox) {
      window.workbox.register();
      return;
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.info('Service worker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}
