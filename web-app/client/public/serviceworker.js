const CACHE_NAME = 'cache-v1';
importScripts('./cache-manifest.js'); 
const OFFLINE_URL = '/index.html';
const SERVER_URL = "https://key-gertrudis-alhusseain-8243cb58.koyeb.app"

const BinarySearchInsert = (episodes,episode)=>{
    let low = 0;
    let high = episodes.length - 1;
    let insertAt = episodes.length;
    
    while (low <= high) {
        const mid = (low + high) >>> 1;
        if (episodes[mid].episode_no === newEpisode.episode_no) {
            return false; 
        } else if (episodes[mid].episode_no < newEpisode.episode_no) {
            low = mid + 1;
        } else {
            high = mid - 1;
            insertAt = mid;
        }
    }
    
    episodes.splice(insertAt, 0, newEpisode);
}

self.addEventListener('install', (event) => {
  console.log('SW installing...');
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      const filesToCache = [...FILES_TO_CACHE, '/','/static/js/bundle.js'];
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
      if(cachedResponse)console.log("Found in Cache!");
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener('message', async (event) => {
  if (event.data?.type === 'CACHE_CARD' && event.data.card && event.data.episode) {
    console.log('SW caching:',event.data.episode.audio_link);

    const cache = await caches.open(CACHE_NAME);
    await fetch(`http://localhost:8080/download?url=${encodeURI(event.data.episode.audio_link)}`).then(res=>res.blob())
    .then((blb)=>{
      const response = new Response(blb,{
        headers:{
          'Content-Length':blb.size
        }
      });
      cache.put(event.data.episode.audio_link,response);
      console.log("put successfully: "+response)
    });

    await caches.match(`${SERVER_URL}/audiobook`).then(async (response)=>{
      let BooksList;
      if(!response){
        BooksList = [];
      }
      else BooksList = response;
      let found = false;
      BooksList.forEach((card)=>{
        if(card.id == event.card.id){
          found = true;
          BinarySearchInsert(card.episodes,event.data.episode.audio_link);
          return;
        }
      })
      if(!found){
        let card = event.data.card;
        card.episodes = [event.data.episode];
        BooksList.push(card);
      }
      console.log(BooksList);
      const response2 = new Response(BooksList);
      await cache.put(`${SERVER_URL}/audiobook`,response2);
    })

}});