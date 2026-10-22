// WorkPulse · service worker (app instalable)
// - Páginas: primero la red (siempre la versión nueva); sin conexión, la última guardada.
// - Íconos y manifiesto: se guardan para abrir rápido.
// - Firebase, Google y CDNs NO pasan por aquí (van directo a la red).
const VERSION = "wp-v1";
const BASICOS = ["./", "index.html", "sistema.html", "manifest.webmanifest", "icono-180.png", "icono-192.png", "icono-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(BASICOS)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;               // Firebase, CDNs, Google: directo
  if (req.mode === "navigate" || req.destination === "document") {
    e.respondWith(fetch(req).then((r) => {
      const copia = r.clone();
      caches.open(VERSION).then((c) => c.put(req, copia)).catch(() => {});
      return r;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(req).then((r) => r || fetch(req)));
});

// Tocar un aviso abre (o enfoca) WorkPulse
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ventanas) => {
    const v = ventanas.find((w) => w.url.includes(self.registration.scope));
    return v ? v.focus() : self.clients.openWindow("./");
  }));
});
