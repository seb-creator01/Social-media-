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
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // You can change this to your app icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
