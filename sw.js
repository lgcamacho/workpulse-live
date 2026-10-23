// WorkPulse · service worker (app instalable y carga rápida)
// - Páginas: primero la red (versión nueva). Si la red tarda más de 3 s o no hay conexión, la última guardada.
// - Librerías con versión fija (Firebase 12.19.0, ApexCharts 3.54.1, QR 1.4.4): se guardan en el equipo
//   la primera vez y después se cargan al instante (no cambian nunca).
// - sekaia.js, íconos y manifiesto: se muestran de lo guardado y se actualizan en segundo plano.
// - Los DATOS (Firestore, inicio de sesión, Google) NO pasan por aquí: van directo a la red.
const VERSION = "wp-v2";
const LIBS = "wp-libs-v1";
const BASICOS = ["./", "index.html", "sistema.html", "sekaia.js", "manifest.webmanifest", "icono-180.png", "icono-192.png", "icono-512.png"];
const LIB_VERSIONADA = [
  /^https:\/\/www\.gstatic\.com\/firebasejs\/\d+\.\d+\.\d+\//,
  /^https:\/\/cdn\.jsdelivr\.net\/npm\/[^/]+@\d+\.\d+\.\d+\//
];
const ESPERA_RED_MS = 3000;

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(BASICOS)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION && k !== LIBS).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function guardar(nombre, req, resp) {
  if (resp && (resp.ok || resp.type === "opaque")) {
    const copia = resp.clone();
    caches.open(nombre).then((c) => c.put(req, copia)).catch(() => {});
  }
  return resp;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Librerías con versión fija: del equipo; si no están, de la red y se guardan
  if (LIB_VERSIONADA.some((r) => r.test(req.url))) {
    e.respondWith(caches.open(LIBS).then((c) => c.match(req)).then((r) => r || fetch(req).then((resp) => guardar(LIBS, req, resp))));
    return;
  }
  if (url.origin !== self.location.origin) return;               // Firebase (datos), Google y lo demás: directo

  // Páginas: red primero, con tiempo límite
  if (req.mode === "navigate" || req.destination === "document") {
    e.respondWith(new Promise((resolve) => {
      let listo = false;
      const deCache = () => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match("index.html"));
      const timer = setTimeout(() => {
        deCache().then((r) => { if (r && !listo) { listo = true; resolve(r); } });
      }, ESPERA_RED_MS);
      fetch(req).then((resp) => {
        guardar(VERSION, req, resp);
        clearTimeout(timer);
        if (!listo) { listo = true; resolve(resp); }
      }).catch(() => {
        clearTimeout(timer);
        deCache().then((r) => { if (!listo) { listo = true; resolve(r || Response.error()); } });
      });
    }));
    return;
  }

  // Lo demás del sitio (sekaia.js, íconos): lo guardado al instante y se actualiza en segundo plano
  e.respondWith(caches.match(req).then((r) => {
    const red = fetch(req).then((resp) => guardar(VERSION, req, resp)).catch(() => r);
    return r || red;
  }));
});

// Tocar un aviso abre (o enfoca) WorkPulse
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((ventanas) => {
    const v = ventanas.find((w) => w.url.includes(self.registration.scope));
    return v ? v.focus() : self.clients.openWindow("./");
  }));
});
