const CACHE_NAME = "weather-app-cache-v1";
const OFFLINE_URL = "/offline.html";

const urlsToCache = [
  "/",
  "/index.html",
  "/offline.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/favicon.ico"
];

// Install event - Cache files for offline access
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Fetch event - Serve cached files when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request) || caches.match(OFFLINE_URL))
  );
});

// Activate event - Remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.filter((cache) => cache !== CACHE_NAME).map((cache) => caches.delete(cache))
      )
    )
  );
  self.clients.claim();
});
