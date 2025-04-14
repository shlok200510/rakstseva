document.getElementById("requestForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
    // Check if API is defined
    if (typeof api === 'undefined') {
      throw new Error("API module is not loaded. Please check if api.js is included in the page.");
    }

    const formData = {
      patient_name: document.getElementById("patientName").value,
      blood_type: document.getElementById("bloodType").value,
      units_required: parseInt(document.getElementById("units").value),
      hospital: document.getElementById("hospital").value,
      city: document.getElementById("city") ? document.getElementById("city").value : "",
      contact_number: document.getElementById("contactNumber").value,
    };

    // Show loading state
    const submitButton = this.querySelector("button[type='submit']");
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitButton.disabled = true;

    // Make API call
    const response = await api.requestBlood(formData);
    
    // Success - show message and reset form
    alert("Blood request submitted successfully! We will notify matching donors.");
    this.reset();
    
  } catch (error) {
    alert(`Request submission failed: ${error.message}`);
    console.error("Request submission error:", error);
  } finally {
    // Reset button state
    const submitButton = this.querySelector("button[type='submit']");
    submitButton.innerHTML = originalButtonText;
    submitButton.disabled = false;
  }
});
