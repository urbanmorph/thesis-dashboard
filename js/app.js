/**
 * Main Application Logic for Public Dashboard
 */

const App = (function () {
    // Current metrics data
    let metricsData = null;

    /**
     * Initialize the application
     */
    async function init() {
        console.log('Initializing Climate Dashboard...');

        // Load data
        await loadData();

        // Initialize charts
        Charts.initPublicCharts();

        // Update metrics display
        updateMetricsDisplay();

        // Animate progress bars
        animateProgressBars();

        // Set up auto-refresh
        setInterval(refreshData, CONFIG.dashboard.refreshInterval);

        console.log('Dashboard initialized successfully');
    }

    /**
     * Load data from storage
     */
    async function loadData() {
        try {
            metricsData = await DataStore.getMetrics();
        } catch (error) {
            console.error('Error loading data:', error);
            // Use fallback data
            metricsData = {
                current: {
                    energy: 0.8,
                    peak: 0.2,
                    buildings: 15000,
                    recycling: 1500
                }
            };
        }
    }

    /**
     * Update the metrics display with current values
     */
    function updateMetricsDisplay() {
        if (!metricsData || !metricsData.current) return;

        const current = metricsData.current;
        const targets = CONFIG.targets.year3;

        // Update metric values with animation
        animateValue('energy-current', 0, current.energy, 'TWh');
        animateValue('peak-current', 0, current.peak, 'GW');
        animateValue('recycling-current', 0, current.recycling, 't');
        animateValue('policies-current', 0, current.policies || 2, '');

        // Calculate and set progress percentages
        const energyProgress = (current.energy / targets.energy) * 100;
        const peakProgress = (current.peak / targets.peak) * 100;
        const recyclingProgress = (current.recycling / targets.recycling) * 100;
        const policiesProgress = ((current.policies || 2) / targets.policies) * 100;

        // Store progress values for animation
        document.getElementById('energy-progress')?.setAttribute('data-progress', energyProgress);
        document.getElementById('peak-progress')?.setAttribute('data-progress', peakProgress);
        document.getElementById('recycling-progress')?.setAttribute('data-progress', recyclingProgress);
        document.getElementById('policies-progress')?.setAttribute('data-progress', policiesProgress);
    }

    /**
     * Animate a numeric value
     */
    function animateValue(elementId, start, end, suffix) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = CONFIG.dashboard.animationDuration;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);

            const current = start + (end - start) * eased;

            // Format the number
            let formatted;
            if (end >= 1000) {
                formatted = Math.round(current).toLocaleString();
            } else if (end >= 1) {
                formatted = current.toFixed(1);
            } else {
                formatted = current.toFixed(2);
            }

            element.textContent = formatted + (suffix ? ' ' + suffix : '');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Animate progress bars
     */
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');

        progressBars.forEach(bar => {
            const targetProgress = bar.getAttribute('data-progress') || 0;

            // Delay animation slightly for visual effect
            setTimeout(() => {
                bar.style.width = `${Math.min(targetProgress, 100)}%`;
            }, 300);
        });
    }

    /**
     * Refresh data from storage
     */
    async function refreshData() {
        console.log('Refreshing data...');
        await loadData();
        updateMetricsDisplay();
        animateProgressBars();
    }

    /**
     * Format large numbers with abbreviations
     */
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    /**
     * Format currency in Indian style
     */
    function formatCurrency(crores) {
        return '₹' + crores + ' Cr';
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        init,
        refreshData,
        formatNumber,
        formatCurrency
    };
})();
