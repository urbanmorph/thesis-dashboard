// js/force-directed-viz.js
export class ForceDirectedVisualization {
  constructor(containerId, data) {
    this.containerId = containerId;
    this.data = data;
    this.width = 1200;
    this.height = 800;
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

    const g = svg.append('g');

    // Add zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Prepare data
    const nodes = this.data.nodes.map(n => ({
      ...n,
      id: n.id,
      label: n.label,
      color: n.color
    }));

    const links = this.data.links.map(l => ({
      ...l,
      source: l.source,
      target: l.target,
      value: l.value
    }));

    // Create force simulation with better spacing
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(250)) // Increased from 150
      .force('charge', d3.forceManyBody().strength(-800)) // Increased repulsion from -400
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(80)); // Increased from 60

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'force-tooltip')
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

    // Define arrow markers for different types
    const defs = svg.append('defs');

    Object.entries(this.data.typeColors).forEach(([type, color]) => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 32) // Position at node edge
        .attr('refY', 0)
        .attr('markerWidth', 5) // Smaller arrows
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L8,0L0,4') // Smaller arrow shape
        .attr('fill', color)
        .attr('opacity', 0.9);
    });

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => this.data.typeColors[d.type])
      .attr('stroke-width', d => Math.max(2, d.value / 10))
      .attr('stroke-opacity', 0.7)
      .attr('marker-end', d => `url(#arrow-${d.type})`)
      .on('mouseover', (event, hoveredEdge) => {
        // Highlight all edges of the same type
        link.each(function(d) {
          const edge = d3.select(this);
          if (d.type === hoveredEdge.type) {
            // Same type - make prominent
            edge.attr('stroke-opacity', 1)
                .attr('stroke-width', Math.max(3, d.value / 8));
          } else {
            // Different type - dim
            edge.attr('stroke-opacity', 0.15)
                .attr('stroke-width', Math.max(1, d.value / 12));
          }
        });

        const sourceNode = nodes.find(n => n.id === hoveredEdge.source.id);
        const targetNode = nodes.find(n => n.id === hoveredEdge.target.id);

        const typeLabel = hoveredEdge.type.charAt(0).toUpperCase() + hoveredEdge.type.slice(1);
        const layerLabel = hoveredEdge.layer.charAt(0).toUpperCase() + hoveredEdge.layer.slice(1);

        tooltip.html(`
          <div class="font-semibold mb-2">${sourceNode.label} → ${targetNode.label}</div>
          <div class="mb-2">
            <span class="inline-block px-2 py-1 rounded text-xs font-semibold mr-2"
                  style="background-color: ${this.data.typeColors[hoveredEdge.type]}20; color: ${this.data.typeColors[hoveredEdge.type]}">
              ${typeLabel}
            </span>
            <span class="inline-block px-2 py-1 rounded text-xs font-semibold"
                  style="background-color: ${this.data.layerColors[hoveredEdge.layer]}20; color: ${this.data.layerColors[hoveredEdge.layer]}">
              ${layerLabel}
            </span>
          </div>
          <div class="text-gray-700 mb-2">${hoveredEdge.quantification}</div>
          <div class="text-xs text-gray-500">${hoveredEdge.citation}</div>
          <div class="mt-2 text-xs font-semibold">Magnitude: ${hoveredEdge.value}</div>
          <div class="mt-2 text-xs text-gray-500 italic">Hover shows all ${typeLabel} relationships</div>
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
      .on('mouseout', () => {
        // Restore all edges to default state
        link.attr('stroke-opacity', 0.7)
            .attr('stroke-width', d => Math.max(2, d.value / 10));
        tooltip.style('visibility', 'hidden');
      });

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Node circles
    node.append('circle')
      .attr('r', d => d.id === 'energy' ? 40 : 30)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke', '#000')
          .attr('stroke-width', 4);

        // Highlight connected links
        link.attr('stroke-opacity', l =>
          l.source.id === d.id || l.target.id === d.id ? 1 : 0.1
        );

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
          .attr('stroke-width', 3);

        // Reset link opacity
        link.attr('stroke-opacity', 0.6);

        tooltip.style('visibility', 'hidden');
      });

    // Node labels
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.id === 'energy' ? 50 : 40)
      .attr('font-size', d => d.id === 'energy' ? '14px' : '11px')
      .attr('font-weight', d => d.id === 'energy' ? 'bold' : 'normal')
      .attr('fill', '#1f2937')
      .text(d => d.label);

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Add legend
    this.addLegend(svg);

    // Add zoom controls hint
    svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#6b7280')
      .text('💡 Drag nodes to rearrange • Scroll to zoom • Hover for details');
  }

  addLegend(svg) {
    const legend = svg.append('g')
      .attr('transform', `translate(20, 50)`);

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
        .attr('transform', `translate(0, ${20 + i * 20})`);

      g.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 30)
        .attr('y2', 0)
        .attr('stroke', type.color)
        .attr('stroke-width', 3)
        .attr('opacity', 0.7);

      g.append('path')
        .attr('d', 'M30,-3L36,0L30,3Z')
        .attr('fill', type.color);

      g.append('text')
        .attr('x', 40)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('font-size', '11px')
        .attr('fill', '#4b5563')
        .text(type.name);
    });
  }

  destroy() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = '';
    }

    // Remove tooltip
    d3.selectAll('.force-tooltip').remove();
  }
}
