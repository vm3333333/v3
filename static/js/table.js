let shortlistedFunds = [];
let investmentAllocations = {};

function formatNumber(value) {
    return parseFloat(value).toFixed(2);
}

function formatPercentage(value) {
    return (parseFloat(value) * 100).toFixed(2) + '%';
}

function applyConditionalFormatting(td, value) {
    if (value >= 0) {
        td.classList.add('high-performance');
    } else {
        td.classList.add('low-performance');
    }
}

function populateTable(data) {
    const table = document.getElementById('fund-table');
    table.innerHTML = '';  // Clear any existing content

    const headers = ['Select', 'Fund Name', 'Region', 'Risk Level', 'Management Type', 'Number of Assets', 'Ongoing Charge (OCF)', 
                     'May 2019 - Apr 2020', 'May 2020 - Apr 2021', 'May 2021 - Apr 2022', 
                     'May 2022 - Apr 2023', 'May 2023 - Apr 2024', 'Performance Average', 'Overall Volatility'];

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

    // Log the headers
    console.log('Table headers added:', headers);

    // Create table body
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        
        // Add checkbox for selection
        const tdSelect = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function() {
            handleSelection(row, this.checked);
        });
        tdSelect.appendChild(checkbox);
        tr.appendChild(tdSelect);

        headers.slice(1).forEach(header => {
            const td = document.createElement('td');
            let cellValue = row[header];
            if (typeof cellValue === 'number') {
                if (header === 'Ongoing Charge (OCF)') {
                    td.textContent = formatPercentage(cellValue);
                } else if (header.includes('Performance') || header.includes('Volatility')) {
                    td.textContent = formatPercentage(cellValue);
                    applyConditionalFormatting(td, cellValue);
                } else {
                    td.textContent = formatNumber(cellValue);
                }
            } else {
                td.textContent = cellValue;
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Log the table body
    console.log('Table body populated with data:', data);
}

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
            let cellValue = row[header];
            if (typeof cellValue === 'number') {
                if (header.includes('Performance') || header.includes('Volatility')) {
                    td.textContent = formatPercentage(cellValue);
                    applyConditionalFormatting(td, cellValue);
                } else {
                    td.textContent = formatNumber(cellValue);
                }
            } else {
                td.textContent = cellValue;
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
