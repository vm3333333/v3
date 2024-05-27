// Table Functions
function updateFundTable(data) {
    const tbody = fundTable.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const rowsToShow = data.slice(startIndex, endIndex);

    rowsToShow.forEach(fund => {
        const row = document.createElement('tr');
        row.dataset.fundId = fund.id;
        row.classList.add(fund['Performance Average'] > 0 ? 'high-performance' : fund['Performance Average'] < 0 ? 'low-performance' : '');

        // Cells for fund data
        for (const key in fund) {
            if (key !== 'id' && key !== 'favorite') {
                const cell = document.createElement('td');
                cell.textContent = fund[key];
                row.appendChild(cell);
            }
        }

        // Checkbox for shortlist
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('select-fund');
        checkbox.checked = shortlistedFunds.some(f => f.id === fund.id);
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                addToShortlist(fund.id);
            } else {
                removeFromShortlist(fund.id);
            }
        });
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);

        // Favorite star
        const favoriteCell = document.createElement('td');
        favoriteCell.classList.add('favorite-cell');
        const star = document.createElement('span');
        star.innerHTML = fund.favorite ? '&#9733;' : '&#9734;'; // Filled or empty star
        star.classList.add('favorite-star');
        star.onclick = () => toggleFavorite(fund.id);
        favoriteCell.appendChild(star);
        row.appendChild(favoriteCell);

        // Delete button
        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.dataset.fundId = fund.id;
        deleteButton.onclick = () => {
            if (confirm('Are you sure you want to delete this fund?')) {
                deleteFund(fund.id);
            }
        };
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        tbody.appendChild(row);
    });

    updatePaginationButtons();
}

// Pagination Functions
function setupPagination(totalRows) {
    const numPages = Math.ceil(totalRows / rowsPerPage);
    paginationContainer.innerHTML = '';

    // "Previous" button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        currentPage--;
        updateFundTable(df);
    });
    paginationContainer.appendChild(prevButton);

    // Page number buttons
    for (let i = 1; i <= numPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            updateFundTable(df);
        });
        paginationContainer.appendChild(button);
    }

    // "Next" button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === numPages;
    nextButton.addEventListener('click', () => {
        currentPage++;
        updateFundTable(df);
    });
    paginationContainer.appendChild(nextButton);

    updatePaginationButtons();
}

function updatePaginationButtons() {
    const buttons = paginationContainer.querySelectorAll('button');
    buttons.forEach(button => button.classList.remove('active'));
    buttons[currentPage].classList.add('active');

    const prevButton = paginationContainer.querySelector('button:first-child');
    const nextButton = paginationContainer.querySelector('button:last-child');
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === Math.ceil(df.length / rowsPerPage);
}


// Favorite Functionality
function toggleFavorite(fundId) {
    const fundIndex = df.findIndex(f => f.id === fundId);
    const newFavoriteStatus = !df[fundIndex].favorite;

    // Send update to backend
    fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fundId, favorite: newFavoriteStatus })
    })
    .then(response => response.json())
    .then(data => {
        df = data.data;
        updateFundTable(df);
        updateShortlist();
    });
}

// Delete Fund Function
function deleteFund(fundId) {
    // Send delete request to backend
    fetch('/update', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fundId })
    })
    .then(response => response.json())
    .then(data => {
        df = data.data;
        updateFundTable(df);
        updateShortlist(); 
    });
}


// Filter and Sort Data (This should be in table.js since it affects the table directly)
function filterAndSortData() {
    const volatility = parseFloat(filterVolatility.value);
    const performance = parseFloat(filterPerformance.value);
    const showFavorites = filterFavorite.checked;

    const queryParams = new URLSearchParams({
        volatility: isNaN(volatility) ? '' : volatility,
        performance: isNaN(performance) ? '' : performance,
        favorites: showFavorites,
    });

    fetch(`/?${queryParams.toString()}`)
        .then(response => response.json())
        .then(data => {
            df = data.data;
            currentPage = 1; // Reset to first page when filtering/sorting
            setupPagination(df.length);
            updateFundTable(df);
        });
}

// Event listeners for filters
filterVolatility.addEventListener('input', filterAndSortData);
filterPerformance.addEventListener('input', filterAndSortData);
filterFavorite.addEventListener('change', filterAndSortData); // New: Favorite filter event listener
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


// Initialize the table and fetch initial data
let df;
fetch('/')
    .then(response => response.json())
    .then(data => {
        df = data.data;
        setupPagination(df.length); // Set up pagination
        updateFundTable(df);       // Initialize table
    });

