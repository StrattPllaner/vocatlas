/* Vocatlas: funciona sin conexión.
   La página se pide primero a la red (así siempre llega la versión nueva) y, si no hay red, sale de la copia guardada.
   Íconos y fuentes salen de la copia y se actualizan por detrás. */
var V = "vocatlas-v1";
var SHELL = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon.svg", "icons/favicon-32.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(V).then(function (c) { return c.addAll(SHELL) }).then(function () { return self.skipWaiting() }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== V }).map(function (k) { return caches.delete(k) }));
  }).then(function () { return self.clients.claim() }));
});

function fromNetwork(req, key) {
  return fetch(req).then(function (r) {
    if (r && (r.ok || r.type === "opaque")) { var cp = r.clone(); caches.open(V).then(function (c) { c.put(key || req, cp) }) }
    return r;
  });
}
self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET") return;
  /* la revisión de versión nueva (?u=) siempre va directo a la red */
  if (url.origin === location.origin && url.searchParams.has("u")) return;
  var page = req.mode === "navigate" || (url.origin === location.origin && /\/(index\.html)?$/.test(url.pathname));
  if (page) {
    e.respondWith(fromNetwork(req, "index.html").catch(function () {
      return caches.match("index.html").then(function (r) { return r || caches.match("./") });
    }));
    return;
  }
  var font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin === location.origin || font) {
    e.respondWith(caches.match(req).then(function (hit) {
      var net = fromNetwork(req).catch(function () { return hit });
      return hit || net;
    }));
  }
});
