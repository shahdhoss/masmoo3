const CACHE_NAME = 'cache-v1';
importScripts('./real.js'); 
const OFFLINE_URL = '/index.html';
const SERVER_URL = "https://key-gertrudis-alhusseain-8243cb58.koyeb.app"
// const SERVER_URL = "http://localhost:8080"

const BinarySearchInsert = (episodes,episode)=>{
    let low = 0;
    let high = episodes.length - 1;
    let insertAt = episodes.length;
    
    while (low <= high) {
        const mid = (low + high) >>> 1;
        if (episodes[mid].episode_no === episode.episode_no) {
            return false; 
        } else if (episodes[mid].episode_no < episode.episode_no) {
            low = mid + 1;
        } else {
            high = mid - 1;
            insertAt = mid;
        }
    }
    
    episodes.splice(insertAt, 0, episode);
}

self.addEventListener('install', (event) => {
  console.log('SW installing...');
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const filesToCache = [FILES_TO_CACHE, '/','/static/js/bundle.js'];
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

  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_URL) || caches.match('/'))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        return networkResponse;
      })
      .catch(async error => {
        console.log('Network failed, trying cache...', error);
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || new Response('Offline fallback', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

self.addEventListener('message', async (event) => {
  if (event.data?.type === 'CACHE_CARD' && event.data.card && event.data.episode) {
    console.log('SW caching:', event.data.episode.audio_link);

    const cache = await caches.open(CACHE_NAME);
    
    await fetch(`${SERVER_URL}/download?url=${encodeURI(event.data.episode.audio_link)}`)
      .then(res => res.blob())
      .then((blob) => {
        const response = new Response(blob, {
          headers: {
            'Content-Length': blob.size
          }
        });
        cache.put(event.data.episode.audio_link, response);
        console.log("Audio cached successfully");
      });

    try {
      const response = await caches.match(`${SERVER_URL}/audiobook`);
      let BooksList = [];
      
      if (response) {
        try {
          BooksList = await response.json();
          if (!Array.isArray(BooksList)) {
            console.warn('Cached data was not an array, resetting');
            BooksList = [];
          }
        } catch (e) {
          console.error('Failed to parse cached books:', e);
          BooksList = [];
        }
      }

      console.log('Current BooksList:', BooksList);

      let cardFound = false;
      const cardId = event.data.card.id;
      await fetch(`${SERVER_URL}/download?url=${encodeURI(event.data.card.image)}`)
      .then(res => res.blob())
      .then((blob) => {
        const imgResponse = new Response(blob, {
          headers: {
            'Content-Length': blob.size
          }
        });
        cache.put(event.data.card.image, imgResponse);
        console.log("image cached successfully");
      });     
      for (const card of BooksList) {
        if (card.id === cardId) {
          cardFound = true;
          BinarySearchInsert(card.episodes, event.data.episode);
          break;
        }
      }

      if (!cardFound) {
        const newCard = { ...event.data.card };
        newCard.episodes = [event.data.episode];
        BooksList.push(newCard);
      }

      const updatedResponse = new Response(JSON.stringify(BooksList), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      await cache.put(`${SERVER_URL}/audiobook`, updatedResponse);
      console.log('Updated BooksList:', BooksList);

      const cardResponse = new Response(JSON.stringify(
        BooksList.find(card => card.id === cardId)
      ), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      await cache.put(`${SERVER_URL}/audiobook/${cardId}`, cardResponse);

    } catch (error) {
      console.error('Error in cache operation:', error);
    }
  }
});