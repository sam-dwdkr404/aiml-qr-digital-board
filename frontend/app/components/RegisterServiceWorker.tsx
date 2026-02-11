'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Registration successful
            console.log('Service worker registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('Service worker registration failed:', err);
          });
      });
    }
  }, []);

  return null;
}
