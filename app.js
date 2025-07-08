// in app.js
async function loadLocations() {
  try {
    const response = await fetch(jsonUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // now call your populate functions, e.g.:
    populateRegions(Object.keys(data));
  } catch (err) {
    console.error('Failed to load location data:', err);
    alert('Could not load location list at this time.');
  }
}
document.addEventListener('DOMContentLoaded', loadLocations);
