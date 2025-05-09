const CACHE_NAME = 'cache-v1';
importScripts('./cache-manifest.js'); 
const OFFLINE_URL = '/index.html';

self.addEventListener('install', (event) => {
  console.log('SW installing...');
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const filesToCache = [FILES_TO_CACHE,'/'];
      return cache.addAll(filesToCache).catch(err => {
        console.error('Failed to cache some files:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('SW activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); 
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('SW fetching:', event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL) 
            .then(response => {
              return response || caches.match('/') || new Response('Offline fallback');
            });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener('message', async (event) => {
  if (event.data?.type === 'CACHE_AUDIO' && event.data.url) {
    console.log('SW caching:', event.data.url);

    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(event.data.url);

    if (response.ok) await cache.put(event.data.url, response);
  }
});