importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBXpJ1dv_3SDq9TVa-_hoSoT4CFteNJsBM",
  authDomain: "hotel-buddha-avenue.firebaseapp.com",
  databaseURL: "https://hotel-buddha-avenue-default-rtdb.firebaseio.com",
  projectId: "hotel-buddha-avenue",
  storageBucket: "hotel-buddha-avenue.firebasestorage.app",
  messagingSenderId: "20353209537",
  appId: "1:20353209537:web:a6f748af3d97def3393040",
  measurementId: "G-7X3Z82HLB8",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png', // Make sure this icon exists in your public folder
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Add custom click handling here if needed
  const urlToOpen = new URL('/', self.location.origin).href;
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
}); 