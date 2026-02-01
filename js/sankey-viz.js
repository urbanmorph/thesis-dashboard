// js/sankey-viz.js
export class SankeyVisualization {
  constructor(containerId, data) {
    this.containerId = containerId;
    this.data = data;
    this.width = 1200;
    this.height = 700;
    this.margin = { top: 20, right: 150, bottom: 20, left: 150 };
  }

  async render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`Container ${this.containerId} not found`);
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Create SVG
    const svg = d3.select(`#${this.containerId}`)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('style', 'max-width: 100%; height: auto;');

    const g = svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    const width = this.width - this.margin.left - this.margin.right;
    const height = this.height - this.margin.top - this.margin.bottom;

    // Prepare Sankey data
    const sankeyData = this.prepareSankeyData();

    // Create Sankey generator
    const sankey = d3.sankey()
      .nodeId(d => d.id)
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[0, 0], [width, height]]);

    // Generate Sankey layout
    const { nodes, links } = sankey(sankeyData);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'sankey-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'white')
      .style('border', '1px solid #d1d5db')
      .style('border-radius', '0.5rem')
      .style('padding', '0.75rem')
      .style('box-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)')
      .style('max-width', '400px')
      .style('font-size', '0.875rem')
      .style('z-index', '1000')
      .style('pointer-events', 'none');

    // Draw links (flows)
    const link = g.append('g')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', d => this.data.typeColors[d.type])
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('opacity', 0.5)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget).attr('opacity', 0.8);

        const typeLabel = d.type.charAt(0).toUpperCase() + d.type.slice(1);
        const layerLabel = d.layer.charAt(0).toUpperCase() + d.layer.slice(1);

        tooltip.html(`
          <div class="font-semibold mb-2">${d.source.label} → ${d.target.label}</div>
          <div class="mb-2">
            <span class="inline-block px-2 py-1 rounded text-xs font-semibold mr-2"
                  style="background-color: ${this.data.typeColors[d.type]}20; color: ${this.data.typeColors[d.type]}">
              ${typeLabel}
            </span>
            <span class="inline-block px-2 py-1 rounded text-xs font-semibold"
                  style="background-color: ${this.data.layerColors[d.layer]}20; color: ${this.data.layerColors[d.layer]}">
              ${layerLabel}
            </span>
          </div>
          <div class="text-gray-700 mb-2">${d.quantification}</div>
          <div class="text-xs text-gray-500">${d.citation}</div>
          <div class="mt-2 text-xs font-semibold">Magnitude: ${d.value}</div>
        `)
          .style('visibility', 'visible')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).attr('opacity', 0.5);
        tooltip.style('visibility', 'hidden');
      });

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g');

    // Node rectangles
    node.append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#000')
          .attr('stroke-width', 3);

        tooltip.html(`
          <div class="font-semibold mb-2">${d.label}</div>
          <div class="text-sm text-gray-700">${d.description}</div>
        `)
          .style('visibility', 'visible')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
        tooltip.style('visibility', 'hidden');
      });

    // Node labels
    node.append('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .text(d => d.label);

    // Add legend
    this.addLegend(svg);
  }

  prepareSankeyData() {
    // Clone nodes
    const nodes = this.data.nodes.map(n => ({ ...n }));

    // Filter links to only show Energy → other sectors (synergies and cascades)
    // This avoids circular flows which Sankey diagrams don't support
    const links = this.data.links
      .filter(l => l.source === 'energy' && (l.type === 'synergy' || l.type === 'cascade'))
      .map(l => ({
        source: l.source,
        target: l.target,
        value: l.value,
        type: l.type,
        layer: l.layer,
        quantification: l.quantification,
        citation: l.citation
      }));

    return { nodes, links };
  }

  addLegend(svg) {
    const legend = svg.append('g')
      .attr('transform', `translate(${this.width - 140}, 20)`);

    // Type legend
    legend.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .text('Relationship Type');

    const types = [
      { name: 'Synergy', color: this.data.typeColors.synergy },
      { name: 'Conflict', color: this.data.typeColors.conflict },
      { name: 'Cascade', color: this.data.typeColors.cascade },
      { name: 'Conditional', color: this.data.typeColors.conditional }
    ];

    types.forEach((type, i) => {
      const g = legend.append('g')
        .attr('transform', `translate(0, ${20 + i * 22})`);

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 20)
        .attr('y2', 0)
        .attr('stroke', type.color)
        .attr('stroke-width', 4)
        .attr('opacity', 0.7);

      g.append('text')
        .attr('x', 25)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('font-size', '11px')
        .attr('fill', '#4b5563')
        .text(type.name);
    });

    // Layer legend
    legend.append('text')
      .attr('x', 0)
      .attr('y', 120)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .text('Layer');

    const layers = [
      { name: 'Governance', color: this.data.layerColors.governance },
      { name: 'Community', color: this.data.layerColors.community },
      { name: 'Technical', color: this.data.layerColors.technical },
      { name: 'Shared', color: this.data.layerColors.shared }
    ];

    layers.forEach((layer, i) => {
      const g = legend.append('g')
        .attr('transform', `translate(0, ${140 + i * 22})`);

      g.append('circle')
        .attr('cx', 10)
        .attr('cy', 0)
        .attr('r', 5)
        .attr('fill', layer.color);

      g.append('text')
        .attr('x', 25)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('font-size', '11px')
        .attr('fill', '#4b5563')
        .text(layer.name);
    });
  }

  destroy() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = '';
    }

    // Remove tooltip
    d3.selectAll('.sankey-tooltip').remove();
  }
}
