console.log('Loaded service worker!');

self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: 'You have not added an entry to your diary today',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTapZwG9027EDdfaV4lweInb3Kcjlq4vAPDpyPtZ5LyJue_IS44',
  });
});
