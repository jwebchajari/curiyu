const CACHE_NAME = "curiyu-pwa-v1";
const urlsToCache = ["/", "/manifest.json", "/escudoi.png"];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => cache.addAll(urlsToCache))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== CACHE_NAME) {
							return caches.delete(cacheName);
						}
					}),
				);
			})
			.then(() => self.clients.claim()),
	);
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			if (cachedResponse) return cachedResponse;
			return fetch(event.request).then((response) => {
				if (
					event.request.method !== "GET" ||
					!response ||
					response.status !== 200
				) {
					return response;
				}
				const responseClone = response.clone();
				caches.open(CACHE_NAME).then((cache) => {
					cache.put(event.request, responseClone);
				});
				return response;
			});
		}),
	);
});
