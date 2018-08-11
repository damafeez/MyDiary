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
  });
});
