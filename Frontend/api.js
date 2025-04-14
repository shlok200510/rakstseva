// API utility functions for communicating with the backend

const API_BASE_URL = 'http://localhost:5000';

// Log when API module loads
console.log("API module loading...");

// Generic function to make API calls
async function apiRequest(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    // If response is not ok, throw an error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Specific API functions
const api = {
  // Donor registration
  registerDonor: (donorData) => apiRequest('/register', 'POST', donorData),

  // Blood request
  requestBlood: (requestData) => apiRequest('/request', 'POST', requestData),

  // SOS emergency
  sendSosAlert: (sosData) => apiRequest('/sos', 'POST', sosData),

  // Plasma donation
  registerPlasmaDonor: (donorData) => apiRequest('/plasma/register', 'POST', donorData),
  requestPlasma: (requestData) => apiRequest('/plasma/request', 'POST', requestData),

  // Get data
  getDonors: () => apiRequest('/donors'),
  getBloodRequests: () => apiRequest('/requests'),
  getSosAlerts: () => apiRequest('/sos/alerts'),
  getPlasmaDonors: () => apiRequest('/plasma/donors'),
  getPlasmaRequests: () => apiRequest('/plasma/requests'),
};

// Make api globally accessible
window.api = api;

// Log successful initialization
console.log("API module loaded successfully");
