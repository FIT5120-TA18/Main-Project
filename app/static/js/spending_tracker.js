/**
 * spending_tracker.js  —  Epic 5: Track My Spending
 *
 * One initial category shown on load (Rent if she pays rent, Groceries otherwise).
 * User adds more from a dropdown of essential / non-essential categories.
 * Results show a donut chart + position summary + contextual epic cross-links.
 */

// ─────────────────────────────────────────────
// Category definitions
// ─────────────────────────────────────────────
const ESSENTIAL_CATEGORIES = [
    { id: "rent",       icon: "🏠", name: "Rent",                  hint: "Weekly rent amount",              default: 0  },
    { id: "utilities",  icon: "⚡", name: "Electricity & gas",      hint: "ABS HES benchmark ~$28/wk",      default: 28 },
    { id: "internet",   icon: "📶", name: "Internet",               hint: "NBN plan ~$14/wk",               default: 14 },
    { id: "groceries",  icon: "🛒", name: "Groceries",              hint: "ABS HES single person ~$110/wk", default: 0  },
    { id: "transport",  icon: "🚌", name: "Public transport",       hint: "Myki weekly cap $53",            default: 53 },
    { id: "phone",      icon: "📱", name: "Phone bill",             hint: "Monthly plan ÷ 4",               default: 0  },
    { id: "medical",    icon: "💊", name: "Medical & pharmacy",     hint: "ABS HES ~$12/wk",                default: 0  },
    { id: "insurance",  icon: "🛡️", name: "Contents insurance",     hint: "~$14/wk for renters",            default: 0  },
  ];
  
  const NONESSENTIAL_CATEGORIES = [
    { id: "eating_out",      icon: "🍜", name: "Eating out & takeaway",   hint: "Restaurants, UberEats, cafés",   default: 0 },
    { id: "entertainment",   icon: "🎬", name: "Entertainment",           hint: "Streaming, events, activities",  default: 0 },
    { id: "clothing",        icon: "👗", name: "Clothing & personal care", hint: "Clothes, beauty, haircuts",      default: 0 },
    { id: "bnpl",            icon: "💳", name: "BNPL repayments",         hint: "Afterpay, Zip, Klarna",          default: 0 },
    { id: "subscriptions",   icon: "📺", name: "Subscriptions",           hint: "Netflix, Spotify, gym etc.",     default: 0 },
    { id: "hobbies",         icon: "🎮", name: "Hobbies & leisure",       hint: "Sport, games, crafts etc.",      default: 0 },
    { id: "gifts",           icon: "🎁", name: "Gifts & social",          hint: "Birthdays, going out",           default: 0 },
    { id: "other",           icon: "📦", name: "Other",                   hint: "Anything else",                  default: 0 },
  ];
  
  // ─────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────
  let activeEssentials    = [];  // array of category ids currently shown
  let activeNonessentials = [];
  let donutChart          = null;
  
  // ─────────────────────────────────────────────
  // Boot
  // ─────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", () => {
    const p = window.userProfileData || {};
  
    // Pre-fill income
    const incomeEl = document.getElementById("incomeInput");
    if (p.income) incomeEl.value = p.income;
    updateIncomeBanner();
  
    // Show one initial card based on living situation
    if (p.living === "Shared rental" || p.living === "Living alone") {
      // She already pays rent - start with rent card pre-filled
      addExpenseCard("essential", "rent", p.rent || 0);
    } else {
      // She lives at home - start with groceries so she can see her current spending
      addExpenseCard("essential", "groceries", 0);
    }
  
    // Populate dropdowns (only show categories not already active)
    rebuildDropdowns();
  
    // Listeners
    incomeEl.addEventListener("input", () => { updateIncomeBanner(); updateTotals(); });
    document.getElementById("addEssentialBtn").addEventListener("click", () => addFromDropdown("essential"));
    document.getElementById("addNonEssentialBtn").addEventListener("click", () => addFromDropdown("nonessential"));
    document.getElementById("checkPositionBtn").addEventListener("click", showResults);
  });
  
  // ─────────────────────────────────────────────
  // Income banner
  // ─────────────────────────────────────────────
  function getIncome() {
    return parseFloat(document.getElementById("incomeInput").value) || 0;
  }
  
  function updateIncomeBanner() {
    const v = getIncome();
    document.getElementById("incomeBannerValue").textContent = v ? `$${v}/wk` : "$--";
  }
  
  // ─────────────────────────────────────────────
  // Add a category card
  // ─────────────────────────────────────────────
  function addExpenseCard(type, id, prefillValue) {
    const catalogue = type === "essential" ? ESSENTIAL_CATEGORIES : NONESSENTIAL_CATEGORIES;
    const cat = catalogue.find(c => c.id === id);
    if (!cat) return;
  
    const activeArr = type === "essential" ? activeEssentials : activeNonessentials;
    if (activeArr.includes(id)) return; // already shown
  
    activeArr.push(id);
  
    const container = document.getElementById(type === "essential" ? "essentialCards" : "nonessentialCards");
    const val = prefillValue !== undefined ? prefillValue : cat.default;
  
    const card = document.createElement("div");
    card.className = `expense-card ${type === "essential" ? "essential-card" : "nonessential-card"}`;
    card.dataset.id   = id;
    card.dataset.type = type;
  
    card.innerHTML = `
      <div class="expense-icon">${cat.icon}</div>
      <div class="expense-info">
        <p class="expense-name">${cat.name}</p>
        <p class="expense-hint">${cat.hint}</p>
      </div>
      <div class="expense-input-wrap">
        <span class="expense-prefix">$</span>
        <input
          class="expense-input"
          type="number"
          min="0"
          step="1"
          value="${val || ""}"
          placeholder="0"
          aria-label="${cat.name} weekly amount"
          data-id="${id}"
          data-type="${type}"
        />
        <span class="expense-suffix">/wk</span>
      </div>
      <button class="remove-btn" aria-label="Remove ${cat.name}">✕</button>
    `;
  
    // Listeners on this card
    card.querySelector(".expense-input").addEventListener("input", updateTotals);
    card.querySelector(".remove-btn").addEventListener("click", () => removeCard(card, id, type));
  
    container.appendChild(card);
    rebuildDropdowns();
    updateTotals();
  }
  
  // ─────────────────────────────────────────────
  // Remove a card
  // ─────────────────────────────────────────────
  function removeCard(card, id, type) {
    const activeArr = type === "essential" ? activeEssentials : activeNonessentials;
    const idx = activeArr.indexOf(id);
    if (idx > -1) activeArr.splice(idx, 1);
    card.remove();
    rebuildDropdowns();
    updateTotals();
  }
  
  // ─────────────────────────────────────────────
  // Rebuild dropdowns — only show unselected categories
  // ─────────────────────────────────────────────
  function rebuildDropdowns() {
    const essentialDrop    = document.getElementById("essentialDropdown");
    const nonessentialDrop = document.getElementById("nonessentialDropdown");
  
    const availableEssentials    = ESSENTIAL_CATEGORIES.filter(c => !activeEssentials.includes(c.id));
    const availableNonessentials = NONESSENTIAL_CATEGORIES.filter(c => !activeNonessentials.includes(c.id));
  
    essentialDrop.innerHTML = `<option value="">+ Add an essential expense…</option>` +
      availableEssentials.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("");
  
    nonessentialDrop.innerHTML = `<option value="">+ Add a non-essential expense…</option>` +
      availableNonessentials.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("");
  
    // Hide add row if no more options
    document.getElementById("addEssentialRow").style.display    = availableEssentials.length    ? "flex" : "none";
    document.getElementById("addNonEssentialRow").style.display = availableNonessentials.length ? "flex" : "none";
  }
  
  // ─────────────────────────────────────────────
  // Add from dropdown button
  // ─────────────────────────────────────────────
  function addFromDropdown(type) {
    const dropId = type === "essential" ? "essentialDropdown" : "nonessentialDropdown";
    const sel    = document.getElementById(dropId);
    const id     = sel.value;
    if (!id) return;
    addExpenseCard(type, id);
    sel.value = "";
  }
  
  // ─────────────────────────────────────────────
  // Calculate totals from all visible inputs
  // ─────────────────────────────────────────────
  function getTotals() {
    let essential    = 0;
    let nonessential = 0;
  
    document.querySelectorAll(".expense-input").forEach(inp => {
      const val = parseFloat(inp.value) || 0;
      if (inp.dataset.type === "essential")    essential    += val;
      else                                     nonessential += val;
    });
  
    const income  = getIncome();
    const total   = essential + nonessential;
    const surplus = income - total;
  
    return { essential, nonessential, total, surplus, income };
  }
  
  function updateTotals() {
    const { essential, nonessential, total, surplus } = getTotals();
  
    document.getElementById("totalEssential").textContent    = `$${Math.round(essential)}`;
    document.getElementById("totalNonessential").textContent = `$${Math.round(nonessential)}`;
    document.getElementById("totalAll").textContent          = `$${Math.round(total)}`;
  
    const surplusEl = document.getElementById("totalSurplus");
    surplusEl.textContent  = surplus >= 0 ? `+$${Math.round(surplus)}` : `-$${Math.round(Math.abs(surplus))}`;
    surplusEl.className    = "total-value " + (surplus >= 0 ? "surplus-color" : "deficit-color");
  }
  
  // ─────────────────────────────────────────────
  // Show results
  // ─────────────────────────────────────────────
  function showResults() {
    const { essential, nonessential, total, surplus, income } = getTotals();
  
    if (income === 0) { alert("Please enter your weekly income first."); return; }
  
    // Build donut data - one segment per active card with a value > 0
    const donutLabels  = [];
    const donutValues  = [];
    const donutColors  = [];
  
    const essentialPalette    = ["#2d8a4e","#4aab6d","#6dc98a","#94d9a8","#b8e8c5","#d4f0dd"];
    const nonessentialPalette = ["#9b72cf","#b08ad8","#c4a3e0","#d7bde8","#e8d5f2","#f0e8f8"];
  
    let ei = 0, ni = 0;
    document.querySelectorAll(".expense-card").forEach(card => {
      const inp = card.querySelector(".expense-input");
      const val = parseFloat(inp?.value) || 0;
      if (val === 0) return;
  
      const type = card.dataset.type;
      const id   = card.dataset.id;
      const cat  = (type === "essential" ? ESSENTIAL_CATEGORIES : NONESSENTIAL_CATEGORIES).find(c => c.id === id);
      if (!cat) return;
  
      donutLabels.push(cat.name);
      donutValues.push(val);
  
      if (type === "essential") {
        donutColors.push(essentialPalette[ei % essentialPalette.length]);
        ei++;
      } else {
        donutColors.push(nonessentialPalette[ni % nonessentialPalette.length]);
        ni++;
      }
    });
  
    // Render donut
    renderDonut(donutLabels, donutValues, donutColors, total);
  
    // Position summary
    const rentCard = document.querySelector('.expense-card[data-id="rent"] .expense-input');
    const rentVal  = parseFloat(rentCard?.value) || 0;
    const rentPct  = income > 0 ? (rentVal / income) * 100 : 0;
  
    document.getElementById("posIncome").textContent      = `$${Math.round(income)}/wk`;
    document.getElementById("posEssential").textContent   = `-$${Math.round(essential)}/wk`;
    document.getElementById("posNonessential").textContent= `-$${Math.round(nonessential)}/wk`;
  
    const surplusEl = document.getElementById("posSurplus");
    surplusEl.textContent = surplus >= 0 ? `+$${Math.round(surplus)}/wk` : `-$${Math.round(Math.abs(surplus))}/wk`;
    surplusEl.style.color = surplus >= 0 ? "#2d8a4e" : "#c0392b";
  
    // Rent stress classification (Planning and Environment Act 1987 Vic)
    if (rentVal > 0) {
      document.getElementById("posRentPct").textContent = `${rentPct.toFixed(1)}%`;
      let stressLabel, stressColor;
      if (rentPct <= 25)       { stressLabel = "✅ Stable";      stressColor = "#2d8a4e"; }
      else if (rentPct <= 30)  { stressLabel = "⚠️ Vulnerable";  stressColor = "#b8860b"; }
      else                     { stressLabel = "🔴 At Risk";     stressColor = "#c0392b"; }
      const statusEl = document.getElementById("posStressStatus");
      statusEl.textContent = stressLabel;
      statusEl.style.color = stressColor;
    } else {
      document.getElementById("posRentPct").textContent    = "No rent entered";
      document.getElementById("posStressStatus").textContent = "—";
    }
  
    // Verdict
    renderVerdict(surplus, income, nonessential, rentPct, rentVal);
  
    // Epic cross-links
    renderEpicLinks(surplus, income, nonessential, rentPct);
  
    // Persist spending data so the forecast page can pull it
    try {
      const items = [];
      document.querySelectorAll(".expense-card").forEach(card => {
        const inp = card.querySelector(".expense-input");
        const val = parseFloat(inp?.value) || 0;
        if (!val) return;
        const type = card.dataset.type;
        const id   = card.dataset.id;
        const cat  = (type === "essential" ? ESSENTIAL_CATEGORIES : NONESSENTIAL_CATEGORIES).find(c => c.id === id);
        if (cat) items.push({ id, name: cat.name, value: val, type });
      });
      sessionStorage.setItem("hermapSpendingData", JSON.stringify({ items, income, savedAt: Date.now() }));
    } catch(e) {}

    // Show results
    const section = document.getElementById("resultsSection");
    section.classList.add("visible");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  
  // ─────────────────────────────────────────────
  // Donut chart
  // ─────────────────────────────────────────────
  function renderDonut(labels, values, colors, total) {
    if (donutChart) { donutChart.destroy(); donutChart = null; }
  
    document.getElementById("donutCenterVal").textContent = `$${Math.round(total)}/wk`;
  
    const ctx = document.getElementById("spendingDonut").getContext("2d");
    donutChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "68%",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => {
                const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                return ` $${Math.round(ctx.raw)}/wk  (${pct}%)`;
              }
            }
          }
        }
      }
    });

    const legendEl = document.getElementById("spendingLegend");
    legendEl.innerHTML = labels.map((label, i) => `
      <div class="chart-legend-item">
        <span class="chart-legend-dot" style="background:${colors[i]}"></span>
        <span>${label}</span>
      </div>
    `).join("");
  }

  // ─────────────────────────────────────────────
  // Verdict card
  // ─────────────────────────────────────────────
  function renderVerdict(surplus, income, nonessential, rentPct, rentVal) {
    const card  = document.getElementById("verdictCard");
    const icon  = document.getElementById("verdictIcon");
    const title = document.getElementById("verdictTitle");
    const body  = document.getElementById("verdictBody");
  
    card.className = "verdict-card";
  
    if (surplus > 50) {
      card.classList.add("surplus");
      icon.textContent  = "✅";
      title.textContent = `You have $${Math.round(surplus)}/wk left over`;
      body.textContent  = `Your spending is within your income. ${rentPct > 30 ? `However, rent is ${rentPct.toFixed(0)}% of your income — above the 30% stress threshold. ` : ""}Non-essential spending is $${Math.round(nonessential)}/wk. Cutting even $30/wk from non-essentials adds $1,560 to your savings over a year.`;
    } else if (surplus >= 0) {
      card.classList.add("tight");
      icon.textContent  = "⚠️";
      title.textContent = "You are just breaking even";
      body.textContent  = `Only $${Math.round(surplus)}/wk left over means one unexpected bill — a medical visit, a phone repair — could put you in the red. Your non-essential spending of $${Math.round(nonessential)}/wk is where you have flexibility.`;
    } else {
      card.classList.add("deficit");
      icon.textContent  = "🔴";
      title.textContent = `You are $${Math.round(Math.abs(surplus))}/wk over your income`;
      const shortfall3m = Math.round(Math.abs(surplus) * 13);
      body.textContent  = `At this rate, your shortfall becomes approximately $${shortfall3m.toLocaleString()} over 3 months. Your non-essential spending of $${Math.round(nonessential)}/wk is driving most of this gap — reducing it is the fastest lever you have right now.`;
    }
  }
  
  // ─────────────────────────────────────────────
  // Epic cross-links — contextual based on situation
  // ─────────────────────────────────────────────
  function renderEpicLinks(surplus, income, nonessential, rentPct) {
    const container = document.getElementById("epicLinks");
    const links     = [];
  
    // Always show forecast if she has rent
    const rentCard = document.querySelector('.expense-card[data-id="rent"] .expense-input');
    if (rentCard && parseFloat(rentCard.value) > 0) {
      links.push({
        href: "/forecast",
        icon: "📈",
        title: "See my 12-month independence forecast",
        desc:  "Find out if you can sustain moving out — including bond timeline and hidden costs.",
      });
    }
  
    // If rent is high or no rent, suggest exploring cheaper areas
    if (rentPct > 30 || !rentCard) {
      links.push({
        href: "/rent_comparison",
        icon: "🗺️",
        title: "Explore more affordable areas",
        desc:  rentPct > 30
          ? `Rent is ${rentPct.toFixed(0)}% of your income. See suburbs where rent fits your budget.`
          : "Compare rent across Victorian LGAs to find your affordable range.",
      });
    }
  
    // If in deficit or high non-essentials, link to budgeting
    if (surplus < 0 || nonessential > income * 0.20) {
      links.push({
        href: "/dashboard",  // Epic 8 budgeting tile — update to direct URL when built
        icon: "💡",
        title: "Learn simple budgeting strategies",
        desc:  "The 50/30/20 rule and envelope method — pick one that works for your lifestyle.",
      });
    }
  
    // If in deficit, link to credit awareness
    if (surplus < 0) {
      links.push({
        href: "/dashboard",  // Epic 6 — update to direct URL when built
        icon: "💳",
        title: "Understand credit and BNPL risk",
        desc:  "Before using a credit card or Afterpay to cover a shortfall, see what it actually costs.",
      });
    }
  
    // Always show income comparison
    links.push({
      href: "/income_comparison",
      icon: "📊",
      title: "See how your income compares",
      desc:  "Explore what women in different industries and areas typically earn.",
    });
  
    container.innerHTML = links.map(l => `
      <a href="${l.href}" class="epic-link-card">
        <div class="epic-link-icon">${l.icon}</div>
        <div class="epic-link-text">
          <h4>${l.title}</h4>
          <p>${l.desc}</p>
        </div>
      </a>
    `).join("");
  }
  