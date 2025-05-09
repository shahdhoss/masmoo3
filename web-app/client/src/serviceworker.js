const CACHE_NAME = 'cache-v1';
importScripts('./cache-manifest.js');

self.addEventListener('install', (event) => {
  console.log('SW installing...');

  self.skipWaiting(); 

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
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