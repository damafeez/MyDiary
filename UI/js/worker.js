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
  const url = 'https://damafeez.github.io/MyDiary/UI/home.html';
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clientList) => {
    if (clientList.length > 0) {
      const focused = clientList.find(client => client.focused);
      if (focused) return focused;
      return clientList[0].focus();
    }
    return self.clients.openWindow(url);
  }));
});
