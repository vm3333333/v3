// static/js/table.js

document.addEventListener('DOMContentLoaded', function() {
    const fundTable = document.getElementById('fund-table');

    fundTable.addEventListener('change', function(event) {
        if (event.target.classList.contains('select-fund')) {
            updateRowStyle(event.target.closest('tr'));
        }
    });

    function updateRowStyle(row) {
        const performanceAverage = parseFloat(row.querySelector('td:nth-child(12)').textContent);
        if (performanceAverage > 0) {
            row.classList.add('high-performance');
            row.classList.remove('low-performance');
        } else {
            row.classList.add('low-performance');
            row.classList.remove('high-performance');
        }
    }

    // Initialize table styles
    const rows = fundTable.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    for (let row of rows) {
        updateRowStyle(row);
    }
});
