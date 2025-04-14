// Update the NotificationManager class to handle plasma donation notifications

class NotificationManager {
  constructor() {
    this.swRegistration = null
    this.isSubscribed = false
    this.applicationServerPublicKey =
      "BLGrBJQBYgOLDZ7GlGj8_TUJVZuYnvbWJZb9uRKRQqQJCHQYx8jEfPCDOkVJUwgTtUTN9dYK7cOJJfyeFXzOXIY" // Example VAPID public key
    this.userId = this.getUserId()
    this.userLocation = null
    this.bloodType = null
    this.maxDistance = 10 // Default max distance in km
    this.notificationPreferences = {
      bloodRequests: true,
      plasmaRequests: true,
      donationDrives: true,
      eligibilityReminders: true,
    }
  }

  // Initialize the notification system
  async init() {
    // Check if service workers and push messaging are supported
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications are not supported in this browser")
      return false
    }

    try {
      // Register service worker
      this.swRegistration = await navigator.serviceWorker.register("/service-worker.js")
      console.log("Service Worker registered successfully", this.swRegistration)

      // Check if already subscribed
      this.updateSubscriptionStatus()

      // Load user profile if available
      this.loadUserProfile()

      return true
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      return false
    }
  }

  // Update subscription status
  async updateSubscriptionStatus() {
    if (!this.swRegistration) return

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription()
      this.isSubscribed = subscription !== null

      // Store subscription in localStorage if subscribed
      if (this.isSubscribed) {
        localStorage.setItem("pushSubscription", JSON.stringify(subscription))
      }

      console.log("User is " + (this.isSubscribed ? "" : "not ") + "subscribed to push notifications")

      // Update UI based on subscription status
      this.updateUI()
    } catch (error) {
      console.error("Error checking subscription status:", error)
    }
  }

  // Subscribe to push notifications
  async subscribe() {
    if (!this.swRegistration) return

    try {
      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        console.warn("Notification permission denied")
        return
      }

      // Convert base64 application server key to Uint8Array
      const applicationServerKey = this.urlB64ToUint8Array(this.applicationServerPublicKey)

      // Subscribe to push notifications
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey,
      })

      console.log("User is subscribed to push notifications")
      this.isSubscribed = true

      // Store subscription in localStorage
      localStorage.setItem("pushSubscription", JSON.stringify(subscription))

      // Send subscription to server (simulated)
      this.sendSubscriptionToServer(subscription)

      // Update UI
      this.updateUI()

      return subscription
    } catch (error) {
      console.error("Failed to subscribe to push notifications:", error)
      return null
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    if (!this.swRegistration) return

    try {
      const subscription = await this.swRegistration.pushManager.getSubscription()

      if (subscription) {
        // Unsubscribe
        await subscription.unsubscribe()

        // Remove subscription from localStorage
        localStorage.removeItem("pushSubscription")

        // Send unsubscription to server (simulated)
        this.sendSubscriptionToServer(null)

        this.isSubscribed = false
        console.log("User is unsubscribed from push notifications")

        // Update UI
        this.updateUI()
      }
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
    }
  }

  // Update UI based on subscription status
  updateUI() {
    const subscribeButton = document.getElementById("notification-subscribe")
    const unsubscribeButton = document.getElementById("notification-unsubscribe")
    const notificationStatus = document.getElementById("notification-status")

    if (!subscribeButton || !unsubscribeButton || !notificationStatus) return

    if (this.isSubscribed) {
      subscribeButton.style.display = "none"
      unsubscribeButton.style.display = "block"
      notificationStatus.textContent = "You will receive emergency notifications"
      notificationStatus.className = "notification-status active"
    } else {
      subscribeButton.style.display = "block"
      unsubscribeButton.style.display = "none"
      notificationStatus.textContent = "Enable notifications to help save lives"
      notificationStatus.className = "notification-status"
    }
  }

  // Send subscription to server (simulated)
  sendSubscriptionToServer(subscription) {
    // In a real application, this would send the subscription to your backend
    console.log("Sending subscription to server:", subscription)

    // Simulate storing subscription with user data
    if (subscription) {
      const userData = {
        userId: this.userId,
        subscription: subscription,
        bloodType: this.bloodType,
        location: this.userLocation,
        maxDistance: this.maxDistance,
        notificationPreferences: this.notificationPreferences,
        lastUpdated: new Date().toISOString(),
      }

      // Store in localStorage (simulating server storage)
      localStorage.setItem("userData", JSON.stringify(userData))
    }
  }

  // Load user profile from localStorage
  loadUserProfile() {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")

    this.bloodType = userData.bloodType || null
    this.userLocation = userData.location || null
    this.maxDistance = userData.maxDistance || 10
    this.notificationPreferences = userData.notificationPreferences || {
      bloodRequests: true,
      plasmaRequests: true,
      donationDrives: true,
      eligibilityReminders: true,
    }

    // Update UI with user data
    this.updateProfileUI()
  }

  // Update profile UI
  updateProfileUI() {
    const bloodTypeElement = document.getElementById("user-blood-type")
    const locationElement = document.getElementById("user-location")
    const distanceElement = document.getElementById("notification-distance")

    if (bloodTypeElement && this.bloodType) {
      bloodTypeElement.textContent = this.bloodType
    }

    if (locationElement && this.userLocation) {
      locationElement.textContent = `${this.userLocation.latitude.toFixed(4)}, ${this.userLocation.longitude.toFixed(4)}`
    }

    if (distanceElement) {
      distanceElement.value = this.maxDistance
    }
  }

  // Update user profile
  updateUserProfile(bloodType, location, maxDistance, notificationPreferences) {
    this.bloodType = bloodType || this.bloodType
    this.userLocation = location || this.userLocation
    this.maxDistance = maxDistance || this.maxDistance

    if (notificationPreferences) {
      this.notificationPreferences = {
        ...this.notificationPreferences,
        ...notificationPreferences,
      }
    }

    // Update localStorage
    const userData = {
      userId: this.userId,
      bloodType: this.bloodType,
      location: this.userLocation,
      maxDistance: this.maxDistance,
      notificationPreferences: this.notificationPreferences,
      lastUpdated: new Date().toISOString(),
    }

    localStorage.setItem("userData", JSON.stringify(userData))

    // Update subscription on server
    const subscription = JSON.parse(localStorage.getItem("pushSubscription") || "null")
    if (subscription) {
      this.sendSubscriptionToServer(subscription)
    }

    // Update UI
    this.updateProfileUI()
  }

  // Get current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          resolve(location)
        },
        (error) => {
          reject(error)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    })
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return distance
  }

  // Convert degrees to radians
  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  // Generate a unique user ID
  getUserId() {
    let userId = localStorage.getItem("userId")
    if (!userId) {
      userId = "user_" + Math.random().toString(36).substr(2, 9)
      localStorage.setItem("userId", userId)
    }
    return userId
  }

  // Convert base64 to Uint8Array for VAPID key
  urlB64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Simulate sending a notification to nearby users
  simulateSendNotification(emergencyData) {
    console.log("Simulating sending notification to nearby users:", emergencyData)

    // In a real application, this would be handled by the server
    // Here we'll simulate it by showing a demo notification

    if (this.swRegistration && this.isSubscribed) {
      // Create notification content
      const isPlasmaRequest = emergencyData.requestType === "plasma"

      const notificationData = {
        title: isPlasmaRequest ? "Plasma Donation Request Nearby" : "Emergency Blood Request Nearby",
        body: `${isPlasmaRequest ? "Plasma" : "Blood type"} ${emergencyData.bloodType} needed ${isPlasmaRequest ? "" : "urgently "}at ${emergencyData.hospital || "a nearby hospital"}`,
        icon: "/icons/blood-drop-icon.png",
        badge: "/icons/badge-icon.png",
        data: {
          url: isPlasmaRequest ? "/plasma-response.html" : "/sos-response.html",
          emergencyId: emergencyData.emergencyId || "emergency_" + Math.random().toString(36).substr(2, 9),
          bloodType: emergencyData.bloodType,
          hospital: emergencyData.hospital,
          contactNumber: emergencyData.contactNumber,
          location: emergencyData.location,
          requestType: emergencyData.requestType || "emergency",
        },
      }

      // Simulate server sending push notification
      // In a real app, this would be done by your backend server
      setTimeout(() => {
        // Display a simulated notification
        if ("Notification" in window && Notification.permission === "granted") {
          const notification = new Notification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            tag: isPlasmaRequest ? "plasma-request" : "emergency-blood-request",
            requireInteraction: true,
          })

          notification.onclick = () => {
            window.open(notificationData.data.url, "_blank")
            notification.close()
          }
        }
      }, 2000)
    }
  }
}

// Initialize notification manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.notificationManager = new NotificationManager()
  window.notificationManager.init()
})

  