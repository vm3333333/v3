function populateTable(data) {
    const tableBody = document.getElementById('funds-table-body');
    tableBody.innerHTML = ''; // Clear the table body

    data.forEach(item => {
        console.log('Processing item:', item); // Debugging statement
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" /></td>
            <td>${item['Fund Name']}</td>
            <td>${item['Region']}</td>
            <td>${item['Risk Level']}</td>
            <td>${item['Management Type']}</td>
            <td>${item['Number of Assets']}</td>
            <td>${item['Ongoing Charge (OCF)']}</td>
            <td>${item['May 2019 - Apr 2020']}</td>
            <td>${item['May 2020 - Apr 2021']}</td>
            <td>${item['May 2021 - Apr 2022']}</td>
            <td>${item['May 2022 - Apr 2023']}</td>
            <td>${item['May 2023 - Apr 2024']}</td>
            <td>${item['Performance Average']}</td>
            <td>${item['Overall Volatility']}</td>
        `;
        tableBody.appendChild(row);
    });
    
}
