var CACHE = "converter-v2";
var FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png",
  "./lib/docx.js",
  "./lib/pptxgen.js",
  "./lib/jszip.js",
  "./lib/pdf-lib.js",
  "./lib/pdf.min.mjs",
  "./lib/pdf.worker.min.mjs"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.all(
        FILES.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.warn("Failed to cache", url, err);
          });
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(name) { return name !== CACHE; })
            .map(function(name) { return caches.delete(name); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function(e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        // Optionally cache new responses for same-origin
        if (response && response.ok && e.request.url.startsWith(self.location.origin)) {
          var clone = response.clone();
          caches.open(CACHE).then(function(cache) {
            cache.put(e.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // Offline and not in cache
        return new Response("Offline and resource not cached", { status: 503, statusText: "Service Unavailable" });
      });
    })
  );
});
