// --- US 6.1: Read sessionStorage anf populate sidebar stats ---

const awareness = JSON.parse(sessionStorage.getItem('debtAwareness') || '{}');

// Credit type from debt awareness quiz
const creditType = awareness.creditType || 'credit';
const typeLabels = {
    credit: 'Credit Card',
    bnpl: 'BNPL',
    both: 'Credit Card & BNPL',
    considering: 'Considering Credit or BNPL'
};

// Populate sidebar stat
document.getElementById('statCreditType').textContent = typeLabels[creditType] || creditType;

// Log to console for debugging
console.log('US 6.1 loaded:', { creditType });


// --- US 6.3 AC 1: Chart formulas and initalisation ---

const CC_RATE = 0.20 / 12;
const DEFAULT_OPENING = 150;
const DEFAULT_MONTHS = 12;

// State object - holds all dynamic values related to the chart and projection
let state = {
    scenario: awareness.creditType === 'bnpl' ? 'bnpl' : 'credit',
    opening: DEFAULT_OPENING,
    totalMonths: DEFAULT_MONTHS,
    currentStep: 0,
    totalSteps: DEFAULT_MONTHS,
    stepSize: 1,
    isComplete: false,
    chartInstance: null,
};

// Build monthly data for credit card scenario
// 20% p.a. compound interest on running balance
function buildCCData(opening, months) {
    const result = [];
    let balance = opening;
    for (let m = 1; m <= months; m++) {
        balance = balance * (1 + CC_RATE) + 0;
        result.push({
            base: opening,
            interest: Math.max(0, Math.round(balance - opening))
        });
    }
    return result;
}

// Build monthly data for BNPL scenario
const BNPL_MONTHLY_FEE = 17; // $10 + $7 two-tier Afterpay late fee structure

function buildBNPLData (opening, months) {
    const result = []; 
    let totalFees = 0;
    for (let m = 1; m <= months; m++) {
        totalFees += BNPL_MONTHLY_FEE;
        result.push({
            base: opening, // locked - never changes
            interest: totalFees // accumulates additively, no compounding
        });
    }
    return result;
}

// Build labels M1, M2, ... dynamically based on total months to ensure flexibility
function buildLabels(totalMonths) {
    const labels = [];
    for (let m = 1; m <= totalMonths; m++) labels.push(`M${m}`);
    return labels;
}

function roundUpTo25 (value) {
    return Math.ceil(value / 25) * 25;
}

function getStepSizeForMax (max) {
    if (max <= 250) return 25;
    if (max <= 1000) return 50;
    return 100;
}

function initChart() {
    if (state.chartInstance) {
        state.chartInstance.destroy();
        state.chartInstance = null;
    }

    state.currentStep = 1;
    state.isComplete = false;
    state.stepSize = 1;
    state.totalSteps = state.totalMonths;
    
    const allData = state.scenario === 'credit'
        ? buildCCData(state.opening, state.totalMonths)
        : buildBNPLData(state.opening, state.totalMonths);

    const m1Total = allData[0].base + allData[0].interest;
    const initialMax = roundUpTo25(m1Total);
    const initialStepSize = getStepSizeForMax(initialMax);
    
    const isCC = state.scenario === 'credit';
    const baseColor = 'rgba(155,114,207,0.95)';
    const topColor = 'rgba(232,84,106,0.95)';    
    const labels = buildLabels(state.totalMonths);
    
    // Start will all values at 0 to let the user control the reveal and fill the data
    const baseValues = new Array(state.totalMonths).fill(0);
    const interestValues = new Array(state.totalMonths).fill(0);

    const ctx = document.getElementById('debtChart').getContext('2d');

    state.chartInstance = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels,
            datasets: [
                {
                    label: 'Original Amount Owed',
                    data: baseValues,
                    backgroundColor: baseColor,
                    borderColor: 'white',
                    borderWidth: 1.5,
                },
                {
                    label: isCC ? 'Interest accrued' : 'Late fees accrued',
                    data: interestValues,
                    backgroundColor: topColor,
                    borderColor: 'white',
                    borderWidth: 1.5,
                }
            ],
            // Store full dataset for reveal to reference
            _allData: allData
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration:500, 
                easing: 'easeOutQuart'
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label(ctx) {
                            const month = allData[ctx.dataIndex];
                            if (!month) return '';
                            if (ctx.datasetIndex === 0) {
                                return `Original amount owed: $${month.base.toLocaleString()}`;
                            }
                            const total = month.base + month.interest;
                            return `Total now owed: $${total.toLocaleString()} ($${month.interest.toLocaleString()} accrued)`;
                        }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: initialMax,
                    ticks: {
                        callback: v => '$' + v.toLocaleString(),
                        font: { size: 11 },
                        stepSize: initialStepSize
                    },
                    grid: { color: 'rgba(0,0,0,0.06)'}
                }
            }
        }
    });

    // Reveal Month 1 so that the chart is not empty
    applyReveal();
    updateSidebar(1);
}

function applyReveal() {
    const allData = state.chartInstance.data._allData;
    const top = state.chartInstance.data.datasets[0].data; // inner -> original amount
    const base = state.chartInstance.data.datasets[1].data; // outer -> original + interest/fees amount

    let highestRevealed = 0;

    for (let i = 0; i < state.totalMonths; i++) {
        if (i < state.currentStep) {
            top[i] = allData[i].base;
            base[i] = allData[i].base + allData[i].interest;
            highestRevealed = Math.max(highestRevealed, base[i]);
        } else {
            top[i] = 0;
            base[i] = 0;
        }
    }

    const newMax = roundUpTo25(highestRevealed);
    const newStepSize = getStepSizeForMax(newMax);

    state.chartInstance.options.scales.r.max = newMax;
    state.chartInstance.options.scales.r.ticks.stepSize = newStepSize;
    state.chartInstance.update();
}

function updateSidebar(stepIndex) {
    const allData = state.chartInstance.data._allData;
    const monthIndex = Math.min(stepIndex * state.stepSize, state.totalMonths - 1);
    const month = allData[monthIndex];
    if (!month) return;
    const total = month.base + month.interest;
    document.getElementById('statCurrentTotal').textContent = `$${total.toLocaleString()}`;
}

// Boot the chart on page load
initChart();

// Log to console for debugging
console.log('US 6.3: Chart initialised', { 
    scenario: state.scenario, 
    opening: state.opening, 
    totalMonths: state.totalMonths 
});

// --- US 6.3 AC 2: Reveal Controls ---

function revealNext() {
    if (state.isComplete) return;
    state.currentStep++;
    applyReveal();
    updateSidebar(state.currentStep);
    if (state.currentStep >= state.totalSteps) {
        state.isComplete = true;
        onRevealComplete();
    }
    updateRevealUI();
}

function skipToEnd() {
    if (state.isComplete) return;

    const btn = document.getElementById('revealNextBtn');
    const skip = document.getElementById('skipToEndBtn');
    if (btn) btn.disabled = true;
    if (skip) skip.disabled = true;

    function revealStep() {
        if (state.currentStep >= state.totalSteps) {
            state.isComplete = true;
            onRevealComplete();
            updateRevealUI();
            return;
        }
        state.currentStep++;
        applyReveal();
        updateSidebar(state.currentStep);
        setTimeout(revealStep, 350);
    }
    revealStep();
}

function onRevealComplete() {
    document.getElementById('keyMessage').style.display = 'block';
    document.getElementById('ctaBox').style.display = 'block';
}

function updateRevealUI() {
    const btn = document.getElementById('revealNextBtn');
    const skip = document.getElementById('skipToEndBtn');
    if (!btn || !skip) return;

    btn.disabled = state.isComplete;
    skip.disabled = state.isComplete;
    btn.textContent = state.isComplete ? 'All Months Revealed' : `Reveal Month ${Math.min(state.currentStep + 1, state.totalMonths)}`;
}

// --- US 6.3 AC 3: Custom Legend ---

function buildLegend() {
    const legend = document.getElementById('chartLegend');
    if (!legend) return;
    const isCC = state.scenario === 'credit';
    const baseHex = 'rgba(155,114,207,0.95)';
    const topHex = 'rgba(232,84,106,0.95)';
    const feeLabel = isCC ? 'Interest accrued' : 'Late fees accrued';

    legend.innerHTML = `
        <span class="legend-item">
            <span class="legend-swatch" style="background:${baseHex};"></span>
            Original Amount Owed
        </span>
        <span class="legend-item">
            <span class="legend-swatch" style="background:${topHex};"></span>
            ${feeLabel}
        </span>
    `;
}


function updateSourceNote() {
    const ccNote = document.getElementById('sourceNoteCC');
    const bnplNote = document.getElementById('sourceNoteBNPL');
    if (!ccNote || !bnplNote) return;

    if (state.scenario === 'credit') {
        ccNote.style.display = 'block';
        bnplNote.style.display = 'none';
    } else {
        ccNote.style.display = 'none';
        bnplNote.style.display = 'block';
    }
}

// Boot legend and reveal UI
buildLegend();
updateRevealUI();
updateSourceNote();

// Log to console for debugging
console.log('US 6.3: Reveal controls and custom legend initialised');
