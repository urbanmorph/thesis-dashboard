/**
 * Configuration file for India Climate Action Dashboard
 *
 * IMPORTANT: Before deploying, replace the placeholder values below
 * with your actual Supabase credentials.
 *
 * For local development, you can also create a config.local.js file
 * that overrides these values (add it to .gitignore)
 */

const CONFIG = {
    // Supabase Configuration
    // Get these from your Supabase project settings
    supabase: {
        url: 'https://your-project.supabase.co',
        anonKey: 'your-anon-key-here',
        bucket: 'dashboard-data'
    },

    // Data file paths in the Supabase bucket
    dataFiles: {
        metrics: 'metrics.json',
        targets: 'targets.json',
        partners: 'admin/partners.json',
        funding: 'admin/funding.json',
        roadmap: 'admin/roadmap.json'
    },

    // Admin credentials (for demo purposes)
    // In production, use proper authentication
    auth: {
        // These are hashed for basic security
        // Default: admin / climate2026
        credentials: {
            username: 'admin',
            // Simple hash - in production use proper auth
            passwordHash: '62dc210006a043de2e2f6efb18bc7a2d370b88818aaae27b3625451c8a95778b'
        }
    },

    // Dashboard settings
    dashboard: {
        refreshInterval: 300000, // 5 minutes
        animationDuration: 1000,
        chartColors: {
            primary: '#059669',
            secondary: '#0ea5e9',
            demand: '#059669',
            circular: '#8b5cf6',
            enablers: '#f59e0b',
            success: '#22c55e',
            warning: '#f59e0b',
            danger: '#ef4444'
        }
    },

    // Year targets for progress calculation
    targets: {
        year1: {
            energy: 2,          // TWh
            peak: 0.5,          // GW
            buildings: 50000,
            recycling: 5000,    // tonnes
            policies: 5,
            professionals: 5000
        },
        year2: {
            energy: 5,
            peak: 1.5,
            buildings: 200000,
            recycling: 15000,
            policies: 15,
            professionals: 15000
        },
        year3: {
            energy: 10,
            peak: 3,
            buildings: 500000,
            recycling: 40000,
            policies: 30,
            professionals: 30000
        },
        fiveYear: {
            energy: 20,
            peak: 8,
            buildings: 1000000,
            recycling: 100000,
            policies: 50,
            professionals: 50000
        }
    }
};

// Freeze the config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.supabase);
Object.freeze(CONFIG.dataFiles);
Object.freeze(CONFIG.auth);
Object.freeze(CONFIG.dashboard);
Object.freeze(CONFIG.targets);
