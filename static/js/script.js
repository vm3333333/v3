document.addEventListener('DOMContentLoaded', function() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            populateTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));
});

function populateTable(data) {
    const table = document.getElementById('fund-table');
    const headers = ['Fund Name', 'Region', 'Risk Level', 'Management Type', 'Number of Assets', 'Ongoing Charge (OCF)', 
                     'Performance (May 2019 - Apr 2020)', 'Performance (May 2020 - Apr 2021)', 'Performance (May 2021 - Apr 2022)', 
                     'Performance (May 2022 - Apr 2023)', 'Performance (May 2023 - Apr 2024)', 'Performance Average', 'Overall Volatility'];

    const thead = document.createElement('thead');
    const tr = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = row[header];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}
