// systems-map-controller.js
import { RadialVisualization } from './radial-viz.js';

class SystemsMapController {
  constructor() {
    this.catalog = null;
    this.currentMap = null;
    this.currentMapData = null;
    this.currentView = 'radial';
    this.visualization = null;
    this.cache = new Map();
    this.selectedSector = null;
    this.selectedPriority = 'all';
  }

  async initialize() {
    await this.loadCatalog();
    this.renderSectorDropdown();
    this.renderPriorityDropdown();
    this.renderMapDropdown();
    await this.loadInitialMap();
    this.setupEventListeners();
  }

  async loadCatalog() {
    try {
      const response = await fetch('/data/systems-map.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.catalog = await response.json();
      this.selectedSector = this.catalog.sectors[0].id;
      console.log('Catalog loaded:', this.catalog);
    } catch (error) {
      console.error('Failed to load catalog:', error);
      throw error;
    }
  }

  renderSectorDropdown() {
    const select = document.getElementById('sector-select');
    if (!select || !this.catalog) return;

    select.innerHTML = this.catalog.sectors.map(sector => {
      const count = this.catalog.maps.filter(m => m.sectorId === sector.id).length;
      return `<option value="${sector.id}">${sector.icon} ${sector.name} (${count} maps)</option>`;
    }).join('');

    select.value = this.selectedSector;
  }

  renderPriorityDropdown() {
    const select = document.getElementById('priority-select');
    if (!select || !this.catalog) return;

    const sectorMaps = this.catalog.maps.filter(m => m.sectorId === this.selectedSector);
    const priorities = {
      all: sectorMaps.length,
      urgent: sectorMaps.filter(m => m.priority === 'urgent').length,
      high: sectorMaps.filter(m => m.priority === 'high').length,
      medium: sectorMaps.filter(m => m.priority === 'medium').length,
      foundational: sectorMaps.filter(m => m.priority === 'foundational').length
    };

    select.innerHTML = `
      <option value="all">All Priorities (${priorities.all})</option>
      ${priorities.urgent > 0 ? `<option value="urgent">🔴 Urgent (${priorities.urgent})</option>` : ''}
      ${priorities.high > 0 ? `<option value="high">🟠 High (${priorities.high})</option>` : ''}
      ${priorities.medium > 0 ? `<option value="medium">🟡 Medium (${priorities.medium})</option>` : ''}
      ${priorities.foundational > 0 ? `<option value="foundational">🟢 Foundational (${priorities.foundational})</option>` : ''}
    `;

    select.value = this.selectedPriority;
  }

  renderMapDropdown() {
    const select = document.getElementById('map-select');
    if (!select || !this.catalog) return;

    let maps = this.catalog.maps.filter(m => m.sectorId === this.selectedSector);

    if (this.selectedPriority !== 'all') {
      maps = maps.filter(m => m.priority === this.selectedPriority);
    }

    select.innerHTML = maps.map(map =>
      `<option value="${map.id}">${map.emoji} ${map.title} - ${map.stats.directRelationships} Direct, ${map.stats.indirectRelationships} Indirect</option>`
    ).join('');

    if (maps.length > 0 && !this.currentMap) {
      select.value = maps[0].id;
    } else if (this.currentMap) {
      select.value = this.currentMap.id;
    }
  }

  async loadInitialMap() {
    const mapSelect = document.getElementById('map-select');
    if (mapSelect && mapSelect.value) {
      await this.loadMap(mapSelect.value);
    }
  }

  async loadMap(mapId) {
    const mapMeta = this.catalog.maps.find(m => m.id === mapId);
    if (!mapMeta) return;

    // Check cache first
    if (!this.cache.has(mapId)) {
      try {
        const response = await fetch(mapMeta.dataFile);
        if (!response.ok) {
          throw new Error(`Failed to load map data: ${response.status}`);
        }
        this.cache.set(mapId, await response.json());
      } catch (error) {
        console.error('Failed to load map data:', error);
        return;
      }
    }

    this.currentMapData = this.cache.get(mapId);
    this.currentMap = mapMeta;

    this.updateLegendCounts();
    this.updateSectorCTA();
    this.renderVisualization();
  }

  updateSectorCTA() {
    const link = document.getElementById('sector-cta-link');
    if (!link || !this.currentMap) return;

    const sector = this.catalog.sectors.find(s => s.id === this.currentMap.sectorId);
    if (sector) {
      link.href = `sectors.html#${sector.id}`;
      link.textContent = `View ${sector.name} Sector →`;
    }
  }

  updateLegendCounts() {
    if (!this.currentMapData) return;

    const links = this.currentMapData.links;

    // Calculate counts and averages by type
    const stats = {};
    ['synergy', 'conflict', 'cascade', 'conditional', 'indirect'].forEach(type => {
      const typeLinks = links.filter(l => l.type === type);
      stats[type] = {
        count: typeLinks.length,
        avg: typeLinks.length > 0
          ? (typeLinks.reduce((sum, l) => sum + l.value, 0) / typeLinks.length).toFixed(1)
          : '0.0'
      };
    });

    // Update counts
    const synergyEl = document.getElementById('synergy-count');
    const conflictEl = document.getElementById('conflict-count');
    const cascadeEl = document.getElementById('cascade-count');
    const conditionalEl = document.getElementById('conditional-count');
    const indirectEl = document.getElementById('indirect-count');

    if (synergyEl) synergyEl.textContent = `(${stats.synergy.count})`;
    if (conflictEl) conflictEl.textContent = `(${stats.conflict.count})`;
    if (cascadeEl) cascadeEl.textContent = `(${stats.cascade.count})`;
    if (conditionalEl) conditionalEl.textContent = `(${stats.conditional.count})`;
    if (indirectEl) indirectEl.textContent = `(${stats.indirect.count})`;

    // Update averages
    const synergyAvgEl = document.getElementById('synergy-avg');
    const conflictAvgEl = document.getElementById('conflict-avg');
    const cascadeAvgEl = document.getElementById('cascade-avg');
    const conditionalAvgEl = document.getElementById('conditional-avg');
    const indirectAvgEl = document.getElementById('indirect-avg');

    if (synergyAvgEl) synergyAvgEl.textContent = `• Avg: ${stats.synergy.avg}`;
    if (conflictAvgEl) conflictAvgEl.textContent = `• Avg: ${stats.conflict.avg}`;
    if (cascadeAvgEl) cascadeAvgEl.textContent = `• Avg: ${stats.cascade.avg}`;
    if (conditionalAvgEl) conditionalAvgEl.textContent = `• Avg: ${stats.conditional.avg}`;
    if (indirectAvgEl) indirectAvgEl.textContent = `• Avg: ${stats.indirect.avg}`;
  }


  renderVisualization() {
    if (!this.currentMapData) return;

    if (this.visualization && this.visualization.destroy) {
      this.visualization.destroy();
    }

    if (this.currentView === 'radial') {
      this.visualization = new RadialVisualization('radial-viz', this.currentMapData, {
        centralNodeId: this.currentMap.sectorId
      });
      this.visualization.render();
    } else if (this.currentView === 'table') {
      this.renderTable();
    }
  }

  renderTable() {
    const tbody = document.getElementById('table-body');
    if (!tbody || !this.currentMapData) return;

    const nodes = this.currentMapData.nodes;
    const typeColors = {
      synergy: 'text-green-700 bg-green-50',
      conflict: 'text-red-700 bg-red-50',
      cascade: 'text-amber-700 bg-amber-50',
      conditional: 'text-purple-700 bg-purple-50',
      indirect: 'text-gray-700 bg-gray-50'
    };

    tbody.innerHTML = this.currentMapData.links.map(link => {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);

      return `
        <tr class="border-b border-gray-100 hover:bg-gray-50">
          <td class="px-3 py-2">${sourceNode ? sourceNode.label : link.source}</td>
          <td class="px-3 py-2">${targetNode ? targetNode.label : link.target}</td>
          <td class="px-3 py-2">
            <span class="inline-block px-2 py-1 rounded text-xs font-medium ${typeColors[link.type]}">
              ${link.type.charAt(0).toUpperCase() + link.type.slice(1)}
            </span>
          </td>
          <td class="px-3 py-2 text-xs capitalize">${link.layer}</td>
          <td class="px-3 py-2 text-right font-semibold">${link.value}</td>
          <td class="px-3 py-2 text-xs">${link.quantification}</td>
        </tr>
      `;
    }).join('');
  }

  setupEventListeners() {
    // Sector dropdown
    const sectorSelect = document.getElementById('sector-select');
    if (sectorSelect) {
      sectorSelect.addEventListener('change', (e) => {
        this.selectedSector = e.target.value;
        this.selectedPriority = 'all';
        this.renderPriorityDropdown();
        this.renderMapDropdown();
        this.loadInitialMap();
      });
    }

    // Priority dropdown
    const prioritySelect = document.getElementById('priority-select');
    if (prioritySelect) {
      prioritySelect.addEventListener('change', (e) => {
        this.selectedPriority = e.target.value;
        this.renderMapDropdown();
        this.loadInitialMap();
      });
    }

    // Map dropdown
    const mapSelect = document.getElementById('map-select');
    if (mapSelect) {
      mapSelect.addEventListener('change', (e) => {
        this.loadMap(e.target.value);
      });
    }

    // Indirect links toggle (checkbox)
    const indirectCheckbox = document.getElementById('toggle-indirect-checkbox');
    if (indirectCheckbox) {
      indirectCheckbox.addEventListener('change', (e) => {
        const container = document.querySelector('#radial-viz svg');
        if (container) {
          const indirectLinks = container.querySelectorAll('.link-indirect');
          indirectLinks.forEach(link => {
            link.style.display = e.target.checked ? 'block' : 'none';
          });
        }
      });
    }

    // View switcher
    const radialBtn = document.getElementById('view-radial');
    const tableBtn = document.getElementById('view-table');
    const radialViz = document.getElementById('radial-viz');
    const tableViz = document.getElementById('table-viz');

    if (radialBtn && tableBtn) {
      radialBtn.addEventListener('click', () => {
        this.currentView = 'radial';
        radialBtn.classList.add('bg-primary', 'text-white');
        radialBtn.classList.remove('bg-white', 'text-gray-700');
        tableBtn.classList.remove('bg-primary', 'text-white');
        tableBtn.classList.add('bg-white', 'text-gray-700');

        if (radialViz) radialViz.classList.remove('hidden');
        if (tableViz) tableViz.classList.add('hidden');

        this.renderVisualization();
      });

      tableBtn.addEventListener('click', () => {
        this.currentView = 'table';
        tableBtn.classList.add('bg-primary', 'text-white');
        tableBtn.classList.remove('bg-white', 'text-gray-700');
        radialBtn.classList.remove('bg-primary', 'text-white');
        radialBtn.classList.add('bg-white', 'text-gray-700');

        if (radialViz) radialViz.classList.add('hidden');
        if (tableViz) tableViz.classList.remove('hidden');

        this.renderVisualization();
      });
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new SystemsMapController().initialize();
});
