/**
 * Supabase Storage Client for Dashboard Data
 *
 * This module handles all data fetching and storage operations
 * using Supabase Storage buckets for JSON/YAML file storage.
 */

const DataStore = (function () {
    let supabaseClient = null;
    let isInitialized = false;

    // Cache for loaded data
    const cache = {
        data: {},
        timestamps: {}
    };

    // Cache duration in milliseconds (5 minutes)
    const CACHE_DURATION = 5 * 60 * 1000;

    /**
     * Initialize the Supabase client
     */
    function init() {
        if (isInitialized) return;

        // Check if Supabase URL is configured
        if (CONFIG.supabase.url === 'https://your-project.supabase.co') {
            console.warn('Supabase not configured. Using local fallback data.');
            isInitialized = true;
            return;
        }

        // Dynamically load Supabase client if not already loaded
        if (typeof supabase === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = () => {
                supabaseClient = supabase.createClient(
                    CONFIG.supabase.url,
                    CONFIG.supabase.anonKey
                );
                isInitialized = true;
            };
            document.head.appendChild(script);
        } else {
            supabaseClient = supabase.createClient(
                CONFIG.supabase.url,
                CONFIG.supabase.anonKey
            );
            isInitialized = true;
        }
    }

    /**
     * Check if data in cache is still valid
     */
    function isCacheValid(key) {
        if (!cache.timestamps[key]) return false;
        return Date.now() - cache.timestamps[key] < CACHE_DURATION;
    }

    /**
     * Fetch JSON data from Supabase bucket
     */
    async function fetchData(filePath, useCache = true) {
        // Check cache first
        if (useCache && isCacheValid(filePath)) {
            return cache.data[filePath];
        }

        // If Supabase not configured, use fallback data
        if (!supabaseClient) {
            return getFallbackData(filePath);
        }

        try {
            const { data, error } = await supabaseClient
                .storage
                .from(CONFIG.supabase.bucket)
                .download(filePath);

            if (error) {
                console.error('Error fetching data:', error);
                return getFallbackData(filePath);
            }

            const text = await data.text();
            const jsonData = JSON.parse(text);

            // Update cache
            cache.data[filePath] = jsonData;
            cache.timestamps[filePath] = Date.now();

            return jsonData;
        } catch (err) {
            console.error('Error parsing data:', err);
            return getFallbackData(filePath);
        }
    }

    /**
     * Upload JSON data to Supabase bucket
     */
    async function uploadData(filePath, data) {
        if (!supabaseClient) {
            console.warn('Supabase not configured. Cannot upload data.');
            return false;
        }

        try {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });

            const { error } = await supabaseClient
                .storage
                .from(CONFIG.supabase.bucket)
                .upload(filePath, blob, {
                    upsert: true,
                    contentType: 'application/json'
                });

            if (error) {
                console.error('Error uploading data:', error);
                return false;
            }

            // Update cache
            cache.data[filePath] = data;
            cache.timestamps[filePath] = Date.now();

            return true;
        } catch (err) {
            console.error('Error uploading data:', err);
            return false;
        }
    }

    /**
     * Get fallback/demo data when Supabase is not available
     */
    function getFallbackData(filePath) {
        const fallbackData = {
            'metrics.json': {
                lastUpdated: new Date().toISOString(),
                current: {
                    energy: 0.8,
                    peak: 0.2,
                    buildings: 15000,
                    recycling: 1500,
                    coolRoofs: 150000,
                    professionals: 2000,
                    policies: 2,
                    states: 3
                }
            },
            'targets.json': CONFIG.targets,
            'admin/partners.json': {
                lastUpdated: new Date().toISOString(),
                partners: [
                    {
                        id: 'nrdc',
                        name: 'NRDC India',
                        tier: 1,
                        category: 'demand',
                        allocation: { min: 40, max: 50 },
                        mouStatus: 'pending',
                        progress: 0,
                        focus: ['Buildings', 'Cool Roofs', 'ECBC']
                    },
                    {
                        id: 'wri',
                        name: 'WRI India',
                        tier: 1,
                        category: 'demand',
                        allocation: { min: 30, max: 40 },
                        mouStatus: 'pending',
                        progress: 0,
                        focus: ['Public Facilities', 'Equity']
                    },
                    {
                        id: 'ceew',
                        name: 'CEEW',
                        tier: 1,
                        category: 'both',
                        allocation: { min: 50, max: 60 },
                        mouStatus: 'pending',
                        progress: 0,
                        focus: ['Cooling', 'Circular Economy', 'Research']
                    },
                    {
                        id: 'itdp',
                        name: 'ITDP India',
                        tier: 1,
                        category: 'demand',
                        allocation: { min: 20, max: 25 },
                        mouStatus: 'pending',
                        progress: 0,
                        focus: ['Transport', 'BRT', 'TOD']
                    }
                ],
                summary: {
                    total: 16,
                    mousSigned: 0,
                    totalBudget: { min: 253, max: 270 }
                }
            },
            'admin/funding.json': {
                lastUpdated: new Date().toISOString(),
                totalBudget: { min: 253, max: 270 },
                disbursed: 0,
                categories: [
                    { name: 'Demand Efficiency', allocation: { min: 145, max: 155 }, percentage: 55 },
                    { name: 'Circular Economy', allocation: { min: 68, max: 75 }, percentage: 30 },
                    { name: 'Enablers', allocation: { min: 40, max: 45 }, percentage: 15 }
                ],
                yearlyPhasing: [
                    { year: 1, allocation: { min: 75, max: 80 }, percentage: 30 },
                    { year: 2, allocation: { min: 100, max: 110 }, percentage: 40 },
                    { year: 3, allocation: { min: 75, max: 80 }, percentage: 30 }
                ]
            },
            'admin/roadmap.json': {
                lastUpdated: new Date().toISOString(),
                currentPhase: 'month1',
                tasks: {
                    month1: [
                        { task: 'Review strategy documents', status: 'done' },
                        { task: 'Finalize portfolio budget', status: 'done' },
                        { task: 'Establish PMU structure', status: 'in_progress' },
                        { task: 'Set up communication channels', status: 'pending' }
                    ]
                }
            }
        };

        return fallbackData[filePath] || {};
    }

    /**
     * Clear the cache
     */
    function clearCache() {
        cache.data = {};
        cache.timestamps = {};
    }

    /**
     * Get metrics data
     */
    async function getMetrics() {
        return fetchData(CONFIG.dataFiles.metrics);
    }

    /**
     * Get targets data
     */
    async function getTargets() {
        return fetchData(CONFIG.dataFiles.targets);
    }

    /**
     * Get partners data (admin only)
     */
    async function getPartners() {
        return fetchData(CONFIG.dataFiles.partners);
    }

    /**
     * Get funding data (admin only)
     */
    async function getFunding() {
        return fetchData(CONFIG.dataFiles.funding);
    }

    /**
     * Get roadmap data (admin only)
     */
    async function getRoadmap() {
        return fetchData(CONFIG.dataFiles.roadmap);
    }

    /**
     * Update metrics data (admin only)
     */
    async function updateMetrics(data) {
        return uploadData(CONFIG.dataFiles.metrics, data);
    }

    /**
     * Update partners data (admin only)
     */
    async function updatePartners(data) {
        return uploadData(CONFIG.dataFiles.partners, data);
    }

    // Initialize on load
    init();

    // Public API
    return {
        init,
        fetchData,
        uploadData,
        clearCache,
        getMetrics,
        getTargets,
        getPartners,
        getFunding,
        getRoadmap,
        updateMetrics,
        updatePartners
    };
})();
