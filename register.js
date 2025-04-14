document.getElementById("donorForm").addEventListener("submit", function (e) {
  e.preventDefault()

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    bloodType: document.getElementById("bloodType").value,
    city: document.getElementById("city").value,
  }

  console.log("Form submitted:", formData)
  // Here you would typically send the data to your backend
  alert("Registration successful!")
  this.reset()
})

