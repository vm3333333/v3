// Initialize shortlist
let shortlistedFunds = [];

// Shortlist Functions
function updateShortlist() {
    const shortlistTableBody = shortlistTable.querySelector('tbody');
    shortlistTableBody.innerHTML = ''; // Clear existing rows

    const totalInvestment = shortlistedFunds.reduce((sum, fund) => sum + (fund.investmentPercentage || 0), 0); // Calculate total investment

    for (const fund of shortlistedFunds) {
        const row = fundTable.querySelector(`tr[data-fund-id="${fund.id}"]`);
        if (row) {
            const newRow = row.cloneNode(true);
            newRow.querySelector('.select-fund').remove(); // Remove the checkbox in the shortlist table
            const favoriteCell = newRow.querySelector('.favorite-cell');
            favoriteCell.innerHTML = ''; // remove the favorite icon

            // Add remove button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removeFromShortlist(fund.id);
            newRow.insertCell().appendChild(removeButton); // Add remove button to a new cell

            // Add input for investment percentage (with validation)
            const inputCell = newRow.insertCell();
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.max = '100';
            input.step = '0.01';
            input.value = fund.investmentPercentage || 0; // Use existing percentage or 0
            input.classList.add('investment-input'); // Add class for styling and event handling
            input.addEventListener('input', (event) => {
                const newPercentage = parseFloat(event.target.value);
                if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100) {
                    event.target.value = fund.investmentPercentage; // Reset to previous valid value
                    return;
                }
                updateInvestment(fund.id, newPercentage);
            });
            inputCell.appendChild(input);

            // Add equivalent sum cell
            const equivalentSumCell = newRow.insertCell();
            const equivalentSum = calculateEquivalentSum(totalInvestment, fund.investmentPercentage);
            equivalentSumCell.textContent = equivalentSum.toFixed(2);

            shortlistTableBody.appendChild(newRow);
        }
    }

    // Update the total investment percentage in the shortlist
    updateTotalInvestment();
}

function addToShortlist(fundId) {
    const fund = df.find(f => f.id === fundId); 
    if (fund && !shortlistedFunds.some(f => f.id === fundId)) {
        shortlistedFunds.push({ ...fund, investmentPercentage: 0 }); 
        updateShortlist();
    }
}

function removeFromShortlist(fundId) {
    shortlistedFunds = shortlistedFunds.filter(fund => fund.id !== fundId);
    updateShortlist();
    // Uncheck the checkbox in the main table
    const checkbox = fundTable.querySelector(`tr[data-fund-id="${fundId}"] .select-fund`);
    if (checkbox) {
        checkbox.checked = false;
    }
}

// Investment Percentage Update
function updateInvestment(fundId, newPercentage) {
    if (newPercentage > 100) {
        newPercentage = 100; 
    } else if (newPercentage < 0) {
        newPercentage = 0; 
    }
    
    const fundIndex = shortlistedFunds.findIndex(fund => fund.id === fundId);
    const originalPercentage = shortlistedFunds[fundIndex].investmentPercentage;
    shortlistedFunds[fundIndex].investmentPercentage = newPercentage;

    // Adjust other percentages proportionally (only if total exceeds 100%)
    const totalPercentage = shortlistedFunds.reduce((sum, fund) => sum + fund.investmentPercentage, 0);
    if (totalPercentage > 100) {
        const excessPercentage = totalPercentage - 100;
        const adjustmentPerFund = excessPercentage / (shortlistedFunds.length - 1); // Exclude the changed fund
        shortlistedFunds.forEach(fund => {
            if (fund.id !== fundId) {
                fund.investmentPercentage = Math.max(0, fund.investmentPercentage - adjustmentPerFund); 
            }
        });
    }

    updateShortlist();
}

// Update Total Investment in Shortlist
function updateTotalInvestment() {
    const totalInvestment = shortlistedFunds.reduce((sum, fund) => sum + (fund.investmentPercentage || 0), 0);
    document.getElementById('total-investment').textContent = totalInvestment.toFixed(2);
}

// Calculate Equivalent Sum
function calculateEquivalentSum(totalInvestment, investmentPercentage) {
    return (totalInvestment * investmentPercentage) / 100;
}
