// Service Worker for Push Notifications
const CACHE_NAME = "raktseva-cache-v1"

// Install event - cache essential files
self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/sos-styles.css",
        "/plasma-styles.css",
        "/sos.html",
        "/plasma.html",
        "/sos.js",
        "/plasma.js",
      ])
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Push notification event handler
self.addEventListener("push", (event) => {
  let notificationData = {}

  try {
    notificationData = event.data.json()
  } catch (e) {
    notificationData = {
      title: "Emergency Blood Request",
      body: "Someone nearby needs your blood type urgently!",
      icon: "/icons/blood-drop-icon.png",
      badge: "/icons/badge-icon.png",
      data: {
        url: "/sos-response.html",
      },
    }
  }

  // Check if it's a plasma request
  if (notificationData.requestType === "plasma") {
    notificationData.title = "Plasma Donation Request"
    notificationData.body = `Your plasma type ${notificationData.bloodType} is needed at ${notificationData.hospital || "a nearby hospital"}`
    notificationData.data.url = "/plasma-response.html"
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    vibrate: [100, 50, 100, 50, 100, 50, 100],
    data: notificationData.data,
    actions: [
      {
        action: "respond",
        title: "Respond Now",
        icon: "/icons/check-icon.png",
      },
      {
        action: "dismiss",
        title: "Not Available",
        icon: "/icons/x-icon.png",
      },
    ],
    tag: notificationData.requestType === "plasma" ? "plasma-request" : "emergency-blood-request",
    renotify: true,
    requireInteraction: true,
  }

  event.waitUntil(self.registration.showNotification(notificationData.title, options))
})

// Notification click event handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "respond") {
    // Open the response page
    event.waitUntil(clients.openWindow(event.notification.data.url || "/sos-response.html"))
  }
})

// Fetch event - network first, then cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response to store in cache
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
      .catch(() => {
        return caches.match(event.request)
      }),
  )
})

