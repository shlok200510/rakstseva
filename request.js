document.getElementById("requestForm").addEventListener("submit", function (e) {
  e.preventDefault()

  const formData = {
    patientName: document.getElementById("patientName").value,
    bloodType: document.getElementById("bloodType").value,
    units: document.getElementById("units").value,
    hospital: document.getElementById("hospital").value,
    contactNumber: document.getElementById("contactNumber").value,
  }

  console.log("Blood request submitted:", formData)
  // Here you would typically send the data to your backend
  alert("Blood request submitted successfully!")
  this.reset()
})

