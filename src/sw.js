//4398utp3qjaljrhf;oreah

const CACHE_NAME = 'pwgen-v1';
const APP_FILES = [
    '/',
    '/index.html',
    '/icon.png',
    '/app.webmanifest',
    '/app.css',
    '/app.js',
    '/sw.js'
];

self.addEventListener('install', e => {
    console.log('[Service Worker] Install');
    e.waitUntil(caches.open(CACHE_NAME).then(cache => {
        console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(APP_FILES);
    }));
});

self.addEventListener('fetch', e => {
    console.log('[Service Worker] Received fetch event ' + e.request.url);
    e.respondWith(caches.match(e.request).then(r => {
        console.log('[Service Worker] Fetching resource: ' + e.request.url);
        return r || fetch(e.request).then(response => {
            return caches.open(CACHE_NAME).then(cache => {
                console.log('[Service Worker] Caching new resource: ' + e.request.url);
                cache.put(e.request, response.clone());
                return response;
            });
        });
    }));
});
