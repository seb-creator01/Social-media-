/**
 * 1. EVENT LISTENERS FIRST
 * We register the click listener at the very top to ensure the browser 
 * attaches it before any script timeouts or Firebase initialization.
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click detected.');
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If no tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

/**
 * 2. IMPORT FIREBASE SDKS
 * Using compat version 10.7.1 as requested.
 */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

/**
 * 3. INITIALIZE FIREBASE
 */
firebase.initializeApp({
    apiKey: "AIzaSyCykBKGTQ3lKc06ZRfE9S4KLjphHPEJiu0",
    authDomain: "social-media-platform-b3242.firebaseapp.com",
    projectId: "social-media-platform-b3242",
    storageBucket: "social-media-platform-b3242.appspot.com",
    messagingSenderId: "85114084944",
    appId: "1:85114084944:web:b3ef84305bc8c04dabfb55"
});

const messaging = firebase.messaging();

/**
 * 4. BACKGROUND MESSAGE HANDLER
 * This catches "data" messages. If you send a "notification" payload, 
 * the browser may show its own default UI and skip this function.
 */
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received: ', payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "You have a new update.",
    icon: '/firebase-logo.png',
    badge: '/firebase-logo.png', // Small icon for the status bar
    tag: 'social-update',        // Prevents duplicate notifications
    data: {
      url: payload.data?.url || '/' 
    }
  };

  // self.registration is the standard way to trigger the UI from the SW
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

