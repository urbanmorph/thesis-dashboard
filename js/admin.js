/**
 * Admin Dashboard Logic
 */

const AdminDashboard = (function () {
    // Data storage
    let partnersData = null;
    let fundingData = null;

    /**
     * Initialize admin dashboard
     */
    async function init() {
        // Auth check is handled by auth.js protectPage()
        // No need to check again here to avoid redirect loops

        console.log('Initializing Admin Dashboard...');

        // Load data
        await loadData();

        // Initialize charts
        Charts.initAdminCharts();

        // Populate partner table
        populatePartnerTable();

        // Update stats
        updateStats();

        // Update last updated timestamp
        updateLastUpdated();

        // Set up event listeners
        setupEventListeners();

        console.log('Admin Dashboard initialized');
    }

    /**
     * Load data from storage
     */
    async function loadData() {
        // DataStore disabled - using static data
        console.log('Using static/fallback data (DataStore disabled)');
        partnersData = null;
        fundingData = null;
    }

    /**
     * Update dashboard stats
     */
    function updateStats() {
        if (!partnersData) return;

        // Update MOU count
        const mousSigned = partnersData.partners?.filter(p => p.mouStatus === 'signed').length || 0;
        const totalPartners = partnersData.summary?.total || 16;
        const mouElement = document.getElementById('mous-signed');
        if (mouElement) {
            mouElement.textContent = `${mousSigned}/${totalPartners}`;
        }

        // Update disbursed amount
        const disbursed = fundingData?.disbursed || 0;
        const disbursedElement = document.getElementById('disbursed');
        if (disbursedElement) {
            disbursedElement.textContent = `₹${disbursed} Cr`;
        }
    }

    /**
     * Populate the partner table
     */
    function populatePartnerTable() {
        const tableBody = document.getElementById('partnerTableBody');
        if (!tableBody) return;

        // Partner data for the table
        const partners = [
            { name: 'NRDC India', category: 'Demand', allocation: '₹40-50 Cr', mouStatus: 'pending', progress: 15 },
            { name: 'WRI India', category: 'Demand', allocation: '₹30-40 Cr', mouStatus: 'pending', progress: 10 },
            { name: 'CEEW', category: 'Demand / Circular', allocation: '₹50-60 Cr', mouStatus: 'pending', progress: 20 },
            { name: 'ITDP India', category: 'Demand', allocation: '₹20-25 Cr', mouStatus: 'pending', progress: 5 },
            { name: 'Prayas', category: 'Demand', allocation: '₹15-20 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'Development Alternatives', category: 'Demand', allocation: '₹15-20 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'Ethos Foundation', category: 'Enablers', allocation: '₹12-15 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'Final Mile', category: 'Enablers', allocation: '₹8-12 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'Saahas', category: 'Circular', allocation: '₹18-22 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'TERI', category: 'Circular', allocation: '₹15-20 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'CSTEP', category: 'Circular', allocation: '₹10-15 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'Chintan', category: 'Circular', allocation: '₹8-12 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'Saath', category: 'Circular', allocation: '₹5-8 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'SFC', category: 'Enablers', allocation: '₹8-12 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'Vasudha', category: 'Enablers', allocation: '₹8-12 Cr', mouStatus: 'pending', progress: 0 },
            { name: 'CSE', category: 'Enablers', allocation: '₹10-15 Cr', mouStatus: 'pending', progress: 0 }
        ];

        tableBody.innerHTML = partners.map(partner => `
            <tr>
                <td><strong>${partner.name}</strong></td>
                <td><span class="category-tag ${getCategoryClass(partner.category)}">${partner.category}</span></td>
                <td>${partner.allocation}</td>
                <td>
                    <span class="mou-status ${partner.mouStatus === 'signed' ? 'status-active' : 'status-pending'}">
                        ${partner.mouStatus === 'signed' ? 'Signed' : 'Pending'}
                    </span>
                </td>
                <td>
                    <div class="progress-bar" style="width: 100px; display: inline-block; vertical-align: middle;">
                        <div class="progress-fill" style="width: ${partner.progress}%"></div>
                    </div>
                    <span style="margin-left: 8px; font-size: 0.75rem;">${partner.progress}%</span>
                </td>
                <td>
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="AdminDashboard.viewPartner('${partner.name}')">
                        View
                    </button>
                </td>
            </tr>
        `).join('');
    }

    /**
     * Get category class for styling
     */
    function getCategoryClass(category) {
        if (category.includes('Demand')) return 'demand';
        if (category.includes('Circular')) return 'circular';
        if (category.includes('Enablers')) return 'enablers';
        return '';
    }

    /**
     * Update last updated timestamp
     */
    function updateLastUpdated() {
        const element = document.getElementById('lastUpdated');
        if (element) {
            element.textContent = new Date().toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                refreshBtn.disabled = true;
                refreshBtn.innerHTML = '<span>↻</span> Refreshing...';

                await loadData();
                updateStats();
                populatePartnerTable();
                updateLastUpdated();

                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<span>↻</span> Refresh Data';
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportReport');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportReport);
        }
    }

    /**
     * View partner details
     */
    function viewPartner(name) {
        window.location.href = `admin-partners.html#${name.toLowerCase().replace(/\s+/g, '-')}`;
    }

    /**
     * Export report as JSON
     */
    function exportReport() {
        const report = {
            generatedAt: new Date().toISOString(),
            summary: {
                totalPartners: 16,
                mousSigned: 0,
                totalBudget: '₹253-270 Cr',
                disbursed: '₹0 Cr'
            },
            metrics: {
                energySaved: '0.8 TWh',
                peakDemandAvoided: '0.2 GW',
                buildingsOptimized: '15,000',
                recyclingCapacity: '1,500 tonnes'
            }
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `climate-dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
        viewPartner,
        exportReport
    };
})();
