// app.js
const jsonUrl = 'https://rmpatio.github.io/ph-location-selector/psgc.json';

async function loadLocations() {
  try {
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    console.log('Loaded data:', data);

    // Populate the <select> elements
    const regionSelect      = document.getElementById('region');
    const provinceSelect    = document.getElementById('province');
    const municipalitySelect= document.getElementById('municipality');
    const barangaySelect    = document.getElementById('barangay');

    // 1) Regions
    Object.keys(data).forEach(region => {
      const opt = document.createElement('option');
      opt.value   = region;
      opt.textContent = region;
      regionSelect.append(opt);
    });

    // 2) When a region is picked, populate provinces...
    regionSelect.addEventListener('change', () => {
      // clear downstream selects
      provinceSelect.innerHTML     = '<option>--Province--</option>';
      municipalitySelect.innerHTML = '<option>--Municipality--</option>';
      barangaySelect.innerHTML     = '<option>--Barangay--</option>';

      const provinces = data[regionSelect.value] || {};
      Object.keys(provinces).forEach(prov => {
        const opt = document.createElement('option');
        opt.value   = prov;
        opt.textContent = prov;
        provinceSelect.append(opt);
      });
    });

    // 3) Province → Municipality
    provinceSelect.addEventListener('change', () => {
      municipalitySelect.innerHTML = '<option>--Municipality--</option>';
      barangaySelect.innerHTML     = '<option>--Barangay--</option>';

      const munis = (data[regionSelect.value] || {})[provinceSelect.value] || {};
      Object.keys(munis).forEach(mun => {
        const opt = document.createElement('option');
        opt.value   = mun;
        opt.textContent = mun;
        municipalitySelect.append(opt);
      });
    });

    // 4) Municipality → Barangay
    municipalitySelect.addEventListener('change', () => {
      barangaySelect.innerHTML = '<option>--Barangay--</option>';

      const brgys = ((data[regionSelect.value] || {})[provinceSelect.value] || {})[municipalitySelect.value] || [];
      brgys.forEach(brgy => {
        const opt = document.createElement('option');
        opt.value   = brgy;
        opt.textContent = brgy;
        barangaySelect.append(opt);
      });
    });

  } catch (err) {
    console.error('Failed to load JSON:', err);
    alert('Could not load locations—check the console for details.');
  }
}

document.addEventListener('DOMContentLoaded', loadLocations);
