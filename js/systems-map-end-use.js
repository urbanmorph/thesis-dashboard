// js/systems-map-end-use.js
import { RadialVisualization } from './radial-viz.js';
import { TableVisualization } from './table-viz.js';

let radialViz = null;
let tableViz = null;
let currentMapData = null;
let currentMapId = 'end-use';

// Map configurations
const MAPS = {
  'end-use': {
    id: 'end-use',
    title: 'End-Use Efficiency Mandate',
    subtitle: 'ENERGY SECTOR · FOCUS AREA',
    description: 'Cross-sectoral systems analysis showing how mandating efficient motors (30%→70%), pumps (35%→75%), and BEE 5-star appliances creates ripple effects across 8 sectors—from unlocking water pricing reform to enabling cold chain expansion.',
    dataFile: '/data/end-use-efficiency-systems.json',
    stats: {
      synergies: 8,
      barriers: 3,
      cascades: 2,
      conditionals: 3
    },
    keyInsight: 'This intervention has <strong>8 direct synergies + 10 indirect cascades</strong> showing full systems impact. Requires <strong>3 high-threshold parallel interventions</strong> (avg magnitude 70.0). Without ECBC enforcement, pump financing, and cold chain financing, the mandate captures only <strong>30-40% of potential impact</strong>.',
    gradient: 'from-amber-600 to-amber-700',
    icon: '⚡'
  },
  'battery': {
    id: 'battery',
    title: 'Battery Recycling Infrastructure',
    subtitle: 'ENERGY SECTOR · FOCUS AREA',
    description: 'Cross-sectoral systems analysis showing how battery recycling EPR enforcement (60% collection by 2025, 128 GWh capacity by 2030, 40% lithium from recycling) creates circular economy impacts—from reducing import dependency to preventing water contamination.',
    dataFile: '/data/battery-recycling-systems.json',
    stats: {
      synergies: 6,
      barriers: 2,
      cascades: 1,
      conditionals: 1
    },
    keyInsight: 'This intervention has <strong>11 direct relationships + 5 indirect cascades</strong> enabling circular economy. Requires <strong>EPR enforcement + hazardous waste licensing</strong>. Without collection infrastructure and recycling capacity, only <strong>15% of batteries recycled</strong> vs 60% target.',
    gradient: 'from-purple-600 to-purple-700',
    icon: '🔋'
  }
};

// Load map data
async function loadMapData(mapId) {
  try {
    const map = MAPS[mapId];
    const response = await fetch(map.dataFile);
    currentMapData = await response.json();
    currentMapId = mapId;
    console.log(`${map.title} data loaded:`, currentMapData);
    return currentMapData;
  } catch (error) {
    console.error(`Error loading map data for ${mapId}:`, error);
    return null;
  }
}

// Update hero section based on selected map
function updateHeroSection(mapId) {
  const map = MAPS[mapId];
  const heroSection = document.getElementById('dynamic-hero');

  if (!heroSection) return;

  heroSection.className = `bg-gradient-to-br ${map.gradient} text-white p-12 rounded-xl mb-12 shadow-lg`;

  heroSection.innerHTML = `
    <div class="flex items-start gap-4 mb-4">
      <div class="bg-white/20 p-3 rounded-lg">
        <span class="text-3xl">${map.icon}</span>
      </div>
      <div class="flex-1">
        <div class="text-sm font-semibold text-white/80 mb-2">${map.subtitle}</div>
        <h1 class="text-4xl mb-3 font-bold leading-tight text-white">${map.title}</h1>
        <p class="text-lg text-white/95 leading-relaxed mb-4">
          ${map.description}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
      <div class="bg-white/10 px-4 py-3 rounded-lg backdrop-blur-sm">
        <div class="text-white/80 text-xs mb-1">Sectoral Synergies</div>
        <div class="font-bold text-2xl">${map.stats.synergies}</div>
      </div>
      <div class="bg-white/10 px-4 py-3 rounded-lg backdrop-blur-sm">
        <div class="text-white/80 text-xs mb-1">Critical Barriers</div>
        <div class="font-bold text-2xl">${map.stats.barriers}</div>
      </div>
      <div class="bg-white/10 px-4 py-3 rounded-lg backdrop-blur-sm">
        <div class="text-white/80 text-xs mb-1">Cascade Loops</div>
        <div class="font-bold text-2xl">${map.stats.cascades}</div>
      </div>
      <div class="bg-white/10 px-4 py-3 rounded-lg backdrop-blur-sm">
        <div class="text-white/80 text-xs mb-1">Conditional Dependencies</div>
        <div class="font-bold text-2xl">${map.stats.conditionals}</div>
      </div>
    </div>

    <div class="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
      <div class="text-sm font-semibold mb-2">Key Insight</div>
      <p class="text-sm text-white/90">
        ${map.keyInsight}
      </p>
    </div>
  `;
}

// Switch to a different map
async function switchToMap(mapId) {
  console.log(`Switching to map: ${mapId}`);

  // Update card active states
  document.querySelectorAll('.map-card').forEach(card => {
    card.classList.remove('active', 'border-primary', 'bg-primary/5');
    card.classList.add('border-gray-300', 'bg-white');

    // Update badge
    const badge = card.querySelector('div:last-child');
    if (badge && badge.textContent.includes('Currently')) {
      badge.textContent = 'Click to switch';
      badge.className = 'text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded';
    }
  });

  const activeCard = document.getElementById(`map-card-${mapId}`);
  if (activeCard) {
    activeCard.classList.add('active', 'border-primary', 'bg-primary/5');
    activeCard.classList.remove('border-gray-300', 'bg-white');

    // Update badge
    const badge = activeCard.querySelector('div:nth-child(2)');
    if (badge) {
      badge.textContent = 'Currently Viewing';
      badge.className = 'text-xs font-semibold text-primary bg-primary/20 px-2 py-1 rounded';
    }
  }

  // Load new map data
  await loadMapData(mapId);

  // Update hero section
  updateHeroSection(mapId);

  // Re-render current view
  const radialContainer = document.getElementById('radial-container');
  const tableContainer = document.getElementById('table-container');

  if (radialContainer && !radialContainer.classList.contains('hidden')) {
    await renderRadial();
  } else if (tableContainer && !tableContainer.classList.contains('hidden')) {
    await renderTable();
  }
}

// Initialize view switchers
export async function initializeEndUseViews() {
  const viewRadial = document.getElementById('view-radial');
  const viewTable = document.getElementById('view-table');

  const radialContainer = document.getElementById('radial-container');
  const tableContainer = document.getElementById('table-container');

  if (!viewRadial || !viewTable) {
    console.log('View buttons not found');
    return;
  }

  // Load initial map data
  await loadMapData('end-use');
  updateHeroSection('end-use');

  // Setup map card click handlers
  document.getElementById('map-card-end-use')?.addEventListener('click', () => {
    if (currentMapId !== 'end-use') switchToMap('end-use');
  });

  document.getElementById('map-card-battery')?.addEventListener('click', () => {
    if (currentMapId !== 'battery') switchToMap('battery');
  });

  // View switching function
  function switchView(activeView) {
    // Update button states
    [viewRadial, viewTable].forEach(btn => {
      if (btn) {
        btn.classList.remove('bg-primary', 'text-white', 'shadow-sm');
        btn.classList.add('bg-white', 'border-2', 'border-gray-300', 'text-gray-700');
      }
    });

    // Hide all containers
    [radialContainer, tableContainer].forEach(container => {
      if (container) container.classList.add('hidden');
    });

    // Show active view and update button
    switch (activeView) {
      case 'radial':
        if (radialContainer) {
          radialContainer.classList.remove('hidden');
          renderRadial();
        }
        if (viewRadial) {
          viewRadial.classList.remove('bg-white', 'border-2', 'border-gray-300', 'text-gray-700');
          viewRadial.classList.add('bg-primary', 'text-white', 'shadow-sm');
        }
        break;

      case 'table':
        if (tableContainer) {
          tableContainer.classList.remove('hidden');
          renderTable();
        }
        if (viewTable) {
          viewTable.classList.remove('bg-white', 'border-2', 'border-gray-300', 'text-gray-700');
          viewTable.classList.add('bg-primary', 'text-white', 'shadow-sm');
        }
        break;
    }
  }

  // Attach event listeners
  if (viewRadial) {
    viewRadial.addEventListener('click', () => switchView('radial'));
  }

  if (viewTable) {
    viewTable.addEventListener('click', () => switchView('table'));
  }

  // Initialize with Radial view
  switchView('radial');
}

// Render Radial diagram
async function renderRadial() {
  if (!currentMapData) {
    console.error('Map data not available for Radial');
    return;
  }

  console.log('Rendering Radial network...');

  // Destroy existing visualization
  if (radialViz) {
    radialViz.destroy();
  }

  // Create new visualization
  radialViz = new RadialVisualization('radial-viz', currentMapData);
  await radialViz.render();
}

// Render Table
async function renderTable() {
  if (!currentMapData) {
    console.error('Map data not available for Table');
    return;
  }

  console.log('Rendering data table...');

  // Destroy existing visualization
  if (tableViz) {
    tableViz.destroy();
  }

  // Create new visualization
  tableViz = new TableVisualization(currentMapData);
  tableViz.render();
  tableViz.attachEventHandlers();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeEndUseViews);
} else {
  initializeEndUseViews();
}
