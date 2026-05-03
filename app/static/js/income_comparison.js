// Income Comparison Page - JavaScript

// Mock comparison data by state and demographic
const STATE_INCOME_DATA = {
  "NSW": 680,
  "VIC": 700,
  "QLD": 650,
  "WA": 720,
  "SA": 620,
  "TAS": 590,
  "ACT": 750,
  "NT": 780
};

// Mock comparison data by demographic profile
const INCOME_COMPARISON_DATA = {
  // Key format: "age_range-state-industry-work_status"
  "18-25-VIC-IT-full-time": {
    peerIncomes: [450, 520, 580, 620, 680, 750, 820, 890, 950, 1050],
    average: 700,
    median: 735,
    min: 450,
    max: 1050,
  },
  "18-25-NSW-Retail-casual": {
    peerIncomes: [280, 320, 360, 400, 450, 500, 550, 600, 650, 700],
    average: 480,
    median: 475,
    min: 280,
    max: 700,
  },
  "26-35-VIC-Finance-full-time": {
    peerIncomes: [600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500],
    average: 1050,
    median: 1050,
    min: 600,
    max: 1500,
  },
  "26-35-QLD-Healthcare-full-time": {
    peerIncomes: [550, 620, 680, 750, 820, 890, 950, 1050, 1100, 1200],
    average: 860,
    median: 855,
    min: 550,
    max: 1200,
  },
  "default": {
    peerIncomes: [400, 450, 500, 550, 600, 650, 700, 750, 800, 850],
    average: 625,
    median: 625,
    min: 400,
    max: 850,
  }
};

let userProfile = {
  age: "--",
  state: "--",
  location: "--",
  industry: "--",
  income: 0,
  workStatus: "--",
  living: "--"
};

let currentChart = null;
let comparisonData = null;
let selectedAreas = ["Your Area"];

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
  loadUserProfile();
  initializeEventListeners();
  loadComparisonData();
  updateAreaIncomeDisplay();
  renderChart('bar');
  updateStatistics();
  generateInsight();
});

// Initialize event listeners
function initializeEventListeners() {
  document.getElementById('barChartBtn').addEventListener('click', function () {
    switchChart('bar');
  });

  document.getElementById('lineChartBtn').addEventListener('click', function () {
    switchChart('line');
  });

  // Area selection
  document.querySelectorAll('.area-tile').forEach(tile => {
    tile.addEventListener('click', handleAreaSelect);
  });

  // Badge removal
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('badge-remove')) {
      const area = e.target.dataset.area;
      removeArea(area);
    }
  });
}

// Load user profile from page context
function loadUserProfile() {
  // Check if real profile data is available from Flask
  if (window.userProfileData) {
    userProfile = window.userProfileData;
  } else {
    // Fallback to demo data
    const profileData = {
      age: "24",
      state: "VIC",
      location: "Melbourne",
      workStatus: "Full-time",
      industry: "IT Services",
      income: 650,
      living: "Shared rental"
    };
    userProfile = profileData;
  }

  // Update profile display
  document.getElementById('profileAge').textContent = userProfile.age;
  document.getElementById('profileLocation').textContent = userProfile.location;
  document.getElementById('profileWorkStatus').textContent = userProfile.workStatus;
  document.getElementById('profileIndustry').textContent = userProfile.industry;
  document.getElementById('profileIncome').textContent = `$${userProfile.income}/week`;
  document.getElementById('profileLiving').textContent = userProfile.living;
}

// Load comparison data based on user profile
function loadComparisonData() {
  const profileKey = generateProfileKey();
  comparisonData = INCOME_COMPARISON_DATA[profileKey] || INCOME_COMPARISON_DATA.default;
}

// Generate profile key for data lookup
function generateProfileKey() {
  const ageRange = getAgeRange(userProfile.age);
  const state = userProfile.state.toUpperCase();
  const industry = userProfile.industry.replace(/\s+/g, '-').toLowerCase();
  const workStatus = userProfile.workStatus.replace(/\s+/g, '-').toLowerCase();

  const key = `${ageRange}-${state}-${industry}-${workStatus}`;
  return INCOME_COMPARISON_DATA[key] ? key : 'default';
}

// Get age range from age
function getAgeRange(age) {
  const ageNum = parseInt(age);
  if (ageNum < 26) return "18-25";
  if (ageNum < 36) return "26-35";
  if (ageNum < 46) return "36-45";
  return "45+";
}

// Handle area selection
function handleAreaSelect(e) {
  const state = e.target.closest('.area-tile').dataset.state;

  if (state === "Your Area") {
    alert("Your area is always included in the comparison");
    return;
  }

  if (selectedAreas.includes(state)) {
    removeArea(state);
  } else {
    selectedAreas.push(state);
    e.target.closest('.area-tile').classList.add('selected');
    addAreaBadge(state);
  }

  renderChart('bar');
  updateStatistics();
}

// Remove area from comparison
function removeArea(area) {
  if (area === "Your Area") return;

  selectedAreas = selectedAreas.filter(a => a !== area);

  // Update tiles
  document.querySelectorAll('.area-tile').forEach(tile => {
    if (tile.dataset.state === area) {
      tile.classList.remove('selected');
    }
  });

  // Update badges
  document.querySelectorAll('.area-badge').forEach(badge => {
    if (badge.dataset.area === area) {
      badge.remove();
    }
  });

  renderChart('bar');
  updateStatistics();
}

// Add area badge
function addAreaBadge(area) {
  const display = document.getElementById('selectedAreasDisplay');
  const badge = document.createElement('span');
  badge.className = 'area-badge';
  badge.dataset.area = area;
  badge.innerHTML = `${area} <button class="badge-remove" data-area="${area}">×</button>`;
  display.appendChild(badge);
}

// Update area income display
function updateAreaIncomeDisplay() {
  document.getElementById('yourAreaIncome').textContent = `$${comparisonData.average}`;

  Object.keys(STATE_INCOME_DATA).forEach(state => {
    const elementId = state.toLowerCase() + 'Income';
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = `$${STATE_INCOME_DATA[state]}`;
    }
  });
}

// Render chart
function renderChart(chartType) {
  if (currentChart) {
    currentChart.destroy();
  }

  const ctx = document.getElementById('incomeChart').getContext('2d');

  const chartConfig = {
    bar: createBarChartConfig(),
    line: createLineChartConfig()
  };

  currentChart = new Chart(ctx, chartConfig[chartType]);
}

// Create bar chart configuration for multiple areas
function createBarChartConfig() {
  const labels = selectedAreas;
  const data = labels.map(area => {
    if (area === "Your Area") {
      return comparisonData.average;
    }
    return STATE_INCOME_DATA[area] || 0;
  });

  const backgroundColors = labels.map((area, index) => {
    if (area === "Your Area") {
      return 'rgba(232, 84, 106, 0.8)';
    }
    const colors = [
      'rgba(155, 155, 155, 0.6)',
      'rgba(76, 175, 80, 0.6)',
      'rgba(33, 150, 243, 0.6)',
      'rgba(255, 152, 0, 0.6)',
      'rgba(156, 39, 176, 0.6)',
      'rgba(244, 67, 54, 0.6)',
      'rgba(0, 188, 212, 0.6)',
      'rgba(76, 175, 80, 0.6)'
    ];
    return colors[index % colors.length];
  });

  return {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Average Weekly Income ($)',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(c => c.replace('0.', '1.')),
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: backgroundColors.map(c => c.replace('0.', '1.'))
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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
  };
}

// Create line chart configuration
function createLineChartConfig() {
  const incomeProgression = generateIncomeProgression();
  const ageRange = getAgeRange(userProfile.age);
  const startAge = parseInt(ageRange.split('-')[0]);

  const labels = Array.from({ length: incomeProgression.yourProjection.length }, (_, i) => {
    return `Age ${startAge + i}`;
  });

  const datasets = [
    {
      label: 'Your Projected Income',
      data: incomeProgression.yourProjection,
      borderColor: 'rgb(232, 84, 106)',
      backgroundColor: 'rgba(232, 84, 106, 0.05)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(232, 84, 106)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5
    }
  ];

  // Add trend lines for selected areas
  selectedAreas.forEach((area, index) => {
    if (area === "Your Area") return;

    const areaIncome = STATE_INCOME_DATA[area];
    const projection = generateAreaIncomeProgression(areaIncome);

    const colors = [
      'rgb(155, 155, 155)',
      'rgb(76, 175, 80)',
      'rgb(33, 150, 243)',
      'rgb(255, 152, 0)',
      'rgb(156, 39, 176)',
      'rgb(244, 67, 54)',
      'rgb(0, 188, 212)'
    ];

    datasets.push({
      label: `${area} Average`,
      data: projection,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + '15',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: colors[index % colors.length],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      borderDash: [5, 5]
    });
  });

  return {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
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
              return `${context.dataset.label}: $${context.parsed.y}/week`;
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
  };
}

// Generate income progression for trend line
function generateIncomeProgression() {
  const yourCurrent = userProfile.income;
  const averageCurrent = comparisonData.average;
  const years = 10;

  const yourProjection = [];
  const peerAverage = [];

  for (let i = 0; i < years; i++) {
    yourProjection.push(Math.round(yourCurrent * Math.pow(1.03, i)));
    peerAverage.push(Math.round(averageCurrent * Math.pow(1.03, i)));
  }

  return { yourProjection, peerAverage };
}

// Generate area income progression
function generateAreaIncomeProgression(baseIncome) {
  const years = 10;
  const projection = [];

  for (let i = 0; i < years; i++) {
    projection.push(Math.round(baseIncome * Math.pow(1.03, i)));
  }

  return projection;
}

// Switch between chart types
function switchChart(chartType) {
  document.getElementById('barChartBtn').classList.remove('active');
  document.getElementById('lineChartBtn').classList.remove('active');

  if (chartType === 'bar') {
    document.getElementById('barChartBtn').classList.add('active');
  } else {
    document.getElementById('lineChartBtn').classList.add('active');
  }

  renderChart(chartType);
}

// Update statistics display
function updateStatistics() {
  const yourPosition = calculatePercentile();
  const incomeRange = `$${comparisonData.min} - $${comparisonData.max}`;

  document.getElementById('averageIncome').textContent = `$${comparisonData.average}`;
  document.getElementById('medianIncome').textContent = `$${comparisonData.median}`;
  document.getElementById('percentilePosition').textContent = `${yourPosition}th`;
  document.getElementById('incomeRange').textContent = incomeRange;
}

// Calculate percentile position
function calculatePercentile() {
  const yourIncome = userProfile.income;
  const peerIncomes = comparisonData.peerIncomes.sort((a, b) => a - b);

  let count = 0;
  for (let income of peerIncomes) {
    if (income <= yourIncome) count++;
  }

  return Math.round((count / peerIncomes.length) * 100);
}

// Generate insight message
function generateInsight() {
  const yourIncome = userProfile.income;
  const average = comparisonData.average;
  const difference = yourIncome - average;
  const percentDifference = Math.round((Math.abs(difference) / average) * 100);

  let insightText = "";

  if (Math.abs(difference) < 50) {
    insightText = `Your weekly income of <span class="insight-highlight">$${yourIncome}</span> is close to the average for your peers (${average}). You're in line with others in your situation.`;
  } else if (difference > 0) {
    insightText = `Your weekly income of <span class="insight-highlight">$${yourIncome}</span> is <span class="insight-highlight">${percentDifference}% higher</span> than the average for your peers. You're earning above the typical income for your demographic.`;
  } else {
    insightText = `Your weekly income of <span class="insight-highlight">$${yourIncome}</span> is <span class="insight-highlight">${percentDifference}% lower</span> than the average for your peers. Consider exploring opportunities to increase your income.`;
  }

  document.getElementById('insightText').innerHTML = insightText;
}

// Function to update user profile from external source
function updateUserProfile(profileData) {
  userProfile = { ...userProfile, ...profileData };
  loadUserProfile();
  loadComparisonData();
  updateAreaIncomeDisplay();
  renderChart('bar');
  updateStatistics();
  generateInsight();
}

// Load user profile from page context
function loadUserProfile() {
  // Check if real profile data is available from Flask
  if (window.userProfileData) {
    userProfile = window.userProfileData;
  } else {
    // Fallback to demo data
    const profileData = {
      age: "24",
      state: "VIC",
      location: "Melbourne",
      workStatus: "Full-time",
      industry: "IT Services",
      income: 650,
      living: "Shared rental"
    };
    userProfile = profileData;
  }

  // Update profile display
  document.getElementById('profileAge').textContent = userProfile.age;
  document.getElementById('profileLocation').textContent = userProfile.location;
  document.getElementById('profileWorkStatus').textContent = userProfile.workStatus;
  document.getElementById('profileIndustry').textContent = userProfile.industry;
  document.getElementById('profileIncome').textContent = `$${userProfile.income}/week`;
  document.getElementById('profileLiving').textContent = userProfile.living;
}

// Load comparison data based on user profile
function loadComparisonData() {
  const profileKey = generateProfileKey();
  comparisonData = INCOME_COMPARISON_DATA[profileKey] || INCOME_COMPARISON_DATA.default;
}

// Generate profile key for data lookup
function generateProfileKey() {
  const ageRange = getAgeRange(userProfile.age);
  const state = userProfile.state.toUpperCase();
  const industry = userProfile.industry.replace(/\s+/g, '-').toLowerCase();
  const workStatus = userProfile.workStatus.replace(/\s+/g, '-').toLowerCase();

  const key = `${ageRange}-${state}-${industry}-${workStatus}`;
  return INCOME_COMPARISON_DATA[key] ? key : 'default';
}

// Get age range from age
function getAgeRange(age) {
  const ageNum = parseInt(age);
  if (ageNum < 26) return "18-25";
  if (ageNum < 36) return "26-35";
  if (ageNum < 46) return "36-45";
  return "45+";
}

// Render chart
function renderChart(chartType) {
  if (currentChart) {
    currentChart.destroy();
  }

  const ctx = document.getElementById('incomeChart').getContext('2d');

  const chartConfig = {
    bar: createBarChartConfig(),
    line: createLineChartConfig()
  };

  currentChart = new Chart(ctx, chartConfig[chartType]);
}

// Create bar chart configuration
function createBarChartConfig() {
  const labels = [
    'You',
    'Average\n(Your Peers)',
    'Min',
    'Max',
    'Median'
  ];

  const data = [
    userProfile.income,
    comparisonData.average,
    comparisonData.min,
    comparisonData.max,
    comparisonData.median
  ];

  const backgroundColors = [
    'rgba(232, 84, 106, 0.8)',    // Primary - Your income
    'rgba(155, 155, 155, 0.6)',   // Gray - Average
    'rgba(76, 175, 80, 0.5)',     // Green - Min
    'rgba(244, 67, 54, 0.5)',     // Red - Max
    'rgba(25, 118, 210, 0.5)'     // Blue - Median
  ];

  return {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Weekly Income ($)',
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(c => c.replace('0.', '1.')),
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: backgroundColors.map(c => c.replace('0.', '1.'))
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
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
  };
}

// Create line chart configuration
function createLineChartConfig() {
  const incomeProgression = generateIncomeProgression();
  const ageRange = getAgeRange(userProfile.age);
  const startAge = parseInt(ageRange.split('-')[0]);

  const labels = Array.from({ length: incomeProgression.length }, (_, i) => {
    return `Age ${startAge + i}`;
  });

  return {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Your Projected Income',
          data: incomeProgression.yourProjection,
          borderColor: 'rgb(232, 84, 106)',
          backgroundColor: 'rgba(232, 84, 106, 0.05)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(232, 84, 106)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5
        },
        {
          label: 'Peer Average Progression',
          data: incomeProgression.peerAverage,
          borderColor: 'rgb(155, 155, 155)',
          backgroundColor: 'rgba(155, 155, 155, 0.05)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(155, 155, 155)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          borderDash: [5, 5]
        }
      ]
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
              return `${context.dataset.label}: $${context.parsed.y}/week`;
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
  };
}

// Generate income progression for trend line
function generateIncomeProgression() {
  const yourCurrent = userProfile.income;
  const averageCurrent = comparisonData.average;
  const years = 10;

  const yourProjection = [];
  const peerAverage = [];

  for (let i = 0; i < years; i++) {
    // Assume 3% annual growth
    yourProjection.push(Math.round(yourCurrent * Math.pow(1.03, i)));
    peerAverage.push(Math.round(averageCurrent * Math.pow(1.03, i)));
  }

  return { yourProjection, peerAverage };
}

// Switch between chart types
function switchChart(chartType) {
  // Update button states
  document.getElementById('barChartBtn').classList.remove('active');
  document.getElementById('lineChartBtn').classList.remove('active');

  if (chartType === 'bar') {
    document.getElementById('barChartBtn').classList.add('active');
  } else {
    document.getElementById('lineChartBtn').classList.add('active');
  }

  renderChart(chartType);
}

// Update statistics display
function updateStatistics() {
  const yourPosition = calculatePercentile();
  const incomeRange = `$${comparisonData.min} - $${comparisonData.max}`;

  document.getElementById('averageIncome').textContent = `$${comparisonData.average}`;
  document.getElementById('medianIncome').textContent = `$${comparisonData.median}`;
  document.getElementById('percentilePosition').textContent = `${yourPosition}th`;
  document.getElementById('incomeRange').textContent = incomeRange;
}

// Calculate percentile position
function calculatePercentile() {
  const yourIncome = userProfile.income;
  const peerIncomes = comparisonData.peerIncomes.sort((a, b) => a - b);

  let count = 0;
  for (let income of peerIncomes) {
    if (income <= yourIncome) count++;
  }

  return Math.round((count / peerIncomes.length) * 100);
}

// Generate insight message
function generateInsight() {
  const yourIncome = userProfile.income;
  const average = comparisonData.average;
  const difference = yourIncome - average;
  const percentDifference = Math.round((Math.abs(difference) / average) * 100);

  let insightText = "";

  if (Math.abs(difference) < 50) {
    insightText = `Your weekly income of <span class="insight-highlight">$${yourIncome}</span> is close to the average for your peers (${average}). You're in line with others in your situation.`;
  } else if (difference > 0) {
    insightText = `Your weekly income of <span class="insight-highlight">$${yourIncome}</span> is <span class="insight-highlight">${percentDifference}% higher</span> than the average for your peers. You're earning above the typical income for your demographic.`;
  } else {
    insightText = `Your weekly income of <span class="insight-highlight">$${yourIncome}</span> is <span class="insight-highlight">${percentDifference}% lower</span> than the average for your peers. Consider exploring opportunities to increase your income, such as skill development or career advancement.`;
  }

  document.getElementById('insightText').innerHTML = insightText;
}

// Function to update user profile from external source
function updateUserProfile(profileData) {
  userProfile = { ...userProfile, ...profileData };
  loadUserProfile();
  loadComparisonData();
  renderChart('bar');
  updateStatistics();
  generateInsight();
}
