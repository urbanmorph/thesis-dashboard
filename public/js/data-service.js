/**
 * Data Service Module
 * Fetches JSON data from Supabase Storage with local fallback
 * Implements caching to minimize API calls
 */

const DataService = (function() {
    const BUCKET = 'dashboard-data';
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    const cache = new Map();

    /**
     * Fetch data from Supabase Storage
     * @param {string} path - Path to file in storage (e.g., 'partners.json')
     * @returns {Promise<Object>} Parsed JSON data
     */
    async function fetchFromStorage(path) {
        const cacheKey = path;
        const cached = cache.get(cacheKey);

        // Return cached data if still valid
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            console.log(`[DataService] Cache hit for ${path}`);
            return cached.data;
        }

        try {
            // Wait for Supabase client to be ready
            await window.waitForSupabase();

            console.log(`[DataService] Fetching from storage: admin/${path}`);
            const { data, error } = await window.supabaseClient.storage
                .from(BUCKET)
                .download(`admin/${path}`);

            if (error) throw error;

            const text = await data.text();
            const json = JSON.parse(text);

            // Cache the result
            cache.set(cacheKey, {
                data: json,
                timestamp: Date.now()
            });

            console.log(`[DataService] Successfully fetched ${path}`);
            return json;

        } catch (error) {
            console.error(`[DataService] Fetch failed for ${path}:`, error);
            console.log(`[DataService] Falling back to local file`);
            return fetchLocalFallback(path);
        }
    }

    /**
     * Fallback to local JSON file
     * @param {string} path - Path to local file
     * @returns {Promise<Object>} Parsed JSON data
     */
    async function fetchLocalFallback(path) {
        try {
            const response = await fetch(`/data/${path}`);
            if (!response.ok) {
                throw new Error(`Local fetch failed: ${response.status}`);
            }
            const json = await response.json();
            console.log(`[DataService] Local fallback successful for ${path}`);
            return json;
        } catch (error) {
            console.error(`[DataService] Local fallback failed for ${path}:`, error);
            return null;
        }
    }

    /**
     * Clear all cached data
     */
    function clearCache() {
        cache.clear();
        console.log('[DataService] Cache cleared');
    }

    // Public API
    return {
        /**
         * Get partners data
         * @returns {Promise<Object>} Partners data with categories and list
         */
        getPartners: () => fetchFromStorage('partners.json'),

        /**
         * Get funders data
         * @returns {Promise<Object>} Funders data with capital stack and philanthropy
         */
        getFunders: () => fetchFromStorage('funders.json'),

        /**
         * Clear the cache (useful for debugging or forcing refresh)
         */
        clearCache: clearCache
    };
})();

// Make available globally
window.DataService = DataService;
