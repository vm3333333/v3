document.addEventListener('DOMContentLoaded', function() {
    // Initial setup and data loading
    loadCSVData('/mnt/data/portfolio_data.csv');

    // Investment amount input handling
    const investmentSubmit = document.getElementById('investment-submit');
    investmentSubmit.addEventListener('click', handleInvestmentInput);

    // Filter submission handling
    const filterSubmit = document.getElementById('filter-submit');
    filterSubmit.addEventListener('click', applyFilters);
});

let fundData = [];
let displayedColumns = [];
let filterCriteria = {
    region: [],
    risk: [],
    management: [],
    avgReturn: { min: 0, max: 100 },
    volatility: { min: 0, max: 100 }
};

function loadCSVData(filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const parsedData = parseCSV(data);
            const validatedData = validateData(parsedData);
            fundData = validatedData;
            displayedColumns = Object.keys(validatedData[0]);
            populateTable(validatedData);
            generateColumnControls(displayedColumns);
            populateFilterOptions(validatedData);
        })
        .catch(error => {
            console.error('Error loading the CSV file:', error);
        });
}

function parseCSV(data) {
    const rows = data.split('\n');
    const headers = rows[0].split(',');
    const parsedData = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
    return parsedData;
}

function validateData(data) {
    const validatedData = data.map(row => {
        for (const key in row) {
            if (!row[key]) {
                if (isNaN(row[key])) {
                    row[key] = 'N/A';
                } else {
                    row[key] = calculateMean(data.map(item => parseFloat(item[key])).filter(value => !isNaN(value)));
                }
            }
        }
        return row;
    });
    return validatedData;
}

function calculateMean(numbers) {
    const sum = numbers.reduce((acc, value) => acc + value, 0);
    return (sum / numbers.length).toFixed(2);
}

function populateTable(data) {
    const table = document.getElementById('funds-table');
    table.innerHTML = '';

    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        if (displayedColumns.includes(header)) {
            const th = document.createElement('th');
            th.textContent = header;
            th.addEventListener('click', () => sortTableByColumn(header));
            headerRow.appendChild(th);
        }
    });
    table.appendChild(headerRow);

    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            if (displayedColumns.includes(header)) {
                const td = document.createElement('td');
                td.textContent = row[header];
                tr.appendChild(td);
            }
        });
        table.appendChild(tr);
    });
}

function sortTableByColumn(column) {
    fundData.sort((a, b) => a[column] > b[column] ? 1 : -1);
    populateTable(fundData);
}

function generateColumnControls(columns) {
    const columnControls = document.getElementById('column-controls');
    columnControls.innerHTML = '';

    columns.forEach(column => {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'column-checkbox';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.id = `column-${column}`;
        checkbox.addEventListener('change', () => toggleColumn(column));

        const label = document.createElement('label');
        label.htmlFor = `column-${column}`;
        label.textContent = column;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        columnControls.appendChild(checkboxContainer);
    });
}

function toggleColumn(column) {
    if (displayedColumns.includes(column)) {
        displayedColumns = displayedColumns.filter(col => col !== column);
    } else {
        displayedColumns.push(column);
    }
    populateTable(fundData);
}

function handleInvestmentInput() {
    const investmentInput = document.getElementById('investment-input').value;
    const investmentAmount = parseFloat(investmentInput);
    
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
        alert('Please enter a valid investment amount.');
        return;
    }

    console.log('Investment Amount:', investmentAmount);
    // Further processing with the investment amount will be implemented later
}

function populateFilterOptions(data) {
    const regionFilter = document.getElementById('region-filter');
    const riskFilter = document.getElementById('risk-filter');
    const managementFilter = document.getElementById('management-filter');

    const regions = new Set(data.map(item => item.Region));
    const risks = new Set(data.map(item => item.Risk));
    const managements = new Set(data.map(item => item.Management));

    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionFilter.appendChild(option);
    });

    risks.forEach(risk => {
        const option = document.createElement('option');
        option.value = risk;
        option.textContent = risk;
        riskFilter.appendChild(option);
    });

    managements.forEach(management => {
        const option = document.createElement('option');
        option.value = management;
        option.textContent = management;
        managementFilter.appendChild(option);
    });

    // Setting default values for range filters
    document.getElementById('return-filter').min = 0;
    document.getElementById('return-filter').max = 100;
    document.getElementById('return-filter').value = 100;

    document.getElementById('volatility-filter').min = 0;
    document.getElementById('volatility-filter').max = 100;
    document.getElementById('volatility-filter').value = 100;
}

function applyFilters() {
    const selectedRegions = Array.from(document.getElementById('region-filter').selectedOptions).map(option => option.value);
    const selectedRisks = Array.from(document.getElementById('risk-filter').selectedOptions).map(option => option.value);
    const selectedManagements = Array.from(document.getElementById('management-filter').selectedOptions).map(option => option.value);
    const avgReturnMax = document.getElementById('return-filter').value;
    const volatilityMax = document.getElementById('volatility-filter').value;

    filterCriteria = {
        region: selectedRegions,
        risk: selectedRisks,
        management: selectedManagements,
        avgReturn: { min: 0, max: avgReturnMax },
        volatility: { min: 0, max: volatilityMax }
    };

    const filteredData = fundData.filter(fund => {
        const regionMatch = filterCriteria.region.length === 0 || filterCriteria.region.includes(fund.Region);
        const riskMatch = filterCriteria.risk.length === 0 || filterCriteria.risk.includes(fund.Risk);
        const managementMatch = filterCriteria.management.length === 0 || filterCriteria.management.includes(fund.Management);
        const avgReturnMatch = parseFloat(fund['Avg Return']) <= filterCriteria.avgReturn.max;
        const volatilityMatch = parseFloat(fund.Volatility) <= filterCriteria.volatility.max;

        return regionMatch && riskMatch && managementMatch && avgReturnMatch && volatilityMatch;
    });

    populateTable(filteredData);
}
