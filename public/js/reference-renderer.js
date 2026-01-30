/**
 * Reference Renderer Module
 * Dynamically renders data source references from JSON into category cards
 * with Tailwind CSS classes matching existing HTML patterns
 */

const ReferenceRenderer = (function() {

    /**
     * Create a single reference list item
     * @param {Object} ref - Reference data object
     * @returns {HTMLElement} List item element
     */
    function createReferenceItem(ref) {
        const li = document.createElement('li');
        li.id = ref.slug;

        // Build HTML with citation and optional link
        let html = ref.citation;
        if (ref.url) {
            html += ` <a href="${ref.url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Link</a>`;
        }
        li.innerHTML = html;

        return li;
    }

    /**
     * Create a category card with references
     * @param {Object} category - Category object with name, sector, order
     * @param {Array} references - Array of reference objects for this category
     * @returns {HTMLElement} Category card element
     */
    function createCategoryCard(category, references) {
        const card = document.createElement('div');
        card.className = 'bg-white border border-gray-200 rounded-lg p-6 shadow-sm';
        card.dataset.category = category.name;
        card.dataset.sector = category.sector;

        // Category heading
        const heading = document.createElement('h4');
        heading.className = 'text-base font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2';
        heading.textContent = category.name;

        // Ordered list with proper start number
        const ol = document.createElement('ol');
        ol.className = 'text-xs text-gray-700 leading-relaxed space-y-2 pl-5 list-decimal';

        // Set start number to first reference's number
        if (references.length > 0) {
            ol.setAttribute('start', references[0].number);
        }

        // Add reference items
        references.forEach(ref => {
            ol.appendChild(createReferenceItem(ref));
        });

        card.appendChild(heading);
        card.appendChild(ol);

        return card;
    }

    /**
     * Group references by category
     * @param {Array} references - Array of all reference objects
     * @returns {Object} Map of category name to references array
     */
    function groupByCategory(references) {
        const grouped = {};
        references.forEach(ref => {
            const cat = ref.category;
            if (!grouped[cat]) {
                grouped[cat] = [];
            }
            grouped[cat].push(ref);
        });
        return grouped;
    }

    /**
     * Render all references into a container
     * @param {Object} data - Full data object with references and categories
     * @param {string|HTMLElement} container - Container element or ID
     */
    function renderAll(data, container) {
        // Get container element
        const containerEl = typeof container === 'string'
            ? document.getElementById(container)
            : container;

        if (!containerEl) {
            console.error('[ReferenceRenderer] Container not found:', container);
            return;
        }

        // Validate data structure
        if (!data || !data.references || !data.categories) {
            console.error('[ReferenceRenderer] Invalid data structure');
            containerEl.innerHTML = '<div class="col-span-3 text-center text-red-500 py-8">Failed to load references: Invalid data format</div>';
            return;
        }

        // Clear container
        containerEl.innerHTML = '';

        // Group references by category
        const grouped = groupByCategory(data.references);

        // Sort categories by order
        const sortedCategories = [...data.categories].sort((a, b) => a.order - b.order);

        // Render category cards in order
        sortedCategories.forEach(category => {
            const categoryRefs = grouped[category.name];
            if (categoryRefs && categoryRefs.length > 0) {
                // Sort references within category by number
                categoryRefs.sort((a, b) => a.number - b.number);
                const card = createCategoryCard(category, categoryRefs);
                containerEl.appendChild(card);
            }
        });

        console.log(`[ReferenceRenderer] Rendered ${data.references.length} references in ${sortedCategories.length} categories`);
    }

    /**
     * Fetch and render references from JSON file
     * @param {string} jsonPath - Path to reference-mapping.json
     * @param {string|HTMLElement} container - Container element or ID
     */
    async function fetchAndRender(jsonPath, container) {
        const containerEl = typeof container === 'string'
            ? document.getElementById(container)
            : container;

        if (!containerEl) {
            console.error('[ReferenceRenderer] Container not found:', container);
            return;
        }

        // Show loading state
        containerEl.innerHTML = '<div class="col-span-3 text-center text-gray-500 py-8">Loading references...</div>';

        try {
            const response = await fetch(jsonPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            renderAll(data, containerEl);
        } catch (error) {
            console.error('[ReferenceRenderer] Failed to fetch references:', error);
            containerEl.innerHTML = `<div class="col-span-3 text-center text-red-500 py-8">Failed to load references: ${error.message}</div>`;
        }
    }

    /**
     * Get reference by slug
     * @param {Array} references - Array of reference objects
     * @param {string} slug - Reference slug ID
     * @returns {Object|null} Reference object or null
     */
    function getBySlug(references, slug) {
        return references.find(ref => ref.slug === slug) || null;
    }

    /**
     * Get references by sector
     * @param {Array} references - Array of reference objects
     * @param {string} sector - Sector name
     * @returns {Array} Filtered references
     */
    function getBySector(references, sector) {
        return references.filter(ref => ref.sector === sector);
    }

    /**
     * Get references by category
     * @param {Array} references - Array of reference objects
     * @param {string} category - Category name
     * @returns {Array} Filtered references
     */
    function getByCategory(references, category) {
        return references.filter(ref => ref.category === category);
    }

    // Public API
    return {
        renderAll: renderAll,
        fetchAndRender: fetchAndRender,
        createCategoryCard: createCategoryCard,
        createReferenceItem: createReferenceItem,
        groupByCategory: groupByCategory,
        getBySlug: getBySlug,
        getBySector: getBySector,
        getByCategory: getByCategory
    };
})();

// Make available globally
window.ReferenceRenderer = ReferenceRenderer;
