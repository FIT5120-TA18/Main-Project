let spendingChart = null;
let benchmarkChart = null;

const FALLBACK_BENCHMARK = {
  "Food": 18,
  "Services": 22,
  "Transport": 12,
  "Health": 7,
  "Recreation and culture": 13,
  "Hotels, cafes and restaurants": 8,
  "Clothing and footwear": 5,
  "Miscellaneous goods and services": 15
};

document.addEventListener("DOMContentLoaded", async () => {
  const data = loadSpendingData();

  if (!data) {
    showEmptyState();
    return;
  }

  showResultsState();

  const benchmark = await fetchBenchmarkData();

  renderSummaryCards(data);
  renderVerdict(data);
  renderActionInsights(data);
  renderSpendingDonut(data);
  renderPositionDetails(data);
  renderBenchmarkComparison(data, benchmark);
  renderNextSteps(data);
});

function loadSpendingData() {
  try {
    const raw = sessionStorage.getItem("hermapSpendingData");
    if (!raw) return null;

    const data = JSON.parse(raw);

    if (!data || !Array.isArray(data.items)) return null;

    return data;
  } catch (error) {
    console.error("Could not load spending data:", error);
    return null;
  }
}

function showEmptyState() {
  document.getElementById("emptyState").style.display = "block";
  document.getElementById("resultsContent").style.display = "none";
}

function showResultsState() {
  document.getElementById("emptyState").style.display = "none";
  document.getElementById("resultsContent").style.display = "block";
}

async function fetchBenchmarkData() {
  try {
    const response = await fetch("/api/abs-spending-benchmark");

    if (!response.ok) {
      throw new Error("Benchmark API failed");
    }

    const json = await response.json();

    if (!json.benchmark || Object.keys(json.benchmark).length === 0) {
      return FALLBACK_BENCHMARK;
    }

    return json.benchmark;
  } catch (error) {
    console.warn("Using fallback benchmark:", error);
    return FALLBACK_BENCHMARK;
  }
}

function money(value) {
  return `$${Math.round(Number(value) || 0)}`;
}

function renderSummaryCards(data) {
  const rentPct = data.income > 0 ? (data.rent / data.income) * 100 : 0;

  document.getElementById("summaryIncome").textContent = `${money(data.income)}/wk`;
  document.getElementById("summaryTotal").textContent = `${money(data.total)}/wk`;

  const surplusEl = document.getElementById("summarySurplus");
  surplusEl.textContent = data.surplus >= 0
    ? `+${money(data.surplus)}/wk`
    : `-${money(Math.abs(data.surplus))}/wk`;

  surplusEl.className = "summary-value " + (data.surplus >= 0 ? "surplus-color" : "deficit-color");

  document.getElementById("summaryRentPressure").textContent =
    data.rent > 0 ? `${rentPct.toFixed(1)}%` : "No rent";
}

function renderVerdict(data) {
  const card = document.getElementById("verdictCard");
  const icon = document.getElementById("verdictIcon");
  const title = document.getElementById("verdictTitle");
  const body = document.getElementById("verdictBody");

  card.className = "verdict-card";

  if (data.surplus < 0) {
    const weeklyDeficit = Math.abs(data.surplus);
    const shortfall = weeklyDeficit * 13;

    card.classList.add("deficit");
    icon.textContent = "🔴";
    title.textContent = `You are ${money(weeklyDeficit)}/wk over your income`;
    body.textContent =
      `At your current deficit of ${money(weeklyDeficit)}/wk, you face a projected shortfall of approximately ${money(shortfall)} over the next 3 months.`;
  } else if (data.surplus <= 50) {
    card.classList.add("tight");
    icon.textContent = "⚠️";
    title.textContent = "You are close to breaking even";
    body.textContent =
      `You have ${money(data.surplus)}/wk left over. One unexpected cost could push you into deficit.`;
  } else {
    card.classList.add("surplus");
    icon.textContent = "✅";
    title.textContent = `You have ${money(data.surplus)}/wk left over`;
    body.textContent =
      `Your spending is currently within your income. This gives you some room to save, plan, or absorb small unexpected costs.`;
  }
}

function renderActionInsights(data) {
  const positionInsight = document.getElementById("positionInsight");
  const fastestImprovement = document.getElementById("fastestImprovement");
  const moveOutReadiness = document.getElementById("moveOutReadiness");

  const rentPct = data.income > 0 ? (data.rent / data.income) * 100 : 0;
  const largestFlexible = getLargestNonEssential(data.items);

  if (data.surplus < 0) {
    positionInsight.textContent =
      `Your spending is currently higher than your income. The main risk is that small weekly gaps can quickly become a larger shortfall.`;
  } else {
    positionInsight.textContent =
      `Your spending is currently within your income. The next question is whether this surplus is enough to support moving out, saving, or unexpected costs.`;
  }

  if (largestFlexible) {
    const reduction = Math.min(30, Math.round(largestFlexible.value * 0.25));
    const yearlySaving = reduction * 52;

    fastestImprovement.textContent =
      `Your largest flexible category is ${largestFlexible.name} at ${money(largestFlexible.value)}/wk. Reducing it by about ${money(reduction)}/wk could free up around ${money(yearlySaving)} over one year.`;
  } else {
    fastestImprovement.textContent =
      `Most of your entered spending is essential. Your biggest improvement may come from comparing lower-rent suburbs or reviewing fixed bills.`;
  }

  const living = String(data.living || "").toLowerCase();

  if (living.includes("home")) {
    const estimatedSharedRent = data.rent > 0 ? data.rent : 280;
    const estimatedUtilities = 45;
    const projectedTotal = data.total + estimatedSharedRent + estimatedUtilities;
    const projectedSurplus = data.income - projectedTotal;

    moveOutReadiness.textContent =
      `Because you currently live at home, your current surplus may not reflect independent living costs. If shared rent and utilities added about ${money(estimatedSharedRent + estimatedUtilities)}/wk, your projected position would be ${projectedSurplus >= 0 ? "+" : "-"}${money(Math.abs(projectedSurplus))}/wk.`;
  } else if (rentPct >= 30) {
    moveOutReadiness.textContent =
      `Rent takes up ${rentPct.toFixed(1)}% of your income, which may make independence harder to sustain unless other costs stay controlled.`;
  } else {
    moveOutReadiness.textContent =
      `Your rent is below the 30% housing stress threshold, which gives you a stronger base for sustaining independence.`;
  }
}

function getLargestNonEssential(items) {
  return items
    .filter(item => item.type === "nonessential" && item.value > 0)
    .sort((a, b) => b.value - a.value)[0] || null;
}

function renderSpendingDonut(data) {
    const labels = [];
    const values = [];
    const colors = [];
    
    let essentialIndex = 0;
    let nonessentialIndex = 0;
    const essentialPalette = [
        "#2f5aa8",
        "#4a73bb",
        "#6a8ccd",
        "#8ba6de",
        "#b0c3ec"
      ];
      
      const nonessentialPalette = [
        "#9b72cf",
        "#b08ad8",
        "#c4a3e0",
        "#d7bde8",
        "#e8d5f2"
      ];
    
    data.items.forEach(item => {
      labels.push(item.name);
      values.push(item.value);
    
      if (item.type === "essential") {
        colors.push(
          essentialPalette[
            essentialIndex % essentialPalette.length
          ]
        );
    
        essentialIndex++;
      } else {
        colors.push(
          nonessentialPalette[
            nonessentialIndex % nonessentialPalette.length
          ]
        );
    
        nonessentialIndex++;
      }
    });

 

  const canvas = document.getElementById("spendingDonut");

  if (!canvas) return;

  if (spendingChart) {
    spendingChart.destroy();
  }

  spendingChart = new Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#ffffff"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: context => {
              const total = values.reduce((sum, value) => sum + value, 0);
              const pct = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
              return `${context.label}: ${money(context.raw)}/wk (${pct}%)`;
            }
          }
        }
      }
    }
  });

  const legend = document.getElementById("spendingLegend");
  legend.innerHTML = labels.map((label, index) => `
    <div class="chart-legend-item">
      <span class="chart-legend-dot" style="background:${colors[index % colors.length]}"></span>
      <span>${label}</span>
    </div>
  `).join("");
}

function renderPositionDetails(data) {
  const rentPct = data.income > 0 ? (data.rent / data.income) * 100 : 0;

  document.getElementById("essentialAmount").textContent = `${money(data.essential)}/wk`;
  document.getElementById("nonessentialAmount").textContent = `${money(data.nonessential)}/wk`;
  document.getElementById("rentPct").textContent = data.rent > 0 ? `${rentPct.toFixed(1)}%` : "No rent entered";

  const status = document.getElementById("stressStatus");

  if (data.rent <= 0) {
    status.textContent = "—";
    return;
  }

  if (rentPct < 30) {
    status.textContent = "✅ Stable";
    status.className = "surplus-color";
  } else if (rentPct <= 45) {
    status.textContent = "⚠️ Vulnerable";
    status.className = "warning-color";
  } else {
    status.textContent = "🔴 At Risk";
    status.className = "deficit-color";
  }
}
function renderBenchmarkComparison(data, benchmark) {
    const enteredBenchmarkItems = data.items.filter(
      item => item.absGroup && item.value > 0
    );
  
    const warning = document.getElementById("benchmarkWarning");
  
    const userGroups = {};
  
    enteredBenchmarkItems.forEach(item => {
      if (!userGroups[item.absGroup]) {
        userGroups[item.absGroup] = 0;
      }
  
      userGroups[item.absGroup] += item.value;
    });
  
    const selectedGroups = Object.keys(userGroups).filter(
      group => benchmark[group] !== undefined
    );
  
    if (selectedGroups.length < 2) {
      warning.textContent =
        "Add at least 2 spending categories to compare your spending pattern. With only one category, the share will always be 100%.";
  
      renderBenchmarkChart([], {}, {});
      renderBenchmarkTable([], {}, {});
      renderBenchmarkInsights([], {}, {});
      return;
    }
  
    warning.textContent =
      "This comparison only uses the categories you entered. Add more categories for a fuller picture of your spending pattern.";
  
    const userTotal = selectedGroups.reduce(
      (sum, group) => sum + userGroups[group],
      0
    );
  
    const selectedBenchmarkTotal = selectedGroups.reduce(
      (sum, group) => sum + benchmark[group],
      0
    );
  
    const userPercentages = {};
    const recalculatedBenchmarkPercentages = {};
  
    selectedGroups.forEach(group => {
      userPercentages[group] =
        userTotal > 0 ? (userGroups[group] / userTotal) * 100 : 0;
  
      recalculatedBenchmarkPercentages[group] =
        selectedBenchmarkTotal > 0
          ? (benchmark[group] / selectedBenchmarkTotal) * 100
          : 0;
    });
  
    renderBenchmarkChart(
      selectedGroups,
      userPercentages,
      recalculatedBenchmarkPercentages
    );
  
    renderBenchmarkTable(
      selectedGroups,
      userPercentages,
      recalculatedBenchmarkPercentages
    );
  
    renderBenchmarkInsights(
      selectedGroups,
      userPercentages,
      recalculatedBenchmarkPercentages
    );
  }

function renderBenchmarkChart(groups, userPercentages, benchmark) {
  const canvas = document.getElementById("benchmarkChart");

  if (!canvas) return;

  if (benchmarkChart) {
    benchmarkChart.destroy();
  }

  benchmarkChart = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels: groups,
      datasets: [
        {
          label: "Your spending share",
          data: groups.map(group => Number((userPercentages[group] || 0).toFixed(1))),
          backgroundColor: "#9b72cf"
        },
        {
          label: "Victorian benchmark",
          data: groups.map(group => Number((benchmark[group] || 0).toFixed(1))),
          backgroundColor: "#b8c2d8"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: value => `${value}%`
          }
        }
      }
    }
  });
}
function renderBenchmarkTable(groups, userPercentages, benchmarkPercentages) {
    const body = document.getElementById("benchmarkTableBody");
  
    if (!body) return;
  
    if (!groups.length) {
      body.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;color:var(--text-muted);">
            Add at least 2 spending categories to see a meaningful comparison.
          </td>
        </tr>
      `;
      return;
    }
  
    body.innerHTML = groups.map(group => {
      const userPct = userPercentages[group] || 0;
      const benchPct = benchmarkPercentages[group] || 0;
      const diff = userPct - benchPct;
  
      return `
        <tr>
          <td>${group}</td>
          <td>${userPct.toFixed(1)}%</td>
          <td>${benchPct.toFixed(1)}%</td>
          <td>${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%</td>
        </tr>
      `;
    }).join("");
  }
  function renderBenchmarkInsights(groups, userPercentages, benchmarkPercentages) {
    const container = document.getElementById("benchmarkInsights");
  
    if (!container) return;
  
    if (!groups.length) {
      container.innerHTML = `
        <div class="benchmark-insight">
          <h4>No comparison yet</h4>
          <p>
            Add at least 2 spending categories so the app can compare how your spending is split.
          </p>
        </div>
      `;
      return;
    }
  
    const differences = groups
      .map(group => ({
        group,
        userPct: userPercentages[group] || 0,
        benchPct: benchmarkPercentages[group] || 0,
        diff: (userPercentages[group] || 0) - (benchmarkPercentages[group] || 0)
      }))
      .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
      .slice(0, 3);
  
    container.innerHTML = differences.map(item => {
      const direction = item.diff >= 0 ? "higher" : "lower";
  
      return `
        <div class="benchmark-insight">
          <h4>${item.group}</h4>
          <p>
            Among the categories you entered, this takes up
            ${Math.abs(item.diff).toFixed(1)} percentage points ${direction}
            share than the Victorian benchmark pattern.
          </p>
        </div>
      `;
    }).join("");
  }

function renderNextSteps(data) {
  const text = document.getElementById("nextStepText");
  const links = document.getElementById("actionLinks");

  const rentPct = data.income > 0 ? (data.rent / data.income) * 100 : 0;

  if (data.surplus < 0) {
    text.textContent =
      "Your first step is to reduce the weekly gap before it becomes a larger shortfall. Start with flexible spending, then review rent pressure if rent is the main driver.";
  } else if (rentPct >= 30) {
    text.textContent =
      "You are not in deficit, but rent takes a large share of income. Your next step is to compare suburbs or rental options that reduce housing pressure.";
  } else {
    text.textContent =
      "Your position looks more manageable. Your next step is to turn your weekly surplus into a savings pathway for bond, emergency savings, or moving costs.";
  }

  const items = [];

  if (data.surplus < 0) {
    items.push({
      href: "/dashboard",
      title: "Learn tips to help you save more",
      desc: "Go to education tiles for practical budgeting strategies.",
      icon: "💡"
    });
  }

  if (rentPct >= 30 || data.rent === 0) {
    items.push({
      href: "/rent_comparison",
      title: "Compare suburb affordability",
      desc: "Find suburbs where rent may fit your income better.",
      icon: "🗺️"
    });
  }

  items.push({
    href: "/income_comparison",
    title: "Compare income pathways",
    desc: "Explore income patterns across industries and areas.",
    icon: "📊"
  });

  links.innerHTML = items.map(item => `
    <a href="${item.href}" class="action-link-card">
      <div class="action-link-icon">${item.icon}</div>
      <div>
        <h4>${item.title}</h4>
        <p>${item.desc}</p>
      </div>
    </a>
  `).join("");
}