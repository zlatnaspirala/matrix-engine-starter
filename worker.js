
'use strict';

var cacheVersion = 120;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
const offlineUrl = 'offline.html';

self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open("static-files-v1").then(function (cache) {
      return cache.addAll([
        offlineUrl,
        "./css/style.css",
        "./node_modules/matrix-engine/lib/gl-matrix-min.js",
        "./node_modules/matrix-engine/lib/matrix-geometry",
        "./node_modules/matrix-engine/lib/engine",
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('V1 now ready to handle fetches!');
});

/*
self.addEventListener("fetch", function (event) {

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  );

});
*/
self.addEventListener("fetch", function (event) {
  if (event.request.method === "POST") { return; }
  event.respondWith(
    caches.open("dynamic-content-v1").then(function (cache) {
      // check if the requested URL is inside the dynamic-content-v1
      return cache.match(event.request).then(function (response) {
        // when found, respond with it.
        // when not found: return it as it is after taking a clone
        // and storing it, so next visit to the URL it will be there
        return response || fetch(event.request).then(function (response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
 /*
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request.url).catch(error => {
        // Return the offline page
        return caches.match(offlineUrl);
      })
    );
  }
  else {
    // Respond with everything else if we can
    event.respondWith(caches.match(event.request)
      .then(function(response) {
        return response || fetch(event.request);
      })
    );
  }*/

});
