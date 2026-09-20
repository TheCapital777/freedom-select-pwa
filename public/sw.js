// Bumped from v1 for the icon/contrast pass. This name is the cache-busting key:
// the `activate` handler below deletes every cache whose name is not this one, so
// a deploy that leaves it unchanged serves returning visitors the PREVIOUS build
// for a whole load. deploy.py now overwrites this with a build timestamp in out/
// so it cannot be forgotten — this literal is only the fallback.
const CACHE_NAME = "freedom-select-20260920-145748";
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

  // NAVIGATIONS GO TO THE NETWORK FIRST.
  //
  // This handler used to be cache-first for everything, including HTML. That is
  // why a deploy could look like it had not landed: bumping CACHE_NAME makes the
  // new worker activate and bin the old caches, but the page you are LOOKING AT
  // was already painted from the old cache, and a cache-first HTML response then
  // served the previous build again on the next visit too. You had to reload
  // twice to see your own deploy, and if you had the old HTML with the new CSS
  // (or the reverse) the page came out visibly broken — the header role pill
  // rendering with markup from one build and styles from another is exactly that
  // failure.
  //
  // HTML is small and changes every deploy, so fetching it fresh costs almost
  // nothing and removes the whole class of problem. The cached copy stays as the
  // offline fallback, which is the only reason it was there.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(event.request, copy));
          }
          return res;
        })
        .catch(() =>
          caches.open(CACHE_NAME)
            .then((c) => c.match(event.request))
            .then((hit) => hit || caches.match("/"))
        )
    );
    return;
  }

  // Everything else — hashed JS/CSS chunks, icons, the manifest — is
  // content-addressed or rarely changed, so cache-first with a background
  // refresh is right for it.
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
