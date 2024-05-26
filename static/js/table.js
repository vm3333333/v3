function applyConditionalFormatting(cell, value) {
    if (value > 0) {
        cell.classList.add('high-performance');
    } else if (value < 0) {
        cell.classList.add('low-performance');
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
            if (typeof row[header] === 'number') {
                td.textContent = formatNumber(row[header]);
                applyConditionalFormatting(td, row[header]);
            } else {
                td.textContent = row[header];
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    // Log the table body
    console.log('Table body populated with data:', data);
}
