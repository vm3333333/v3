// static/js/init.js

document.addEventListener('DOMContentLoaded', function() {
    initializePage();

    function initializePage() {
        fetch('/api/data')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data);
                populateTable(data);
            })
            .catch(error => {
                console.error('Error fetching or parsing data:', error);
                alert('An error occurred while fetching data. Please check the console for more details.');
            });
    }

    function populateTable(data) {
        const tableBody = document.getElementById('fund-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        data.forEach(fund => {
            const row = document.createElement('tr');
            Object.keys(fund).forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = fund[key] !== null ? fund[key] : '-'; // Handle null values
                row.appendChild(cell);
            });
            const selectCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'select-fund';
            selectCell.appendChild(checkbox);
            row.appendChild(selectCell);

            tableBody.appendChild(row);
        });
    }
});
