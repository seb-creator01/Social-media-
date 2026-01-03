// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyCykBKGTQ3lKc06ZRfE9S4KLjphHPEJiu0",
    authDomain: "social-media-platform-b3242.firebaseapp.com",
    projectId: "social-media-platform-b3242",
    storageBucket: "social-media-platform-b3242.appspot.com",
    messagingSenderId: "85114084944",
    appId: "1:85114084944:web:b3ef84305bc8c04dabfb55"
});

const messaging = firebase.messaging();

// This handles notifications when the tab is closed or in the background
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received: ', payload);
  
  // Updated to include a fallback in case payload.notification is undefined
  const notificationTitle = payload.notification?.title || payload.data?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "You have a new update.",
    icon: '/firebase-logo.png', // Keep your original path
    data: {
      url: '/' // This allows us to capture the URL for the click event below
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// NEW: Add a listener for when the user clicks the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification banner

  // Open the app or a specific URL when clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow(event.notification.data.url);
    })
  );
});

