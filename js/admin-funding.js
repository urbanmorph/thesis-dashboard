/**
 * Admin Funding Page Logic
 */

const AdminFunding = (function () {
    /**
     * Initialize funding page
     */
    function init() {
        // Auth check is handled by auth.js protectPage()
        // No need to check again here to avoid redirect loops

        console.log('Initializing Admin Funding page...');

        // Initialize charts
        Charts.initFundingCharts();

        console.log('Admin Funding page initialized');
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        init
    };
})();
