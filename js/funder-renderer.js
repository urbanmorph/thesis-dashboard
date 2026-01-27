/**
 * Funder Renderer Module
 * Generates funder cards with Tailwind CSS classes matching existing HTML
 */

const FunderRenderer = (function() {

    /**
     * Create a capital stack card
     * @param {Object} category - Capital stack category object
     * @returns {HTMLElement} Card element
     */
    function createCapitalStackCard(category) {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm';

        card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-base font-semibold text-gray-900">${category.emoji} ${category.name}</h3>
                <span class="text-sm font-medium text-gray-500">${category.stage}</span>
            </div>
            <div class="mb-4">
                <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full transition-all duration-300" style="width: ${category.progress}%; background: ${category.color}"></div>
                </div>
                <span class="text-xs text-gray-600">${category.progressLabel}</span>
            </div>
            <ul class="space-y-2">
                ${category.investors.map(investor => `<li>${investor}</li>`).join('\n                ')}
            </ul>
        `;

        return card;
    }

    /**
     * Create a philanthropy sector card
     * @param {Object} category - Philanthropy category object
     * @returns {HTMLElement} Card element
     */
    function createPhilanthropyCard(category) {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm';

        card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-base font-semibold text-gray-900">${category.emoji} ${category.name}</h3>
            </div>
            <ul class="space-y-2">
                ${category.funders.map(funder => `<li>${funder}</li>`).join('\n                ')}
            </ul>
        `;

        return card;
    }

    /**
     * Create an India investor category card
     * @param {Object} category - India investor category object
     * @returns {HTMLElement} Card element
     */
    function createIndiaInvestorCard(category) {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm';

        card.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-base font-semibold text-gray-900">${category.emoji} ${category.name}</h3>
            </div>
            <ul class="space-y-2">
                ${category.investors.map(investor => `<li>${investor}</li>`).join('\n                ')}
            </ul>
        `;

        return card;
    }

    /**
     * Render capital stack categories
     * @param {Array} categories - Array of capital stack category objects
     * @param {string} containerId - ID of container element
     */
    function renderCapitalStack(categories, containerId = 'capital-stack-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`[FunderRenderer] Container #${containerId} not found`);
            return;
        }

        if (!categories || categories.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8">No capital stack data found</div>';
            return;
        }

        container.innerHTML = '';
        categories.forEach(category => {
            const card = createCapitalStackCard(category);
            container.appendChild(card);
        });

        console.log(`[FunderRenderer] Rendered ${categories.length} capital stack categories`);
    }

    /**
     * Render philanthropy sectors
     * @param {Array} categories - Array of philanthropy category objects
     * @param {string} containerId - ID of container element
     */
    function renderPhilanthropy(categories, containerId = 'philanthropy-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`[FunderRenderer] Container #${containerId} not found`);
            return;
        }

        if (!categories || categories.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8">No philanthropy data found</div>';
            return;
        }

        container.innerHTML = '';
        categories.forEach(category => {
            const card = createPhilanthropyCard(category);
            container.appendChild(card);
        });

        console.log(`[FunderRenderer] Rendered ${categories.length} philanthropy sectors`);
    }

    /**
     * Render India investors
     * @param {Array} categories - Array of India investor category objects
     * @param {string} containerId - ID of container element
     */
    function renderIndiaInvestors(categories, containerId = 'india-investors-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`[FunderRenderer] Container #${containerId} not found`);
            return;
        }

        if (!categories || categories.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8">No India investor data found</div>';
            return;
        }

        container.innerHTML = '';
        categories.forEach(category => {
            const card = createIndiaInvestorCard(category);
            container.appendChild(card);
        });

        console.log(`[FunderRenderer] Rendered ${categories.length} India investor categories`);
    }

    /**
     * Render all funder data
     * @param {Object} data - Funders data object
     */
    function renderAll(data) {
        if (!data) {
            console.error('[FunderRenderer] Invalid data structure');
            return;
        }

        if (data.capitalStack && data.capitalStack.categories) {
            renderCapitalStack(data.capitalStack.categories);
        }

        if (data.philanthropy && data.philanthropy.categories) {
            renderPhilanthropy(data.philanthropy.categories);
        }

        if (data.indiaInvestors && data.indiaInvestors.categories) {
            renderIndiaInvestors(data.indiaInvestors.categories);
        }
    }

    // Public API
    return {
        renderCapitalStack: renderCapitalStack,
        renderPhilanthropy: renderPhilanthropy,
        renderIndiaInvestors: renderIndiaInvestors,
        renderAll: renderAll
    };
})();

// Make available globally
window.FunderRenderer = FunderRenderer;
