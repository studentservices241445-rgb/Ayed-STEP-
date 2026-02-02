/* Minimal service worker to cache static assets */
const CACHE_NAME = 'level-test-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/quiz.html',
  '/results.html',
  '/support.html',
  '/bridge.html',
  '/builder.html',
  '/custom-quiz.html',
  '/manifest.webmanifest',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/js/quiz.js',
  '/assets/js/results.js',
  '/assets/js/support.js',
  '/assets/js/builder.js',
  '/assets/js/custom-quiz.js',
  '/assets/data/question-bank.json',
  '/assets/img/logo.svg',
  '/assets/img/icon-192.png',
  '/assets/img/icon-512.png',
  '/assets/img/hero-bg.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});