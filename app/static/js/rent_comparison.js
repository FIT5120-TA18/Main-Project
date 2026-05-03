// Rent Comparison Page - JavaScript

// Mock LGA data by state (with rental prices and historical data)
const LGA_DATA = {
  NSW: [
    { name: "Sydney - CBD", postcode: "2000", rent: 350, coords: [-33.8688, 151.2093], history: [210, 225, 245, 265, 290, 315, 330, 340, 345, 350] },
    { name: "Parramatta", postcode: "2150", rent: 280, coords: [-33.8148, 151.0040], history: [165, 175, 185, 200, 220, 240, 260, 270, 275, 280] },
    { name: "Newcastle", postcode: "2300", rent: 240, coords: [-32.9271, 151.7802], history: [145, 155, 165, 175, 190, 205, 220, 230, 235, 240] },
    { name: "Wollongong", postcode: "2500", rent: 220, coords: [-34.4268, 150.8931], history: [135, 145, 155, 165, 180, 195, 210, 215, 218, 220] },
    { name: "Central Coast", postcode: "2250", rent: 260, coords: [-33.4507, 151.4349], history: [155, 170, 185, 200, 220, 235, 245, 250, 255, 260] },
  ],
  VIC: [
    { name: "Melbourne - CBD", postcode: "3000", rent: 330, coords: [-37.8136, 144.9631], history: [200, 220, 245, 270, 290, 305, 315, 322, 326, 330] },
    { name: "Fitzroy", postcode: "3065", rent: 310, coords: [-37.7979, 144.9734], history: [185, 205, 225, 250, 270, 285, 295, 305, 308, 310] },
    { name: "Brunswick", postcode: "3056", rent: 290, coords: [-37.7577, 144.9689], history: [170, 190, 210, 230, 250, 265, 275, 285, 288, 290] },
    { name: "Geelong", postcode: "3220", rent: 240, coords: [-38.1499, 144.3617], history: [145, 160, 175, 190, 205, 220, 230, 235, 238, 240] },
    { name: "Ballarat", postcode: "3350", rent: 200, coords: [-37.5585, 143.8503], history: [120, 130, 140, 155, 170, 180, 190, 195, 198, 200] },
    { name: "Bendigo", postcode: "3550", rent: 210, coords: [-36.7597, 144.2711], history: [125, 140, 155, 170, 180, 190, 200, 205, 208, 210] },
  ],
  QLD: [
    { name: "Brisbane - CBD", postcode: "4000", rent: 320, coords: [-27.4705, 153.0260], history: [190, 210, 235, 260, 285, 300, 310, 315, 318, 320] },
    { name: "Gold Coast", postcode: "4217", rent: 290, coords: [-28.0029, 153.4311], history: [170, 190, 215, 240, 260, 275, 285, 288, 290] },
    { name: "Sunshine Coast", postcode: "4558", rent: 270, coords: [-26.8041, 153.1090], history: [160, 180, 200, 220, 240, 255, 265, 268, 270] },
    { name: "Cairns", postcode: "4870", rent: 250, coords: [-16.8661, 145.7781], history: [150, 165, 180, 195, 210, 225, 240, 245, 248, 250] },
    { name: "Townsville", postcode: "4810", rent: 240, coords: [-19.2643, 146.8118], history: [145, 160, 175, 190, 205, 220, 230, 235, 238, 240] },
  ],
  WA: [
    { name: "Perth - CBD", postcode: "6000", rent: 300, coords: [-31.9454, 115.8604], history: [180, 200, 225, 250, 270, 285, 295, 300] },
    { name: "Fremantle", postcode: "6160", rent: 270, coords: [-32.0527, 115.7448], history: [160, 180, 200, 225, 245, 260, 265, 270] },
    { name: "Mandurah", postcode: "6210", rent: 240, coords: [-32.5310, 115.7241], history: [145, 165, 185, 210, 225, 235, 240] },
    { name: "Albany", postcode: "6330", rent: 200, coords: [-35.0281, 117.8852], history: [120, 135, 150, 170, 185, 195, 200] },
  ],
  SA: [
    { name: "Adelaide - CBD", postcode: "5000", rent: 280, coords: [-34.9285, 138.6007], history: [170, 190, 210, 230, 250, 265, 275, 280] },
    { name: "North Adelaide", postcode: "5006", rent: 290, coords: [-34.8914, 138.6061], history: [180, 200, 220, 240, 260, 275, 285, 290] },
    { name: "Glenelg", postcode: "5045", rent: 270, coords: [-35.0346, 138.5238], history: [160, 180, 200, 220, 240, 255, 265, 270] },
    { name: "Port Augusta", postcode: "5700", rent: 190, coords: [-32.5007, 137.7711], history: [115, 130, 145, 160, 175, 185, 190] },
  ],
  TAS: [
    { name: "Hobart - CBD", postcode: "7000", rent: 260, coords: [-42.8826, 147.3257], history: [155, 175, 195, 215, 235, 250, 260] },
    { name: "Launceston", postcode: "7250", rent: 230, coords: [-41.4317, 147.1203], history: [135, 155, 175, 195, 210, 225, 230] },
    { name: "Devonport", postcode: "7310", rent: 200, coords: [-41.1716, 146.4050], history: [120, 140, 160, 180, 195, 200] },
  ],
  ACT: [
    { name: "Canberra - CBD", postcode: "2600", rent: 310, coords: [-35.2809, 149.1300], history: [190, 210, 235, 260, 280, 295, 310] },
    { name: "Belconnen", postcode: "2617", rent: 280, coords: [-35.2401, 149.0700], history: [170, 190, 210, 235, 255, 270, 280] },
    { name: "Woden", postcode: "2606", rent: 270, coords: [-35.3457, 149.1100], history: [165, 185, 205, 230, 250, 265, 270] },
  ],
  NT: [
    { name: "Darwin - CBD", postcode: "0800", rent: 340, coords: [-12.4564, 130.8347], history: [210, 235, 265, 295, 315, 330, 340] },
    { name: "Alice Springs", postcode: "0870", rent: 280, coords: [-23.7001, 133.8807], history: [170, 190, 220, 245, 265, 275, 280] },
    { name: "Palmerston", postcode: "0830", rent: 300, coords: [-12.5563, 130.9852], history: [190, 215, 245, 275, 295, 300] },
  ],
};

let map = null;
let selectedState = null;
let selectedLGA = null;
let currentBudget = null;
let userIncome = null;
let trendChart = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
  initializeEventListeners();
  loadUserData();
});

// Initialize all event listeners
function initializeEventListeners() {
  // State selection
  document.querySelectorAll('.state-tile').forEach(tile => {
    tile.addEventListener('click', handleStateSelect);
  });

  // Budget filter
  document.getElementById('filterButton').addEventListener('click', handleBudgetFilter);
  document.getElementById('budgetInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      handleBudgetFilter();
    }
  });

  // Close detail panel
  document.getElementById('closeDetailBtn').addEventListener('click', closeDetailPanel);
}

// Load user data from session (profile data)
function loadUserData() {
  // Check if real profile data is available from Flask
  if (window.userProfileData) {
    userIncome = window.userProfileData.income;
  } else {
    // Fallback to demo income
    userIncome = 500;
  }
}

// Handle state selection
function handleStateSelect(e) {
  const state = e.target.dataset.state;

  document.querySelectorAll('.state-tile').forEach(tile => {
    tile.classList.remove('active');
  });
  e.target.classList.add('active');

  selectedState = state;
  initializeMap(state);
}

// Initialize map for selected state
function initializeMap(state) {
  const lgaList = LGA_DATA[state];
  if (!lgaList) return;

  const lats = lgaList.map(lga => lga.coords[0]);
  const lngs = lgaList.map(lga => lga.coords[1]);
  const center = [
    (Math.max(...lats) + Math.min(...lats)) / 2,
    (Math.max(...lngs) + Math.min(...lngs)) / 2
  ];

  if (map) {
    map.remove();
  }

  const container = document.getElementById('mapContainer');
  container.innerHTML = '';

  map = L.map(container).setView(center, 7);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  lgaList.forEach(lga => {
    const marker = L.circleMarker(lga.coords, {
      radius: 8,
      fillColor: getRentColor(lga.rent),
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    });

    marker.bindPopup(`<strong>${lga.name}</strong><br>$${lga.rent}/week`);

    marker.on('click', function () {
      showLGADetail(lga);
    });

    marker.addTo(map);
  });

  closeDetailPanel();
  currentBudget = null;
  updateBudgetDisplay();
}

// Get color based on rent price
function getRentColor(rent) {
  if (rent >= 300) return '#c62828';
  if (rent >= 250) return '#f57f17';
  return '#2e7d32';
}

// Show LGA detail panel
function showLGADetail(lga) {
  selectedLGA = lga;

  document.getElementById('lgaDetailName').textContent = lga.name;
  document.getElementById('detailRentPrice').textContent = `$${lga.rent}`;

  if (userIncome) {
    const affordabilityPercent = Math.round((lga.rent / userIncome) * 100);
    document.getElementById('detailAffordability').textContent = `${affordabilityPercent}%`;

    let affordabilityClass = 'affordability-affordable';
    let affordabilityText = 'Affordable';

    if (affordabilityPercent >= 40) {
      affordabilityClass = 'affordability-unaffordable';
      affordabilityText = 'Unaffordable';
    } else if (affordabilityPercent >= 30) {
      affordabilityClass = 'affordability-stretched';
      affordabilityText = 'Stretched';
    }

    document.getElementById('detailAffordabilityLabel').textContent = affordabilityText;
    const badge = document.getElementById('affordabilityBadge');
    badge.textContent = affordabilityText;
    badge.className = `affordability-badge ${affordabilityClass}`;
  }

  renderTrendChart(lga);
  generateTrendInsight(lga);

  document.getElementById('lgaDetailPanel').classList.remove('hidden');
}

// Render trend chart
function renderTrendChart(lga) {
  if (trendChart) {
    trendChart.destroy();
  }

  const ctx = document.getElementById('trendChart').getContext('2d');
  const years = Array.from({ length: lga.history.length }, (_, i) => {
    return `${new Date().getFullYear() - lga.history.length + i + 1}`;
  });

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: '1-Bedroom Rent ($)',
        data: lga.history,
        borderColor: 'rgb(232, 84, 106)',
        backgroundColor: 'rgba(232, 84, 106, 0.05)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(232, 84, 106)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `$${context.parsed.y}/week`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return `$${value}`;
            }
          }
        }
      }
    }
  });
}

// Generate trend insight
function generateTrendInsight(lga) {
  const history = lga.history;
  const firstYear = history[0];
  const lastYear = history[history.length - 1];
  const totalIncrease = lastYear - firstYear;
  const percentIncrease = Math.round((totalIncrease / firstYear) * 100);

  const recentTrend = history.slice(-3);
  const recentIncreases = recentTrend.filter((val, i) => i === 0 || val > recentTrend[i - 1]).length - 1;

  let trendStatus = 'Stable';
  let trendClass = 'affordability-affordable';

  if (recentIncreases >= 2) {
    trendStatus = 'Rising';
    trendClass = 'affordability-unaffordable';
  } else if (recentIncreases === 0) {
    trendStatus = 'Stable';
    trendClass = 'affordability-affordable';
  }

  const badge = document.getElementById('trendStatusBadge');
  badge.textContent = trendStatus;
  badge.className = `affordability-badge ${trendClass}`;

  let insightText = '';

  if (trendStatus === 'Rising') {
    insightText = `<strong>${lga.name}'s rent is rising.</strong> Over the past ${history.length} years, rent has increased by <strong>${percentIncrease}%</strong> (from $${firstYear} to $${lastYear}/week). The area is becoming less affordable. Consider this when planning your budget.`;
  } else {
    insightText = `<strong>${lga.name}'s rent is relatively stable.</strong> Over the past ${history.length} years, rent has changed by only <strong>${percentIncrease}%</strong>. This area offers more predictable housing costs for budgeting purposes.`;
  }

  document.getElementById('trendInsight').innerHTML = insightText;
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
  updateBudgetDisplay();

  if (!selectedState) {
    alert('Please select a state first');
    return;
  }

  updateMapBasedOnBudget();
}

// Update map markers based on budget filter
function updateMapBasedOnBudget() {
  if (!map || !selectedState) return;

  const lgaList = LGA_DATA[selectedState];

  map.eachLayer(layer => {
    if (layer instanceof L.CircleMarker) {
      map.removeLayer(layer);
    }
  });

  lgaList.forEach(lga => {
    const isAffordable = lga.rent <= currentBudget;
    const opacity = isAffordable ? 0.8 : 0.3;

    const marker = L.circleMarker(lga.coords, {
      radius: isAffordable ? 10 : 6,
      fillColor: isAffordable ? getRentColor(lga.rent) : '#999',
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: opacity
    });

    const popupText = `<strong>${lga.name}</strong><br>$${lga.rent}/week${!isAffordable ? '<br><small>(Outside budget)</small>' : ''}`;
    marker.bindPopup(popupText);

    marker.on('click', function () {
      showLGADetail(lga);
    });

    marker.addTo(map);
  });
}

// Update budget display
function updateBudgetDisplay() {
  const display = document.getElementById('currentBudgetDisplay');

  if (currentBudget) {
    document.getElementById('budgetDisplayValue').textContent = `$${currentBudget}`;
    display.classList.remove('hidden');
  } else {
    display.classList.add('hidden');
  }
}

// Function to update user income
function updateUserIncome(income) {
  userIncome = income;
  if (selectedLGA) {
    showLGADetail(selectedLGA);
  }
}
