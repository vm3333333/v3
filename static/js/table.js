document.addEventListener('DOMContentLoaded', function() {

    // Get references to the tables and filter elements (now inside DOMContentLoaded)
    const fundTable = document.getElementById('fund-table');
    const filterVolatility = document.getElementById('filter-volatility');
    const filterPerformance = document.getElementById('filter-performance');
    const filterFavorite = document.getElementById('filter-favorite');
    const paginationContainer = document.querySelector('.pagination');

    // Initialize data and pagination (now inside DOMContentLoaded)
    let df;
    let rowsPerPage = 10; // Default value
    let currentPage = 1;
    
    // Load and initialize the dashboard (now inside DOMContentLoaded)
    fetch('/')
        .then(response => response.json())
        .then(data => {
            df = data.data;
            setupPagination(df.length); // Set up pagination
            updateFundTable(df); // Initialize table
        });
    

    // Table Functions
    function updateFundTable(data) {
        // ... (Code for rendering the fund table, adding favorite stars, checkboxes, and delete buttons)
    }

    // Pagination Functions
    function setupPagination(totalRows) {
        // ... (Code for creating pagination buttons and Previous/Next buttons)
    }

    function updatePaginationButtons() {
        // ... (Code for updating active page button style and Previous/Next button states)
    }
    
    // Favorite Functionality
    function toggleFavorite(fundId) {
        // ... (Code for toggling favorite status and updating tables)
    }

    // Delete Fund Function
    function deleteFund(fundId) {
        // ... (Code to send delete request to backend and update tables)
    }

    // Event Listeners for Table
    fundTable.addEventListener('change', (event) => {
        if (event.target.classList.contains('select-fund')) {
            const fundId = parseInt(event.target.closest('tr').dataset.fundId);
            if (event.target.checked) {
                addToShortlist(fundId);
            } else {
                removeFromShortlist(fundId);
            }
        }
    });

    fundTable.addEventListener('click', (event) => {
        if (event.target.classList.contains('favorite-star')) {
            const fundId = parseInt(event.target.closest('tr').dataset.fundId);
            toggleFavorite(fundId);
        } else if (event.target.classList.contains('delete-button')) {
            const fundId = parseInt(event.target.dataset.fundId);
            if (confirm('Are you sure you want to delete this fund?')) {
                deleteFund(fundId);
            }
        }
    });

    // Filter and Sort Data (This should be in table.js since it affects the table directly)
    function filterAndSortData() { 
        // ... (code from previous steps) 
    }

    // Event listeners for filters (now inside DOMContentLoaded)
    filterVolatility.addEventListener('input', filterAndSortData);
    filterPerformance.addEventListener('input', filterAndSortData);
    filterFavorite.addEventListener('change', filterAndSortData);

    document.getElementById('reset-filters').addEventListener('click', () => {
        filterVolatility.value = 0;
        filterPerformance.value = -100;
        filterFavorite.checked = false;
        rowsPerPage = parseInt(document.getElementById('rows-per-page').value);
        filterAndSortData(); // Refresh the table with default filters
    });

    // Rows per Page Change
    document.getElementById('rows-per-page').addEventListener('change', (event) => {
        rowsPerPage = parseInt(event.target.value);
        currentPage = 1; // Reset to first page when rowsPerPage changes
        setupPagination(df.length); // Re-setup pagination
        updateFundTable(df);       // Refresh the table
    });
    
    // Event Listeners for Pagination
    paginationContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const newPage = parseInt(event.target.textContent);
            if (!isNaN(newPage)) {
                currentPage = newPage;
                updateFundTable(df);
            } else if (event.target.textContent === 'Previous' && currentPage > 1) {
                currentPage--;
                updateFundTable(df);
            } else if (event.target.textContent === 'Next' && currentPage < Math.ceil(df.length / rowsPerPage)) {
                currentPage++;
                updateFundTable(df);
            }
        }
    });    

});
