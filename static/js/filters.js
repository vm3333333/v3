function setupFilters(data) {
    const volatilityMinInput = document.getElementById('volatility-filter-min');
    const volatilityMaxInput = document.getElementById('volatility-filter-max');
    const performanceMinInput = document.getElementById('performance-filter-min');
    const performanceMaxInput = document.getElementById('performance-filter-max');
    const favouritesFilter = document.getElementById('favourites-filter');

    const volatilityRangeSlider = document.getElementById('volatility-filter-range');
    const performanceRangeSlider = document.getElementById('performance-filter-range');

    const volatilityMin = Math.min(...data.map(fund => fund['Overall Volatility'])) * 100;
    const volatilityMax = Math.max(...data.map(fund => fund['Overall Volatility'])) * 100;
    const performanceMin = Math.min(...data.map(fund => fund['Performance Average'])) * 100;
    const performanceMax = Math.max(...data.map(fund => fund['Performance Average'])) * 100;

    volatilityMinInput.value = volatilityMin.toFixed(2);
    volatilityMaxInput.value = volatilityMax.toFixed(2);
    performanceMinInput.value = performanceMin.toFixed(2);
    performanceMaxInput.value = performanceMax.toFixed(2);

    noUiSlider.create(volatilityRangeSlider, {
        start: [volatilityMin, volatilityMax],
        connect: true,
        range: {
            'min': volatilityMin,
            'max': volatilityMax
        },
        tooltips: [true, true],
        format: {
            to: value => `${value.toFixed(2)}%`,
            from: value => Number(value.replace('%', ''))
        }
    });

    noUiSlider.create(performanceRangeSlider, {
        start: [performanceMin, performanceMax],
        connect: true,
        range: {
            'min': performanceMin,
            'max': performanceMax
        },
        tooltips: [true, true],
        format: {
            to: value => `${value.toFixed(2)}%`,
            from: value => Number(value.replace('%', ''))
        }
    });

    const updateFilters = () => {
        const volatilityValues = volatilityRangeSlider.noUiSlider.get().map(val => parseFloat(val) / 100);
        const performanceValues = performanceRangeSlider.noUiSlider.get().map(val => parseFloat(val) / 100);
        const favouritesOnly = favouritesFilter.checked;

        volatilityMinInput.value = (volatilityValues[0] * 100).toFixed(2);
        volatilityMaxInput.value = (volatilityValues[1] * 100).toFixed(2);
        performanceMinInput.value = (performanceValues[0] * 100).toFixed(2);
        performanceMaxInput.value = (performanceValues[1] * 100).toFixed(2);

        const filteredData = data.filter(fund => {
            const matchesVolatility = (fund['Overall Volatility'] >= volatilityValues[0]) && 
                                      (fund['Overall Volatility'] <= volatilityValues[1]);
            const matchesPerformance = (fund['Performance Average'] >= performanceValues[0]) && 
                                       (fund['Performance Average'] <= performanceValues[1]);
            const matchesFavourites = !favouritesOnly || fund.favourite;
            return matchesVolatility && matchesPerformance && matchesFavourites;
        });

        populateTable(filteredData);
    };

    volatilityRangeSlider.noUiSlider.on('update', updateFilters);
    performanceRangeSlider.noUiSlider.on('update', updateFilters);

    favouritesFilter.addEventListener('change', updateFilters);

    // Synchronize number inputs with sliders
    volatilityMinInput.addEventListener('input', function() {
        volatilityRangeSlider.noUiSlider.set([this.value, null]);
    });
    volatilityMaxInput.addEventListener('input', function() {
        volatilityRangeSlider.noUiSlider.set([null, this.value]);
    });
    performanceMinInput.addEventListener('input', function() {
        performanceRangeSlider.noUiSlider.set([this.value, null]);
    });
    performanceMaxInput.addEventListener('input', function() {
        performanceRangeSlider.noUiSlider.set([null, this.value]);
    });
}
