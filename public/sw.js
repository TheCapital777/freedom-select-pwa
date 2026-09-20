// Bumped from v1 for the icon/contrast pass. This name is the cache-busting key:
// the `activate` handler below deletes every cache whose name is not this one, so
// a deploy that leaves it unchanged serves returning visitors the PREVIOUS build
// for a whole load. deploy.py now overwrites this with a build timestamp in out/
// so it cannot be forgotten — this literal is only the fallback.
const CACHE_NAME = "freedom-select-20260920-115226";
const PRECACHE = ["/", "/products/", "/cart/", "/checkout/", "/orders/", "/login/", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      const fetchPromise = fetch(event.request)
        .then((res) => { if (res.ok) cache.put(event.request, res.clone()); return res; })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
