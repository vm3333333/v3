$(document).ready(function() {
    let funds = [];
    let shortlistedFunds = [];

    // Fetch the fund data
    $.get('/get_funds', function(data) {
        funds = JSON.parse(data);
        let tableBody = $('#fundTable tbody');
        funds.forEach((fund, index) => {
            let row = `<tr>
                <td><input type="checkbox" class="fund-select" data-index="${index}"></td>
                <td>${fund['Fund Name']}</td>
                <td>${fund['Region']}</td>
                <td>${fund['Risk Level']}</td>
                <td>${fund['Management Type']}</td>
                <td>${fund['Number of Assets']}</td>
                <td>${fund['Ongoing Charge (OCF)']}</td>
                ${getPerformanceCells(fund)}
            </tr>`;
            tableBody.append(row);
        });
        applyConditionalFormatting();
    });

    // Handle fund selection
    $(document).on('change', '.fund-select', function() {
        let fundIndex = $(this).data('index');
        if ($(this).is(':checked')) {
            shortlistedFunds.push(funds[fundIndex]);
        } else {
            shortlistedFunds = shortlistedFunds.filter((_, index) => index !== fundIndex);
        }
        updateShortlistTable();
    });

    // Update the shortlist table
    function updateShortlistTable() {
        let tableBody = $('#shortlistTable tbody');
        tableBody.empty();
        shortlistedFunds.forEach((fund, index) => {
            let row = `<tr>
                <td>${fund['Fund Name']}</td>
                <td>${fund['Region']}</td>
                <td>${fund['Risk Level']}</td>
                <td>${fund['Management Type']}</td>
                <td>${fund['Number of Assets']}</td>
                <td>${fund['Ongoing Charge (OCF)']}</td>
                ${getPerformanceCells(fund)}
                <td><input type="number" class="investment-percentage" data-index="${index}" value="0" min="0" max="100"></td>
                <td class="equivalent-sum">0</td>
            </tr>`;
            tableBody.append(row);
        });
        updateTotalInvestment();
        applyConditionalFormatting();
    }

    // Generate performance cells with appropriate class
    function getPerformanceCells(fund) {
        let performanceYears = [
            'May 2019 - Apr 2020',
            'May 2020 - Apr 2021',
            'May 2021 - Apr 2022',
            'May 2022 - Apr 2023',
            'May 2023 - Apr 2024'
        ];
        return performanceYears.map(year => {
            let value = parseFloat(fund[year].replace('%', ''));
            let className = value >= 0 ? 'high-performance' : 'low-performance';
            return `<td class="${className}">${fund[year]}</td>`;
        }).join('');
    }

    // Apply conditional formatting
    function applyConditionalFormatting() {
        $('td').each(function() {
            let cell = $(this);
            let value = parseFloat(cell.text().replace('%', ''));
            if (!isNaN(value)) {
                if (value >= 0) {
                    cell.addClass('high-performance');
                } else {
                    cell.addClass('low-performance');
                }
            }
        });
    }

    // Update total investment and equivalent sums
    $(document).on('input', '.investment-percentage', function() {
        let index = $(this).data('index');
        let percentage = parseFloat($(this).val());
        let fund = shortlistedFunds[index];
        let equivalentSum = (percentage / 100) * fund['Number of Assets'];
        $(this).closest('tr').find('.equivalent-sum').text(equivalentSum.toFixed(2));
        updateTotalInvestment();
    });

    // Update the total investment percentage and sums
    function updateTotalInvestment() {
        let totalPercentage = 0;
        let totalEquivalentSum = 0;
        $('.investment-percentage').each(function() {
            let percentage = parseFloat($(this).val());
            totalPercentage += percentage;
            let fundIndex = $(this).data('index');
            let fund = shortlistedFunds[fundIndex];
            let equivalentSum = (percentage / 100) * fund['Number of Assets'];
            totalEquivalentSum += equivalentSum;
        });
        $('#total-investment').text(`Total Investment: ${totalPercentage.toFixed(2)}%`);
        $('#total-equivalent-sum').text(`Total Equivalent Sum: ${totalEquivalentSum.toFixed(2)}`);
        if (totalPercentage > 100) {
            alert('Total investment percentage cannot exceed 100%.');
        }
    }

    // Add new fund
    $('#addFundBtn').click(function() {
        $('#addFundModal').modal('show');
    });

    $('#addFundForm').submit(function(event) {
        event.preventDefault();
        let newFund = {
            'Fund Name': $('#fundName').val(),
            'Region': $('#region').val(),
            'Risk Level': $('#riskLevel').val(),
            'Management Type': $('#managementType').val(),
            'Number of Assets': $('#numberOfAssets').val(),
            'Ongoing Charge (OCF)': $('#ongoingCharge').val(),
            'May 2019 - Apr 2020': $('#performance2020').val(),
            'May 2020 - Apr 2021': $('#performance2021').val(),
            'May 2021 - Apr 2022': $('#performance2022').val(),
            'May 2022 - Apr 2023': $('#performance2023').val(),
            'May 2023 - Apr 2024': $('#performance2024').val(),
        };
        funds.push(newFund);
        let row = `<tr>
            <td><input type="checkbox" class="fund-select" data-index="${funds.length - 1}"></td>
            <td>${newFund['Fund Name']}</td>
            <td>${newFund['Region']}</td>
            <td>${newFund['Risk Level']}</td>
            <td>${newFund['Management Type']}</td>
            <td>${newFund['Number of Assets']}</td>
            <td>${newFund['Ongoing Charge (OCF)']}</td>
            ${getPerformanceCells(newFund)}
        </tr>`;
        $('#fundTable tbody').append(row);
        $('#addFundModal').modal('hide');
        applyConditionalFormatting();
    });

    // Bulk update performance data
    $('#bulkUpdateBtn').click(function() {
        $('#bulkUpdateModal').modal('show');
    });

    $('#bulkUpdateForm').submit(function(event) {
        event.preventDefault();
        let bulkData = $('#bulkUpdateData').val().trim();
        let lines = bulkData.split('\n');
        lines.forEach(line => {
            let data = line.split(',');
            let fundName = data[0];
            let fund = funds.find(f => f['Fund Name'] === fundName);
            if (fund) {
                fund['May 2019 - Apr 2020'] = data[1];
                fund['May 2020 - Apr 2021'] = data[2];
                fund['May 2021 - Apr 2022'] = data[3];
                fund['May 2022 - Apr 2023'] = data[4];
                fund['May 2023 - Apr 2024'] = data[5];
            }
        });
        updateFundTable();
        $('#bulkUpdateModal').modal('hide');
    });

    // Update the fund table with the latest data
    function updateFundTable() {
        let tableBody = $('#fundTable tbody');
        tableBody.empty();
        funds.forEach((fund, index) => {
            let row = `<tr>
                <td><input type="checkbox" class="fund-select" data-index="${index}"></td>
                <td>${fund['Fund Name']}</td>
                <td>${fund['Region']}</td>
                <td>${fund['Risk Level']}</td>
                <td>${fund['Management Type']}</td>
                <td>${fund['Number of Assets']}</td>
                <td>${fund['Ongoing Charge (OCF)']}</td>
                ${getPerformanceCells(fund)}
            </tr>`;
            tableBody.append(row);
        });
        applyConditionalFormatting();
    }
});
