document.addEventListener('DOMContentLoaded', function() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            console.log('Data fetched:', data);  // Log the fetched data
            populateTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Get the modal elements
    const addFundModal = document.getElementById('add-fund-modal');
    const bulkUpdateModal = document.getElementById('bulk-update-modal');

    // Get the buttons that open the modals
    const addFundBtn = document.getElementById('open-add-fund-modal');
    const bulkUpdateBtn = document.getElementById('open-bulk-update-modal');

    // Get the <span> elements that close the modals
    const spanElements = document.getElementsByClassName('close');

    // When the user clicks the button, open the modal
    addFundBtn.onclick = function() {
        addFundModal.style.display = 'block';
    }

    bulkUpdateBtn.onclick = function() {
        bulkUpdateModal.style.display = 'block';
    }

    // When the user clicks on <span> (x), close the modal
    for (let i = 0; i < spanElements.length; i++) {
        spanElements[i].onclick = function() {
            addFundModal.style.display = 'none';
            bulkUpdateModal.style.display = 'none';
        }
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == addFundModal) {
            addFundModal.style.display = 'none';
        }
        if (event.target == bulkUpdateModal) {
            bulkUpdateModal.style.display = 'none';
        }
    }

    // Handle add fund form submission
    document.getElementById('add-fund-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch('/add_fund', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fund added:', data);
            populateTable(data);
            addFundModal.style.display = 'none';
        })
        .catch(error => console.error('Error adding fund:', error));
    });

    // Handle bulk update form submission
    document.getElementById('bulk-update-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        fetch('/bulk_update', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log('Funds updated:', data);
            populateTable(data);
            bulkUpdateModal.style.display = 'none';
        })
        .catch(error => console.error('Error updating funds:', error));
    });
});

let shortlistedFunds = [];
let investmentAllocations = {};

function formatNumber(value) {
    return parseFloat(value).toFixed(2);
}
