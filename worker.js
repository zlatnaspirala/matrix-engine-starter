
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

self.addEventListener("fetch", function (event) {
  if (event.request.method === "POST") { return; }
  event.respondWith(
    caches.open("dynamic-content-v1").then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function (response) {
          if (response.status == 206) {
            // statusText: "Partial Content"
            return response;
          } else {
          cache.put(event.request, response.clone());
          }
          return response;
        });
      });
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return (
        resp || fetch(event.request).then(response => {
          return caches.open(cacheName).then(cache => {
            if (response.status == 206) {
              // statusText: "Partial Content"
              return response;
            } else {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        })
      );
    })
  );
});

const fireAddToHomeScreenImpression = event => {
  fireTracking( "Add to homescreen shown" );

  // will not work for chrome, untill fixed
  event.userChoice.then( choiceResult => {
    fireTracking( `User clicked ${choiceResult}` );
  } );

  // This is to prevent `beforeinstallprompt` event that triggers again on `Add` or `Cancel` click
  self.removeEventListener("beforeinstallprompt",fireAddToHomeScreenImpression);

};
self.addEventListener("beforeinstallprompt", fireAddToHomeScreenImpression);

// Track web app install by user
self.addEventListener( "appinstalled", event => {
  fireTracking( "PWA app installed by user!!! Hurray" );
} );

//Track from where your web app has been opened/browsed
self.addEventListener( "load", () => {
  let trackText;
  if ( navigator && navigator.standalone ) {
    trackText = "Launched: Installed (iOS)";
  } else if ( matchMedia( "(display-mode: standalone)" ).matches ) {
    trackText = "Launched: Installed";
  } else {
    trackText = "Launched: Browser Tab";
  }
  fireTracking( track );
} );
