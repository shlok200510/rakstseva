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
    plasmaDonorForm.addEventListener("submit", async function (e) {
      e.preventDefault()

      const submitButton = this.querySelector("button[type='submit']")
      const originalButtonText = submitButton.innerHTML
      submitButton.innerHTML = '<span class="loading"></span> Registering...'
      submitButton.disabled = true

      try {
        const formData = new FormData(this)
        const donorData = {
          name: formData.get("donorName"),
          age: parseInt(formData.get("donorAge")),
          blood_type: formData.get("donorBloodType"),
          phone: formData.get("donorPhone"),
          email: formData.get("donorEmail"),
          latitude: formData.get("latitude"),
          longitude: formData.get("longitude"),
          notify_emergency: formData.get("notifyEmergency") === "on" ? 1 : 0,
          notify_drive: formData.get("notifyDonationDrive") === "on" ? 1 : 0,
          notify_eligibility: formData.get("notifyEligibility") === "on" ? 1 : 0
        }

        // Call the backend API
        const response = await api.registerPlasmaDonor(donorData);
        
        // Display success message
        plasmaDonorForm.innerHTML = `
          <div class="success-message">
            <i class="fas fa-check-circle success-icon"></i>
            <h2>Thank You for Registering!</h2>
            <p>You are now registered as a plasma donor. We'll notify you when your donation is needed.</p>
            <div class="donor-card">
              <div class="donor-card-header">
                <h3>Plasma Donor Card</h3>
                <div class="donor-blood-type">${donorData.blood_type}</div>
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
        `;
      } catch (error) {
        alert(`Registration failed: ${error.message}`);
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }
    })
  }

  const plasmaRequestForm = document.getElementById("plasma-request-form")
  if (plasmaRequestForm) {
    plasmaRequestForm.addEventListener("submit", async function (e) {
      e.preventDefault()

      const submitButton = this.querySelector("button[type='submit']")
      const originalButtonText = submitButton.innerHTML
      submitButton.innerHTML = '<span class="loading"></span> Submitting...'
      submitButton.disabled = true

      try {
        const formData = new FormData(this)
        const requestData = {
          patient_name: formData.get("patientName"),
          blood_type: formData.get("patientBloodType"),
          hospital: formData.get("hospital"),
          city: formData.get("city") || "",
          contact_number: formData.get("contactNumber")
        }

        // Call the backend API
        const response = await api.requestPlasma(requestData);
        
        // Display success message
        const requestId = Math.random().toString(36).substr(2, 9);
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
            <p>We'll notify potential donors in your area and contact you at <strong>${requestData.contact_number}</strong> with updates.</p>
            <div class="request-details">
              <p><strong>Request ID:</strong> PR-${requestId.substr(-6).toUpperCase()}</p>
              <p><strong>Blood Type:</strong> ${requestData.blood_type}</p>
              <p><strong>Hospital:</strong> ${requestData.hospital}</p>
            </div>
            <div class="action-buttons">
              <button class="button secondary-button" onclick="window.location.reload()">
                <i class="fas fa-red/o-cross"></i> Request Another Plasma
                </button>
                <a href="index.html" class="button plasma-button">
                <i class="fas fa-home"></i> Home
                </a>
            </div>
            </div>
        `;
        } catch (error) {
        alert(`Request submission failed: ${error.message}`);
      }