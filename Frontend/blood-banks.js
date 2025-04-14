document.addEventListener("DOMContentLoaded", async () => {
    const citySearch = document.getElementById("citySearch")
    const stateFilter = document.getElementById("stateFilter")
    const bloodTypeFilter = document.getElementById("bloodTypeFilter")
    const searchButton = document.getElementById("searchButton")
    const bloodBanksList = document.getElementById("bloodBanksList")
    
    // For now, using the sample data
    // In future, you'd load this from the backend with:
    // const bloodBanks = await api.getBloodBanks();
  
    // Sample data - in a real application, this would come from a database
    const bloodBanks = [
      {
        name: "Red Cross Blood Bank",
        address: "123 Health Avenue, Koramangala, Bangalore, Karnataka",
        contact: "080-12345678",
        hours: "9:00 AM - 6:00 PM (Mon-Sat)",
        state: "Karnataka",
        city: "Bangalore",
        availability: {
          "A+": "available",
          "B+": "available",
          "AB+": "low",
          "O-": "critical",
          "O+": "available",
        },
      },
      {
        name: "City Blood Center",
        address: "45 Medical Complex, Andheri East, Mumbai, Maharashtra",
        contact: "022-98765432",
        hours: "8:00 AM - 8:00 PM (All days)",
        state: "Maharashtra",
        city: "Mumbai",
        availability: {
          "A+": "available",
          "A-": "low",
          "B+": "available",
          "AB+": "available",
          "O+": "low",
        },
      },
      {
        name: "National Blood Services",
        address: "78 Gandhi Road, Connaught Place, New Delhi, Delhi",
        contact: "011-45678901",
        hours: "9:00 AM - 5:00 PM (Mon-Fri)",
        state: "Delhi",
        city: "New Delhi",
        availability: {
          "A-": "critical",
          "B-": "low",
          "AB-": "available",
          "O+": "available",
          "O-": "critical",
        },
      },
      {
        name: "Life Saver Blood Bank",
        address: "234 Hospital Lane, T Nagar, Chennai, Tamil Nadu",
        contact: "044-56789012",
        hours: "8:30 AM - 7:00 PM (All days)",
        state: "Tamil Nadu",
        city: "Chennai",
        availability: {
          "A+": "available",
          "B+": "available",
          "AB+": "available",
          "AB-": "low",
          "O+": "available",
        },
      },
    ]
  
    // Search functionality
    searchButton.addEventListener("click", () => {
      const cityQuery = citySearch.value.toLowerCase()
      const stateQuery = stateFilter.value
      const bloodTypeQuery = bloodTypeFilter.value
  
      // In a real application, this would be an API call
      // For this demo, we'll filter the sample data
      const filteredBanks = bloodBanks.filter((bank) => {
        const cityMatch =
          cityQuery === "" ||
          bank.city.toLowerCase().includes(cityQuery) ||
          bank.address.toLowerCase().includes(cityQuery)
  
        const stateMatch = stateQuery === "" || bank.state === stateQuery
  
        const bloodTypeMatch = bloodTypeQuery === "" || bank.availability.hasOwnProperty(bloodTypeQuery)
  
        return cityMatch && stateMatch && bloodTypeMatch
      })
  
      displayBloodBanks(filteredBanks)
    })
  
    function displayBloodBanks(banks) {
      // Clear current list
      bloodBanksList.innerHTML = ""
  
      if (banks.length === 0) {
        bloodBanksList.innerHTML = "<p>No blood banks found matching your criteria. Please try a different search.</p>"
        return
      }
  
      // Display each blood bank
      banks.forEach((bank) => {
        const bankCard = document.createElement("div")
        bankCard.className = "blood-bank-card"
  
        const availabilityHTML = Object.entries(bank.availability)
          .map(([type, status]) => `<span class="blood-type ${status}">${type}</span>`)
          .join("")
  
        bankCard.innerHTML = `
                  <h3>${bank.name}</h3>
                  <p><strong>Address:</strong> ${bank.address}</p>
                  <p><strong>Contact:</strong> ${bank.contact}</p>
                  <p><strong>Hours:</strong> ${bank.hours}</p>
                  <div class="availability">
                      <span><strong>Blood Availability:</strong></span>
                      ${availabilityHTML}
                  </div>
              `
  
        bloodBanksList.appendChild(bankCard)
      })
    }
    
    // Display initial list of blood banks
    displayBloodBanks(bloodBanks);
})
