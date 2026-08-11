const CACHE_NAME = 'flappy-bird-v4';
const CORE_ASSETS = [
  './', './index.html', './app.js', './vendor.js', './manifest.webmanifest',
  './assets/birdSprite2.png', './assets/pipe-cool.png', './assets/pause.png',
  './assets/cloud2.png', './assets/moun.png', './assets/ground2.png', './assets/death.wav'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request)));
});
