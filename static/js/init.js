document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayData(data); // Call the displayData function here
        })
        .catch(error => console.error('Error fetching or parsing data:', error));

    function displayData(data) {
        const tableBody = document.getElementById('table-body');
        data.forEach(item => {
            const row = document.createElement('tr');

            // Add table cells with data
            Object.keys(item).forEach(key => {
                const cell = document.createElement('td');
                cell.textContent = item[key] !== null ? item[key] : 'N/A'; // Handle null values
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    }
});
