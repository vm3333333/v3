// static/js/filters.js

document.addEventListener('DOMContentLoaded', function() {
    // Example filter functionality
    document.getElementById('volatility-filter').addEventListener('input', function() {
        filterTable();
    });

    document.getElementById('performance-filter').addEventListener('input', function() {
        filterTable();
    });

    function filterTable() {
        // Logic to filter the fund table based on user inputs
    }
});
