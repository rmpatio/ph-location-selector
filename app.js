const jsonUrl = 'https://rmpatio.github.io/ph-location-selector/psgc.json';

async function loadLocations() {
  try {
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('Loaded data:', data);
    // Example: populate the region <select>:
    const regionSelect = document.getElementById('region');
    Object.keys(data).forEach(region => {
      const opt = document.createElement('option');
      opt.value = region;
      opt.textContent = region;
      regionSelect.append(opt);
    });
  } catch (err) {
    console.error('Failed to load JSON:', err);
    alert('Could not load locations—check the console for details.');
  }
}

document.addEventListener('DOMContentLoaded', loadLocations);
