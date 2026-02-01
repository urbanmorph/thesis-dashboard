# Systems Map Architecture Guide

## Overview

The Systems Map page visualizes cross-sectoral dependencies for focus areas across 9 sectors. It uses a scalable architecture with a master catalog and individual map data files.

**Current Status:** Phase 1 complete - 11 Energy sector maps implemented, Phase 2 in progress - 2 of 7 Transport sector maps implemented

## ⚠️ CRITICAL: Keeping Systems Maps Synchronized

**IMPORTANT:** The Intersections page and the Sectors page must stay synchronized. Whenever you make changes to focus areas in `sectors.html`, you MUST update the corresponding systems maps:

### When to Update Systems Maps:

1. **Focus area added/removed in sectors.html**
   - Add/remove corresponding map entry in `/public/data/systems-map.json`
   - Create/delete the map data file in `/public/data/systems/`
   - Update `totalMaps` count in catalog metadata

2. **Focus area priority changed** (e.g., URGENT → HIGH)
   - Update `priority` field in catalog entry
   - Rename map file to match new priority (e.g., `energy-urgent-3` → `energy-high-3`)
   - Update `dataFile` path in catalog

3. **Focus area description/data changed**
   - Update `description` field in catalog entry
   - Update node descriptions and link quantifications in map data file
   - Ensure cross-sectoral relationships reflect new data points

4. **New cross-sectoral relationships discovered**
   - Add new links to the map data file
   - Update `stats` in catalog entry (relationship counts)
   - Ensure total relationships stay within 8-15 range

5. **Sector baseline data updated** (e.g., new emissions figures)
   - Review all map quantifications for that sector
   - Update numerical values in link `quantification` fields
   - Update `citation` references if sources change

### Sync Checklist:

- [ ] Does the focus area exist in both `sectors.html` AND the systems map catalog?
- [ ] Do the titles match exactly between both pages?
- [ ] Do the descriptions align (allowing for length differences)?
- [ ] Do the priority labels match (🔴 URGENT, 🟠 HIGH, 🟡 MEDIUM, 🟢 FOUNDATIONAL)?
- [ ] Are the quantified impacts in the systems map consistent with the focus area's stated goals?
- [ ] Have new "Addresses" items in sectors.html been reflected as conflict/barrier relationships?
- [ ] Have new "Enables" items in sectors.html been reflected as synergy/cascade relationships?

**Location of Files:**
- Sector focus areas: `/sectors.html` (search for "🎯 Focus Areas")
- Systems map catalog: `/public/data/systems-map.json`
- Individual maps: `/public/data/systems/*.json`

## Data Architecture

### 1. Master Catalog: `/public/data/systems-map.json`

The catalog contains metadata for all available maps:

```json
{
  "meta": {
    "version": "2.0",
    "lastUpdated": "2026-01-31",
    "totalMaps": 11,
    "totalSectors": 1
  },
  "sectors": [
    {
      "id": "energy",
      "name": "Energy",
      "icon": "⚡",
      "color": "#eab308",
      "focusAreaCount": 11
    }
  ],
  "maps": [
    {
      "id": "energy-urgent-1-end-use-efficiency",
      "sectorId": "energy",
      "title": "End-Use Efficiency Mandate",
      "description": "Motors 30%→70%, Pumps 35%→75%...",
      "priority": "urgent",
      "priorityOrder": 1,
      "emoji": "⚡",
      "dataFile": "/data/systems/energy-urgent-1-end-use-efficiency.json",
      "stats": {
        "directRelationships": 16,
        "indirectRelationships": 10,
        "synergies": 8,
        "conflicts": 3,
        "cascades": 2,
        "conditionals": 3,
        "sectors": 9
      }
    }
  ]
}
```

### 2. Individual Map Files: `/public/data/systems/*.json`

Each map contains nodes (sectors) and links (relationships):

```json
{
  "title": "Focus Area Title",
  "description": "Brief description",
  "nodes": [
    {
      "id": "energy",
      "label": "Energy",
      "description": "Sector description",
      "color": "#eab308",
      "isCentralNode": true
    },
    {
      "id": "biodiversity",
      "label": "Biodiversity",
      "description": "Ecosystem health, habitat conservation",
      "color": "#059669"
    }
  ],
  "links": [
    {
      "id": 1,
      "source": "energy",
      "target": "biodiversity",
      "value": 45,
      "type": "synergy",
      "layer": "shared",
      "quantification": "Specific impact measurement with numbers",
      "citation": "Thesis: Source reference"
    }
  ],
  "typeColors": {
    "synergy": "#10b981",
    "conflict": "#ef4444",
    "cascade": "#f59e0b",
    "conditional": "#a855f7",
    "indirect": "#6b7280"
  },
  "layerColors": {
    "governance": "#3b82f6",
    "community": "#10b981",
    "technical": "#6b7280",
    "shared": "#64748b"
  }
}
```

## Creating a New Map

### Step 1: Create the Map Data File

Create a new JSON file in `/public/data/systems/`:

**Naming convention:** `{sector}-{priority}-{order}-{slug}.json`

Example: `energy-urgent-3-solar-panel-eol.json`

**Required fields:**
- `title`: Map title
- `description`: Brief description
- `nodes`: Array of sector nodes (8-15 recommended)
- `links`: Array of relationships (8-15 recommended)
- `typeColors`: Relationship type color mapping
- `layerColors`: Interdependency layer color mapping

### Step 2: Define Nodes

**Central node** (the focus sector):
```json
{
  "id": "energy",
  "label": "Energy",
  "description": "Focus area description",
  "color": "#eab308",
  "isCentralNode": true
}
```

**Peripheral nodes** (connected sectors):
```json
{
  "id": "biodiversity",
  "label": "Biodiversity",
  "description": "Ecosystem health, habitat conservation",
  "color": "#059669"
}
```

**Standard sector colors:**
```javascript
{
  energy: "#eab308",       // Amber
  buildings: "#3b82f6",    // Blue
  transport: "#8b5cf6",    // Purple
  water: "#06b6d4",        // Cyan
  food: "#10b981",         // Green
  industry: "#f97316",     // Orange
  air: "#64748b",          // Slate
  waste: "#84cc16",        // Lime
  neighbourhoods: "#ec4899", // Pink
  biodiversity: "#059669"  // Emerald
}
```

### Step 3: Define Relationships

Each relationship should have:

**Direct relationships** (primary impacts):
```json
{
  "id": 1,
  "source": "energy",
  "target": "biodiversity",
  "value": 60,
  "type": "synergy",
  "layer": "shared",
  "quantification": "20 GW coal retirement → reduced mining footprint → ecosystem recovery",
  "citation": "Thesis: Coal ecosystem impacts"
}
```

**Indirect relationships** (secondary/downstream effects):
```json
{
  "id": 15,
  "source": "air",
  "target": "biodiversity",
  "value": 45,
  "type": "indirect",
  "layer": "shared",
  "quantification": "Via emissions reduction: Better air quality → healthier ecosystems → pollinator recovery",
  "citation": "Thesis: Air-biodiversity cascade"
}
```

**Relationship types:**
- `synergy`: Positive reinforcement, mutual benefits
- `conflict`: Barriers, tensions, implementation challenges
- `cascade`: Self-reinforcing loops, feedback effects
- `conditional`: Depends on policy prerequisites
- `indirect`: Secondary, downstream effects

**Interdependency layers:**
- `governance`: Policy, regulatory frameworks
- `community`: Social, behavioral factors
- `technical`: Infrastructure, technology
- `shared`: Externalities, co-benefits

**Magnitude (0-100):**
- Quantifies relationship strength
- Based on: impact scale, affected population, implementation complexity
- Higher = stronger cross-sectoral dependency

### Step 4: Add to Catalog

Update `/public/data/systems-map.json`:

```json
{
  "id": "energy-urgent-3-solar-panel-eol",
  "sectorId": "energy",
  "title": "Solar Panel EOL Management",
  "description": "299 recycling facilities by 2047",
  "priority": "urgent",
  "priorityOrder": 3,
  "emoji": "☀️",
  "dataFile": "/data/systems/energy-urgent-3-solar-panel-eol.json",
  "stats": {
    "directRelationships": 12,
    "indirectRelationships": 6,
    "synergies": 7,
    "conflicts": 2,
    "cascades": 1,
    "conditionals": 2,
    "sectors": 9
  },
  "shiftsEnabled": ["#6 Material Circularity", "#2 RE as circular resource"],
  "hiddenDynamicsAddressed": ["340 kt waste by 2030", "E-waste Rules 2022 gap"]
}
```

## Best Practices

### Relationship Guidelines

1. **8-15 total relationships per map**
   - Direct: 6-10
   - Indirect: 2-6

2. **Distribution by type:**
   - Synergies: 40-50%
   - Conflicts: 15-25%
   - Cascades: 10-15%
   - Conditionals: 10-15%
   - Indirect: 20-30%

3. **Only include connected sectors**
   - The visualization filters orphaned nodes
   - Only add sectors that have actual relationships

4. **Quantification requirements:**
   - Include specific numbers (%, GW, Cr, etc.)
   - Reference measurable impacts
   - Cite thesis or research source

### Writing Quantifications

**Good examples:**
```
"20 GW coal retirement → reduced mining footprint → ecosystem recovery in mining regions"
"40% lithium from recycling → reduces mining in biodiversity hotspots (Chile, Australia)"
"Cold storage load shifting to solar hours → 30% energy cost reduction → viable rural cold chain"
```

**Poor examples:**
```
"Helps the environment" (too vague)
"Improves things" (no measurement)
"Has an impact" (no quantification)
```

### Magnitude Calibration

**0-25:** Weak/emerging relationship
- Limited scope or early-stage impacts
- Small affected population

**25-50:** Moderate relationship
- Measurable impacts
- Regional or sector-specific effects

**50-75:** Strong relationship
- Significant cross-sectoral dependency
- National-scale impacts
- High implementation complexity

**75-100:** Critical relationship
- Fundamental dependency
- System-wide transformation required
- Major policy/infrastructure changes needed

## Adding New Sectors

To add Transport, Buildings, or other sectors beyond Energy:

### 1. Add sector to catalog

```json
{
  "id": "transport",
  "name": "Transport",
  "icon": "🚗",
  "color": "#8b5cf6",
  "focusAreaCount": 7
}
```

### 2. Create map files

Follow naming convention: `transport-urgent-1-ev-transition.json`

### 3. Update UI (if needed)

The dropdown UI automatically adapts to multiple sectors. No code changes needed unless customizing sector-specific features.

## How the System Works

### Data Flow

```
1. Page loads → systems-map-controller.js initializes
2. Loads /data/systems-map.json (catalog)
3. Populates dropdowns (Sector → Priority → Map)
4. User selects map → Loads /data/systems/{map-file}.json
5. Controller updates:
   - Legend counts (with averages)
   - Sector CTA link
   - Visualization
6. Radial-viz.js renders:
   - Filters to connected nodes only
   - Positions central node at center
   - Arranges peripherals in circle
   - Draws curved arcs (thickness = magnitude)
   - Shows all links (including indirect)
```

### Key Files

- `/systems-map.html` - Page structure, legend, dropdowns
- `/js/systems-map-controller.js` - Map loading, dropdown population, stats calculation
- `/js/radial-viz.js` - D3.js visualization rendering
- `/public/data/systems-map.json` - Master catalog
- `/public/data/systems/*.json` - Individual map data

## Troubleshooting

### Map not appearing in dropdown
- Check catalog has correct `dataFile` path
- Verify `sectorId` matches sector in catalog
- Check `priority` is one of: urgent, high, medium, foundational

### Visualization shows wrong sectors
- Ensure nodes have correct `id` matching link `source`/`target`
- Check `isCentralNode: true` on correct node
- Verify nodes appear in at least one relationship

### Averages not calculating
- Check all links have numeric `value` field
- Ensure `type` is one of: synergy, conflict, cascade, conditional, indirect
- Verify link IDs are unique within map

### Orphaned nodes appearing
- This shouldn't happen - visualization filters them
- If it does, check radial-viz.js `connectedNodeIds` logic

## Future Phases

**Phase 2:** Transport sector (7 maps)
**Phase 3:** Buildings, Air, Water, Waste (27 maps)
**Phase 4:** Neighbourhoods, Food, Biodiversity (22 maps)

Total target: **67 maps across 9 sectors**

Current architecture supports this scale with no code changes - just add map files and catalog entries.
