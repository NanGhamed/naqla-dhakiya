/* Service Worker — مبادرة نقلة ذكية: عمل كامل دون اتصال */
var VERSION = 'naqla-v10';
var CORE = [
  'index.html',
  'phase1.html',
  'phase2.html',
  'phase3.html',
  'phase4.html',
  'الملحق.html',
  'الحزمة التنفيذية.html',
  'manifest.webmanifest',
  'fonts/arfonts-sst-arabic-roman.ttf',
  'fonts/arfonts-sst-arabic-medium.ttf',
  'fonts/arfonts-sst-arabic-bold.ttf',
  'fonts/arfonts-sst-arabic-light.ttf',
  'install.js',
  'install.css',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
  'شعار نقلة ذكية.png',
  'صورة الكعبة ومنى.png',
  'مبادرة نقلة ذكية -المرحلة الأولى تصنيف الفئات وتحديد الاحتياجات التدريبية.pdf',
  'ملحق تنفيذي للمرحلة الأولى – الإطار الاسترشادي الأولي للاحتياجات الرقمية لموظفي شركات تقديم الخدمة للحجاج.pdf',
  'حزمة أدوات تنفيذ المرحلة الأولى.pdf'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(VERSION).then(function(cache) {
      return Promise.all(CORE.map(function(url) {
        return cache.add(url).catch(function() {});
      }));
    }).then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k) { return k !== VERSION; }).map(function(k) {
        return caches.delete(k);
      }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') { return; }
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) { return; }
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(function(res) {
        var copy = res.clone();
        caches.open(VERSION).then(function(cache) { cache.put(e.request, copy); });
        return res;
      }).catch(function() {
        return caches.match(e.request).then(function(m) { return m || caches.match('index.html'); });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(m) {
        if (m) { return m; }
        return fetch(e.request).then(function(res) {
          var copy = res.clone();
          caches.open(VERSION).then(function(cache) { cache.put(e.request, copy); });
          return res;
        }).catch(function() { return undefined; });
      })
    );
  }
});
