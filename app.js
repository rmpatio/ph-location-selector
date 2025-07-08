// in app.js
const jsonUrl = 'https://rmpatio.github.io/ph-location-selector/psgc.json';

async function loadLocations() {
  const res = await fetch(jsonUrl);
  const data = await res.json();
  // …populate your <select> elements…
}

document.addEventListener('DOMContentLoaded', loadLocations);
