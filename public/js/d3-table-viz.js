// js/d3-table-viz.js
export class TableVisualization {
  constructor(data) {
    this.rawData = data;
    this.tableData = this.prepareTableData(data);
    this.filteredData = [...this.tableData];
    this.sortColumn = 'magnitude';
    this.sortDirection = 'desc';
  }

  prepareTableData(rawData) {
    // Use postShift scenario edges (16 total)
    const activeEdges = rawData.scenarios.postShift.activeEdges;

    return rawData.edges
      .filter(e => activeEdges.includes(e.id))
      .map(e => {
        const sourceNode = rawData.nodes.find(n => n.id === e.source);
        const targetNode = rawData.nodes.find(n => n.id === e.target);

        return {
          id: e.id,
          source: sourceNode ? sourceNode.label : e.source,
          target: targetNode ? targetNode.label : e.target,
          type: e.type,
          layer: e.layer,
          quantification: e.quantification,
          magnitude: this.extractMagnitude(e.quantification),
          unit: this.extractUnit(e.quantification),
          citation: e.citation || 'N/A',
          scenario: e.scenario
        };
      });
  }

  extractMagnitude(text) {
    if (!text) return 0;

    // Pattern 1: Percentage (40%, 15-20%, 30% reduction)
    const percentMatch = text.match(/(\d+)%/);
    if (percentMatch) return parseInt(percentMatch[1]);

    // Pattern 2: Range (15-20%, 30-40%)
    const rangeMatch = text.match(/(\d+)-(\d+)%/);
    if (rangeMatch) {
      return Math.round((parseInt(rangeMatch[1]) + parseInt(rangeMatch[2])) / 2);
    }

    // Pattern 3: Arrow transition (15% → 80%)
    const arrowMatch = text.match(/(\d+)%?\s*→\s*(\d+)%/);
    if (arrowMatch) {
      return parseInt(arrowMatch[2]) - parseInt(arrowMatch[1]); // Delta
    }

    // Pattern 4: Absolute numbers (50L, 180M, 100 cities)
    const absoluteMatch = text.match(/(\d+)([LMK]?\s+(?:households|cities|stations|collectors))/);
    if (absoluteMatch) {
      const num = parseInt(absoluteMatch[1]);
      const unit = absoluteMatch[2];

      if (unit.includes('L')) return num; // Lakh as-is for scale
      if (unit.includes('M')) return num; // Million as-is
      return num; // Direct number
    }

    // Pattern 5: Theoretical (no number) - look for keywords
    if (text.toLowerCase().includes('target') ||
        text.toLowerCase().includes('potential') ||
        text.toLowerCase().includes('enables') ||
        text.toLowerCase().includes('visibility')) {
      return 10; // Minimum magnitude for visibility
    }

    return 0;
  }

  extractUnit(text) {
    if (!text) return '';

    if (text.includes('%')) return '%';
    if (text.includes('households')) return 'households';
    if (text.includes('cities')) return 'cities';
    if (text.includes('stations')) return 'stations';
    if (text.includes('collectors')) return 'collectors';

    return '';
  }

  render() {
    const tbody = document.getElementById('table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    const sortedData = this.sortData(this.filteredData);

    sortedData.forEach(row => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer';
      tr.dataset.id = row.id;

      tr.innerHTML = `
        <td class="px-4 py-3 text-gray-900">${row.source}</td>
        <td class="px-4 py-3 text-gray-900">${row.target}</td>
        <td class="px-4 py-3">
          <span class="inline-block px-2 py-1 rounded text-xs font-semibold ${this.getTypeBadgeClass(row.type)}">
            ${this.capitalizeFirst(row.type)}
          </span>
        </td>
        <td class="px-4 py-3">
          <span class="inline-block px-2 py-1 rounded text-xs font-semibold ${this.getLayerBadgeClass(row.layer)}">
            ${this.capitalizeFirst(row.layer)}
          </span>
        </td>
        <td class="px-4 py-3 text-right">
          <span class="font-mono font-bold text-lg text-primary">${row.magnitude}</span>
          <span class="text-xs text-gray-500 ml-1">${row.unit}</span>
        </td>
        <td class="px-4 py-3 text-gray-700 max-w-md">${row.quantification}</td>
        <td class="px-4 py-3">
          <a href="resources.html#${row.citation}"
             class="text-primary text-xs hover:underline"
             title="View citation">
            ${row.citation}
          </a>
        </td>
      `;

      tbody.appendChild(tr);
    });

    this.updateResultsCount();
  }

  sortData(data) {
    return [...data].sort((a, b) => {
      let aVal = a[this.sortColumn];
      let bVal = b[this.sortColumn];

      // Numerical sort for magnitude
      if (this.sortColumn === 'magnitude') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (this.sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }

  attachEventHandlers() {
    // Sort handlers
    document.querySelectorAll('th[data-sort]').forEach(th => {
      th.addEventListener('click', () => {
        const column = th.dataset.sort;

        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = column;
          this.sortDirection = 'desc';
        }

        // Update sort icons
        document.querySelectorAll('.sort-icon').forEach(icon => {
          icon.textContent = '⇅';
          icon.className = 'sort-icon text-gray-400';
        });

        const icon = th.querySelector('.sort-icon');
        icon.textContent = this.sortDirection === 'asc' ? '↑' : '↓';
        icon.className = 'sort-icon text-primary';

        this.render();
      });
    });

    // Search handler
    const searchInput = document.getElementById('table-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.applyFilters();
      });
    }

    // Type filter handlers
    ['synergy', 'conflict', 'cascade', 'shared'].forEach(type => {
      const checkbox = document.getElementById(`filter-${type}`);
      if (checkbox) {
        checkbox.addEventListener('change', () => this.applyFilters());
      }
    });

    // Layer filter handlers
    ['governance', 'community', 'technical', 'conditional'].forEach(layer => {
      const checkbox = document.getElementById(`filter-${layer}`);
      if (checkbox) {
        checkbox.addEventListener('change', () => this.applyFilters());
      }
    });
  }

  applyFilters() {
    const searchQuery = document.getElementById('table-search')?.value.toLowerCase() || '';

    const typeFilters = ['synergy', 'conflict', 'cascade', 'shared']
      .filter(type => document.getElementById(`filter-${type}`)?.checked);

    const layerFilters = ['governance', 'community', 'technical', 'conditional']
      .filter(layer => document.getElementById(`filter-${layer}`)?.checked);

    this.filteredData = this.tableData.filter(row => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        row.source.toLowerCase().includes(searchQuery) ||
        row.target.toLowerCase().includes(searchQuery) ||
        row.quantification.toLowerCase().includes(searchQuery);

      // Type filter
      const matchesType = typeFilters.length === 0 || typeFilters.includes(row.type);

      // Layer filter
      const matchesLayer = layerFilters.length === 0 || layerFilters.includes(row.layer);

      return matchesSearch && matchesType && matchesLayer;
    });

    this.render();
  }

  updateResultsCount() {
    const countEl = document.getElementById('results-count');
    if (countEl) {
      countEl.textContent = this.filteredData.length;
    }
  }

  getTypeBadgeClass(type) {
    const classes = {
      synergy: 'bg-green-100 text-green-700',
      conflict: 'bg-red-100 text-red-700',
      cascade: 'bg-amber-100 text-amber-700',
      shared: 'bg-gray-100 text-gray-700'
    };
    return classes[type] || 'bg-gray-100 text-gray-700';
  }

  getLayerBadgeClass(layer) {
    const classes = {
      governance: 'bg-blue-100 text-blue-700',
      community: 'bg-green-100 text-green-700',
      technical: 'bg-gray-100 text-gray-700',
      conditional: 'bg-purple-100 text-purple-700'
    };
    return classes[layer] || 'bg-gray-100 text-gray-700';
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// View switcher - will be initialized by systems-map.js
export function initializeTableView(data) {
  const tableViz = new TableVisualization(data);

  // View switching
  const viewNetworkBtn = document.getElementById('view-network');
  const viewTableBtn = document.getElementById('view-table');
  const networkContainer = document.getElementById('network-container');
  const tableContainer = document.getElementById('table-container');

  if (viewNetworkBtn && viewTableBtn && networkContainer && tableContainer) {
    viewNetworkBtn.addEventListener('click', () => {
      networkContainer.classList.remove('hidden');
      tableContainer.classList.add('hidden');

      viewNetworkBtn.classList.remove('bg-white', 'border', 'border-gray-300', 'text-gray-700');
      viewNetworkBtn.classList.add('bg-primary', 'text-white');

      viewTableBtn.classList.remove('bg-primary', 'text-white');
      viewTableBtn.classList.add('bg-white', 'border', 'border-gray-300', 'text-gray-700');
    });

    viewTableBtn.addEventListener('click', () => {
      networkContainer.classList.add('hidden');
      tableContainer.classList.remove('hidden');

      viewTableBtn.classList.remove('bg-white', 'border', 'border-gray-300', 'text-gray-700');
      viewTableBtn.classList.add('bg-primary', 'text-white');

      viewNetworkBtn.classList.remove('bg-primary', 'text-white');
      viewNetworkBtn.classList.add('bg-white', 'border', 'border-gray-300', 'text-gray-700');

      // Render table when switched to
      tableViz.render();
      tableViz.attachEventHandlers();
    });
  }

  return tableViz;
}
