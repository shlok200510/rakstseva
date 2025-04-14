document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")
    question.addEventListener("click", () => {
    
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active")
        }
      })

     
      item.classList.toggle("active")
    })
  })

 
  const radiusSlider = document.getElementById("notificationRadius")
  const radiusValue = document.getElementById("radius-value")

  if (radiusSlider && radiusValue) {
    radiusSlider.addEventListener("input", () => {
      radiusValue.textContent = radiusSlider.value
    })
  }

 
  const donorShareLocation = document.getElementById("donorShareLocation")
  const donorLocationStatus = document.getElementById("donorLocationStatus")

  if (donorShareLocation && donorLocationStatus) {
    donorShareLocation.addEventListener("change", function () {
      if (this.checked) {
        donorLocationStatus.textContent = "Getting your location..."
        donorLocationStatus.className = "location-status loading"

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              donorLocationStatus.textContent = "Location acquired successfully"
              donorLocationStatus.className = "location-status success"

             
              const latInput = document.createElement("input")
              latInput.type = "hidden"
              latInput.name = "latitude"
              latInput.id = "donor-latitude"
              latInput.value = position.coords.latitude

              const longInput = document.createElement("input")
              longInput.type = "hidden"
              longInput.name = "longitude"
              longInput.id = "donor-longitude"
              longInput.value = position.coords.longitude

              const form = document.getElementById("plasma-donor-form")
              form.appendChild(latInput)
              form.appendChild(longInput)
            },
            (error) => {
              donorLocationStatus.textContent = "Error getting location: " + error.message
              donorLocationStatus.className = "location-status error"
              donorShareLocation.checked = false
            },
          )
        } else {
          donorLocationStatus.textContent = "Geolocation is not supported by your browser"
          donorLocationStatus.className = "location-status error"
          donorShareLocation.checked = false
        }
      } else {
        donorLocationStatus.textContent = ""
        donorLocationStatus.className = "location-status"

        
        const latInput = document.getElementById("donor-latitude")
        const longInput = document.getElementById("donor-longitude")
        if (latInput) latInput.remove()
        if (longInput) longInput.remove()
      }
    })
  }

 
  const plasmaDonorForm = document.getElementById("plasma-donor-form")
  if (plasmaDonorForm) {
    plasmaDonorForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const submitButton = this.querySelector("button[type='submit']")
      const originalButtonText = submitButton.innerHTML
      submitButton.innerHTML = '<span class="loading"></span> Registering...'
      submitButton.disabled = true

      
      const formData = new FormData(this)
      const donorData = {
        name: formData.get("donorName"),
        age: formData.get("donorAge"),
        bloodType: formData.get("donorBloodType"),
        phone: formData.get("donorPhone"),
        email: formData.get("donorEmail"),
        shareLocation: formData.get("donorShareLocation") === "on",
        latitude: formData.get("latitude"),
        longitude: formData.get("longitude"),
        covidRecovered: formData.get("covidRecovered"),
        notifyEmergency: formData.get("notifyEmergency") === "on",
        notifyDonationDrive: formData.get("notifyDonationDrive") === "on",
        notifyEligibility: formData.get("notifyEligibility") === "on",
      }

      console.log("Plasma donor registration:", donorData)

     
      const donors = JSON.parse(localStorage.getItem("plasmaDonors") || "[]")
      donors.push({
        ...donorData,
        id: "donor_" + Math.random().toString(36).substr(2, 9),
        registeredAt: new Date().toISOString(),
      })
      localStorage.setItem("plasmaDonors", JSON.stringify(donors))

      
      if (donorData.notifyEmergency && window.notificationManager) {
        window.notificationManager.updateUserProfile(donorData.bloodType, {
          latitude: donorData.latitude,
          longitude: donorData.longitude,
        })
        window.notificationManager.subscribe()
      }

      setTimeout(() => {
       
        plasmaDonorForm.innerHTML = `
          <div class="success-message">
            <i class="fas fa-check-circle success-icon"></i>
            <h2>Thank You for Registering!</h2>
            <p>You are now registered as a plasma donor. We'll notify you when your donation is needed.</p>
            <div class="donor-card">
              <div class="donor-card-header">
                <h3>Plasma Donor Card</h3>
                <div class="donor-blood-type">${donorData.bloodType}</div>
              </div>
              <div class="donor-card-body">
                <div class="donor-info">
                  <p><strong>Name:</strong> ${donorData.name}</p>
                  <p><strong>ID:</strong> PD-${Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                  <p><strong>Registered:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
                <div class="donor-qr">
                  <img src="/placeholder.svg?height=80&width=80" alt="Donor QR Code">
                </div>
              </div>
              <div class="donor-card-footer">
                <p>Thank you for your commitment to saving lives!</p>
              </div>
            </div>
            <div class="action-buttons">
              <a href="#request-plasma" class="button outline-button">
                <i class="fas fa-notes-medical"></i> Request Plasma
              </a>
              <a href="index.html" class="button plasma-button">
                <i class="fas fa-home"></i> Home
              </a>
            </div>
          </div>
        `
      }, 2000)
    })
  }

  const plasmaRequestForm = document.getElementById("plasma-request-form")
  if (plasmaRequestForm) {
    plasmaRequestForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const submitButton = this.querySelector("button[type='submit']")
      const originalButtonText = submitButton.innerHTML
      submitButton.innerHTML = '<span class="loading"></span> Submitting...'
      submitButton.disabled = true

      const formData = new FormData(this)
      const requestData = {
        patientName: formData.get("patientName"),
        bloodType: formData.get("patientBloodType"),
        hospital: formData.get("hospital"),
        requiredUnits: formData.get("requiredUnits"),
        requiredBy: formData.get("requiredBy"),
        contactName: formData.get("contactName"),
        contactNumber: formData.get("contactNumber"),
        contactEmail: formData.get("contactEmail"),
        notificationRadius: formData.get("notificationRadius"),
        additionalInfo: formData.get("additionalInfo"),
      }

      console.log("Plasma request submitted:", requestData)

      
      const requests = JSON.parse(localStorage.getItem("plasmaRequests") || "[]")
      const requestId = "request_" + Math.random().toString(36).substr(2, 9)
      requests.push({
        ...requestData,
        id: requestId,
        status: "pending",
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem("plasmaRequests", JSON.stringify(requests))

      if (window.notificationManager) {
        window.notificationManager.simulateSendNotification({
          emergencyId: requestId,
          bloodType: requestData.bloodType,
          hospital: requestData.hospital,
          contactNumber: requestData.contactNumber,
          notificationRadius: requestData.notificationRadius,
          requestType: "plasma",
        })
      }

   
      setTimeout(() => {
        plasmaRequestForm.innerHTML = `
          <div class="success-message">
            <i class="fas fa-check-circle success-icon"></i>
            <h2>Plasma Request Submitted</h2>
            <div class="progress-steps">
              <div class="progress-step completed">
                <div class="step-icon"><i class="fas fa-paper-plane"></i></div>
                <div class="step-text">Request Submitted</div>
              </div>
              <div class="progress-step active">
                <div class="step-icon"><i class="fas fa-bell"></i></div>
                <div class="step-text">Notifying Donors</div>
              </div>
              <div class="progress-step">
                <div class="step-icon"><i class="fas fa-hospital"></i></div>
                <div class="step-text">Matching with Blood Banks</div>
              </div>
            </div>
            <p>Your plasma request has been submitted successfully.</p>
            <p>We'll notify potential donors in your area and contact you at <strong>${requestData.contactNumber}</strong> with updates.</p>
            <div class="request-details">
              <p><strong>Request ID:</strong> PR-${requestId.substr(-6).toUpperCase()}</p>
              <p><strong>Blood Type:</strong> ${requestData.bloodType}</p>
              <p><strong>Required Units:</strong> ${requestData.requiredUnits}</p>
              <p><strong>Required By:</strong> ${new Date(requestData.requiredBy).toLocaleDateString()}</p>
            </div>
            <div class="notification-info">
              <p><i class="fas fa-info-circle"></i> Notifications sent to potential donors within <strong>${requestData.notificationRadius}km</strong></p>
            </div>
            <div class="action-buttons">
              <button class="button secondary-button" onclick="window.location.reload()">
                <i class="fas fa-redo"></i> New Request
              </button>
              <a href="index.html" class="button outline-button">
                <i class="fas fa-home"></i> Home
              </a>
            </div>
          </div>
        `
      }, 2000)
    })
  }

  const subscribeButton = document.getElementById("notification-subscribe")
  const unsubscribeButton = document.getElementById("notification-unsubscribe")

  if (subscribeButton && window.notificationManager) {
    subscribeButton.addEventListener("click", () => {
      window.notificationManager.subscribe()
    })
  }

  if (unsubscribeButton && window.notificationManager) {
    unsubscribeButton.addEventListener("click", () => {
      window.notificationManager.unsubscribe()
    })
  }


  const floatingSOSButton = document.getElementById("floating-sos")
  if (floatingSOSButton) {
    
    let lastScrollTop = 0
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      if (scrollTop > lastScrollTop && scrollTop > 300) {
        
        floatingSOSButton.classList.add("show")
      } else if (scrollTop < 100) {
        
        floatingSOSButton.classList.remove("show")
      }
      lastScrollTop = scrollTop
    })
  }

  
  const requiredByInput = document.getElementById("requiredBy")
  if (requiredByInput) {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")
    const todayString = `${yyyy}-${mm}-${dd}`
    requiredByInput.min = todayString
  }
})
