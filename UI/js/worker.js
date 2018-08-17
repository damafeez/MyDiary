console.log('Loaded service worker!');

self.addEventListener('push', (event) => {
  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = event.data;
  }
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: data.icon,
    requireInteraction: true,
  });
});
self.addEventListener('notificationclick', (event) => {
  console.log('notification clicked');
  const url = 'https://damafeez.github.io/MyDiary/UI/home.html';
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      windowClients.map((client) => {
        if (client.url === url && client.focus) return client.focus();
        return client;
      });
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
