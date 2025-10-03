// Nombre de nuestra caché
const CACHE_NAME = 'inventario-pro-cache-v1';

// Archivos que conforma la "cáscara" de la aplicación y recursos externos
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/logo.png',
  '/images/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://unpkg.com/html5-qrcode',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

// Evento de instalación: se dispara cuando el SW se instala por primera vez
self.addEventListener('install', event => {
  self.skipWaiting(); // Forzar la activación inmediata del nuevo Service Worker
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierta y guardando recursos de la app...');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Evento fetch: se dispara cada vez que la app solicita un recurso (una imagen, un script, etc.)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en caché, lo devolvemos desde ahí
        if (response) {
          return response;
        }
        // Si no, lo pedimos a la red
        return fetch(event.request).then(
            (networkResponse) => {
                // Opcional: podrías clonar y guardar en caché la respuesta de red aquí
                // si quieres que los nuevos recursos estén disponibles offline la próxima vez.
                return networkResponse;
            }
        );
      })
  );
});

// Evento de activación: se usa para limpiar cachés antiguas y tomar control
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Tomar control de las páginas abiertas inmediatamente
    );
});