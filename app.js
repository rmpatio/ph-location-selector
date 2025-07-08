// app.js
const jsonUrl = 'https://rmpatio.github.io/ph-location-selector/psgc.json';

async function loadLocations() {
  try {
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();  // data is an object whose keys are region codes and values have .name & .provinces :contentReference[oaicite:0]{index=0}
    console.log('Loaded data:', data);

    // Grab your <select>s
    const regionSelect       = document.getElementById('region');
    const provinceSelect     = document.getElementById('province');
    const municipalitySelect = document.getElementById('municipality');
    const barangaySelect     = document.getElementById('barangay');

    // Helper to reset downstream dropdowns
    function reset(...sels) {
      sels.forEach(sel => sel.innerHTML = `<option>--${sel.id.charAt(0).toUpperCase() + sel.id.slice(1)}--</option>`);
      sels.forEach(sel => sel.disabled = true);
    }
    // Initially disable all but region
    reset(provinceSelect, municipalitySelect, barangaySelect);

    // 1) Populate Regions by name, but keep 'code' as the value
    Object.entries(data)
      .sort(([,a],[,b]) => a.name.localeCompare(b.name))
      .forEach(([code, region]) => {
        const opt = document.createElement('option');
        opt.value       = code;
        opt.textContent = region.name;
        regionSelect.append(opt);
      });

    // 2) When Region changes, load its Provinces
    regionSelect.addEventListener('change', () => {
      reset(provinceSelect, municipalitySelect, barangaySelect);
      const regionCode = regionSelect.value;
      if (!regionCode) return; 
      const provinces = data[regionCode].provinces || {};
      Object.entries(provinces)
        .sort(([,a],[,b]) => a.name.localeCompare(b.name))
        .forEach(([pcode, prov]) => {
          const opt = new Option(prov.name, pcode);
          provinceSelect.append(opt);
        });
      provinceSelect.disabled = false;
    });

    // 3) Province → Municipality
    provinceSelect.addEventListener('change', () => {
      reset(municipalitySelect, barangaySelect);
      const regionCode = regionSelect.value;
      const provCode   = provinceSelect.value;
      if (!provCode) return;
      const munis = (data[regionCode].provinces[provCode].municipalities) || {};
      Object.entries(munis)
        .sort(([,a],[,b]) => a.name.localeCompare(b.name))
        .forEach(([mcode, muni]) => {
          municipalitySelect.append(new Option(muni.name, mcode));
        });
      municipalitySelect.disabled = false;
    });

    // 4) Municipality → Barangay
    municipalitySelect.addEventListener('change', () => {
      reset(barangaySelect);
      const regionCode = regionSelect.value;
      const provCode   = provinceSelect.value;
      const muniCode   = municipalitySelect.value;
      if (!muniCode) return;
      const barangays = data[regionCode]
                          .provinces[provCode]
                          .municipalities[muniCode]
                          .barangays || [];
      barangays.sort().forEach(b => {
        barangaySelect.append(new Option(b, b));
      });
      barangaySelect.disabled = false;
    });

  } catch (err) {
    console.error('Failed to load JSON:', err);
    alert('Could not load locations—check the console for details.');
  }
}

document.addEventListener('DOMContentLoaded', loadLocations);
