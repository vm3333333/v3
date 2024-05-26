document.addEventListener('DOMContentLoaded', function() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            console.log('Data fetched:', data);
            populateTable(data);
            setupFilters(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    // Modal elements
    const addFundModal = document.getElementById('add-fund-modal');

    // Buttons to open modals
    const addFundBtn = document.getElementById('open-add-fund-modal');

    // Function to open modals
    if (addFundBtn) {
        addFundBtn.onclick = function() {
            if (addFundModal) {
                addFundModal.style.display = 'block';
            }
        };
    }

    // Close modals when clicking on <span> (x)
    const spanElements = document.getElementsByClassName('close');
    for (let i = 0; i < spanElements.length; i++) {
        spanElements[i].onclick = function() {
            if (addFundModal) {
                addFundModal.style.display = 'none';
            }
        };
    }

    // Close modals when clicking outside of the modal
    window.onclick = function(event) {
        if (event.target == addFundModal) {
            addFundModal.style.display = 'none';
        }
    };

    // Handle add fund form submission
    const addFundForm = document.getElementById('add-fund-form');
    if (addFundForm) {
        addFundForm.addEventListener('submit', function(event) {
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
                if (addFundModal) {
                    addFundModal.style.display = 'none';
                }
            })
            .catch(error => console.error('Error adding fund:', error));
        });
    }
});
