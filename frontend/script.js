document.addEventListener('DOMContentLoaded', function() {
    const totalInvestmentInput = document.getElementById('total-investment');
    const fundsTableBody = document.querySelector('#funds-table tbody');
    const shortlistTableBody = document.querySelector('#shortlist-table tbody');
    const favouritesOnlyCheckbox = document.getElementById('favourites-only');
    const filterRegion = document.getElementById('filter-region');
    const filterRisk = document.getElementById('filter-risk');
    const filterManagement = document.getElementById('filter-management');
    const filterPerformance = document.getElementById('filter-performance');
    const filterVolatility = document.getElementById('filter-volatility');
    const performanceValue = document.getElementById('performance-value');
    const volatilityValue = document.getElementById('volatility-value');
    const tableHeaders = document.querySelectorAll('#funds-table th');
    let fundsData = [];
    let shortlistData = [];
    let favourites = new Set();
    let currentSortColumn = '';
    let currentSortDirection = 'asc';

    loadFavourites();

    function saveFavourites() {
        localStorage.setItem('favourites', JSON.stringify(Array.from(favourites)));
    }
    
    function loadFavourites() {
        const savedFavourites = JSON.parse(localStorage.getItem('favourites'));
        if (savedFavourites) {
            favourites = new Set(savedFavourites);
        }
    }

    function getGradientColor(value, min, max, colors) {
        const range = max - min;
        const step = range / (colors.length - 1);
        for (let i = 0; i < colors.length - 1; i++) {
            if (value >= min + i * step && value < min + (i + 1) * step) {
                return colors[i];
            }
        }
        return colors[colors.length - 1];
    }
    
    function applyPerformanceColor(value, min, max) {
        const colors = ['#ff5722', '#ff7043', '#ff8a65', '#ffab91', '#ffd54f', '#dce775', '#aed581', '#81c784', '#4caf50'];
        return getGradientColor(value, min, max, colors);
    }
    
    function applyVolatilityColor(value, min, max) {
        const colors = ['#4caf50', '#81c784', '#aed581', '#dce775', '#ffd54f', '#ffab91', '#ff8a65', '#ff7043', '#ff5722'];
        return getGradientColor(value, min, max, colors);
    }
    
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
                <td class="${applyPerformanceColor(fund['Average Performance'], minPerformance, maxPerformance)}">${(fund['Average Performance'] * 100).toFixed(2)}%</td>
                <td class="${applyVolatilityColor(fund['Volatility'], minVolatility, maxVolatility)}">${(fund['Volatility'] * 100).toFixed(2)}%</td>
                <td><input type="number" class="allocation-input" data-fund-id="${fund['Fund Name']}" value="${fund.allocation || 0}" step="0.01"></td>
                <td>${(fund.investmentAmount || 0).toFixed(2)}</td>
            `;
            shortlistTableBody.appendChild(row);

            // Add event listener for allocation input changes
            row.querySelector('.allocation-input').addEventListener('input', function() {
                const fundId = this.dataset.fundId;
                const allocation = parseFloat(this.value) || 0;
                const fund = shortlistData.find(f => f['Fund Name'] === fundId);
                if (fund) {
                    fund.allocation = allocation;
                    updateInvestmentAmounts();
                }
            });
        });
    }

    function updateInvestmentAmounts() {
        const totalInvestment = parseFloat(totalInvestmentInput.value) || 0;
        shortlistData.forEach(fund => {
            fund.investmentAmount = (fund.allocation || 0) / 100 * totalInvestment;
        });
        updateShortlist();
    }

    function sortData(column) {
        if (currentSortColumn === column) {
            currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = column;
            currentSortDirection = 'asc';
        }

        fundsData.sort((a, b) => {
            if (a[column] < b[column]) {
                return currentSortDirection === 'asc' ? -1 : 1;
            }
            if (a[column] > b[column]) {
                return currentSortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        updateFundsTable();
    }

    function updateFilters() {
        // Clear existing options
        filterRegion.innerHTML = '<option value="">All</option>';
        filterRisk.innerHTML = '<option value="">All</option>';
        filterManagement.innerHTML = '<option value="">All</option>';

        const uniqueRegions = [...new Set(fundsData.map(fund => fund['Region']))];
        const uniqueRiskLevels = [...new Set(fundsData.map(fund => fund['Risk Level'].toString().trim()))];
        const uniqueManagementTypes = [...new Set(fundsData.map(fund => fund['Management Type']))];

        uniqueRegions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            filterRegion.appendChild(option);
        });

        uniqueRiskLevels.forEach(risk => {
            const option = document.createElement('option');
            option.value = risk;
            option.textContent = risk;
            filterRisk.appendChild(option);
        });

        uniqueManagementTypes.forEach(management => {
            const option = document.createElement('option');
            option.value = management;
            option.textContent = management;
            filterManagement.appendChild(option);
        });
    }

    function updateFundsTable() {
        fundsTableBody.innerHTML = '';
        const showFavouritesOnly = favouritesOnlyCheckbox.checked;
        const selectedRegion = filterRegion.value;
        const selectedRisk = filterRisk.value;
        const selectedManagement = filterManagement.value;
        const performanceThreshold = parseFloat(filterPerformance.value) / 100;
        const volatilityThreshold = parseFloat(filterVolatility.value) / 100;
        
        console.log('Updating funds table with filters:', {
            showFavouritesOnly,
            selectedRegion,
            selectedRisk,
            selectedManagement,
            performanceThreshold,
            volatilityThreshold
        });
    
        const minPerformance = Math.min(...fundsData.map(fund => fund['Average Performance']));
        const maxPerformance = Math.max(...fundsData.map(fund => fund['Average Performance']));
        const minVolatility = Math.min(...fundsData.map(fund => fund['Volatility']));
        const maxVolatility = Math.max(...fundsData.map(fund => fund['Volatility']));
    
        // Update slider ranges and values
        filterPerformance.min = (minPerformance * 100).toFixed(2);
        filterPerformance.max = (maxPerformance * 100).toFixed(2);
        filterPerformance.value = filterPerformance.min;
        performanceValue.textContent = `${filterPerformance.value}%`;
    
        filterVolatility.min = (minVolatility * 100).toFixed(2);
        filterVolatility.max = (maxVolatility * 100).toFixed(2);
        filterVolatility.value = filterVolatility.max;
        volatilityValue.textContent = `${filterVolatility.value}%`;
    
        fundsData.forEach(fund => {
            if (showFavouritesOnly && !favourites.has(fund['Fund Name'])) {
                return;
            }
            if (selectedRegion && fund['Region'] !== selectedRegion) {
                return;
            }
            if (selectedRisk && fund['Risk Level'] !== selectedRisk) {
                return;
            }
            if (selectedManagement && fund['Management Type'] !== selectedManagement) {
                return;
            }
            if (fund['Average Performance'] < performanceThreshold) {
                return;
            }
            if (fund['Volatility'] > volatilityThreshold) {
                return;
            }
    
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="select-fund" data-fund-id="${fund['Fund Name']}"></td>
                <td><input type="checkbox" class="favourite-fund" data-fund-id="${fund['Fund Name']}" ${favourites.has(fund['Fund Name']) ? 'checked' : ''}></td>
                <td>${fund['Fund Name']}</td>
                <td>${fund['Region']}</td>
                <td>${fund['Risk Level']}</td>
                <td>${fund['Management Type']}</td>
                <td>${fund['Number of Assets']}</td>
                <td>${fund['Ongoing Charge (OCF)']}</td>
                <td style="background-color: ${applyPerformanceColor(fund['Average Performance'], minPerformance, maxPerformance)};">${(fund['Average Performance'] * 100).toFixed(2)}%</td>
                <td style="background-color: ${applyVolatilityColor(fund['Volatility'], minVolatility, maxVolatility)};">${(fund['Volatility'] * 100).toFixed(2)}%</td>
            `;
            
            fundsTableBody.appendChild(row);
    
            // Attach event listeners to select checkboxes
            row.querySelector('.select-fund').addEventListener('change', function() {
                const fundId = this.dataset.fundId;
                if (this.checked) {
                    const fund = fundsData.find(f => f['Fund Name'] === fundId);
                    shortlistData.push({ ...fund, allocation: 0, investmentAmount: 0 });
                } else {
                    shortlistData = shortlistData.filter(f => f['Fund Name'] !== fundId);
                }
                updateShortlist();
            });
    
            // Attach event listeners to favourite checkboxes
            row.querySelector('.favourite-fund').addEventListener('change', function() {
                const fundId = this.dataset.fundId;
                if (this.checked) {
                    favourites.add(fundId);
                } else {
                    favourites.delete(fundId);
                }
                saveFavourites();
                updateFundsTable();
            });
        });
    }
    
    filterRegion.addEventListener('change', updateFundsTable);
    filterRisk.addEventListener('change', updateFundsTable);
    filterManagement.addEventListener('change', updateFundsTable);
    filterPerformance.addEventListener('input', function() {
        performanceValue.textContent = `${filterPerformance.value}%`;
        updateFundsTable();
    });
    filterVolatility.addEventListener('input', function() {
        volatilityValue.textContent = `${filterVolatility.value}%`;
        updateFundsTable();
    });
    
    tableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const column = this.innerText.trim();
            sortData(column);
        });
    });
    
    fetch('/load-data')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            fundsData = data.map(fund => {
                fund['Risk Level'] = fund['Risk Level'].toString().trim();
                return fund;
            });
            updateFilters();
            updateFundsTable();
    
            totalInvestmentInput.addEventListener('input', updateInvestmentAmounts);
            favouritesOnlyCheckbox.addEventListener('change', updateFundsTable);
        })
        .catch(error => console.error('Error loading data:', error));    

})
