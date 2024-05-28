document.addEventListener('DOMContentLoaded', function() {
    const totalInvestmentInput = document.getElementById('total-investment');
    const fundsTableBody = document.querySelector('#funds-table tbody');
    const shortlistTableBody = document.querySelector('#shortlist-table tbody');
    let fundsData = [];
    let shortlistData = [];

    function updateShortlist() {
        shortlistTableBody.innerHTML = '';
        shortlistData.forEach(fund => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${fund['Fund Name']}</td>
                <td>${fund['Region']}</td>
                <td>${fund['Risk Level']}</td>
                <td>${fund['Management Type']}</td>
                <td>${fund['Number of Assets']}</td>
                <td>${fund['Ongoing Charge (OCF)']}</td>
                <td>${(fund['Average Performance'] * 100).toFixed(2)}%</td>
                <td>${(fund['Volatility'] * 100).toFixed(2)}%</td>
                <td><input type="number" class="allocation-input" data-fund-id="${fund['Fund Name']}" value="${fund.allocation || 0}" step="0.01"></td>
                <td>${(fund.investmentAmount || 0).toFixed(2)}</td>
            `;
            shortlistTableBody.appendChild(row);
        });
    }

    function updateInvestmentAmounts() {
        const totalInvestment = parseFloat(totalInvestmentInput.value) || 0;
        shortlistData.forEach(fund => {
            fund.investmentAmount = (fund.allocation || 0) / 100 * totalInvestment;
        });
        updateShortlist();
    }

    fetch('/load-data')
        .then(response => response.json())
        .then(data => {
            fundsData = data;
            fundsData.forEach(fund => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td><input type="checkbox" class="select-fund" data-fund-id="${fund['Fund Name']}"></td>
                    <td>${fund['Fund Name']}</td>
                    <td>${fund['Region']}</td>
                    <td>${fund['Risk Level']}</td>
                    <td>${fund['Management Type']}</td>
                    <td>${fund['Number of Assets']}</td>
                    <td>${fund['Ongoing Charge (OCF)']}</td>
                    <td>${(fund['Average Performance'] * 100).toFixed(2)}%</td>
                    <td>${(fund['Volatility'] * 100).toFixed(2)}%</td>
                `;
                
                fundsTableBody.appendChild(row);
            });

            document.querySelectorAll('.select-fund').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    const fundId = this.dataset.fundId;
                    if (this.checked) {
                        const fund = fundsData.find(f => f['Fund Name'] === fundId);
                        shortlistData.push({ ...fund, allocation: 0, investmentAmount: 0 });
                    } else {
                        shortlistData = shortlistData.filter(f => f['Fund Name'] !== fundId);
                    }
                    updateShortlist();
                });
            });

            document.querySelectorAll('.allocation-input').forEach(input => {
                input.addEventListener('input', function() {
                    const fundId = this.dataset.fundId;
                    const allocation = parseFloat(this.value) || 0;
                    const fund = shortlistData.find(f => f['Fund Name'] === fundId);
                    if (fund) {
                        fund.allocation = allocation;
                        updateInvestmentAmounts();
                    }
                });
            });

            totalInvestmentInput.addEventListener('input', updateInvestmentAmounts);
        })
        .catch(error => console.error('Error loading data:', error));
});
