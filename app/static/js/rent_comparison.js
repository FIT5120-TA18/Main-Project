// Rent Comparison Page - JavaScript
let lgaRentLayer = null;
let suburbRentLayer = null;
let currentLgaRentGeoJson = null;
let currentSuburbs = [];
let currentLgaGeoJson = null;
let map = null;
let suburbGeoJsonLayer = null;
let currentGeoJson = null;
let budgetFilterActive = false;
// let selectedState = null;
// let selectedLGA = null;
let selectedLGAName = null;
let selectedSuburb = null;
let currentBudget = null;
let userIncome = null;
let trendChart = null;

// Initialize page
document.addEventListener('DOMContentLoaded', async function () {
  initializeEventListeners();
  await loadLgaRentLayer();
  loadUserData();
});

async function loadLgaRentLayer() {
  try {
    const response = await fetch("/api/lga-rent-map");
    currentLgaRentGeoJson = await response.json();
    console.log("Loaded all LGA rent layer:", currentLgaRentGeoJson);
  } catch (error) {
    console.error("Error loading LGA rent layer:", error);
  }
}

// Initialize all event listeners
function initializeEventListeners() {
  const locationSearchInput      = document.getElementById('locationSearchInput');
  const locationSearchSuggestions = document.getElementById('locationSearchSuggestions');
  const selectedLgaInput         = document.getElementById('selectedLgaInput');
  const selectedLgacodeInput     = document.getElementById('selectedLgacodeInput');

  if (locationSearchInput && locationSearchSuggestions) {
    locationSearchInput.addEventListener('input', async function () {
      const query = locationSearchInput.value.trim();

      // Reset LGA state on new typing
      if (selectedLgaInput) selectedLgaInput.value = "";
      if (selectedLgacodeInput) selectedLgacodeInput.value = "";
      selectedLGAName = null;

      if (query.length < 2) {
        locationSearchSuggestions.innerHTML = "";
        return;
      }

      try {
        const response  = await fetch(`/api/locations?q=${encodeURIComponent(query)}`);
        const locations = await response.json();

        if (!locations.length) {
          locationSearchSuggestions.innerHTML = `
            <div class="location-suggestion-item no-result">No matching suburb found</div>`;
          return;
        }

        locationSearchSuggestions.innerHTML = locations.map(item => `
          <button type="button" class="location-suggestion-item"
            data-locality="${item.locality}" data-postcode="${item.postcode}">
            ${item.locality} (${item.postcode})
          </button>`).join("");
      } catch (error) {
        console.error("Location fetch error:", error);
        locationSearchSuggestions.innerHTML = "";
      }
    });

    locationSearchSuggestions.addEventListener('click', async function (event) {
      const item = event.target.closest(".location-suggestion-item");
      if (!item || item.classList.contains("no-result")) return;

      const locality = item.dataset.locality;
      const postcode = item.dataset.postcode;

      locationSearchInput.value = `${locality} (${postcode})`;
      locationSearchSuggestions.innerHTML = "";

      try {
        const response = await fetch(
          `/api/lga-from-location?locality=${encodeURIComponent(locality)}&postcode=${encodeURIComponent(postcode)}`
        );
        const data = await response.json();

        if (data.lga_name && data.lgacode) {
          if (selectedLgaInput)     selectedLgaInput.value     = data.lga_name;
          if (selectedLgacodeInput) selectedLgacodeInput.value = data.lgacode;
          selectedLGAName = data.lga_name;

          const display = document.getElementById('resolvedLgaDisplay');
          if (display) {
            display.textContent = `Local Government Area: ${data.lga_name}`;
            display.style.display = "block";
          }

          handleLGASelect(data.lga_name, data.lgacode);
        } else {
          alert("Could not find an LGA for that location. Please try a different suburb or postcode.");
        }
      } catch (error) {
        console.error("LGA lookup error:", error);
      }
    });
  }

  // Budget filter button click → apply budget filter to map
  document.getElementById('filterButton').addEventListener('click', handleBudgetFilter);

  // Pressing Enter in budget input also applies budget filter
  document.getElementById('budgetInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') { handleBudgetFilter(); }
  });

  // Close button hides the suburb detail panel
  document.getElementById('closeDetailBtn').addEventListener('click', closeDetailPanel);
}


async function loadUserData() {
  const budgetInput          = document.getElementById('budgetInput');
  const locationSearchInput  = document.getElementById('locationSearchInput');
  const selectedLgaInput     = document.getElementById('selectedLgaInput');
  const selectedLgacodeInput = document.getElementById('selectedLgacodeInput');

  if (!window.userProfileData) { userIncome = 500; return; }

  userIncome = window.userProfileData.income || 500;

  let defaultBudget = null;
  if (window.userProfileData.rent && Number(window.userProfileData.rent) > 0) {
    defaultBudget = Number(window.userProfileData.rent);
  } else if (window.userProfileData.income && Number(window.userProfileData.income) > 0) {
    defaultBudget = Number(window.userProfileData.income);
  }
  if (defaultBudget && budgetInput) {
    budgetInput.value = defaultBudget;
    currentBudget = defaultBudget;
    updateBudgetDisplay();
  }

  const locality = window.userProfileData.locality || "";
  const postcode = window.userProfileData.postcode || "";

  if (locality || postcode) {
    if (locationSearchInput) {
      locationSearchInput.value = locality ? `${locality} (${postcode})` : postcode;
    }

    try {
      const response = await fetch(
        `/api/lga-from-location?locality=${encodeURIComponent(locality)}&postcode=${encodeURIComponent(postcode)}`
      );
      const data = await response.json();

      if (data.lga_name) {
        if (selectedLgaInput)     selectedLgaInput.value     = data.lga_name;
        if (selectedLgacodeInput) selectedLgacodeInput.value = data.lgacode;
        selectedLGAName = data.lga_name;

        const display = document.getElementById('resolvedLgaDisplay');
        if (display) {
          display.textContent = `Local Government Area: ${data.lga_name}`;
          display.style.display = "block";
        }

        if (data.lgacode) {
          handleLGASelect(data.lga_name, data.lgacode);
        }
      }
    } catch (error) {
      console.error("Error finding LGA from profile location:", error);
    }
  }
  updateMapModeBox();
}


// Handle LGA selection
//INPUT:("Monash", "24600")
//PROCESS:
// Fetch APIs
// Store data
// Render map
// Show details
//OUTPUT:
// 1. Map updated:
//    - Previous map cleared
//    - New map created
//    - Base tiles loaded
//    - LGA overview layer rendered
//    - Suburb layer rendered
//    - Map zoomed to selected LGA

// 2. UI updated:
//    - LGA name and rent displayed
//    - Trend chart rendered
//    - Insight text generated
//    - Trend status badge updated
//    - Map legend/mode box updated

// 3. Internal state updated:
//    - Suburb GeoJSON stored
//    - LGA boundary stored
//    - Selected LGA name saved
//    - Filter state reset
//    - Data prepared for future interactions

async function handleLGASelect(lgaName, lgacode) {
  selectedLGAName = lgaName;

  const mapTitle = document.getElementById('mapTitle');
  if (mapTitle) mapTitle.textContent = `${lgaName} — Rental Prices by Suburb`;

  try {
    const [suburbResponse, lgaResponse] = await Promise.all([ // Promise.all runs 2 api calls in parlllel
      fetch(`/api/suburb-rent-map?lgacode=${encodeURIComponent(lgacode)}`), //return suburb polygon
      fetch(`/api/lga-boundary?lgacode=${encodeURIComponent(lgacode)}`)// return lga polygon
    ]);

    const suburbGeojson = await suburbResponse.json();//geojson to json
    const lgaGeojson = await lgaResponse.json();//geojson to josn

    currentGeoJson = suburbGeojson;
    currentLgaGeoJson = lgaGeojson;
    budgetFilterActive = false;
    updateMapModeBox();

    console.log("Loaded suburb GeoJSON:", suburbGeojson);
    console.log("Loaded LGA boundary:", lgaGeojson);

    initializeMap(suburbGeojson, lgaGeojson);

    const selectedLgaFeature = currentLgaRentGeoJson?.features?.find(
      feature => String(feature.properties.lgacode) === String(lgacode)
    );
    
    if (selectedLgaFeature) {
      const props = selectedLgaFeature.properties;
    
      showLgaDetail({
        name: props.lga_name,
        lgacode: props.lgacode,
        rent: props.rent,
        history: props.history,
        historyLabels: props.history_labels
      });
    }

  } catch (error) {
    console.error("Error loading LGA map:", error);
  }
}


// Initialize map for selected LGA
function initializeMap(suburbGeojson, lgaGeojson) {
  const container = document.getElementById('mapContainer');

  if (!lgaGeojson || !lgaGeojson.features || !lgaGeojson.features.length) {//safety check, prevents crash
    container.innerHTML = `
      <div style="padding: 20px;">
        No LGA boundary data found for ${selectedLGAName}.
      </div>
    `;
    return;
  }

  container.classList.remove("map-placeholder");
  container.innerHTML = "";

  if (map) {
    map.remove();
  }

  map = L.map(container);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  // 1. Draw all LGAs as background overview
//Example of geojson
  // {
  //   "type": "FeatureCollection",
  //   "features": [
  //     {
  //       "properties": {
  //         "lga_name": "Monash",
  //         "rent": 520
  //       },
  //       "geometry": { ... }
  //     }
  //   ]
  if (currentLgaRentGeoJson) {
    lgaRentLayer = L.geoJSON(currentLgaRentGeoJson, {//leaflet function reads geojson and draw on map based on features
      style: function (feature) {//apply style to  each feature(lga)
        const rent = feature.properties.rent;

        return {
          color: "#666",
          weight: 0.7,
          fillColor: getLgaRentColor(rent),
          fillOpacity: 0.8
        };
      },
      onEachFeature: function (feature, layer) {
        const props = feature.properties;
        const rentText = props.rent ? `$${Math.round(props.rent)}/week` : "No rent data";

        layer.on("click", function () {
          showLgaDetail({
            name: props.lga_name,
            lgacode: props.lgacode,
            rent: props.rent,
            history: props.history,
            historyLabels: props.history_labels
          });
        });

        layer.bindPopup(`
          <strong>${props.lga_name}</strong><br>
          LGA median/average rent: ${rentText}
        `);
        layer.bindTooltip(props.lga_name, {
          permanent: true,
          direction: "center",
          className: "lga-label"
        });
      }
    }).addTo(map);
    lgaRentLayer.bringToBack();
  }

  // 2. Draw selected LGA suburb polygons on top
  if (suburbGeojson && suburbGeojson.features && suburbGeojson.features.length) {
    suburbRentLayer = L.geoJSON(suburbGeojson, {
      // interactive: false,
      style: function (feature) {
        const rent = feature.properties.rent;

        return {
          color: "#ffffff",
          weight: 1.2,
          fillColor: getRentColor(rent),
          fillOpacity: rent ? 0.8 : 0.25
        };
      },

      onEachFeature: function (feature, layer) {
        const props = feature.properties;
        const rentText = props.rent ? `$${props.rent}/week` : "No rent data";

        layer.bindPopup(`
          <strong>${props.suburb_name}</strong><br>
          ${props.postcode ? `Postcode: ${props.postcode}<br>` : ""}
          Median rent: ${rentText}
        `);

        layer.bindTooltip(props.suburb_name, {
          permanent: true,
          direction: "center",
          className: "suburb-label"
        });

        // layer.on("click", function () {
        //   showSuburbDetail({
        //     name: props.suburb_name,
        //     postcode: props.postcode,
        //     rent: props.rent
        //   });
        // });
      }
    }).addTo(map);
  }

  // 3. Draw selected LGA outline
  const selectedLgaBoundaryLayer = L.geoJSON(lgaGeojson, {
    interactive: false,
    style: {
      color: "#111",
      weight: 3,
      fillOpacity: 0
    }
  }).addTo(map);

  // 4. Always zoom to selected LGA, not all suburbs
  map.fitBounds(selectedLgaBoundaryLayer.getBounds(), {
    padding: [20, 20]
  });
}

function getLgaRentColor(rent) {
  if (!rent) return "#eeeeee";

  if (rent >= 650) return "#4a148c";
  if (rent >= 550) return "#7b1fa2";
  if (rent >= 450) return "#ab47bc";
  if (rent >= 350) return "#ce93d8";
  return "#f3e5f5";
}
// Get color based on rent price suburb color
function getRentColor(rent) {
  if (!rent) return "#cccccc";

  // Only use budget colours after user clicks the budget button
  if (budgetFilterActive && currentBudget) {
    return rent <= currentBudget ? "#2e7d32" : "#c62828";
  }

  // Default rent tier colours
  if (rent >= 650) return "#7f0000";
  if (rent >= 550) return "#c62828";
  if (rent >= 450) return "#ef6c00";
  if (rent >= 350) return "#f9a825";
  return "#2e7d32";
}

// Show LGA detail panel
function showLgaDetail(lga) {
  document.getElementById('lgaDetailName').textContent = lga.name;

  const rent = Math.round(lga.rent || 0);
  document.getElementById('detailRentPrice').textContent = rent ? `$${rent}` : "No data";

  if (userIncome && rent) {
    const affordabilityPercent = Math.round((rent / userIncome) * 100);
    document.getElementById('detailAffordability').textContent = `${affordabilityPercent}%`;

    let affordabilityClass = 'affordability-affordable';
    let affordabilityText = 'Affordable';

    if (affordabilityPercent > 45) {
      affordabilityClass = 'affordability-unaffordable';
      affordabilityText = 'Not Recommended';
    } else if (affordabilityPercent >= 30) {
      affordabilityClass = 'affordability-stretched';
      affordabilityText = 'Stretched';
    }

    document.getElementById('detailAffordabilityLabel').textContent = 'of your weekly income';

    const badge = document.getElementById('affordabilityBadge');
    badge.textContent = affordabilityText;
    badge.className = `affordability-badge ${affordabilityClass}`;
  } else {
    document.getElementById('detailAffordability').textContent = "--";
    document.getElementById('detailAffordabilityLabel').textContent = "income not available";
  }

  renderLgaTrendChart(lga);
  generateLgaTrendInsight(lga);

  document.getElementById('lgaDetailPanel').classList.remove('hidden');
}


// Render trend chart
function renderLgaTrendChart(lga) {
  if (trendChart) {
    trendChart.destroy();
  }

  const ctx = document.getElementById('trendChart').getContext('2d');

  const labels = lga.historyLabels || [];
  const data = lga.history || [];//y-axis

  trendChart = new Chart(ctx, {//Create a new Chart.js
    type: 'line',
    data: {
      labels: labels,//X-axis labels (e.g., ["03-21", "06-21", ..., "09-25"])
      datasets: [{// Array of datasets ( can have multiple lines, here only one)
        label: `${lga.name} average weekly rent`,
        data: data,// Y-axis values (rent values over time)
        borderColor: 'rgb(232, 84, 106)', //line color
        backgroundColor: 'rgba(232, 84, 106, 0.05)',
        borderWidth: 3,
        fill: true, //Fill area under the line (area chart effect)
        tension: 0.35,//a smooth curve 
        pointBackgroundColor: 'rgb(232, 84, 106)',//color data point
        pointBorderColor: '#fff',//white border around data point
        pointBorderWidth: 2,
        pointRadius: 4//size of each point
      }]
    },
    options: { // Chart behaviour and display settings
      responsive: true,// Chart resizes automatically with container
      maintainAspectRatio: false,//allow custom  height/width instead of fixed
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {// Tooltip (hover popup) settings
          callbacks: { // Customise what tooltip shows, function js chart
            label: function (context) { // Runs when user hovers a data point 
              // context = {
              //   parsed: {
              //     x: "03-21",
              //     y: 520
              //   },
              //   dataset: {...},
              //   dataIndex: 5
              // }
              return `$${Math.round(context.parsed.y)}/week`; // Format value → "$520/week"
            }
          }
        }
      },
      scales: {//axis config
        y: {// Y-axis settings (vertical axis)
          beginAtZero: false,// Do NOT force axis to start at 0 (better for rent data)
          ticks: {
            callback: function (value) {// For each tick value
              return `$${value}`;// Format as currency (e.g., "$500")
            }
          }
        }
      }
    }
  });
}

// Generate trend insight
function generateLgaTrendInsight(lga) {
  const history = (lga.history || []).filter(value => value !== null && value !== undefined);

  if (history.length < 2) {
    document.getElementById('trendStatusBadge').textContent = "No data";
    document.getElementById('trendInsight').innerHTML =
      `Not enough rental history is available for ${lga.name}.`;
    return;
  }

  const firstRent = history[0];
  const lastRent = history[history.length - 1];

  const totalIncrease = lastRent - firstRent;
  const percentIncrease = Math.round((totalIncrease / firstRent) * 100);

  const recent = history.slice(-4);
  const recentIncrease = recent[recent.length - 1] - recent[0];

  let trendStatus = "Stable";
  let trendClass = "affordability-affordable";

  if (recentIncrease > 20) {
    trendStatus = "Rising";
    trendClass = "affordability-unaffordable";
  } else if (recentIncrease < -20) {
    trendStatus = "Declining";
    trendClass = "affordability-affordable";
  }

  const badge = document.getElementById('trendStatusBadge');
  badge.textContent = trendStatus;
  badge.className = `affordability-badge ${trendClass}`;

  const yearlyIncrease = totalIncrease / 4.5;

  document.getElementById('trendInsight').innerHTML = `
    <strong>${lga.name} rent trend:</strong>
    Average weekly rent changed from <strong>$${Math.round(firstRent)}</strong>
    to <strong>$${Math.round(lastRent)}</strong> between 03-21 and 09-25.
    This is a change of <strong>$${Math.round(totalIncrease)}</strong>
    (${percentIncrease}%), or about <strong>$${Math.round(yearlyIncrease)}</strong> per year.
  `;
}
// Close detail panel
function closeDetailPanel() {
  document.getElementById('lgaDetailPanel').classList.add('hidden');
  selectedLGA = null;
  if (trendChart) {
    trendChart.destroy();
  }
}

// Handle budget filter
function handleBudgetFilter() {
  const budgetValue = document.getElementById('budgetInput').value;

  if (!budgetValue || isNaN(budgetValue) || budgetValue < 0) {
    alert('Please enter a valid budget amount');
    return;
  }

  currentBudget = parseInt(budgetValue);
  budgetFilterActive = true;
  updateMapModeBox();

  updateBudgetDisplay();

  if (!selectedLGAName || !currentGeoJson) {
    alert('Please select an LGA first');
    return;
  }

  // Redraw map with budget-based colours
  initializeMap(currentGeoJson, currentLgaGeoJson);
}



// Update budget display
function updateBudgetDisplay() {
  const display = document.getElementById('currentBudgetDisplay');
  const value = document.getElementById('budgetDisplayValue');

  if (!display || !value) {
    return;
  }

  if (currentBudget) {
    value.textContent = `$${currentBudget}`;
    display.classList.remove('hidden');
  } else {
    display.classList.add('hidden');
  }
}


function updateMapModeBox() {
  const title = document.getElementById('mapModeTitle');
  const text = document.getElementById('mapModeText');
  const legend = document.getElementById('mapModeLegend');

  if (!title || !text || !legend) return;

  if (budgetFilterActive) {
    title.textContent = "Map mode: Budget View";
    text.textContent = "Suburbs are coloured by your budget.";
    legend.innerHTML = `
      <div class="map-mode-item"><span class="map-dot green"></span>Within budget</div>
      <div class="map-mode-item"><span class="map-dot red"></span>Above budget</div>
      <div class="map-mode-item"><span class="map-dot grey"></span>No rent data</div>
    `;
  } else {
    title.textContent = "Map mode: Rent View";
    text.textContent = "Suburbs are coloured by weekly rent.";
    legend.innerHTML = `
      <div class="map-mode-item"><span class="map-dot green"></span>Lower rent</div>
      <div class="map-mode-item"><span class="map-dot yellow"></span>Moderate rent</div>
      <div class="map-mode-item"><span class="map-dot red"></span>Higher rent</div>
      <div class="map-mode-item"><span class="map-dot grey"></span>No rent data</div>
    `;
  }
}