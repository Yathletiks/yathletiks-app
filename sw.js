self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: "YATHLETIKS", body: e.data ? e.data.text() : "" }; }
  var opt = { body: d.body || "", icon: "icons/icon-192.png", badge: "icons/icon-192.png", data: { url: d.url || "./" } };
  if (d.tag) opt.tag = d.tag;
  e.waitUntil(self.registration.showNotification(d.title || "YATHLETIKS", opt));
});
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (ws) {
    for (var i = 0; i < ws.length; i++) { if ("focus" in ws[i]) return ws[i].focus(); }
    return self.clients.openWindow(url);
  }));
});
