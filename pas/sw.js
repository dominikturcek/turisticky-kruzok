const CACHE_NAME = "turisticky-pas-v2";
const APP_SHELL = [
  "/turisticky-kruzok/pas/",
  "/turisticky-kruzok/pas/index.html",
  "/turisticky-kruzok/pas/manifest.webmanifest",
  "/turisticky-kruzok/icons/pass-96.png",
  "/turisticky-kruzok/icons/pass-180.png",
  "/turisticky-kruzok/icons/pass-192.png",
  "/turisticky-kruzok/icons/pass-512.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("turisticky-pas-") && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith("/turisticky-kruzok/pas/")) return;
  event.respondWith(fetch(request).then(response => {
    if (response && response.ok && response.type === "basic") {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request).then(cached => cached || caches.match("/turisticky-kruzok/pas/"))));
});
