// sw.js - Service Worker para PWA
const CACHE_NAME = 'referral-hub-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/assets/js/app.js',
  '/assets/js/admin.js',
  '/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
