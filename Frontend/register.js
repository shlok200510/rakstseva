document.getElementById("donorForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      blood_type: document.getElementById("bloodType").value,
      city: document.getElementById("city").value,
      phone: document.getElementById("phone") ? document.getElementById("phone").value : "",
    };

    // Show loading state
    const submitButton = this.querySelector("button[type='submit']");
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    submitButton.disabled = true;

    // Make API call
    const response = await api.registerDonor(formData);
    
    // Success - show message and reset form
    alert("Registration successful! Thank you for becoming a donor.");
    this.reset();
    
  } catch (error) {
    alert(`Registration failed: ${error.message}`);
  } finally {
    // Reset button state
    const submitButton = this.querySelector("button[type='submit']");
    submitButton.innerHTML = originalButtonText;
    submitButton.disabled = false;
  }
});
