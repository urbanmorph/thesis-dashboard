// Systems Map - Cytoscape Network Visualization
// Visualizes cross-sectoral interdependencies across 8 sectors

let cy; // Cytoscape instance
let data; // JSON data
let currentScenario = 'postShift'; // Start with Post-Shift to show synergies
let currentLayer = 'all';
let currentLinkFilter = 'all';
let currentLevel = 1;
let currentTour = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch data
        const response = await fetch('/data/systems-map.json');
        data = await response.json();

        // Initialize Cytoscape
        initCytoscape();

        // Setup event listeners
        setupControls();

        console.log('Systems map initialized successfully');
    } catch (error) {
        console.error('Error initializing systems map:', error);
        document.getElementById('insights-content').textContent =
            'Error loading systems map. Please refresh the page.';
    }
});

function initCytoscape() {
    // Build initial elements (Level 1: 8 sectors)
    const elements = buildLevel1Elements();

    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: elements,
        layout: {
            name: 'circle',
            radius: 200,
            avoidOverlap: true,
            padding: 50
        },
        style: [
            // Sector nodes (Level 1)
            {
                selector: 'node[type="sector"]',
                style: {
                    'background-color': '#e5e7eb',
                    'label': 'data(label)',
                    'width': 100,
                    'height': 100,
                    'font-size': 11,
                    'font-weight': 'bold',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'text-wrap': 'wrap',
                    'text-max-width': 90,
                    'color': '#111827',
                    'border-width': 3,
                    'border-color': '#9ca3af'
                }
            },
            // Focus area nodes (Level 2) - Layer-specific colors
            {
                selector: 'node[layer="governance"]',
                style: {
                    'background-color': '#3b82f6',
                    'color': '#ffffff',
                    'border-color': '#1e40af'
                }
            },
            {
                selector: 'node[layer="community"]',
                style: {
                    'background-color': '#10b981',
                    'color': '#ffffff',
                    'border-color': '#047857'
                }
            },
            {
                selector: 'node[layer="technical"]',
                style: {
                    'background-color': '#6b7280',
                    'color': '#ffffff',
                    'border-color': '#374151'
                }
            },
            {
                selector: 'node[layer="conditional"]',
                style: {
                    'background-color': '#8b5cf6',
                    'color': '#ffffff',
                    'border-color': '#6d28d9'
                }
            },
            {
                selector: 'node[type="focusArea"]',
                style: {
                    'width': 80,
                    'height': 80,
                    'font-size': 12,
                    'font-weight': 'bold',
                    'label': 'data(label)',
                    'text-wrap': 'wrap',
                    'text-max-width': 100,
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#ffffff',
                    'border-width': 2
                }
            },
            // Edge styles by type
            {
                selector: 'edge[type="aggregate"]',
                style: {
                    'line-color': '#6b7280',
                    'target-arrow-color': '#6b7280',
                    'target-arrow-shape': 'triangle',
                    'width': 'data(weight)',
                    'curve-style': 'bezier',
                    'label': 'data(label)',
                    'font-size': 10,
                    'text-background-color': '#ffffff',
                    'text-background-opacity': 0.8,
                    'text-background-padding': 3
                }
            },
            {
                selector: 'edge[type="synergy"]',
                style: {
                    'line-color': '#10b981',
                    'target-arrow-color': '#10b981',
                    'target-arrow-shape': 'triangle',
                    'width': 3,
                    'curve-style': 'bezier',
                    'opacity': 0.8
                }
            },
            {
                selector: 'edge[type="conflict"]',
                style: {
                    'line-color': '#ef4444',
                    'target-arrow-color': '#ef4444',
                    'target-arrow-shape': 'triangle',
                    'width': 3,
                    'curve-style': 'bezier',
                    'opacity': 0.8
                }
            },
            {
                selector: 'edge[type="cascade"]',
                style: {
                    'line-color': '#f59e0b',
                    'target-arrow-color': '#f59e0b',
                    'target-arrow-shape': 'triangle',
                    'width': 3,
                    'curve-style': 'bezier',
                    'opacity': 0.8
                }
            },
            {
                selector: 'edge[type="shared"]',
                style: {
                    'line-color': '#6b7280',
                    'target-arrow-color': '#6b7280',
                    'target-arrow-shape': 'triangle',
                    'width': 3,
                    'curve-style': 'bezier',
                    'line-style': 'dashed',
                    'opacity': 0.8
                }
            },
            // Strength styling
            {
                selector: 'edge[strength="theoretical"]',
                style: {
                    'line-style': 'dashed'
                }
            },
            // Hidden edges (filtered out)
            {
                selector: '.hidden',
                style: {
                    'display': 'none'
                }
            },
            // Highlighted elements (during tours)
            {
                selector: '.highlighted',
                style: {
                    'border-width': 4,
                    'border-color': '#fbbf24',
                    'z-index': 999
                }
            },
            {
                selector: 'edge.highlighted',
                style: {
                    'width': 4,
                    'z-index': 999
                }
            },
            // Dimmed elements (during tours)
            {
                selector: '.dimmed',
                style: {
                    'opacity': 0.2
                }
            },
            // Hover state
            {
                selector: 'node:active',
                style: {
                    'overlay-color': '#fbbf24',
                    'overlay-padding': 10,
                    'overlay-opacity': 0.3
                }
            }
        ]
    });

    // Event handlers
    cy.on('tap', 'node', handleNodeClick);
    cy.on('tap', handleBackgroundClick);

    // Apply initial scenario
    applyScenario(currentScenario);
}

function buildLevel1Elements() {
    const elements = [];

    // Add sector nodes with connection counts
    const sectorNodes = data.nodes.filter(n => n.type === 'sector');
    sectorNodes.forEach(node => {
        const sectorName = node.id.replace('sector-', '');

        // Count connections for this sector
        const focusAreaIds = data.nodes
            .filter(n => n.sector === sectorName && n.level === 2)
            .map(n => n.id);

        const connectionCount = data.edges.filter(e =>
            focusAreaIds.includes(e.source) || focusAreaIds.includes(e.target)
        ).length;

        elements.push({
            group: 'nodes',
            data: {
                id: node.id,
                label: `${node.label}\n(${connectionCount} links)`,
                type: node.type,
                level: node.level,
                description: node.description,
                connectionCount: connectionCount
            }
        });
    });

    // Add aggregated sector-to-sector edges
    const sectorEdges = new Map(); // key: "source|target", value: count

    data.edges.forEach(edge => {
        // Find which sectors the source and target belong to
        const sourceNode = data.nodes.find(n => n.id === edge.source);
        const targetNode = data.nodes.find(n => n.id === edge.target);

        if (sourceNode && targetNode && sourceNode.sector && targetNode.sector) {
            const sourceSector = `sector-${sourceNode.sector}`;
            const targetSector = `sector-${targetNode.sector}`;

            // Only create edges between different sectors
            if (sourceSector !== targetSector) {
                const edgeKey = `${sourceSector}|${targetSector}`;
                const reverseKey = `${targetSector}|${sourceSector}`;

                // Check if reverse edge already exists (to avoid duplicates)
                if (sectorEdges.has(reverseKey)) {
                    sectorEdges.set(reverseKey, sectorEdges.get(reverseKey) + 1);
                } else {
                    sectorEdges.set(edgeKey, (sectorEdges.get(edgeKey) || 0) + 1);
                }
            }
        }
    });

    // Add aggregated edges to elements
    let edgeIndex = 0;
    sectorEdges.forEach((count, edgeKey) => {
        const [source, target] = edgeKey.split('|');

        elements.push({
            group: 'edges',
            data: {
                id: `sector-edge-${edgeIndex++}`,
                source: source,
                target: target,
                type: 'aggregate',
                label: `${count}`,
                weight: count
            }
        });
    });

    return elements;
}

function buildLevel2Elements(sectorId) {
    const elements = [];

    // Get focus areas for this sector
    const focusAreas = data.nodes.filter(n =>
        n.sector === sectorId.replace('sector-', '') && n.level === 2
    );

    // Get edges involving these focus areas
    const focusAreaIds = focusAreas.map(fa => fa.id);
    const relevantEdges = data.edges.filter(e =>
        focusAreaIds.includes(e.source) || focusAreaIds.includes(e.target)
    );

    // Collect all connected node IDs (including cross-sectoral ones)
    const connectedNodeIds = new Set(focusAreaIds);
    relevantEdges.forEach(edge => {
        connectedNodeIds.add(edge.source);
        connectedNodeIds.add(edge.target);
    });

    // Add all connected nodes (both from this sector and connected sectors)
    const allConnectedNodes = data.nodes.filter(n =>
        connectedNodeIds.has(n.id) && n.level === 2
    );

    allConnectedNodes.forEach(node => {
        elements.push({
            group: 'nodes',
            data: {
                id: node.id,
                label: node.label,
                type: node.type,
                level: node.level,
                sector: node.sector,
                layer: node.layer,
                shiftDimension: node.shiftDimension,
                description: node.description,
                currentStatus: node.currentStatus
            }
        });
    });

    // Add edges
    relevantEdges.forEach(edge => {
        elements.push({
            group: 'edges',
            data: {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: edge.type,
                layer: edge.layer,
                strength: edge.strength,
                scenario: edge.scenario,
                description: edge.description,
                quantification: edge.quantification,
                citation: edge.citation
            }
        });
    });

    return elements;
}

function handleNodeClick(evt) {
    const node = evt.target;
    const nodeData = node.data();

    if (currentTour) {
        // Don't allow manual clicks during tour
        return;
    }

    if (nodeData.level === 1) {
        // Drill down to Level 2 (Focus Areas for this sector)
        drillDownToLevel2(nodeData.id);
    } else if (nodeData.level === 2) {
        // Show detailed information in insights panel
        showNodeDetails(nodeData);
    }
}

function handleBackgroundClick(evt) {
    if (evt.target === cy) {
        if (currentTour) {
            // Don't allow zooming out during tour
            return;
        }

        if (currentLevel === 2) {
            // Zoom back out to Level 1
            zoomOutToLevel1();
        }
    }
}

function drillDownToLevel2(sectorId) {
    const elements = buildLevel2Elements(sectorId);

    const nodes = elements.filter(e => e.group === 'nodes');
    const edges = elements.filter(e => e.group === 'edges');

    console.log(`Drilling down to ${sectorId}:`);
    console.log(`  - ${nodes.length} nodes`);
    console.log(`  - ${edges.length} edges`);

    if (nodes.length === 0) {
        console.log('No focus areas found for sector:', sectorId);
        return;
    }

    cy.elements().remove();
    cy.add(elements);

    console.log(`Added to Cytoscape: ${cy.nodes().length} nodes, ${cy.edges().length} edges`);

    cy.layout({
        name: 'cose',
        idealEdgeLength: 150,
        nodeOverlap: 20,
        refresh: 20,
        fit: true,
        padding: 50,
        randomize: false,
        componentSpacing: 100,
        nodeRepulsion: 400000,
        edgeElasticity: 100,
        nestingFactor: 5,
        gravity: 80,
        numIter: 1000,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1.0
    }).run();

    currentLevel = 2;
    const sectorName = sectorId.replace('sector-', '').charAt(0).toUpperCase() + sectorId.replace('sector-', '').slice(1);
    document.getElementById('level-indicator').textContent =
        `Level 2: ${sectorName} Focus Areas (${edges.length} connections)`;

    // Apply current filters
    applyScenario(currentScenario);
    applyLayerFilter(currentLayer);
    applyLinkTypeFilter(currentLinkFilter);

    const visibleEdges = cy.edges().filter(e => !e.hasClass('hidden')).length;
    console.log(`After scenario filter: ${visibleEdges} visible edges (scenario: ${currentScenario})`);

    if (visibleEdges === 0) {
        document.getElementById('insights-content').innerHTML = `
            <p class="text-sm text-amber-600 mb-2">
                <strong>No connections visible in Current State scenario.</strong>
            </p>
            <p class="text-xs text-gray-600">
                Try toggling to <strong>Post-Shift</strong> scenario above to see synergies and cross-sectoral connections.
                The Current State shows primarily conflicts and barriers.
            </p>
        `;
    }
}

function zoomOutToLevel1() {
    const elements = buildLevel1Elements();

    cy.elements().remove();
    cy.add(elements);

    cy.layout({
        name: 'circle',
        radius: 200,
        avoidOverlap: true,
        padding: 50
    }).run();

    currentLevel = 1;
    document.getElementById('level-indicator').textContent = 'Level 1: 8 Sectors';

    // Clear insights
    document.getElementById('insights-content').textContent =
        'Click a node to see details about its cross-sectoral connections.';
}

function showNodeDetails(nodeData) {
    const insightsContent = document.getElementById('insights-content');

    // Get connected edges
    const connectedEdges = cy.edges().filter(edge =>
        edge.data('source') === nodeData.id || edge.data('target') === nodeData.id
    );

    let html = `
        <div class="mb-3">
            <h4 class="font-semibold text-gray-900 mb-1">${nodeData.label}</h4>
            <p class="text-xs text-gray-500 mb-2">
                <span class="bg-${getLayerColor(nodeData.layer)}-100 text-${getLayerColor(nodeData.layer)}-800 px-2 py-1 rounded text-xs font-medium">
                    ${nodeData.layer ? nodeData.layer.charAt(0).toUpperCase() + nodeData.layer.slice(1) : 'N/A'}
                </span>
            </p>
            <p class="text-sm text-gray-700 mb-2">${nodeData.description}</p>
            <p class="text-xs text-gray-600"><strong>Current Status:</strong> ${nodeData.currentStatus}</p>
        </div>
    `;

    if (connectedEdges.length > 0) {
        html += `<div class="mt-4 pt-3 border-t border-gray-200">
            <h5 class="text-sm font-semibold text-gray-900 mb-2">Cross-Sectoral Connections (${connectedEdges.length})</h5>
            <ul class="text-xs text-gray-700 space-y-2">`;

        connectedEdges.forEach(edge => {
            const edgeData = edge.data();
            const otherNodeId = edgeData.source === nodeData.id ? edgeData.target : edgeData.source;
            const otherNode = cy.getElementById(otherNodeId).data();
            const direction = edgeData.source === nodeData.id ? '→' : '←';

            html += `<li>
                <span class="font-medium">${direction} ${otherNode.label}</span><br>
                <span class="text-gray-600">${edgeData.description}</span><br>
                <span class="text-gray-500 italic">${edgeData.quantification || 'Not quantified'}</span>
            </li>`;
        });

        html += `</ul></div>`;
    } else {
        html += `<p class="text-xs text-gray-500 italic mt-2">No cross-sectoral connections at this level.</p>`;
    }

    insightsContent.innerHTML = html;
}

function getLayerColor(layer) {
    const colors = {
        'governance': 'blue',
        'community': 'green',
        'technical': 'gray',
        'conditional': 'purple'
    };
    return colors[layer] || 'gray';
}

function setupControls() {
    // Scenario toggle
    document.getElementById('scenario-current').addEventListener('click', () => {
        setActiveButton('scenario', 'scenario-current');
        currentScenario = 'current';
        applyScenario('current');
    });

    document.getElementById('scenario-post').addEventListener('click', () => {
        setActiveButton('scenario', 'scenario-post');
        currentScenario = 'postShift';
        applyScenario('postShift');
    });

    // Layer filter
    document.getElementById('layer-all').addEventListener('click', () => {
        setActiveButton('layer', 'layer-all');
        currentLayer = 'all';
        applyLayerFilter('all');
    });

    document.getElementById('layer-governance').addEventListener('click', () => {
        setActiveButton('layer', 'layer-governance');
        currentLayer = 'governance';
        applyLayerFilter('governance');
    });

    document.getElementById('layer-community').addEventListener('click', () => {
        setActiveButton('layer', 'layer-community');
        currentLayer = 'community';
        applyLayerFilter('community');
    });

    // Link type filter
    document.getElementById('link-filter').addEventListener('change', (e) => {
        currentLinkFilter = e.target.value;
        applyLinkTypeFilter(e.target.value);
    });

    // Tour buttons
    document.getElementById('tour-1').addEventListener('click', () => playTour('tour-1'));
    document.getElementById('tour-2').addEventListener('click', () => playTour('tour-2'));
    document.getElementById('tour-3').addEventListener('click', () => playTour('tour-3'));
    document.getElementById('tour-stop').addEventListener('click', stopTour);
}

function setActiveButton(group, activeId) {
    if (group === 'scenario') {
        ['scenario-current', 'scenario-post'].forEach(id => {
            const btn = document.getElementById(id);
            if (id === activeId) {
                btn.classList.remove('bg-white', 'border-gray-300', 'text-gray-700');
                btn.classList.add('bg-primary', 'text-white');
            } else {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-white', 'border-gray-300', 'text-gray-700');
            }
        });
    } else if (group === 'layer') {
        ['layer-all', 'layer-governance', 'layer-community'].forEach(id => {
            const btn = document.getElementById(id);
            if (id === activeId) {
                btn.classList.remove('bg-white', 'border-gray-300', 'text-gray-700');
                btn.classList.add('bg-primary', 'text-white');
            } else {
                btn.classList.remove('bg-primary', 'text-white');
                btn.classList.add('bg-white', 'border-gray-300', 'text-gray-700');
            }
        });
    }
}

function applyScenario(scenario) {
    if (currentLevel === 1) return; // No edges at Level 1

    const activeEdgeIds = data.scenarios[scenario].activeEdges;

    cy.edges().forEach(edge => {
        if (activeEdgeIds.includes(edge.data('id'))) {
            edge.removeClass('hidden');
        } else {
            edge.addClass('hidden');
        }
    });
}

function applyLayerFilter(layer) {
    if (currentLevel === 1) return; // No filtering needed at Level 1

    if (layer === 'all') {
        cy.nodes().removeClass('hidden');
    } else {
        cy.nodes().forEach(node => {
            if (node.data('layer') === layer) {
                node.removeClass('hidden');
            } else {
                node.addClass('hidden');
            }
        });
    }
}

function applyLinkTypeFilter(linkType) {
    if (currentLevel === 1) return; // No edges at Level 1

    if (linkType === 'all') {
        cy.edges().removeClass('hidden');
        // Re-apply scenario filter
        applyScenario(currentScenario);
    } else {
        cy.edges().forEach(edge => {
            if (edge.data('type') === linkType) {
                edge.removeClass('hidden');
            } else {
                edge.addClass('hidden');
            }
        });
    }
}

async function playTour(tourId) {
    const tour = data.tours.find(t => t.id === tourId);
    if (!tour) return;

    currentTour = tour;

    // Show narration box
    document.getElementById('tour-narration-box').classList.remove('hidden');

    // Zoom out to Level 1 if needed
    if (currentLevel === 2) {
        zoomOutToLevel1();
        await sleep(500);
    }

    // Play each step
    for (let i = 0; i < tour.steps.length; i++) {
        if (!currentTour) break; // Tour was stopped

        const step = tour.steps[i];
        await playTourStep(step);
        await sleep(step.duration || 4000);
    }

    // End tour
    stopTour();
}

async function playTourStep(step) {
    // Dim all elements
    cy.elements().addClass('dimmed').removeClass('highlighted');

    // Highlight focus nodes
    step.focusNodes.forEach(nodeId => {
        cy.getElementById(nodeId).removeClass('dimmed').addClass('highlighted');
    });

    // Highlight edges
    step.highlightEdges.forEach(edgeId => {
        cy.getElementById(edgeId).removeClass('dimmed').addClass('highlighted');
    });

    // Update narration
    document.getElementById('tour-narration').textContent = step.narration;

    // Pan to center of focus nodes
    const focusElements = cy.collection();
    step.focusNodes.forEach(nodeId => {
        const node = cy.getElementById(nodeId);
        if (node.length > 0) {
            focusElements.merge(node);
        }
    });

    if (focusElements.length > 0) {
        cy.animate({
            fit: { eles: focusElements, padding: 100 },
            duration: 1000
        });
    }
}

function stopTour() {
    currentTour = null;

    // Hide narration box
    document.getElementById('tour-narration-box').classList.add('hidden');

    // Remove all highlighting
    cy.elements().removeClass('dimmed highlighted');

    // Reset view
    cy.fit(50);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
