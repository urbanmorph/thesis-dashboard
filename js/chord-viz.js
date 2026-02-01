// js/chord-viz.js
export class ChordVisualization {
  constructor(containerId, data) {
    this.containerId = containerId;
    this.data = data;
    this.width = 800;
    this.height = 800;
    this.innerRadius = Math.min(this.width, this.height) * 0.35;
    this.outerRadius = this.innerRadius + 20;
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
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    // Prepare matrix data
    const { matrix, nodes } = this.prepareMatrixData();

    // Create chord layout
    const chord = d3.chord()
      .padAngle(0.05)
      .sortSubgroups(d3.descending);

    const chords = chord(matrix);

    // Create arc generator for outer ring
    const arc = d3.arc()
      .innerRadius(this.innerRadius)
      .outerRadius(this.outerRadius);

    // Create ribbon generator for connections
    const ribbon = d3.ribbon()
      .radius(this.innerRadius);

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'chord-tooltip')
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

    // Draw outer arcs (sectors)
    const group = g.append('g')
      .selectAll('g')
      .data(chords.groups)
      .join('g');

    group.append('path')
      .attr('d', arc)
      .attr('fill', d => nodes[d.index].color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#000')
          .attr('stroke-width', 3);

        // Highlight connected ribbons
        ribbonGroup.selectAll('path')
          .attr('opacity', r =>
            r.source.index === d.index || r.target.index === d.index ? 0.8 : 0.1
          );

        tooltip.html(`
          <div class="font-semibold mb-2">${nodes[d.index].label}</div>
          <div class="text-sm text-gray-700">${nodes[d.index].description}</div>
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
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);

        // Reset ribbon opacity
        ribbonGroup.selectAll('path')
          .attr('opacity', 0.6);

        tooltip.style('visibility', 'hidden');
      });

    // Add labels
    group.append('text')
      .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr('dy', '0.35em')
      .attr('transform', d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${this.outerRadius + 10})
        ${d.angle > Math.PI ? 'rotate(180)' : ''}
      `)
      .attr('text-anchor', d => d.angle > Math.PI ? 'end' : 'start')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .text(d => nodes[d.index].label);

    // Draw ribbons (connections)
    const ribbonGroup = g.append('g')
      .selectAll('path')
      .data(chords)
      .join('path')
      .attr('d', ribbon)
      .attr('fill', d => {
        // Find the link data to get the type
        const link = this.findLink(nodes[d.source.index].id, nodes[d.target.index].id);
        return link ? this.data.typeColors[link.type] : '#6b7280';
      })
      .attr('opacity', 0.6)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .attr('opacity', 0.9)
          .attr('stroke', '#000')
          .attr('stroke-width', 2);

        // Dim other ribbons
        ribbonGroup.selectAll('path')
          .attr('opacity', r => r === d ? 0.9 : 0.1);

        // Find the link data
        const link = this.findLink(nodes[d.source.index].id, nodes[d.target.index].id);

        if (link) {
          const typeLabel = link.type.charAt(0).toUpperCase() + link.type.slice(1);
          const layerLabel = link.layer.charAt(0).toUpperCase() + link.layer.slice(1);

          tooltip.html(`
            <div class="font-semibold mb-2">${nodes[d.source.index].label} → ${nodes[d.target.index].label}</div>
            <div class="mb-2">
              <span class="inline-block px-2 py-1 rounded text-xs font-semibold mr-2"
                    style="background-color: ${this.data.typeColors[link.type]}20; color: ${this.data.typeColors[link.type]}">
                ${typeLabel}
              </span>
              <span class="inline-block px-2 py-1 rounded text-xs font-semibold"
                    style="background-color: ${this.data.layerColors[link.layer]}20; color: ${this.data.layerColors[link.layer]}">
                ${layerLabel}
              </span>
            </div>
            <div class="text-gray-700 mb-2">${link.quantification}</div>
            <div class="text-xs text-gray-500">${link.citation}</div>
            <div class="mt-2 text-xs font-semibold">Magnitude: ${link.value}</div>
          `)
            .style('visibility', 'visible')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        }
      })
      .on('mousemove', (event) => {
        tooltip
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget)
          .attr('opacity', 0.6)
          .attr('stroke', '#fff')
          .attr('stroke-width', 1);

        // Reset all ribbons
        ribbonGroup.selectAll('path')
          .attr('opacity', 0.6);

        tooltip.style('visibility', 'hidden');
      });

    // Add legend
    this.addLegend(svg);

    // Add title
    svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .text('Cross-Sectoral Dependencies: End-Use Efficiency Mandate');
  }

  prepareMatrixData() {
    const nodes = this.data.nodes;
    const n = nodes.length;

    // Initialize matrix with zeros
    const matrix = Array(n).fill(0).map(() => Array(n).fill(0));

    // Fill matrix with link values
    this.data.links.forEach(link => {
      const sourceIndex = nodes.findIndex(node => node.id === link.source);
      const targetIndex = nodes.findIndex(node => node.id === link.target);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        matrix[sourceIndex][targetIndex] = link.value;
      }
    });

    return { matrix, nodes };
  }

  findLink(sourceId, targetId) {
    return this.data.links.find(link =>
      link.source === sourceId && link.target === targetId
    );
  }

  addLegend(svg) {
    const legend = svg.append('g')
      .attr('transform', `translate(20, ${this.height - 150})`);

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

      g.append('rect')
        .attr('x', 0)
        .attr('y', -8)
        .attr('width', 20)
        .attr('height', 16)
        .attr('fill', type.color)
        .attr('opacity', 0.7);

      g.append('text')
        .attr('x', 25)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('font-size', '11px')
        .attr('fill', '#4b5563')
        .text(type.name);
    });

    // Note
    legend.append('text')
      .attr('x', 0)
      .attr('y', 130)
      .attr('font-size', '10px')
      .attr('fill', '#6b7280')
      .text('Hover over ribbons to see details');
  }

  destroy() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = '';
    }

    // Remove tooltip
    d3.selectAll('.chord-tooltip').remove();
  }
}
