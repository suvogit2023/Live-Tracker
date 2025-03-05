// Replace with your deployed Google Apps Script web app URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxg1XgxjUKBP5cFkIpIht-WOhtJ3utKYAUsu5Cx5mcuni1LBdXQWCGFg_lKDXv6gYiE/exec";

// Prompt the user for a driver ID (this can be adjusted if you want a fixed value)
const DRIVER_ID = prompt("Enter Driver ID:");

// Function to send location data to Google Apps Script
function sendLocation(position) {
  // Get coordinates from the geolocation API
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  // Convert timestamp to IST using the Asia/Kolkata time zone
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  
  // Update the status on the page for user feedback
  document.getElementById("status").innerText =
    `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)} | ${timestamp}`;
  
  // Send the data via AJAX (Fetch API) using URL-encoded form data
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      driver_id: DRIVER_ID,
      latitude: latitude,
      longitude: longitude,
      timestamp: timestamp
    })
  })
  .then(response => response.text())
  .then(data => console.log("Google Sheet Response:", data))
  .catch(error => console.error("Error sending data:", error));
}

// Function to handle geolocation errors
function handleError(error) {
  console.error("Geolocation error:", error.message);
  document.getElementById("status").innerText = "Unable to retrieve location";
}

// Start tracking automatically on page load using watchPosition
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(sendLocation, handleError, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
  });
} else {
  document.getElementById("status").innerText = "Geolocation not supported";
  console.error("Geolocation is not supported by this browser.");
}
