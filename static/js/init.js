document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/data');
        const data = await response.json();
        
        if (data.error) {
            console.error('Error fetching data:', data.error);
            return;
        }

        console.log('Data fetched:', data); // For debugging purposes
        populateTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
