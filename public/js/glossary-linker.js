// Glossary Auto-Linker
// Automatically links technical terms to their glossary definitions

const glossaryTerms = {
    // Energy
    'NDC': 'ndc',
    'ECBC': 'ecbc',
    'EPR': 'epr',
    'PAT': 'pat',
    'Mtoe': 'mtoe',
    'TWh': 'twh',

    // Transport
    'BRT': 'brt',
    'TOD': 'tod',
    'NMT': 'nmt',
    'ZEV': 'zev',
    'FAME': 'fame',

    // Air Quality
    'NCAP': 'ncap',
    'CAAQMS': 'caaqms',
    'PM2.5': 'pm25',
    'AQI': 'aqi',
    'Source Apportionment': 'source-apportionment',
    'TROPOMI': 'tropomi',
    'NO2': 'no2',

    // Buildings
    'IGBC': 'igbc',
    'GRIHA': 'griha',
    'NoTF': 'notf',
    'ASSURE': 'assure',
    'HPB': 'hpb',
    'Embodied Carbon': 'embodied-carbon',
    'Operational Carbon': 'operational-carbon',
    'CREDAI': 'credai',

    // Waste
    'MSW': 'msw',
    'SWM': 'swm',
    'SBM-U': 'sbm-u',
    'ULB': 'ulb',
    'MRF': 'mrf',
    'C&D Waste': 'cd-waste',
    'E-waste': 'e-waste',
    'EBWGR': 'ebwgr',
    'Legacy Waste': 'legacy-waste',
    'TPD': 'tpd',
    'Circular Economy': 'circular-economy',
    'Waste Picker': 'waste-picker',
    'Source Segregation': 'source-segregation',
    'RDF': 'rdf',
    'Bio-methanation': 'bio-methanation',
    'WtE': 'wte',
    'IWMF': 'iwmf',
    'Sanitary Landfill': 'sanitary-landfill',
    'Tipping Fee': 'tipping-fee',
    'Kabadiwala': 'kabadiwala',
    'NGT': 'ngt',
    'Inclusive Circularity': 'inclusive-circularity',

    // Water
    'CGWB': 'cgwb',
    'JJM': 'jjm',
    'STP': 'stp',
    'RWH': 'rwh',
    'NMCG': 'nmcg',
    'BCM': 'bcm',
    'LPCD': 'lpcd',
    'Aquifer': 'aquifer',
    'MLD': 'mld',
    'Treated Water Reuse': 'treated-water-reuse',
    'AMRUT 2.0': 'amrut-20',
    'Tanker Mafia': 'tanker-mafia',
    'CETP': 'cetp',
    'Tertiary Treatment': 'tertiary-treatment',

    // Urban Governance
    '74th CAA': '74th-caa',
    '3Fs': '3fs',
    '12th Schedule': '12th-schedule',
    'Parastatal': 'parastatal',
    'SFC': 'sfc',
    'SEC': 'sec',
    'Ward Committee': 'ward-committee',
    'RWA': 'rwa',
    'BBMP': 'bbmp',
    'MCGM': 'mcgm',
    'Ward': 'ward',

    // Food & Agriculture
    'ASICS': 'asics',
    'MSP': 'msp',
    'FPO': 'fpo',
    'APMC': 'apmc',
    'PDS': 'pds',
    'Packhouse': 'packhouse',
    'NPK Ratio': 'npk-ratio',
    'NBS': 'nbs',

    // Biodiversity
    'CAMPA': 'campa',
    'Lantana': 'lantana',
    'GRACE': 'grace',
    'Natural Capital': 'natural-capital',
    'Ecosystem Services': 'ecosystem-services',
    'TEEB': 'teeb',
    'NCAVES': 'ncaves',
    'Green GDP': 'green-gdp',
    'PES': 'pes',
    'EVP': 'evp'
};

// Function to escape regex special characters
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Function to link terms in a text node
function linkTermsInNode(node) {
    if (!node.nodeValue || node.nodeValue.trim() === '') return;

    // Skip if parent is already a link, heading, code, or script
    let parent = node.parentElement;
    if (!parent) return;

    const skipTags = ['A', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'CODE', 'PRE', 'SCRIPT', 'STYLE', 'BUTTON'];
    if (skipTags.includes(parent.tagName)) return;

    // Also skip if inside data-panel attributes or has specific classes to exclude
    if (parent.hasAttribute('data-panel') || parent.classList.contains('nav-link')) return;

    let text = node.nodeValue;
    let modified = false;
    let fragment = document.createDocumentFragment();
    let lastIndex = 0;

    // Sort terms by length (longest first) to match longer phrases before shorter ones
    const sortedTerms = Object.keys(glossaryTerms).sort((a, b) => b.length - a.length);

    // Find all term matches
    const matches = [];
    sortedTerms.forEach(term => {
        const regex = new RegExp('\\b' + escapeRegex(term) + '\\b', 'g');
        let match;
        while ((match = regex.exec(text)) !== null) {
            matches.push({
                term: term,
                index: match.index,
                length: term.length
            });
        }
    });

    // Sort matches by position
    matches.sort((a, b) => a.index - b.index);

    // Remove overlapping matches (keep first occurrence)
    const filteredMatches = [];
    let lastEnd = -1;
    matches.forEach(match => {
        if (match.index >= lastEnd) {
            filteredMatches.push(match);
            lastEnd = match.index + match.length;
        }
    });

    // Build the new content with links
    filteredMatches.forEach(match => {
        // Add text before the match
        if (match.index > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }

        // Create link
        const link = document.createElement('a');
        link.href = `resources.html#glossary-${glossaryTerms[match.term]}`;
        link.textContent = match.term;
        link.className = 'glossary-link';
        link.style.color = '#10b981';
        link.style.textDecoration = 'underline';
        link.style.textDecorationStyle = 'dotted';
        link.title = `See definition in glossary`;
        fragment.appendChild(link);

        lastIndex = match.index + match.length;
        modified = true;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }

    // Replace the node if we made changes
    if (modified && parent) {
        parent.replaceChild(fragment, node);
    }
}

// Function to walk through all text nodes
function walkTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        linkTermsInNode(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Skip certain elements entirely
        const skipElements = ['SCRIPT', 'STYLE', 'TEXTAREA', 'NAV'];
        if (!skipElements.includes(node.tagName)) {
            // Process child nodes (use array to avoid live NodeList issues)
            Array.from(node.childNodes).forEach(child => walkTextNodes(child));
        }
    }
}

// Run the linker after page loads
function initGlossaryLinker() {
    // Only run on pages that aren't the glossary itself
    if (window.location.pathname.includes('resources.html')) {
        return; // Don't link terms on the glossary page itself
    }

    // Wait for content to be fully loaded
    const contentAreas = document.querySelectorAll('.sector-content, .content-panel, main, article, section');

    if (contentAreas.length > 0) {
        contentAreas.forEach(area => walkTextNodes(area));
    } else {
        // Fallback: process body but skip nav
        const body = document.body;
        if (body) {
            const nav = body.querySelector('nav');
            Array.from(body.childNodes).forEach(child => {
                if (child !== nav) {
                    walkTextNodes(child);
                }
            });
        }
    }

    console.log('Glossary linker initialized - technical terms linked to glossary');
}

// Run after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlossaryLinker);
} else {
    initGlossaryLinker();
}
