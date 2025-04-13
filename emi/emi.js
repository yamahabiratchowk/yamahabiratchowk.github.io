// Elements
const loanAmountInput = document.getElementById('loanAmount');
const loanAmountRange = document.getElementById('loanAmountRange');
const interestRateInput = document.getElementById('interestRate');
const interestRateRange = document.getElementById('interestRateRange');
const loanTenureInput = document.getElementById('loanTenure');
const tenureTypeSelect = document.getElementById('tenureType');
const calculateBtn = document.getElementById('calculateBtn');
const emiValue = document.getElementById('emiValue');
const totalInterest = document.getElementById('totalInterest');
const totalPayment = document.getElementById('totalPayment');
const viewScheduleBtn = document.getElementById('viewScheduleBtn');
const amortizationTable = document.getElementById('amortizationTable');
const scheduleBody = document.getElementById('scheduleBody');

// Sync range inputs with number inputs
loanAmountRange.addEventListener('input', () => {
    loanAmountInput.value = loanAmountRange.value;
    calculateEMI();
});

loanAmountInput.addEventListener('input', () => {
    loanAmountRange.value = loanAmountInput.value;
    calculateEMI();
});

interestRateRange.addEventListener('input', () => {
    interestRateInput.value = interestRateRange.value;
    calculateEMI();
});

interestRateInput.addEventListener('input', () => {
    interestRateRange.value = interestRateInput.value;
    calculateEMI();
});

loanTenureInput.addEventListener('input', calculateEMI);
tenureTypeSelect.addEventListener('change', calculateEMI);
calculateBtn.addEventListener('click', calculateEMI);

viewScheduleBtn.addEventListener('click', () => {
    if (amortizationTable.classList.contains('hidden')) {
        amortizationTable.classList.remove('hidden');
        viewScheduleBtn.textContent = 'Hide Repayment Schedule';
        generateAmortizationSchedule();
    } else {
        amortizationTable.classList.add('hidden');
        viewScheduleBtn.textContent = 'View Repayment Schedule';
    }
});

// Format number as currency
function formatCurrency(number) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(number);
}

// Calculate EMI
function calculateEMI() {
    let principal = parseFloat(loanAmountInput.value);
    let interestRate = parseFloat(interestRateInput.value) / 100 / 12; // Monthly interest rate
    let tenure = parseInt(loanTenureInput.value);
    
    // Convert years to months if necessary
    if (tenureTypeSelect.value === 'years') {
        tenure = tenure * 12;
    }
    
    // EMI calculation formula: P * r * (1+r)^n / ((1+r)^n - 1)
    let emi;
    if (interestRate === 0) {
        emi = principal / tenure;
    } else {
        emi = principal * interestRate * Math.pow(1 + interestRate, tenure) / (Math.pow(1 + interestRate, tenure) - 1);
    }
    
    const totalAmount = emi * tenure;
    const interestAmount = totalAmount - principal;
    
    emiValue.textContent = formatCurrency(emi);
    totalInterest.textContent = formatCurrency(interestAmount);
    totalPayment.textContent = formatCurrency(totalAmount);
    
    // Generate schedule if visible
    if (!amortizationTable.classList.contains('hidden')) {
        generateAmortizationSchedule();
    }
}

// Generate amortization schedule
function generateAmortizationSchedule() {
    let principal = parseFloat(loanAmountInput.value);
    let interestRate = parseFloat(interestRateInput.value) / 100 / 12; // Monthly interest rate
    let tenure = parseInt(loanTenureInput.value);
    
    // Convert years to months if necessary
    if (tenureTypeSelect.value === 'years') {
        tenure = tenure * 12;
    }
    
    // Calculate EMI
    let emi;
    if (interestRate === 0) {
        emi = principal / tenure;
    } else {
        emi = principal * interestRate * Math.pow(1 + interestRate, tenure) / (Math.pow(1 + interestRate, tenure) - 1);
    }
    
    // Clear existing table
    scheduleBody.innerHTML = '';
    
    let balance = principal;
    let totalInterestPaid = 0;
    
    // Generate table rows
    for (let month = 1; month <= tenure; month++) {
        const interestForMonth = balance * interestRate;
        const principalForMonth = emi - interestForMonth;
        
        totalInterestPaid += interestForMonth;
        balance -= principalForMonth;
        
        if (balance < 1) balance = 0; // Fix for tiny decimal remainders
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month}</td>
            <td>${formatCurrency(emi)}</td>
            <td>${formatCurrency(principalForMonth)}</td>
            <td>${formatCurrency(interestForMonth)}</td>
            <td>${formatCurrency(balance)}</td>
        `;
        
        scheduleBody.appendChild(row);
        
        // For very long tables, show only first and last few months
        if (tenure > 120 && month === 12) {
            const skipRow = document.createElement('tr');
            skipRow.innerHTML = `<td colspan="5" style="text-align:center;">.... skipping to last year ....</td>`;
            scheduleBody.appendChild(skipRow);
            month = tenure - 12;
        }
    }
}

// Initialize
calculateEMI();