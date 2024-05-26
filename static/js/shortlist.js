function handleSelection(row, isSelected) {
    if (isSelected) {
        shortlistedFunds.push(row);
        investmentAllocations[row['Fund Name']] = 0;  // Initialize allocation to 0
    } else {
        shortlistedFunds = shortlistedFunds.filter(fund => fund['Fund Name'] !== row['Fund Name']);
        delete investmentAllocations[row['Fund Name']];
    }
    updateShortlistTable();
    updateTotalInvestment();
}

function updateShortlistTable() {
    const table = document.getElementById('shortlist-table');
    table.innerHTML = '';  // Clear any existing content

    const headers = ['Select', 'Fund Name', 'Region', 'Performance Average', 'Overall Volatility', 'Allocation (%)'];

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    shortlistedFunds.forEach(row => {
        const tr = document.createElement('tr');

        // Add checkbox for selection
        const tdSelect = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;  // Default to checked since it's in the shortlist
        checkbox.addEventListener('change', function() {
            handleSelection(row, this.checked);
        });
        tdSelect.appendChild(checkbox);
        tr.appendChild(tdSelect);

        headers.slice(1).forEach(header => {
            const td = document.createElement('td');
            if (typeof row[header] === 'number') {
                td.textContent = formatNumber(row[header]);
                applyConditionalFormatting(td, row[header]);
            } else {
                td.textContent = row[header];
            }
            tr.appendChild(td);
        });

        // Add input for allocation
        const tdAlloc = document.createElement('td');
        const inputAlloc = document.createElement('input');
        inputAlloc.type = 'number';
        inputAlloc.min = 0;
        inputAlloc.max = 100;
        inputAlloc.value = investmentAllocations[row['Fund Name']] || 0;
        inputAlloc.addEventListener('input', function() {
            investmentAllocations[row['Fund Name']] = parseFloat(this.value) || 0;
            updateTotalInvestment();
        });
        tdAlloc.appendChild(inputAlloc);
        tr.appendChild(tdAlloc);

        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Log the shortlisted funds
    console.log('Shortlisted funds updated:', shortlistedFunds);
}

function updateTotalInvestment() {
    const totalInvestment = Object.values(investmentAllocations).reduce((acc, val) => acc + val, 0);
    document.getElementById('total-investment').textContent = `Total Investment: ${formatNumber(totalInvestment)}%`;
    console.log('Total investment updated:', totalInvestment);
}
