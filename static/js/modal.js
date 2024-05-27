// Add Fund Modal Functions
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
                <select id="riskLevel" name="riskLevel" required>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select><br>
                <label for="managementType">Management Type:</label><br>
                <select id="managementType" name="managementType" required>
                    <option value="Active">Active</option>
                    <option value="Passive">Passive</option>
                </select><br>
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

    // Event Listener for Add Fund Modal
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
            "Performance (May 2020 - Apr 2021)": parseFloat(document.getElementById('performance2').value),
            "Performance (May 2021 - Apr 2022)": parseFloat(document.getElementById('performance3').value),
            "Performance (May 2022 - Apr 2023)": parseFloat(document.getElementById('performance4').value),
            "Performance (May 2023 - Apr 2024)": parseFloat(document.getElementById('performance5').value),
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
}

// Bulk Update Modal Functions
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

    // Event Listeners for Bulk Update Modal
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
                    //closeModal('bulk-update-modal');
                });
            },
            error: function(error) {
                console.error("Error parsing CSV:", error);
            }
        });
    });
}

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
