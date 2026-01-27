/**
 * Partner Renderer Module
 * Generates partner cards with Tailwind CSS classes matching existing HTML
 */

const PartnerRenderer = (function() {

    /**
     * Create a partner card element
     * @param {Object} partner - Partner data object
     * @param {Object} categories - Category definitions
     * @returns {HTMLElement} Partner card element
     */
    function createPartnerCard(partner, categories) {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm';
        card.dataset.category = partner.category;

        const category = categories[partner.category] || {};

        card.innerHTML = `
            <div class="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <h3 class="text-lg font-semibold text-gray-900 mb-3">${partner.name}</h3>
                <span class="text-sm font-bold text-primary">₹${partner.allocation.min}-${partner.allocation.max} Cr</span>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
                ${partner.focus.map(tag => `<span class="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${tag}</span>`).join('\n                ')}
            </div>
            <div class="space-y-3">
                <p><strong>Sector:</strong> ${category.label || 'Unknown'}</p>
                <p><strong>Org Budget:</strong> ${partner.orgBudget}</p>
                <p><strong>Key Strengths:</strong></p>
                <ul>
                    ${partner.strengths.map(s => `<li>${s}</li>`).join('\n                    ')}
                </ul>
                <p><strong>Key Deliverables (3 Years):</strong></p>
                <ul>
                    ${partner.deliverables.map(d => `<li>${d}</li>`).join('\n                    ')}
                </ul>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-600">
                ${partner.status === 'signed'
                    ? `<span class="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">Signed: ${partner.signedDate}</span>`
                    : `<span class="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-medium">Pending: ${partner.targetDate}</span>`
                }
            </div>
        `;

        return card;
    }

    /**
     * Render signed partners
     * @param {Array} partners - Array of partner objects
     * @param {Object} categories - Category definitions
     * @param {string} containerId - ID of container element
     */
    function renderSignedPartners(partners, categories, containerId = 'signed-partners-container') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`[PartnerRenderer] Container #${containerId} not found`);
            return;
        }

        const signedPartners = partners.filter(p => p.status === 'signed');

        if (signedPartners.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8">No signed partners found</div>';
            return;
        }

        container.innerHTML = '';
        signedPartners.forEach(partner => {
            const card = createPartnerCard(partner, categories);
            container.appendChild(card);
        });

        console.log(`[PartnerRenderer] Rendered ${signedPartners.length} signed partners`);
    }

    /**
     * Render pending partners by category
     * @param {Array} partners - Array of partner objects
     * @param {Object} categories - Category definitions
     * @param {string} category - Category to filter by
     * @param {string} containerId - ID of container element
     */
    function renderPendingPartnersByCategory(partners, categories, category, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`[PartnerRenderer] Container #${containerId} not found`);
            return;
        }

        const pendingPartners = partners.filter(p =>
            p.status === 'pending' && p.category === category
        );

        if (pendingPartners.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 py-8">No pending partners in this category</div>';
            return;
        }

        container.innerHTML = '';
        pendingPartners.forEach(partner => {
            const card = createPartnerCard(partner, categories);
            container.appendChild(card);
        });

        console.log(`[PartnerRenderer] Rendered ${pendingPartners.length} pending ${category} partners`);
    }

    /**
     * Render all pending partners (all categories)
     * @param {Array} partners - Array of partner objects
     * @param {Object} categories - Category definitions
     */
    function renderAllPendingPartners(partners, categories) {
        // Render each category
        const categoryContainers = {
            'demand': 'pending-demand-container',
            'circular': 'pending-circular-container',
            'enablers': 'pending-enablers-container',
            'transport': 'pending-transport-container',
            'water': 'pending-water-container',
            'food': 'pending-food-container',
            'biodiversity': 'pending-biodiversity-container',
            'air': 'pending-air-container'
        };

        Object.entries(categoryContainers).forEach(([category, containerId]) => {
            renderPendingPartnersByCategory(partners, categories, category, containerId);
        });
    }

    /**
     * Render all partners (signed and pending)
     * @param {Object} data - Partners data object
     */
    function renderAll(data) {
        if (!data || !data.partners || !data.categories) {
            console.error('[PartnerRenderer] Invalid data structure');
            return;
        }

        renderSignedPartners(data.partners, data.categories);
        renderAllPendingPartners(data.partners, data.categories);
    }

    // Public API
    return {
        createCard: createPartnerCard,
        renderSigned: renderSignedPartners,
        renderPendingByCategory: renderPendingPartnersByCategory,
        renderAllPending: renderAllPendingPartners,
        renderAll: renderAll
    };
})();

// Make available globally
window.PartnerRenderer = PartnerRenderer;
