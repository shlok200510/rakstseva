document.addEventListener("DOMContentLoaded", () => {
  // Tab switching functionality
  const tabButtons = document.querySelectorAll(".tab-button")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab")

      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Update active tab content
      tabContents.forEach((content) => content.classList.remove("active"))
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })

  // Quick Request Form Functionality
  const bloodTypeButtons = document.querySelectorAll(".blood-type-btn")
  const hospitalChips = document.querySelectorAll(".hospital-chip")
  const detectLocationBtn = document.getElementById("detect-location")
  const locationStatus = document.getElementById("location-status")
  const quickSubmitBtn = document.getElementById("submit-quick-sos")
  const radiusSlider = document.getElementById("radius-slider")
  const radiusValue = document.getElementById("radius-value")

  // Selected values for quick form
  let selectedBloodType = null
  let selectedHospital = null
  let userLocation = null
  let notificationRadius = 10 // Default radius in km

  // Update radius value display
  if (radiusSlider && radiusValue) {
    radiusSlider.addEventListener("input", () => {
      notificationRadius = radiusSlider.value
      radiusValue.textContent = notificationRadius
    })
  }

  // Blood type selection
  bloodTypeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      bloodTypeButtons.forEach((b) => b.classList.remove("selected"))
      btn.classList.add("selected")
      selectedBloodType = btn.getAttribute("data-type")
      updateQuickSubmitButton()
    })
  })

  // Hospital chip selection
  hospitalChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      hospitalChips.forEach((c) => c.classList.remove("selected"))
      chip.classList.add("selected")
      selectedHospital = chip.getAttribute("data-hospital")
      document.getElementById("hospital-quick").value = selectedHospital
      updateQuickSubmitButton()
    })
  })

  // Hospital input
  document.getElementById("hospital-quick").addEventListener("input", (e) => {
    selectedHospital = e.target.value
    // Deselect any selected chips
    hospitalChips.forEach((c) => c.classList.remove("selected"))
    updateQuickSubmitButton()
  })

  // Contact input
  document.getElementById("contact-quick").addEventListener("input", updateQuickSubmitButton)

  // Location detection
  detectLocationBtn.addEventListener("click", () => {
    locationStatus.textContent = "Getting your location..."
    locationStatus.className = "location-status loading"
    detectLocationBtn.disabled = true

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }

          locationStatus.innerHTML = '<i class="fas fa-check-circle"></i> Location detected'
          locationStatus.className = "location-status success"
          detectLocationBtn.innerHTML = '<i class="fas fa-check"></i> Location Ready'
          detectLocationBtn.classList.add("location-ready")
          updateQuickSubmitButton()
        },
        (error) => {
          locationStatus.textContent = "Error: " + error.message
          locationStatus.className = "location-status error"
          detectLocationBtn.disabled = false
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      locationStatus.textContent = "Geolocation not supported"
      locationStatus.className = "location-status error"
      detectLocationBtn.disabled = false
    }
  })

  // Quick submit button update
  function updateQuickSubmitButton() {
    const contactNumber = document.getElementById("contact-quick").value

    if (selectedBloodType && (selectedHospital || userLocation) && contactNumber) {
      quickSubmitBtn.disabled = false
      quickSubmitBtn.classList.remove("disabled")
    } else {
      quickSubmitBtn.disabled = true
      quickSubmitBtn.classList.add("disabled")
    }
  }

  // Quick submit functionality
  quickSubmitBtn.addEventListener("click", () => {
    const contactNumber = document.getElementById("contact-quick").value

    // Show loading state
    const originalButtonText = quickSubmitBtn.innerHTML
    quickSubmitBtn.innerHTML = '<span class="loading"></span> Sending...'
    quickSubmitBtn.disabled = true

    // Prepare request data
    const emergencyId = "emergency_" + Math.random().toString(36).substr(2, 9)
    const requestData = {
      emergencyId: emergencyId,
      bloodType: selectedBloodType,
      hospital: selectedHospital,
      contactNumber: contactNumber,
      location: userLocation,
      notificationRadius: notificationRadius,
      timestamp: new Date().toISOString(),
      requestType: "emergency",
    }

    console.log("Emergency SOS request submitted:", requestData)

    // Send notification to nearby donors if notification system is available
    if (window.notificationManager) {
      window.notificationManager.simulateSendNotification(requestData)
    }

    // Simulate API call with timeout
    setTimeout(() => {
      // Show success message with progress steps
      document.querySelector(".quick-request-container").innerHTML = `
        <div class="success-message">
          <i class="fas fa-check-circle success-icon"></i>
          <h2>Emergency Request Sent!</h2>
          <div class="progress-steps">
            <div class="progress-step completed">
              <div class="step-icon"><i class="fas fa-paper-plane"></i></div>
              <div class="step-text">Request Sent</div>
            </div>
            <div class="progress-step active">
              <div class="step-icon"><i class="fas fa-bell"></i></div>
              <div class="step-text">Notifying Donors</div>
            </div>
            <div class="progress-step">
              <div class="step-icon"><i class="fas fa-hospital"></i></div>
              <div class="step-text">Alerting Blood Banks</div>
            </div>
          </div>
          <p>We've sent your emergency request to nearby donors and blood banks.</p>
          <p>A coordinator will contact you at <strong>${contactNumber}</strong> shortly.</p>
          <div class="notification-info">
            <p><i class="fas fa-info-circle"></i> Push notifications sent to <strong>${Math.floor(Math.random() * 15) + 5}</strong> potential donors within <strong>${notificationRadius}km</strong></p>
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

      // Save to recent hospitals for future use
      if (selectedHospital) {
        const recentHospitals = JSON.parse(localStorage.getItem("recentHospitals") || "[]")
        if (!recentHospitals.includes(selectedHospital)) {
          recentHospitals.unshift(selectedHospital)
          if (recentHospitals.length > 3) recentHospitals.pop()
          localStorage.setItem("recentHospitals", JSON.stringify(recentHospitals))
        }
      }
    }, 2000)
  })

  // Detailed form functionality
  const sosForm = document.getElementById("sosForm")
  const shareLocationCheckbox = document.getElementById("shareLocation")
  const locationStatusDetailed = document.getElementById("locationStatus")

  // Handle location sharing for detailed form
  shareLocationCheckbox.addEventListener("change", function () {
    if (this.checked) {
      locationStatusDetailed.textContent = "Getting your location..."
      locationStatusDetailed.className = "location-status loading"

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            locationStatusDetailed.textContent = "Location acquired successfully"
            locationStatusDetailed.className = "location-status success"

            // Store coordinates in hidden fields
            const latInput = document.createElement("input")
            latInput.type = "hidden"
            latInput.name = "latitude"
            latInput.id = "latitude"
            latInput.value = position.coords.latitude

            const longInput = document.createElement("input")
            longInput.type = "hidden"
            longInput.name = "longitude"
            longInput.id = "longitude"
            longInput.value = position.coords.longitude

            sosForm.appendChild(latInput)
            sosForm.appendChild(longInput)
          },
          (error) => {
            locationStatusDetailed.textContent = "Error getting location: " + error.message
            locationStatusDetailed.className = "location-status error"
            shareLocationCheckbox.checked = false
          },
        )
      } else {
        locationStatusDetailed.textContent = "Geolocation is not supported by your browser"
        locationStatusDetailed.className = "location-status error"
        shareLocationCheckbox.checked = false
      }
    } else {
      locationStatusDetailed.textContent = ""
      locationStatusDetailed.className = "location-status"

      // Remove coordinates if checkbox is unchecked
      const latInput = document.getElementById("latitude")
      const longInput = document.getElementById("longitude")
      if (latInput) sosForm.removeChild(latInput)
      if (longInput) sosForm.removeChild(longInput)
    }
  })

  // Handle detailed form submission
  sosForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Show loading state
    const submitButton = this.querySelector("button[type='submit']")
    const originalButtonText = submitButton.innerHTML
    submitButton.innerHTML = '<span class="loading"></span> Sending...'
    submitButton.disabled = true

    // Collect form data
    const emergencyId = "emergency_" + Math.random().toString(36).substr(2, 9)
    const formData = {
      emergencyId: emergencyId,
      patientName: document.getElementById("patientName").value,
      bloodType: document.getElementById("bloodType").value,
      hospital: document.getElementById("hospital").value,
      contactNumber: document.getElementById("contactNumber").value,
      emergencyDetails: document.getElementById("emergencyDetails").value,
      shareLocation: document.getElementById("shareLocation").checked,
      notificationRadius: document.getElementById("notificationRadius").value,
      latitude: document.getElementById("latitude")?.value || null,
      longitude: document.getElementById("longitude")?.value || null,
    }

    console.log("Emergency SOS request submitted:", formData)

    // Send notification to nearby donors if notification system is available
    if (window.notificationManager && formData.shareLocation && formData.latitude && formData.longitude) {
      const locationData = {
        latitude: Number.parseFloat(formData.latitude),
        longitude: Number.parseFloat(formData.longitude),
      }

      window.notificationManager.simulateSendNotification({
        emergencyId: emergencyId,
        bloodType: formData.bloodType,
        hospital: formData.hospital,
        contactNumber: formData.contactNumber,
        location: locationData,
        notificationRadius: formData.notificationRadius,
      })
    }

    // Simulate API call with timeout
    setTimeout(() => {
      // Reset button state
      submitButton.innerHTML = originalButtonText
      submitButton.disabled = false

      // Show success message
      alert(
        `Emergency request sent successfully! Notifications sent to potential donors within ${formData.notificationRadius}km radius.`,
      )

      // Reset form
      sosForm.reset()
      locationStatusDetailed.textContent = ""
      locationStatusDetailed.className = "location-status"

      // Remove coordinates
      const latInput = document.getElementById("latitude")
      const longInput = document.getElementById("longitude")
      if (latInput) sosForm.removeChild(latInput)
      if (longInput) sosForm.removeChild(longInput)
    }, 2000)
  })

  // Load recent hospitals from localStorage
  function loadRecentHospitals() {
    const recentHospitals = JSON.parse(localStorage.getItem("recentHospitals") || "[]")
    const hospitalChipsContainer = document.querySelector(".hospital-chips")

    if (recentHospitals.length > 0) {
      hospitalChipsContainer.innerHTML = ""
      recentHospitals.forEach((hospital) => {
        const chip = document.createElement("button")
        chip.className = "hospital-chip"
        chip.setAttribute("data-hospital", hospital)
        chip.textContent = hospital
        chip.addEventListener("click", () => {
          document.querySelectorAll(".hospital-chip").forEach((c) => c.classList.remove("selected"))
          chip.classList.add("selected")
          selectedHospital = hospital
          document.getElementById("hospital-quick").value = selectedHospital
          updateQuickSubmitButton()
        })
        hospitalChipsContainer.appendChild(chip)
      })
    }
  }

  // Initialize recent hospitals
  loadRecentHospitals()

  // Initialize location detection if checkbox is checked by default
  if (shareLocationCheckbox && shareLocationCheckbox.checked) {
    const event = new Event("change")
    shareLocationCheckbox.dispatchEvent(event)
  }

  // Initialize floating SOS button behavior
  const floatingSOSButton = document.getElementById("floating-sos")
  if (floatingSOSButton) {
    // Hide on SOS page
    if (window.location.pathname.includes("sos.html")) {
      floatingSOSButton.style.display = "none"
    }

    // Show/hide on scroll for other pages
    let lastScrollTop = 0
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      if (scrollTop > lastScrollTop && scrollTop > 300) {
        // Scrolling down
        floatingSOSButton.classList.add("show")
      } else if (scrollTop < 100) {
        // Near top
        floatingSOSButton.classList.remove("show")
      }
      lastScrollTop = scrollTop
    })
  }
})
