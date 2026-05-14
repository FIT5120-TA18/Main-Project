// --- US 6.1: Read sessionStorage anf populate sidebar stats ---

const awareness = JSON.parse(sessionStorage.getItem('debtAwareness') || '{}');
const spending = JSON.parse(sessionStorage.getItem('spendingData') || '{}');

// Guard: redirect if no spending data exists
if (!spending.weeklyIncome && !spending.totalExpenses) {
    window.location.href = "{{ url_for('main.spending_input') }}";
}

// Derive weekly deficit from spending data
const weeklyDeficit = Math.abs(
    parseFloat(spending.weeklyIncome || 0) - 
    parseFloat(spending.totalExpenses || 0)
);

// Opening balance = 13-week projected shortfall
const defaultOpening = weeklyDeficit > 0 ? Math.round(weeklyDeficit * 13) : 200;

// Credit type from debt awareness quiz
const creditType = awareness.creditType || 'credit';
const typeLabels = {
    credit: 'Credit Card',
    bnpl: 'BNPL',
    both: 'Credit Card & BNPL',
    considering: 'Considering Credit & BNPL'
};

// Populate sidebar stats
document.getElementById('statDeficit').textContent = `$${weeklyDeficit.toFixed(0)}/week`;
document.getElementById('statCreditType').textContent = typeLabels[creditType] || creditType;

// Log to console for debugging
console.log('US 6.1 loaded:', { weeklyDeficit, defaultOpening, creditType });
