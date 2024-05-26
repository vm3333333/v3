// static/js/shortlist.js

document.addEventListener('DOMContentLoaded', function() {
    const fundTable = document.getElementById('fund-table');
    
    fundTable.addEventListener('change', function(event) {
        if (event.target.classList.contains('select-fund')) {
            updateShortlist();
        }
    });

    function updateShortlist() {
        const selectedFunds = [];
        const rows = fundTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        
        for (let row of rows) {
            const checkbox = row.querySelector('.select-fund');
            if (checkbox && checkbox.checked) {
                const fundData = {};
                const cells = row.getElementsByTagName('td');
                fundData['Fund Name'] = cells[0].textContent;
                fundData['Region'] = cells[1].textContent;
                fundData['Risk Level'] = cells[2].textContent;
                fundData['Management Type'] = cells[3].textContent;
                fundData['Number of Assets'] = cells[4].textContent;
                fundData['Ongoing Charge (OCF)'] = cells[5].textContent;
                fundData['Performance (May 2019 - Apr 2020)'] = cells[6].textContent;
                fundData['Performance (May 2020 - Apr 2021)'] = cells[7].textContent;
                fundData['Performance (May 2021 - Apr 2022)'] = cells[8].textContent;
                fundData['Performance (May 2022 - Apr 2023)'] = cells[9].textContent;
                fundData['Performance (May 2023 - Apr 2024)'] = cells[10].textContent;
                fundData['Performance Average'] = cells[11].textContent;
                fundData['Overall Volatility'] = cells[12].textContent;
                selectedFunds.push(fundData);
            }
        }

        populateShortlist(selectedFunds);
    }

    function populateShortlist(selectedFunds) {
        const shortlistSection = document.querySelector('.shortlist-section');
        shortlistSection.innerHTML = '<h2>Shortlisted Funds</h2>';
        
        if (selectedFunds.length === 0) {
            shortlistSection.innerHTML += '<p>No funds selected.</p>';
            return;
        }
        
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headerRow = document.createElement('tr');
        
        const headers = ['Fund Name', 'Region', 'Risk Level', 'Management Type', 'Number of Assets', 'Ongoing Charge (OCF)', 'Performance (May 2019 - Apr 2020)', 'Performance (May 2020 - Apr 2021)', 'Performance (May 2021 - Apr 2022)', 'Performance (May 2022 - Apr 2023)', 'Performance (May 2023 - Apr 2024)', 'Performance Average', 'Overall Volatility'];
        
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        selectedFunds.forEach(fund => {
            const row = document.createElement('tr');
            headers.forEach(header => {
                const cell = document.createElement('td');
                cell.textContent = fund[header];
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        shortlistSection.appendChild(table);
    }
});
