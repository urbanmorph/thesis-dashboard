// js/radial-viz.js
export class RadialVisualization {
  constructor(containerId, data, options = {}) {
    this.containerId = containerId;
    this.data = data;
    this.options = {
      centralNodeId: options.centralNodeId || this.detectCentralNode(),
      radius: options.radius || 280,
      width: options.width || 1000,
      height: options.height || 800
    };
    this.width = this.options.width;
    this.height = this.options.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = this.options.radius;
  }

  detectCentralNode() {
    // Find node marked as central
    const centralNode = this.data.nodes.find(n => n.isCentralNode);
    if (centralNode) return centralNode.id;

    // Fallback: node with most connections
    const linkCounts = {};
    this.data.links.forEach(link => {
      linkCounts[link.source] = (linkCounts[link.source] || 0) + 1;
    });
    return Object.entries(linkCounts).sort((a, b) => b[1] - a[1])[0][0];
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
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Prepare data - Central node at center, others in circle
    const centralNode = this.data.nodes.find(n => n.id === this.options.centralNodeId);

    // Only include nodes that are actually connected (appear in links)
    const connectedNodeIds = new Set();
    connectedNodeIds.add(this.options.centralNodeId); // Always include central node
    this.data.links.forEach(link => {
      connectedNodeIds.add(link.source);
      connectedNodeIds.add(link.target);
    });

    const peripheralNodes = this.data.nodes
      .filter(n => n.id !== this.options.centralNodeId && connectedNodeIds.has(n.id));

    // Position nodes in a circle
    const nodes = [
      { ...centralNode, x: this.centerX, y: this.centerY },
      ...peripheralNodes.map((node, i) => {
        const angle = (i / peripheralNodes.length) * 2 * Math.PI - Math.PI / 2;
        return {
          ...node,
          x: this.centerX + this.radius * Math.cos(angle),
          y: this.centerY + this.radius * Math.sin(angle),
          angle: angle
        };
      })
    ];

    // Create tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'radial-tooltip')
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

    // Define arrow markers
    const defs = svg.append('defs');

    Object.entries(this.data.typeColors).forEach(([type, color]) => {
      defs.append('marker')
        .attr('id', `radial-arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 15) // Adjusted for curved arcs
        .attr('refY', 0)
        .attr('markerWidth', 4)
        .attr('markerHeight', 4)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-3L7,0L0,3Z') // Slightly smaller, closed path
        .attr('fill', color)
        .attr('opacity', 0.9);
    });

    // Draw curved links using arcs
    const linkGroup = g.append('g');

    // Group links by source-target pair to handle parallel edges
    const linksByPair = new Map();
    this.data.links.forEach(link => {
      const key = `${link.source}-${link.target}`;
      if (!linksByPair.has(key)) {
        linksByPair.set(key, []);
      }
      linksByPair.get(key).push(link);
    });

    this.data.links.forEach(link => {
      const source = nodes.find(n => n.id === link.source);
      const target = nodes.find(n => n.id === link.target);

      if (!source || !target) return;

      // Find parallel edges
      const pairKey = `${link.source}-${link.target}`;
      const parallelEdges = linksByPair.get(pairKey);
      const edgeIndex = parallelEdges.indexOf(link);
      const totalParallel = parallelEdges.length;

      // Calculate node radii
      const sourceRadius = source.id === this.options.centralNodeId ? 45 : 35;
      const targetRadius = target.id === this.options.centralNodeId ? 45 : 35;

      // Calculate angle and distance
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const angle = Math.atan2(dy, dx);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Adjust start and end points to be at edge of circles
      const sourceX = source.x + sourceRadius * Math.cos(angle);
      const sourceY = source.y + sourceRadius * Math.sin(angle);
      const targetX = target.x - targetRadius * Math.cos(angle);
      const targetY = target.y - targetRadius * Math.sin(angle);

      // Curve radius - vary for parallel edges with more spacing
      let dr = distance * 0.8;
      if (totalParallel > 1) {
        // Offset parallel edges by varying curve radius (increased spacing)
        const offset = (edgeIndex - (totalParallel - 1) / 2) * 0.4;
        dr = distance * (0.6 + offset);
      }

      // Curve away from center for radial layout
      const sweep = source.id === this.options.centralNodeId ? 0 : 1;

      linkGroup.append('path')
        .datum(link)
        .attr('d', `M${sourceX},${sourceY}A${dr},${dr} 0 0,${sweep} ${targetX},${targetY}`)
        .attr('fill', 'none')
        .attr('stroke', this.data.typeColors[link.type])
        .attr('stroke-width', Math.max(2, link.value / 12))
        .attr('stroke-opacity', link.type === 'indirect' ? 0.4 : 0.6)
        .attr('stroke-dasharray', link.type === 'indirect' ? '5,5' : 'none')
        .attr('marker-end', `url(#radial-arrow-${link.type})`)
        .attr('class', `link-${link.type}`)
        .style('display', 'block') // Show all links by default including indirect
        .on('mouseover', (event, d) => {
          // Highlight all links of same type
          linkGroup.selectAll('path').each(function(linkData) {
            const path = d3.select(this);
            if (linkData.type === d.type) {
              path.attr('stroke-opacity', 1)
                  .attr('stroke-width', Math.max(3, linkData.value / 10));
            } else {
              path.attr('stroke-opacity', 0.15);
            }
          });

          const typeLabel = d.type.charAt(0).toUpperCase() + d.type.slice(1);
          const layerLabel = d.layer.charAt(0).toUpperCase() + d.layer.slice(1);

          tooltip.html(`
            <div class="font-semibold mb-2">${source.label} → ${target.label}</div>
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
            <div class="mt-2 text-xs text-gray-500 italic">All ${typeLabel} relationships highlighted</div>
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
          linkGroup.selectAll('path')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.max(2, d.value / 12));
          tooltip.style('visibility', 'hidden');
        });
    });

    // Draw nodes
    const nodeGroup = g.append('g');

    nodes.forEach(node => {
      const nodeG = nodeGroup.append('g')
        .attr('transform', `translate(${node.x},${node.y})`);

      // Node circle
      nodeG.append('circle')
        .attr('r', node.id === this.options.centralNodeId ? 45 : 35)
        .attr('fill', node.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .style('cursor', 'pointer')
        .on('mouseover', (event) => {
          d3.select(event.currentTarget)
            .attr('stroke', '#000')
            .attr('stroke-width', 4);

          // Highlight connected links
          linkGroup.selectAll('path').each(function(d) {
            const path = d3.select(this);
            if (d.source === node.id || d.target === node.id) {
              path.attr('stroke-opacity', 1)
                  .attr('stroke-width', Math.max(3, d.value / 10));
            } else {
              path.attr('stroke-opacity', 0.1);
            }
          });

          tooltip.html(`
            <div class="font-semibold mb-2">${node.label}</div>
            <div class="text-sm text-gray-700">${node.description}</div>
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

          linkGroup.selectAll('path')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.max(2, d.value / 12));

          tooltip.style('visibility', 'hidden');
        });

      // Node label
      nodeG.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', node.id === this.options.centralNodeId ? 55 : 45)
        .attr('font-size', node.id === this.options.centralNodeId ? '14px' : '12px')
        .attr('font-weight', node.id === this.options.centralNodeId ? 'bold' : '600')
        .attr('fill', '#1f2937')
        .text(node.label);
    });

    // Add legend
    this.addLegend(svg);

    // Add zoom hint
    const centralLabel = centralNode ? centralNode.label : 'Center';
    svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('fill', '#6b7280')
      .text(`💡 Scroll to zoom • Hover over nodes/edges for details • ${centralLabel} (center) connects to ${peripheralNodes.length} sectors`);

    // Setup toggle for indirect relationships
    this.setupIndirectToggle(linkGroup);
  }

  setupIndirectToggle(linkGroup) {
    const toggleBtn = document.getElementById('toggle-indirect');
    const toggleText = document.getElementById('toggle-indirect-text');
    let showingIndirect = false;

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        showingIndirect = !showingIndirect;

        // Toggle visibility of indirect links
        linkGroup.selectAll('path').each(function(d) {
          if (d.type === 'indirect') {
            d3.select(this).style('display', showingIndirect ? 'block' : 'none');
          }
        });

        // Update button text
        toggleText.textContent = showingIndirect ? 'Hide Indirect' : 'Show Indirect';
        toggleBtn.classList.toggle('bg-primary', showingIndirect);
        toggleBtn.classList.toggle('text-white', showingIndirect);
        toggleBtn.classList.toggle('bg-gray-100', !showingIndirect);
        toggleBtn.classList.toggle('text-gray-700', !showingIndirect);
      });
    }
  }

  addLegend(svg) {
    const legend = svg.append('g')
      .attr('transform', `translate(20, 50)`);

    legend.append('text')
      .attr('x', 0)
      .attr('y', 0)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .text('Relationship Type');

    const types = [
      { name: 'Synergy', color: this.data.typeColors.synergy, count: 8, dashed: false },
      { name: 'Conflict', color: this.data.typeColors.conflict, count: 3, dashed: false },
      { name: 'Cascade', color: this.data.typeColors.cascade, count: 2, dashed: false },
      { name: 'Conditional', color: this.data.typeColors.conditional, count: 3, dashed: false },
      { name: 'Indirect', color: this.data.typeColors.indirect, count: 10, dashed: true }
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
        .attr('stroke-dasharray', type.dashed ? '4,4' : 'none')
        .attr('opacity', type.dashed ? 0.5 : 0.7);

      g.append('path')
        .attr('d', 'M30,-3L36,0L30,3Z')
        .attr('fill', type.color)
        .attr('opacity', type.dashed ? 0.6 : 1);

      g.append('text')
        .attr('x', 40)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('font-size', '11px')
        .attr('fill', '#4b5563')
        .text(`${type.name} (${type.count})`);
    });
  }

  destroy() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = '';
    }
    d3.selectAll('.radial-tooltip').remove();
  }
}
