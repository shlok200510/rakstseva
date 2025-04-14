document.addEventListener("DOMContentLoaded", () => {
  const sosForm = document.getElementById("sos-form");
  
  if (sosForm) {
    // Automatically get location if available
    if (navigator.geolocation) {
      const locationStatus = document.getElementById("location-status");
      if (locationStatus) {
        locationStatus.textContent = "Detecting your location...";
        locationStatus.className = "location-status loading";
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Create hidden fields for coordinates
          const latInput = document.createElement("input");
          latInput.type = "hidden";
          latInput.name = "latitude";
          latInput.id = "latitude";
          latInput.value = position.coords.latitude;
          
          const longInput = document.createElement("input");
          longInput.type = "hidden";
          longInput.name = "longitude";
          longInput.id = "longitude";
          longInput.value = position.coords.longitude;
          
          sosForm.appendChild(latInput);
          sosForm.appendChild(longInput);
          
          if (locationStatus) {
            locationStatus.textContent = "Location detected successfully";
            locationStatus.className = "location-status success";
          }
        },
        (error) => {
          if (locationStatus) {
            locationStatus.textContent = "Could not detect location. Please describe your location.";
            locationStatus.className = "location-status error";
          }
        }
      );
    }
    
    // Handle form submission
    sosForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      
      const submitButton = this.querySelector("button[type='submit']");
      const originalButtonText = submitButton.innerHTML;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending SOS...';
      submitButton.disabled = true;
      
      try {
        const formData = {
          blood_type: document.getElementById("bloodType").value,
          latitude: document.getElementById("latitude") ? document.getElementById("latitude").value : null,
          longitude: document.getElementById("longitude") ? document.getElementById("longitude").value : null,
          location_description: document.getElementById("locationDescription").value,
          hospital: document.getElementById("hospital").value,
          contact_number: document.getElementById("contactNumber").value
        };
        
        // Call the backend API
        const response = await api.sendSosAlert(formData);
        
        // Show success message
        document.querySelector(".sos-form-container").innerHTML = `
          <div class="sos-success">
            <div class="pulse-icon">
              <i class="fas fa-heartbeat"></i>
            </div>
            <h2>Emergency SOS Sent!</h2>
            <p>Your emergency blood request has been sent to all eligible donors in your area.</p>
            <p>We are contacting nearby blood banks and hospitals as well.</p>
            <div class="sos-details">
              <p><strong>Blood Type Needed:</strong> ${formData.blood_type}</p>
              <p><strong>Hospital:</strong> ${formData.hospital}</p>
              <p><strong>Contact Number:</strong> ${formData.contact_number}</p>
            </div>
            <p class="sos-id">Emergency ID: SOS-${Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
            <p>Stay on this page to receive updates</p>
            <div class="action-buttons">
              <a href="index.html" class="button outline-button">
                <i class="fas fa-home"></i> Home
              </a>
            </div>
          </div>
        `;
      } catch (error) {
        alert(`SOS alert failed to send: ${error.message}`);
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
});
