/**
 * Charts Module for Dashboard Visualizations
 *
 * Uses Chart.js for rendering interactive charts
 */

const Charts = (function () {
    // Store chart instances for updates
    const chartInstances = {};

    // Default chart options
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 12,
                cornerRadius: 8
            }
        }
    };

    // Color palette
    const colors = CONFIG.dashboard.chartColors;

    /**
     * Create Energy & Climate Outcomes Chart
     */
    function createEnergyChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Year 1', 'Year 2', 'Year 3', '5-Year Vision'],
            datasets: [
                {
                    label: 'Energy Saved (TWh/year)',
                    data: [2, 5, 10, 20],
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + '20',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Peak Demand Avoided (GW)',
                    data: [0.5, 1.5, 3, 8],
                    borderColor: colors.secondary,
                    backgroundColor: colors.secondary + '20',
                    fill: true,
                    tension: 0.4
                }
            ]
        };

        const options = {
            ...defaultOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'line',
            data,
            options
        });

        return chartInstances[canvasId];
    }

    /**
     * Create Infrastructure Development Chart
     */
    function createInfrastructureChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Year 1', 'Year 2', 'Year 3', '5-Year Vision'],
            datasets: [
                {
                    label: 'Buildings Optimized (thousands)',
                    data: [50, 200, 500, 1000],
                    backgroundColor: colors.demand,
                    borderRadius: 4
                },
                {
                    label: 'Recycling Capacity (tonnes/yr x100)',
                    data: [50, 150, 400, 1000],
                    backgroundColor: colors.circular,
                    borderRadius: 4
                }
            ]
        };

        const options = {
            ...defaultOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data,
            options
        });

        return chartInstances[canvasId];
    }

    /**
     * Create Budget by Category Pie Chart (Admin)
     */
    function createBudgetPieChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Demand Efficiency', 'Circular Economy', 'Enablers'],
            datasets: [{
                data: [55, 30, 15],
                backgroundColor: [
                    colors.demand,
                    colors.circular,
                    colors.enablers
                ],
                borderWidth: 0
            }]
        };

        const options = {
            ...defaultOptions,
            plugins: {
                ...defaultOptions.plugins,
                tooltip: {
                    ...defaultOptions.plugins.tooltip,
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            return `${label}: ${value}%`;
                        }
                    }
                }
            }
        };

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data,
            options
        });

        return chartInstances[canvasId];
    }

    /**
     * Create Year-wise Budget Bar Chart (Admin)
     */
    function createPhasingChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Year 1', 'Year 2', 'Year 3'],
            datasets: [
                {
                    label: 'Demand Efficiency',
                    data: [42, 58, 43],
                    backgroundColor: colors.demand,
                    borderRadius: 4
                },
                {
                    label: 'Circular Economy',
                    data: [21, 30, 21],
                    backgroundColor: colors.circular,
                    borderRadius: 4
                },
                {
                    label: 'Enablers',
                    data: [15, 22, 16],
                    backgroundColor: colors.enablers,
                    borderRadius: 4
                }
            ]
        };

        const options = {
            ...defaultOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Amount (₹ Cr)'
                    }
                },
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                }
            }
        };

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data,
            options
        });

        return chartInstances[canvasId];
    }

    /**
     * Create Category Allocation Pie Chart (Admin Funding)
     */
    function createCategoryPieChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: [
                'Demand Efficiency (₹145-155 Cr)',
                'Circular Economy (₹68-75 Cr)',
                'Enablers (₹40-45 Cr)'
            ],
            datasets: [{
                data: [150, 72, 43],
                backgroundColor: [
                    colors.demand,
                    colors.circular,
                    colors.enablers
                ],
                borderWidth: 0
            }]
        };

        const options = {
            ...defaultOptions,
            plugins: {
                ...defaultOptions.plugins,
                legend: {
                    ...defaultOptions.plugins.legend,
                    position: 'right'
                }
            }
        };

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'pie',
            data,
            options
        });

        return chartInstances[canvasId];
    }

    /**
     * Create Year-wise Category Bar Chart (Admin Funding)
     */
    function createCategoryBarChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Year 1 (₹75-80 Cr)', 'Year 2 (₹100-110 Cr)', 'Year 3 (₹75-80 Cr)'],
            datasets: [
                {
                    label: 'Demand Efficiency',
                    data: [42, 58, 43],
                    backgroundColor: colors.demand
                },
                {
                    label: 'Circular Economy',
                    data: [21, 30, 21],
                    backgroundColor: colors.circular
                },
                {
                    label: 'Enablers',
                    data: [8, 11, 8],
                    backgroundColor: colors.enablers
                },
                {
                    label: 'Policy Research',
                    data: [6, 7, 5],
                    backgroundColor: colors.secondary
                },
                {
                    label: 'Operations',
                    data: [3, 4, 3],
                    backgroundColor: '#6b7280'
                }
            ]
        };

        const options = {
            ...defaultOptions,
            indexAxis: 'y',
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    title: {
                        display: true,
                        text: 'Amount (₹ Cr)'
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                }
            }
        };

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data,
            options
        });

        return chartInstances[canvasId];
    }

    /**
     * Update chart data
     */
    function updateChart(canvasId, newData) {
        const chart = chartInstances[canvasId];
        if (!chart) return;

        chart.data = newData;
        chart.update();
    }

    /**
     * Destroy a chart instance
     */
    function destroyChart(canvasId) {
        const chart = chartInstances[canvasId];
        if (chart) {
            chart.destroy();
            delete chartInstances[canvasId];
        }
    }

    /**
     * Create Progress Chart (Multi-Year Targets)
     */
    function createProgressChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Year 1', 'Year 2', 'Year 3'],
            datasets: [
                {
                    label: 'Energy Saved (TWh)',
                    data: [2, 5, 10],
                    borderColor: colors.primary,
                    backgroundColor: colors.primary + '20',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Policies Influenced',
                    data: [5, 15, 30],
                    borderColor: colors.secondary,
                    backgroundColor: colors.secondary + '20',
                    fill: true,
                    tension: 0.4
                }
            ]
        };

        const options = {
            ...defaultOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'line',
            data,
            options
        });

        return chartInstances[canvasId];
    }

    /**
     * Create Sector Readiness Chart
     */
    function createSectorChart(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const data = {
            labels: ['Energy', 'Buildings', 'Waste', 'Water', 'Air Quality'],
            datasets: [{
                label: 'Readiness',
                data: [100, 40, 20, 15, 10],
                backgroundColor: [
                    colors.primary,
                    colors.warning,
                    colors.warning + '80',
                    colors.warning + '60',
                    colors.warning + '40'
                ],
                borderRadius: 4
            }]
        };

        const options = {
            ...defaultOptions,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                ...defaultOptions.plugins,
                legend: {
                    display: false
                }
            }
        };

        chartInstances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data,
            options
        });

        return chartInstances[canvasId];
    }

    /**
     * Initialize all charts on the public dashboard
     */
    function initPublicCharts() {
        createProgressChart('progressChart');
        createSectorChart('sectorChart');
    }

    /**
     * Initialize admin overview charts
     */
    function initAdminCharts() {
        createBudgetPieChart('budgetChart');
        createPhasingChart('phasingChart');
    }

    /**
     * Initialize admin funding charts
     */
    function initFundingCharts() {
        createCategoryPieChart('categoryPieChart');
        createCategoryBarChart('categoryBarChart');
    }

    // Public API
    return {
        createEnergyChart,
        createInfrastructureChart,
        createProgressChart,
        createSectorChart,
        createBudgetPieChart,
        createPhasingChart,
        createCategoryPieChart,
        createCategoryBarChart,
        updateChart,
        destroyChart,
        initPublicCharts,
        initAdminCharts,
        initFundingCharts
    };
})();
