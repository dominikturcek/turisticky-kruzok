const CACHE_NAME = "turisticky-kruzok-web-v1";
const APP_SHELL = [
  "/turisticky-kruzok/web/",
  "/turisticky-kruzok/web/index.html",
  "/turisticky-kruzok/web/manifest.json",
  "/turisticky-kruzok/styles.css",
  "/turisticky-kruzok/app.js",
  "/turisticky-kruzok/icons/web-96.png",
  "/turisticky-kruzok/icons/web-180.png",
  "/turisticky-kruzok/icons/web-192.png",
  "/turisticky-kruzok/icons/web-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("turisticky-kruzok-web-") && k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const allowed =
    url.pathname.startsWith("/turisticky-kruzok/web/") ||
    url.pathname === "/turisticky-kruzok/styles.css" ||
    url.pathname === "/turisticky-kruzok/app.js" ||
    url.pathname.startsWith("/turisticky-kruzok/icons/web-");

  if (!allowed) return;

  event.respondWith(
    fetch(request).then(response => {
      if (response && response.ok && response.type === "basic") {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(() => caches.match(request).then(cached => cached || caches.match("/turisticky-kruzok/web/")))
  );
});
