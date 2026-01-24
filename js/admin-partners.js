/**
 * Admin Partners Page Logic
 */

const AdminPartners = (function () {
    /**
     * Initialize partners page
     */
    function init() {
        // Check authentication
        if (!Auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        console.log('Initializing Admin Partners page...');

        // Set up category filter
        setupCategoryFilter();

        // Handle hash navigation
        handleHashNavigation();

        console.log('Admin Partners page initialized');
    }

    /**
     * Set up category filter functionality
     */
    function setupCategoryFilter() {
        const filterSelect = document.getElementById('filterCategory');
        if (!filterSelect) return;

        filterSelect.addEventListener('change', (e) => {
            const category = e.target.value;
            filterPartners(category);
        });
    }

    /**
     * Filter partners by category
     */
    function filterPartners(category) {
        const partnerCards = document.querySelectorAll('.partner-card');

        partnerCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || '';

            if (category === 'all') {
                card.style.display = '';
            } else if (category === 'demand' && cardCategory.includes('demand')) {
                card.style.display = '';
            } else if (category === 'circular' && cardCategory.includes('circular')) {
                card.style.display = '';
            } else if (category === 'enablers' && cardCategory.includes('enablers')) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * Handle hash navigation (scroll to partner)
     */
    function handleHashNavigation() {
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.querySelector(`[data-partner="${targetId}"]`);

            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetElement.classList.add('highlight');

                    setTimeout(() => {
                        targetElement.classList.remove('highlight');
                    }, 2000);
                }, 300);
            }
        }
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
        filterPartners
    };
})();
