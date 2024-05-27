// Get references to the tables and filter elements
const fundTable = document.getElementById('fund-table');
const shortlistTable = document.getElementById('shortlist');
const filterVolatility = document.getElementById('filter-volatility');
const filterPerformance = document.getElementById('filter-performance');
const filterFavorite = document.getElementById('filter-favorite'); // New: Favorite filter

// ... (get references for add fund modal and bulk update modal)

// Initialize shortlist (empty at start)
let shortlistedFunds = [];

// ... (Add Modal HTML here dynamically for both add and bulk update. See below)

// Filter and Sort Data
function filterAndSortData() {
    const volatilityFilter = parseFloat(filterVolatility.value);
    const performanceFilter = parseFloat(filterPerformance.value);
    const showFavorites = filterFavorite.checked; // New: Filter by favorites

    const filteredRows = Array.from(fundTable.querySelectorAll('tbody tr')).filter(row => {
        const volatility = parseFloat(row.cells[12].textContent); // Assuming volatility is in column 12
        const performance = parseFloat(row.cells[11].textContent); // Assuming performance is in column 11
        const isFavorite = row.classList.contains('favorite'); 

        return (
            (isNaN(volatilityFilter) || volatility >= volatilityFilter) &&
            (isNaN(performanceFilter) || performance >= performanceFilter) &&
            (!showFavorites || isFavorite) 
        );
    });

    // Update fund table with filtered rows (no sorting for now)
    updateFundTable(filteredRows);
}

// Update Fund Table
function updateFundTable(rows) {
    const tbody = fundTable.querySelector('tbody');
    tbody.innerHTML = ''; 
    rows.forEach(row => tbody.appendChild(row));
}

// Shortlist Functions
function updateShortlist() {
    // ... (Clear existing shortlist and add rows for shortlisted funds)
}

function addToShortlist(fundId) {
    // ... (Add fund to shortlistedFunds, update shortlist display, and mark as favorite)
}

function removeFromShortlist(fundId) {
    // ... (Remove fund from shortlistedFunds, update shortlist display, and unmark as favorite)
}


// Event listeners for filters
filterVolatility.addEventListener('input', filterAndSortData);
filterPerformance.addEventListener('input', filterAndSortData);
filterFavorite.addEventListener('change', filterAndSortData); // New: Favorite filter event listener

// ... (Event listeners for fund checkboxes, modal buttons, etc.)

// ... (previous code for filtering, sorting, shortlist functions)

// Add Fund Modal
function createAddFundModal() {
    const modalHtml = `
        <div class="modal-content">
            <span class="close-button" onclick="closeModal('add-fund-modal')">&times;</span>
            <h2>Add New Fund</h2>
            <form id="add-fund-form">
                <label for="fundName">Fund Name:</label><br>
                <input type="text" id="fundName" name="fundName" required><br>
                <label for="region">Region:</label><br>
                <input type="text" id="region" name="region" required><br>
                <label for="riskLevel">Risk Level:</label><br>
                <input type="text" id="riskLevel" name="riskLevel" required><br>
                <label for="managementType">Management Type:</label><br>
                <input type="text" id="managementType" name="managementType" required><br>
                <label for="numAssets">Number of Assets:</label><br>
                <input type="number" id="numAssets" name="numAssets" required><br>
                <label for="ocf">Ongoing Charge (OCF):</label><br>
                <input type="number" step="0.01" id="ocf" name="ocf" required><br>
                <label for="performance1">Performance (May 2019 - Apr 2020):</label><br>
                <input type="number" step="0.01" id="performance1" name="performance1" required><br>
                <label for="performance2">Performance (May 2020 - Apr 2021):</label><br>
                <input type="number" step="0.01" id="performance2" name="performance2" required><br>
                <label for="performance3">Performance (May 2021 - Apr 2022):</label><br>
                <input type="number" step="0.01" id="performance3" name="performance3" required><br>
                <label for="performance4">Performance (May 2022 - Apr 2023):</label><br>
                <input type="number" step="0.01" id="performance4" name="performance4" required><br>
                <label for="performance5">Performance (May 2023 - Apr 2024):</label><br>
                <input type="number" step="0.01" id="performance5" name="performance5" required><br>
                <input type="submit" value="Add Fund">
            </form>
        </div>
    `;

    document.getElementById('add-fund-modal').innerHTML = modalHtml;
}

// Bulk Update Modal
function createBulkUpdateModal() {
    // ... (Similar to createAddFundModal, but with a file input for CSV upload)
}

// Initialize Modals (call these functions on page load)
createAddFundModal();
createBulkUpdateModal();

// Close Modal Function
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// ... (Event listeners for opening modals, submitting forms, etc.)
// ... (previous code for filtering, sorting, shortlist functions, modal HTML)

// Form Submission for Add Fund Modal
document.getElementById('add-fund-form').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const newFundData = {
        "Fund Name": document.getElementById('fundName').value,
        "Region": document.getElementById('region').value,
        "Risk Level": document.getElementById('riskLevel').value,
        "Management Type": document.getElementById('managementType').value,
        "Number of Assets": parseInt(document.getElementById('numAssets').value),
        "Ongoing Charge (OCF)": parseFloat(document.getElementById('ocf').value),
        "Performance (May 2019 - Apr 2020)": parseFloat(document.getElementById('performance1').value),
        // ... (get values for other performance periods)
    };

    // Send the newFundData to the Flask backend using fetch or AJAX
    fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFundData)
    })
    .then(response => response.json())
    .then(data => {
        // Update the fund table with the new data from the backend
        df = data.data; // Assuming the backend returns the updated data
        updateFundTable(df); // Call the updateFundTable function to refresh the table

        // Close the modal
        closeModal('add-fund-modal');
    });
});

// Form Submission for Bulk Update Modal
document.getElementById('bulk-update-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('bulk-update-file');
    const file = fileInput.files[0];

    // Read the CSV file (using FileReader or a library like PapaParse)
    // ...

    // Process the CSV data and update the dataframe (df)
    // ...

    // Send the updated data to the Flask backend 
    // ... (similar to the fetch call in add-fund-form submission)

    // Update the fund table and close the modal
    // ...
});


// Open Modal Functions
function openAddFundModal() {
    document.getElementById('add-fund-modal').style.display = 'block';
}

function openBulkUpdateModal() {
    document.getElementById('bulk-update-modal').style.display = 'block';
}

// Close Modal Function (already defined)

// Event listeners for opening modals
document.getElementById('add-fund-button').addEventListener('click', openAddFundModal);
document.getElementById('bulk-update-button').addEventListener('click', openBulkUpdateModal);

// ... (previous code for filtering, sorting, shortlist functions, Add Fund modal HTML)

// Bulk Update Modal HTML
function createBulkUpdateModal() {
    const modalHtml = `
        <div class="modal-content">
            <span class="close-button" onclick="closeModal('bulk-update-modal')">&times;</span>
            <h2>Bulk Update Funds</h2>
            <form id="bulk-update-form">
                <label for="bulk-update-file">Select CSV file:</label><br>
                <input type="file" id="bulk-update-file" name="bulk-update-file" accept=".csv" required><br>
                <input type="submit" value="Update Funds">
            </form>
        </div>
    `;
    document.getElementById('bulk-update-modal').innerHTML = modalHtml;
}

// Form Submission for Bulk Update Modal
document.getElementById('bulk-update-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const fileInput = document.getElementById('bulk-update-file');
    const file = fileInput.files[0];

    // Use FileReader to read the CSV file
    const reader = new FileReader();
    reader.onload = function(e) {
        const csvData = e.target.result;
        const updatedData = processCSVData(csvData); // Process the CSV data (see next step)

        // Send the updatedData to the Flask backend (similar to addFund)
        fetch('/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        })
        .then(response => response.json())
        .then(data => {
            // Update the fund table with the new data from the backend
            df = data.data; // Assuming the backend returns the updated data
            updateFundTable(df); // Call the updateFundTable function to refresh the table

            // Close the modal
            closeModal('bulk-update-modal');
        });
    };
    reader.readAsText(file);
});

// Process CSV Data (Example - you'll need to customize this)
function processCSVData(csvData) {
    const lines = csvData.split('\n');
    const updatedData = [];
    for (let i = 1; i < lines.length; i++) { // Start from 1 to skip the header
        const values = lines[i].split(',');
        if (values.length === 13) { // Assuming 13 columns (including the checkbox column)
            updatedData.push({
                "Fund Name": values[0],
                "Region": values[1],
                // ... (map other CSV values to fund properties)
                "Performance (May 2023 - Apr 2024)": parseFloat(values[10])
            });
        }
    }
    return updatedData;
}

// ... (Rest of the code for filtering, sorting, shortlist functions, Add Fund modal logic)
// ... (previous code)

// Form Submission for Bulk Update Modal (updated)
document.getElementById('bulk-update-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('bulk-update-file');
    const file = fileInput.files[0];

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const updatedData = results.data.map(row => {
                return {
                    "Fund Name": row['Fund Name'],
                    "Region": row['Region'],
                    // ... (map other CSV columns to fund properties)
                    "Performance (May 2023 - Apr 2024)": parseFloat(row['Performance (May 2023 - Apr 2024)']) || 0,
                };
            });

            // Send the updatedData to the Flask backend (similar to addFund)
            fetch('/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            })
            .then(response => response.json())
            .then(data => {
                // Update the fund table with the new data from the backend
                df = data.data; // Assuming the backend returns the updated data
                updateFundTable(df); // Call the updateFundTable function to refresh the table

                // Close the modal
                closeModal('bulk-update-modal');
            });
        },
        error: function(error) {
            // Handle parsing errors (e.g., display an error message to the user)
            console.error("Error parsing CSV:", error);
        }
    });
});


// ... (Rest of the code for filtering, sorting, shortlist functions, Add Fund modal logic)
// ... (previous code for filtering, sorting, modal handling, etc.)

// Shortlist Functions
function updateShortlist() {
    const shortlistTableBody = shortlistTable.querySelector('tbody');
    shortlistTableBody.innerHTML = ''; // Clear existing rows

    for (const fund of shortlistedFunds) {
        const row = fundTable.querySelector(`tr[data-fund-id="${fund.id}"]`);
        if (row) {
            const newRow = row.cloneNode(true);
            newRow.querySelector('.select-fund').checked = true; // Mark checkbox as checked

            // Add remove button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = () => removeFromShortlist(fund.id);
            newRow.insertCell().appendChild(removeButton); // Add remove button to a new cell

            // Add input for investment percentage
            const inputCell = newRow.insertCell();
            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.max = '100';
            input.step = '0.01';
            input.value = fund.investmentPercentage || 0; // Use existing percentage or 0
            input.classList.add('investment-input'); // Add class for styling and event handling
            input.addEventListener('input', () => {
                updateInvestment(fund.id, parseFloat(input.value));
            });
            inputCell.appendChild(input);

            shortlistTableBody.appendChild(newRow);
        }
    }

    // Update the total investment percentage in the shortlist
    updateTotalInvestment(); // (Add this function - see below)
}

function addToShortlist(fundId) {
    const fund = df.find(f => f.id === fundId); // Assuming your data has an 'id' property
    if (fund && !shortlistedFunds.some(f => f.id === fundId)) {
        shortlistedFunds.push({ ...fund, investmentPercentage: 0 }); // Add with initial 0% investment
        updateShortlist();
    }
}

function removeFromShortlist(fundId) {
    shortlistedFunds = shortlistedFunds.filter(fund => fund.id !== fundId);
    updateShortlist();
    // Uncheck the checkbox in the main table
    const checkbox = fundTable.querySelector(`tr[data-fund-id="${fundId}"] .select-fund`);
    if (checkbox) {
        checkbox.checked = false;
    }
}

// Investment Percentage Update
function updateInvestment(fundId, newPercentage) {
    // ... (adjust other percentages to keep the total at 100%)
}

// Update Total Investment in Shortlist
function updateTotalInvestment() {
    const totalInvestment = shortlistedFunds.reduce((sum, fund) => sum + (fund.investmentPercentage || 0), 0);
    document.getElementById('total-investment').textContent = totalInvestment.toFixed(2);
}

// Event Listener for Fund Selection
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

// ... (Rest of the code)

// ... (previous code)

// Investment Percentage Update
function updateInvestment(fundId, newPercentage) {
    if (newPercentage > 100) {
        newPercentage = 100; // Cap at 100%
    } else if (newPercentage < 0) {
        newPercentage = 0;  // Ensure non-negative
    }
    
    const fundIndex = shortlistedFunds.findIndex(fund => fund.id === fundId);
    shortlistedFunds[fundIndex].investmentPercentage = newPercentage;

    // Adjust other percentages proportionally
    const remainingPercentage = 100 - newPercentage;
    const numOtherFunds = shortlistedFunds.length - 1;

    shortlistedFunds.forEach(fund => {
        if (fund.id !== fundId) {
            fund.investmentPercentage = (fund.investmentPercentage / (100 - shortlistedFunds[fundIndex].investmentPercentage)) * remainingPercentage;
        }
    });
    updateShortlist();
}

// Calculate Equivalent Sum
function calculateEquivalentSum(totalInvestment, investmentPercentage) {
    return (totalInvestment * investmentPercentage) / 100;
}
// ... (rest of the code)
// ... (previous code)

// Shortlist Functions (updated)
function updateShortlist() {
    const shortlistTableBody = shortlistTable.querySelector('tbody');
    shortlistTableBody.innerHTML = ''; // Clear existing rows

    const totalInvestment = shortlistedFunds.reduce((sum, fund) => sum + (fund.investmentPercentage || 0), 0); // Calculate total investment

    for (const fund of shortlistedFunds) {
        // ... (create row, checkbox, remove button as before)

        // Add input for investment percentage (with validation)
        const inputCell = newRow.insertCell();
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.max = '100';
        input.step = '0.01';
        input.value = fund.investmentPercentage || 0;
        input.classList.add('investment-input');

        // Add input validation event listener
        input.addEventListener('input', (event) => {
            const newPercentage = parseFloat(event.target.value);
            if (isNaN(newPercentage) || newPercentage < 0 || newPercentage > 100) {
                event.target.value = fund.investmentPercentage; // Reset to previous valid value
                return;
            }
            updateInvestment(fund.id, newPercentage);
        });

        inputCell.appendChild(input);

        // Add equivalent sum cell
        const equivalentSumCell = newRow.insertCell();
        const equivalentSum = calculateEquivalentSum(totalInvestment, fund.investmentPercentage);
        equivalentSumCell.textContent = equivalentSum.toFixed(2);

        shortlistTableBody.appendChild(newRow);
    }

    // Update total investment
    updateTotalInvestment();
}

// ... (Rest of the code)
// ... (previous code)

// Favorite Functionality
function toggleFavorite(fundId) {
    const fundIndex = df.findIndex(f => f.id === fundId);
    df[fundIndex].favorite = !df[fundIndex].favorite;

    updateFundTable(df); // Update the main table
    updateShortlist();   // Update the shortlist if needed
}

// Update Fund Table (updated)
function updateFundTable(rows) {
    // ... (existing code to clear and add rows) ...

    // Add favorite stars
    rows.forEach(row => {
        const favoriteCell = row.querySelector('.favorite-cell');
        favoriteCell.innerHTML = ''; // Clear any existing star
        if (row.favorite) { // Assuming the 'favorite' property is added to each fund object in the update_fund route
            const star = document.createElement('span');
            star.innerHTML = '&#9733;'; // Star character
            star.classList.add('favorite-star');
            star.onclick = () => toggleFavorite(parseInt(row.dataset.fundId));
            favoriteCell.appendChild(star);
        }
    });
}

// Event Listener for Favorite Stars
fundTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('favorite-star')) {
        const fundId = parseInt(event.target.closest('tr').dataset.fundId);
        toggleFavorite(fundId);
    }
});

// ... (Rest of the code)
// Filter and Sort Data
function filterAndSortData() {
    const volatility = parseFloat(filterVolatility.value);
    const performance = parseFloat(filterPerformance.value);
    const showFavorites = filterFavorite.checked;

    // Construct the query string
    const queryParams = new URLSearchParams({
        volatility: isNaN(volatility) ? '' : volatility,
        performance: isNaN(performance) ? '' : performance,
        favorites: showFavorites,
    });

    // Fetch the filtered data
    fetch(`/?${queryParams.toString()}`)
        .then(response => response.json())
        .then(data => {
            df = data.data; // Assuming the backend returns the updated data
            updateFundTable(df); // Call the updateFundTable function to refresh the table
        });
}

// ... (Rest of the script.js code)
// ... (previous code)

// Event listeners for arrow buttons
document.querySelectorAll('.arrow-button').forEach(button => {
    button.addEventListener('click', () => {
        const fieldId = button.dataset.field;
        const direction = button.dataset.direction;
        const input = document.getElementById(fieldId);
        let value = parseFloat(input.value);
        value += direction === 'up' ? 1 : -1;
        input.value = value;
        filterAndSortData(); // Trigger filtering after value change
    });
});

// ... (rest of the code)
// ... (previous code)

// Favorite Functionality (updated)
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
        updateFundTable(df); // Update the main table
        updateShortlist();   // Update the shortlist if needed
    });
}

// ... (rest of script.js)
// ... (previous code)

// Pagination
const rowsPerPage = 10; // Number of rows per page
let currentPage = 1;
const paginationContainer = document.querySelector('.pagination');

function setupPagination(totalRows) {
    const numPages = Math.ceil(totalRows / rowsPerPage);

    paginationContainer.innerHTML = '';

    for (let i = 1; i <= numPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            currentPage = i;
            updateFundTable(df); // Update table based on current page
        });
        paginationContainer.appendChild(button);
    }

    updatePaginationButtons();
}

function updatePaginationButtons() {
    const buttons = paginationContainer.querySelectorAll('button');
    buttons.forEach(button => button.classList.remove('active'));
    buttons[currentPage - 1].classList.add('active');
}

// Update Fund Table (updated with pagination)
function updateFundTable(data) {
    const tbody = fundTable.querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing rows

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const rowsToShow = data.slice(startIndex, endIndex); // Get rows for the current page

    // Add favorite stars, checkboxes, and rows (similar to before)
    // ... (code from previous step)

    updatePaginationButtons(); // Update button styles
}

// ... (rest of script.js code)
// ... (previous code for filtering, sorting, shortlist functions, favorite functionality)

// Initialize the table and fetch initial data
let df; 
fetch('/')
    .then(response => response.json())
    .then(data => {
        df = data.data;
        setupPagination(df.length); // Set up pagination
        updateFundTable(df);       // Initialize table
        createAddFundModal();
        createBulkUpdateModal();
        updateShortlist();
    });
    

// Form Submission for Add Fund Modal
document.getElementById('add-fund-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const newFundData = {
        id: Math.max(...df.map(f => f.id)) + 1, // Assign a new unique ID (assuming your data has 'id')
        favorite: false,
        "Fund Name": document.getElementById('fundName').value,
        "Region": document.getElementById('region').value,
        "Risk Level": document.getElementById('riskLevel').value,
        "Management Type": document.getElementById('managementType').value,
        "Number of Assets": parseInt(document.getElementById('numAssets').value),
        "Ongoing Charge (OCF)": parseFloat(document.getElementById('ocf').value),
        "Performance (May 2019 - Apr 2020)": parseFloat(document.getElementById('performance1').value),
        // ... (get values for other performance periods)
    };

    // Send the newFundData to the Flask backend using fetch or AJAX
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFundData)
    })
        .then(response => response.json())
        .then(data => {
            df = data.data; // Assuming the backend returns the updated data
            updateFundTable(df); // Call the updateFundTable function to refresh the table

            // Close the modal
            closeModal('add-fund-modal');
        });
});



// Form Submission for Bulk Update Modal (using PapaParse)
document.getElementById('bulk-update-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('bulk-update-file');
    const file = fileInput.files[0];

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const updatedData = results.data.map(row => {
                return {
                    "id": row['id'], // Make sure you have an ID column in your CSV for updating
                    "Fund Name": row['Fund Name'],
                    "Region": row['Region'],
                    // ... (map other CSV columns to fund properties)
                    "Performance (May 2023 - Apr 2024)": parseFloat(row['Performance (May 2023 - Apr 2024)']) || 0,
                    "favorite": df.find(f => f.id === parseInt(row['id']))?.favorite || false // Preserve favorite status
                };
            });

            // Send the updatedData to the Flask backend
            fetch('/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            })
            .then(response => response.json())
            .then(data => {
                df = data.data; 
                updateFundTable(df); 

                closeModal('bulk-update-modal');
            });
        },
        error: function(error) {
            console.error("Error parsing CSV:", error);
        }
    });
});

// ... (rest of the script.js code from previous steps)
// ... (previous code)

// Filter Reset
document.getElementById('reset-filters').addEventListener('click', () => {
    filterVolatility.value = 0;
    filterPerformance.value = -100;
    filterFavorite.checked = false;
    rowsPerPage = parseInt(document.getElementById('rows-per-page').value); // Update rowsPerPage from select
    filterAndSortData(); // Refresh the table with default filters
});

// Rows per Page Change
document.getElementById('rows-per-page').addEventListener('change', (event) => {
    rowsPerPage = parseInt(event.target.value);
    currentPage = 1; // Reset to first page when rowsPerPage changes
    setupPagination(df.length); // Re-setup pagination
    updateFundTable(df);       // Refresh the table
});

// Pagination (updated with Previous/Next buttons)
function setupPagination(totalRows) {
    // ... (code to generate page number buttons)

    // Add Previous and Next buttons
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1; // Disable on first page
    prevButton.addEventListener('click', () => {
        currentPage--;
        updateFundTable(df);
    });
    paginationContainer.insertBefore(prevButton, paginationContainer.firstChild);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === Math.ceil(totalRows / rowsPerPage); // Disable on last page
    nextButton.addEventListener('click', () => {
        currentPage++;
        updateFundTable(df);
    });
    paginationContainer.appendChild(nextButton);

    updatePaginationButtons(); // Update button styles
}

function updatePaginationButtons() {
    // ... (existing code to update active button style)

    // Update Previous and Next button states
    const prevButton = paginationContainer.querySelector('button:first-child');
    const nextButton = paginationContainer.querySelector('button:last-child');
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === Math.ceil(df.length / rowsPerPage);
}
// ... (rest of the script.js code)

// Delete Fund Function
function deleteFund(fundId) {
    // Send delete request to backend
    fetch('/update', {
        method: 'DELETE',  // Use DELETE method for deleting
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fundId })
    })
    .then(response => response.json())
    .then(data => {
        df = data.data;
        updateFundTable(df);  // Update the main table
        updateShortlist();    // Update the shortlist if needed
    });
}

// Event Listener for Delete Buttons
fundTable.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        const fundId = parseInt(event.target.dataset.fundId);
        deleteFund(fundId);
    }
});

// ... (rest of the script.js code)
