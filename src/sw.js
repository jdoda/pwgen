//34rggjofdjgodfj

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

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install');
    event.waitUntil(caches.open(CACHE_NAME).then(cache => {
        console.log('[Service Worker] Caching all: app shell and content');
        return cache.addAll(APP_FILES);
    }));
});

self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Received fetch event ' + event.request.url);
    event.respondWith(caches.match(event.request).then(r => {
        console.log('[Service Worker] Fetching resource: ' + event.request.url);
        return r || fetch(event.request).then(response => {
            return caches.open(CACHE_NAME).then(cache => {
                console.log('[Service Worker] Caching new resource: ' + event.request.url);
                cache.put(event.request, response.clone());
                return response;
            });
        });
    }));
});
