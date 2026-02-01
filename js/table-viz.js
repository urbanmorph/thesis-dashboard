// js/table-viz.js
export class TableVisualization {
  constructor(data) {
    this.rawData = data;
    this.tableData = this.prepareTableData(data);
    this.filteredData = [...this.tableData];
    this.sortColumn = 'magnitude';
    this.sortDirection = 'desc';
  }

  prepareTableData(rawData) {
    return rawData.links.map(link => {
      const sourceNode = rawData.nodes.find(n => n.id === link.source);
      const targetNode = rawData.nodes.find(n => n.id === link.target);

      return {
        id: link.id,
        source: sourceNode ? sourceNode.label : link.source,
        target: targetNode ? targetNode.label : link.target,
        type: link.type,
        layer: link.layer,
        quantification: link.quantification,
        magnitude: link.value,
        citation: link.citation || 'Thesis analysis'
      };
    });
  }

  render() {
    const tbody = document.getElementById('table-body');
    if (!tbody) {
      console.error('Table body not found');
      return;
    }

    tbody.innerHTML = '';

    const sortedData = this.sortData(this.filteredData);

    sortedData.forEach(row => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer';
      tr.dataset.id = row.id;

      tr.innerHTML = `
        <td class="px-4 py-3 text-gray-900 font-medium">${row.source}</td>
        <td class="px-4 py-3 text-gray-900 font-medium">${row.target}</td>
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
        </td>
        <td class="px-4 py-3 text-gray-700 text-sm max-w-md">${row.quantification}</td>
        <td class="px-4 py-3 text-xs text-gray-500">${row.citation}</td>
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
      searchInput.addEventListener('input', () => {
        this.applyFilters();
      });
    }

    // Type filter handlers
    ['synergy', 'conflict', 'cascade', 'conditional'].forEach(type => {
      const checkbox = document.getElementById(`filter-${type}`);
      if (checkbox) {
        checkbox.addEventListener('change', () => this.applyFilters());
      }
    });

    // Layer filter handlers
    ['governance', 'community', 'technical', 'shared'].forEach(layer => {
      const checkbox = document.getElementById(`filter-${layer}`);
      if (checkbox) {
        checkbox.addEventListener('change', () => this.applyFilters());
      }
    });
  }

  applyFilters() {
    const searchQuery = document.getElementById('table-search')?.value.toLowerCase() || '';

    const typeFilters = ['synergy', 'conflict', 'cascade', 'conditional']
      .filter(type => document.getElementById(`filter-${type}`)?.checked);

    const layerFilters = ['governance', 'community', 'technical', 'shared']
      .filter(layer => document.getElementById(`filter-${layer}`)?.checked);

    this.filteredData = this.tableData.filter(row => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        row.source.toLowerCase().includes(searchQuery) ||
        row.target.toLowerCase().includes(searchQuery) ||
        row.quantification.toLowerCase().includes(searchQuery) ||
        row.type.toLowerCase().includes(searchQuery) ||
        row.layer.toLowerCase().includes(searchQuery);

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
      conditional: 'bg-purple-100 text-purple-700'
    };
    return classes[type] || 'bg-gray-100 text-gray-700';
  }

  getLayerBadgeClass(layer) {
    const classes = {
      governance: 'bg-blue-100 text-blue-700',
      community: 'bg-green-100 text-green-700',
      technical: 'bg-gray-100 text-gray-700',
      shared: 'bg-gray-100 text-gray-600'
    };
    return classes[layer] || 'bg-gray-100 text-gray-700';
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  destroy() {
    // Clean up event listeners if needed
  }
}
