// Dashboard Dorcat PWA. Naikkan SW_VERSI setiap ada perubahan file (Safari hanya memperbarui bila isi sw.js berubah).
var SW_VERSI = 'dorcat-2026-11-08a';
var FILE = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-180.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SW_VERSI).then(function (c) {
    return Promise.all(FILE.map(function (f) { return fetch(f, { cache: 'reload' }).then(function (r) { if (r.ok) return c.put(f, r); }); }));
  }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) {
    return Promise.all(k.filter(function (x) { return x !== SW_VERSI; }).map(function (x) { return caches.delete(x); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;   // data dashboard tidak pernah disimpan di HP
  e.respondWith(fetch(e.request).then(function (r) {
    if (r.ok) { var s = r.clone(); caches.open(SW_VERSI).then(function (c) { c.put(e.request, s); }); }
    return r;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true }).then(function (m) { return m || caches.match('index.html'); });
  }));
});
