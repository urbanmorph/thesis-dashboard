# Development Guide - India Progress Monitor

## Overview

This project is a 9-page static HTML dashboard that has been migrated to use **Tailwind CSS** with **Vite** as the build tool. All styling is done with Tailwind utility classes inline in the HTML.

## Technology Stack

- **HTML** - 10 static pages (login, index, thesis, resources, sectors, 5 admin pages)
- **Tailwind CSS v3** - Utility-first CSS framework
- **Vite** - Build tool with fast HMR (Hot Module Replacement)
- **Vanilla JavaScript** - No framework, uses ES modules
- **Supabase** - Authentication and data storage
- **Chart.js** - Data visualization on admin pages

## Project Structure

```
thesis-dashboard/
├── css/
│   └── main.css                 # Tailwind directives only
├── js/                          # Vanilla JavaScript modules
│   ├── supabase-config.js
│   ├── admin-auth.js
│   ├── config.js
│   ├── charts.js
│   └── *.js
├── public/                      # Static assets (served as-is)
│   ├── data/                    # JSON data files
│   └── js/                      # JavaScript copied from /js
├── *.html                       # 9 HTML pages
├── package.json                 # npm dependencies and scripts
├── vite.config.js               # Multi-page build configuration
├── tailwind.config.js           # Tailwind customization
└── postcss.config.js            # PostCSS with Tailwind plugin
```

## Development Workflow

### Installing Dependencies

```bash
npm install
```

### Starting Development Server

```bash
npm run dev
```

- Opens at `http://localhost:5173`
- Hot Module Replacement (HMR) - changes appear instantly
- All pages accessible directly (e.g., `/sectors.html`, `/admin.html`)

### Building for Production

```bash
npm run build
```

- Output goes to `dist/` directory
- All HTML pages are processed
- CSS is minified and purged (only used classes included)
- Current production CSS: **21.87 KB** (4.69 KB gzipped)

### Preview Production Build

```bash
npm run preview
```

- Serves the `dist/` directory locally
- Test production build before deploying

## Styling with Tailwind CSS

### Core Principles

1. **Utility-First**: All styling is done with utility classes directly in HTML
2. **No @apply**: Avoid extracting classes - keep HTML as single source of truth
3. **Responsive**: Use `md:`, `lg:` prefixes for breakpoints (480px, 768px, 992px)
4. **Custom Colors**: Defined in `tailwind.config.js` (primary, dark, accent, etc.)

### Design Tokens (tailwind.config.js)

```javascript
colors: {
  primary: { DEFAULT: '#10b981', dark: '#059669', light: '#34d399' },
  dark: { DEFAULT: '#0f172a', 800: '#1e293b', 700: '#334155' },
  accent: { DEFAULT: '#8b5cf6', light: '#a78bfa' },
}
spacing: {
  xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem',
  xl: '2rem', '2xl': '3rem', '3xl': '4rem'
}
```

### Common Patterns

#### Navbar (All Pages)
```html
<nav class="bg-white/95 border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-[100] backdrop-blur-sm">
  <div class="flex items-center gap-2">
    <span class="text-2xl">🌱</span>
    <span class="text-lg font-bold text-dark">India Progress Monitor</span>
  </div>
  <div class="flex items-center gap-1">
    <a href="index.html" class="bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-lg">Dashboard</a>
  </div>
</nav>
```

#### Admin Navbar (Dark Variant)
```html
<nav class="bg-dark border-b border-gray-700 px-8 py-4 flex justify-between items-center sticky top-0 z-[100]">
  <div class="flex items-center gap-2">
    <span class="text-2xl">🌱</span>
    <span class="text-lg font-bold text-white">India Progress Monitor</span>
    <span class="bg-primary text-white text-xs font-bold px-2 py-1 rounded ml-2">ADMIN</span>
  </div>
</nav>
```

#### Hero Section
```html
<section class="bg-gradient-to-br from-dark to-dark-800 text-white p-16 rounded-xl mb-12">
  <h1 class="text-5xl mb-4 font-bold leading-tight text-white">Page Title</h1>
  <p class="text-lg text-white/90 leading-relaxed">Subtitle text</p>
</section>
```

#### Cards
```html
<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
  <h3 class="text-lg font-semibold text-gray-900 mb-4">Card Title</h3>
  <p class="text-sm text-gray-600">Card content</p>
</div>
```

#### Buttons
```html
<!-- Primary -->
<button class="bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors duration-150">
  Click Me
</button>

<!-- Secondary -->
<button class="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-150">
  Cancel
</button>
```

#### Responsive Grids
```html
<!-- 2-column -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
</div>

<!-- 3-column -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

#### Tables
```html
<div class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
  <table class="w-full text-sm text-left">
    <thead class="bg-gray-50 border-b border-gray-200">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Header</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="px-6 py-4 border-b border-gray-200">Cell</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Adding New Features

### Adding a New HTML Page

1. Create `new-page.html` in root directory
2. Add to `vite.config.js` input:
```javascript
input: {
  main: resolve(__dirname, 'index.html'),
  newpage: resolve(__dirname, 'new-page.html'), // Add this line
  // ... other pages
}
```
3. Use existing page as template for navbar and structure
4. Style with Tailwind utility classes

### Adding Custom Styles

**Avoid this when possible** - use Tailwind utilities instead. If absolutely needed:

1. Add to `tailwind.config.js` theme extension:
```javascript
extend: {
  colors: {
    'custom-blue': '#1e40af'
  }
}
```

2. For one-off utilities, use arbitrary values:
```html
<div class="bg-[#1e40af]">Custom color</div>
```

### Tab Switching Pattern

For pages with tabs (sectors.html, resources.html), use this JavaScript pattern:

```javascript
document.querySelectorAll('.tab-button').forEach(tab => {
  tab.addEventListener('click', () => {
    // Update tab styles
    document.querySelectorAll('.tab-button').forEach(t => {
      t.classList.remove('bg-dark', 'border-dark', 'text-white');
      t.classList.add('bg-white', 'border-gray-300', 'text-gray-700');
    });
    tab.classList.remove('bg-white', 'border-gray-300', 'text-gray-700');
    tab.classList.add('bg-dark', 'border-dark', 'text-white');

    // Update panel visibility
    document.querySelectorAll('.content-panel').forEach(c => {
      c.classList.add('hidden');
      c.classList.remove('block');
    });
    const panelId = tab.dataset.panel;
    document.getElementById(panelId).classList.remove('hidden');
    document.getElementById(panelId).classList.add('block');
  });
});
```

## Deployment

### Vercel (Current Setup)

The project is configured for Vercel with `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

**Deployment Steps:**
1. Push changes to main branch
2. Vercel auto-deploys from `dist/` directory
3. No additional configuration needed

### Manual Deployment

1. Build: `npm run build`
2. Upload contents of `dist/` directory to static host
3. Ensure server is configured to serve static files

## Performance Characteristics

- **CSS Bundle**: 21.87 KB (4.69 KB gzipped) - 75% smaller than before
- **Build Time**: ~650ms
- **HMR**: Instant updates during development
- **Purging**: Only used Tailwind classes included in production

## Breakpoints

```
sm:  480px   (mobile landscape)
md:  768px   (tablet)
lg:  992px   (desktop)
```

Use mobile-first approach:
```html
<!-- Base (mobile), then override for larger screens -->
<div class="text-sm md:text-base lg:text-lg">Responsive text</div>
```

## Common Tasks

### Update a Color
Edit `tailwind.config.js` and rebuild - all instances update automatically.

### Add Hover Effect
```html
<div class="hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
  Hover me
</div>
```

### Debug Styling
1. Inspect element in browser DevTools
2. See all applied Tailwind classes
3. Add/remove classes directly to test

### Check Bundle Size
```bash
npm run build
# Look for "dist/assets/main-*.css" size in output
```

## Important Notes

- **No legacy CSS**: All old CSS files removed (dashboard.css, styles.css, thesis.css)
- **Inline only**: Never use `<style>` tags - use Tailwind utilities
- **JavaScript modules**: Not bundled by Vite - kept on CDN (Supabase, Chart.js)
- **Responsive testing**: Test at 375px (mobile), 768px (tablet), 1440px (desktop)

## Admin Data Storage (IMPORTANT)

**Admin page data is PRIVATE and stored in Supabase Storage, NOT in git.**

### Data Location
- **Supabase Bucket**: `dashboard-data/admin/`
- **Files**: `partners.json`, `funders.json`, `funding.json`

### Rules for Admin Data
1. **NEVER commit admin JSON data to git** - it contains confidential partner information
2. **NEVER create local JSON files** in `public/data/` for admin pages
3. **Always use `DataService`** (js/data-service.js) to fetch admin data from Supabase
4. **Upload data via Supabase CLI**:
   ```bash
   supabase storage cp <file> ss:///dashboard-data/admin/<file> --experimental
   ```

### How Dynamic Admin Pages Work
1. `data-service.js` fetches JSON from Supabase Storage bucket
2. Falls back to local `/data/*.json` ONLY for development (files are gitignored)
3. Renderer modules (`partner-renderer.js`, `funder-renderer.js`) generate HTML dynamically

### Adding New Admin Data
1. Create JSON structure locally for testing
2. Upload to Supabase Storage: `supabase storage cp file.json ss:///dashboard-data/admin/file.json --experimental`
3. Add the local file path to `.gitignore`
4. Create a renderer module in `js/` if needed
5. Update the HTML page to use dynamic containers

## Citation & Reference System (IMPORTANT)

**All data source citations use semantic slug IDs that link to specific references.**

### Reference Mapping File
- **Location**: `public/data/reference-mapping.json`
- **Purpose**: Source of truth for all ~180 data source references
- **Format**: Contains display number, semantic slug ID, full citation text, URL, and sector

### Semantic Slug Convention
Format: `ref-{org}-{topic}-{year}`

Examples:
| Reference | Slug ID |
|-----------|---------|
| CPCB. (2024). Annual Report on SWM Rules | `ref-cpcb-swm-annual-2024` |
| MoHUA. (2024). SBM Urban 2.0 Progress | `ref-mohua-sbm-2024` |
| TERI. (2023). State of Waste Management | `ref-teri-waste-management-2023` |

### Rules for Adding New Data Sources
1. **ALWAYS update `public/data/reference-mapping.json`** when adding new references
2. Add the new reference to the appropriate section in `resources.html` with:
   - Sequential number (update `start=` attribute if needed)
   - Semantic `id="ref-{slug}"` attribute
3. In sector pages, use `href="resources.html#ref-{slug}"` (not `#references`)
4. Include `title="Source Name"` attribute for hover preview
5. Keep display numbers `[83]` in citation text for readability

### Citation Link Format
```html
<!-- In sectors.html or other pages -->
<a href="resources.html#ref-cpcb-swm-annual-2024" title="CPCB Annual Report 2024">[83]</a>
```

### Why Semantic Slugs?
- **Future-proof**: Adding/reordering references doesn't break links
- **Self-documenting**: ID tells you what it references
- **Grep-friendly**: Can search codebase for specific sources

## Strategic Frameworks

### Theory of Change for Sectoral Transformation

**All 9 sectoral pages follow a 4-stage diagnostic process:**

1. **Diagnose** - Identify hidden dynamics blocking this sector
2. **Partner** - Map actors already working on solutions
3. **Remove** - Design targeted interventions to eliminate barriers
4. **Scale** - Once dynamics are addressed, solutions spread naturally

### 7 Categories of Hidden Dynamics

**Standardized framework used across all sectors:**

| Category | Description | Example Questions |
|----------|-------------|-------------------|
| 1. **Ownership & Demands** | Who owns the problem? Do incentives align? | Split incentives in buildings, first-mile waste ownership |
| 2. **Culture & Narrative** | What beliefs/norms block change? | AC as status symbol, stigma around manual waste sorting |
| 3. **Capacity & Skills** | What capabilities are missing? | ECBC compliance verification, AC testing labs |
| 4. **Data & Evidence** | What information gaps exist? | Real-time building energy use, waste composition audits |
| 5. **Policy & Regulation** | What rules enable/block progress? | Star labeling gaps, RWA governance powers |
| 6. **Finance & Capital** | What financial barriers exist? | High upfront costs for retrofits, thin margins for aggregators |
| 7. **Market & Procurement** | What market failures block adoption? | Fragmented supply chains, lack of aggregated demand |

### Paradigm Shift Framework

**Paradigm shifts are the FUNDAMENTAL LENS for all sectoral analysis.**

#### Why Paradigm Shifts vs Interventions?

Traditional approaches track **interventions** (solar GW installed, AQI measurements, ECBC buildings). Paradigm shift approach tracks the **CAUSES** that enable interventions (prosumer mindset, health-AQ visibility, buyer demand for efficiency).

**The Causal Chain:**
```
Paradigm Shift → Removes Hidden Dynamic → Enables Strategy → Produces Intervention → Creates Outcome
```

**Example from Buildings:**
1. **Shift 3**: Passive owners → Active demanders (paradigm change)
2. **Removes**: Split incentives (developers minimize cost, buyers pay bills)
3. **Enables**: Energy disclosure at transaction (strategy)
4. **Produces**: Mandatory EPCs for sale/rent (intervention)
5. **Creates**: 30% building energy intensity reduction (outcome)

#### Why Paradigm Shifts Are Superior Predictors

1. **Durability**: Persist beyond policy changes; self-reinforcing
2. **Scalability**: One shift enables multiple interventions
3. **Systemic**: Address root causes, not symptoms
4. **Leading indicators**: Signal transformation before outcomes appear

#### The 6 Universal Paradigm Shift Dimensions

**These apply to ANY sector:**

| Dimension | Question | Examples |
|-----------|----------|----------|
| 1. **Ontological** | What is the sector FOR? | Buildings: Human comfort → Living ecosystems<br>Energy: kWh sold → Reliable access<br>Air: Invisible externality → Visible health commons |
| 2. **Reframing** | How do we TALK about it? | Buildings: Problem contributors → Solution mediums<br>Energy: Coal necessity → Managed transition<br>Air: Monitoring → Solving at source |
| 3. **Agency** | Who DRIVES change? | Buildings: Passive owners → Active demanders<br>Energy: Passive consumers → Active prosumers<br>Air: Passive victims → Active protectors |
| 4. **Governance** | How are DECISIONS made? | Buildings: Top-down mandates → Collective action<br>Energy: DISCOM monopoly → Open market<br>Air: City silos → Airshed coordination |
| 5. **Time Horizon** | Optimize for WHEN? | Buildings: Construction cost → Lifecycle value<br>Energy: Peak adequacy → System flexibility<br>Air: Crisis response → Prevention |
| 6. **Objectives** | What do we MEASURE? | Buildings: Carbon only → Multi-dimensional systems<br>Energy: Supply-side → Demand-side optimization<br>Air: PM2.5 only → Multi-pollutant + health |

#### How to Identify Paradigm Shifts for a Sector

**Process:**
1. Read Section 4 (Hidden Dynamics) - identify the 7-category barriers
2. For each dimension (1-6), ask: "What fundamental belief blocks progress?"
3. Define the OLD paradigm (current dominant mindset)
4. Define the NEW paradigm (transformational mindset)
5. Identify the **Breakthrough Moment** - when is the shift irreversible?
6. Map which Hidden Dynamics this shift addresses

**Template:**
```
Shift [N]: [OLD PARADIGM] → [NEW PARADIGM]

What This Looks Like:
- Example 1 (concrete manifestation)
- Example 2 (concrete manifestation)
- Example 3 (concrete manifestation)

Breakthrough Moment:
When [SPECIFIC SIGNAL] happens, this shift becomes irreversible.

Addresses Hidden Dynamic: [Category X] - [Specific barrier]
```

#### Breakthrough Moments

**Definition**: An irreversibility signal - once this happens, the paradigm shift cannot be undone.

**Characteristics:**
- **Tangible**: Can be observed/measured
- **Tipping point**: Creates self-reinforcing feedback loop
- **Market/cultural**: Often non-policy triggers
- **Specific**: Not vague ("awareness increases") but concrete ("50% of buyers ask for EPC")

**Examples:**
- Buildings: "When 50% of buyers ask for energy performance certificates before purchase"
- Energy: "When DISCOMs compete on reliability metrics, not just tariff"
- Air: "When real estate prices reflect AQI differentials (₹500/sqft premium for <50 AQI zones)"

#### Section 5 (SHIFT) Structure

**HTML Template:**
```html
<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8 border-l-4 border-l-blue-500">
  <h3 class="text-xl font-semibold text-gray-900 mb-6">🌟 Shift: The Six Paradigm Transformations</h3>

  <!-- Shift 1 -->
  <div class="mb-6 pb-6 border-b border-gray-200">
    <div class="flex items-start gap-4">
      <span class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">1</span>
      <div class="flex-1">
        <h4 class="text-lg font-semibold text-gray-900 mb-3">Ontological: [OLD] → [NEW]</h4>
        <p class="text-sm text-gray-700 mb-4">[1-2 sentence explanation of shift]</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <!-- What This Looks Like -->
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-gray-700 mb-2">What This Looks Like</p>
            <ul class="text-xs text-gray-600 space-y-1">
              <li>• Example 1 with data <a href="resources.html#ref-slug">[N]</a></li>
              <li>• Example 2 with data <a href="resources.html#ref-slug">[N]</a></li>
              <li>• Example 3 with data <a href="resources.html#ref-slug">[N]</a></li>
            </ul>
          </div>

          <!-- Breakthrough Moment -->
          <div class="bg-blue-50 rounded-lg p-3">
            <p class="text-xs font-semibold text-blue-700 mb-2">Breakthrough Moment</p>
            <p class="text-xs text-gray-700">[Specific irreversibility signal]</p>
          </div>
        </div>

        <p class="text-xs text-gray-500 italic">
          <strong>Addresses Hidden Dynamic:</strong> [Category] - [Specific barrier from Section 4]
        </p>
      </div>
    </div>
  </div>

  <!-- Repeat for Shifts 2-6 -->
</div>
```

**Critical Requirements:**
- All 6 shifts must be present
- Each shift must address at least one Hidden Dynamic from Section 4
- Numbered badges (1-6) with consistent styling
- Two-column grid: "What This Looks Like" + "Breakthrough Moment"
- Citations for all data points
- Map to Hidden Dynamics explicitly

#### Section 6 (MARKERS) - Tracking Paradigm Shift Progress

**Three types of markers:**

1. **Leading Indicators**: Early signals of paradigm shift (appear 1-3 years before outcomes)
   - Example: "% of tenders mentioning lifecycle cost analysis" (Buildings)
   - Example: "Number of prosumer tariff applications" (Energy)

2. **Lagging Indicators**: Confirmation that shift has occurred (outcome-based)
   - Example: "Buildings with EPC ratings at time of sale" (Buildings)
   - Example: "Grid flexibility capacity (GW)" (Energy)

3. **Discourse Markers**: Changes in how sector is discussed (narrative/cultural)
   - Example: "Media mentions of 'living buildings' vs 'green buildings'" (Buildings)
   - Example: "Use of 'energy service' vs 'electricity supply' in policy docs" (Energy)

**HTML Structure:**
```html
<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8 border-l-4 border-l-teal-500">
  <h3>📊 Markers: How We Track Transformation</h3>

  <div class="mb-6">
    <h4 class="font-semibold mb-3">Leading Indicators (Early Signals)</h4>
    <ul class="space-y-2">
      <li>• [Indicator 1] <a href="...">[N]</a></li>
      <!-- 5+ indicators -->
    </ul>
  </div>

  <div class="mb-6">
    <h4 class="font-semibold mb-3">Lagging Indicators (Confirmation)</h4>
    <ul class="space-y-2">
      <li>• [Indicator 1] <a href="...">[N]</a></li>
      <!-- 5+ indicators -->
    </ul>
  </div>

  <div>
    <h4 class="font-semibold mb-3">Discourse Markers (Narrative Change)</h4>
    <ul class="space-y-2">
      <li>• [Marker 1]</li>
      <!-- 3+ markers -->
    </ul>
  </div>
</div>
```

#### Section 7 (STRATEGIES) - Shift-Enabling Power

**Strategies are evaluated by HOW MUCH they enable paradigm shifts, not just direct impact.**

**Three tiers:**

1. **High Leverage** (🔥 High Shift-Enabling Power)
   - Directly triggers 2+ paradigm shifts
   - Creates irreversibility
   - Example: "Mandatory energy disclosure at transaction" → Enables Shifts 3 (Agency) + 5 (Time Horizon)

2. **Medium Leverage** (⚡ Medium Shift-Enabling Power)
   - Enables 1 paradigm shift
   - Reinforces existing shift momentum
   - Example: "ECBC-compliant new construction" → Enables Shift 6 (Objectives)

3. **Foundational** (🧱 Foundational)
   - Necessary but insufficient alone
   - Supports shift environment
   - Example: "Training programs for energy auditors" → Supports capacity for all shifts

**HTML Structure:**
```html
<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8 border-l-4 border-l-indigo-600">
  <h3>🎯 Strategies: Interventions Organized by Shift-Enabling Power</h3>

  <div class="mb-6">
    <h4>🔥 High Leverage (Direct Shift Triggers)</h4>
    <ul>
      <li><strong>[Strategy]</strong> - [Description] <a href="...">[N]</a>
        <br><span class="text-xs text-gray-500">→ Enables Shifts [1, 3]: [Explanation]</span>
      </li>
    </ul>
  </div>

  <!-- Medium and Foundational sections -->
</div>
```

**Key Rule**: EVERY strategy must explicitly state which shift(s) it enables.

#### Section 10 (FOCUS AREAS) - Urgency + Shift-Enabling Potential

**Prioritization criteria:**
1. **Urgency**: Decision windows closing (policy cycles, infrastructure lock-in)
2. **Shift-Enabling**: Does it trigger irreversible paradigm shifts?
3. **Data-Driven**: Evidence that window is now

**HTML Structure:**
```html
<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8 border-l-4 border-l-red-500">
  <h3>🎯 Focus Areas: Where to Act Now (Urgency-Ranked)</h3>

  <div class="space-y-4">
    <div class="border-l-4 border-l-red-600 pl-4">
      <div class="flex items-start justify-between mb-2">
        <h4 class="font-semibold">[Focus Area 1]</h4>
        <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">CRITICAL</span>
      </div>
      <p class="text-sm text-gray-700 mb-2">[Why urgent - specific decision window]</p>
      <p class="text-xs text-gray-500">
        <strong>Shift-Enabling:</strong> Triggers Shifts [N, N] if acted upon in [timeframe]
      </p>
      <p class="text-xs text-gray-500">
        <strong>Evidence:</strong> [Data point showing urgency] <a href="...">[N]</a>
      </p>
    </div>

    <!-- Repeat for HIGH, MEDIUM priority areas -->
  </div>
</div>
```

### Thesis for Action: 10-Section Structure

**Every sector page must contain these 9 sections in order (Section 2 TARGETS has been removed):**

| # | Section | Border Color | Purpose | Key Elements |
|---|---------|--------------|---------|--------------|
| 1 | **Baseline** | Gray (`border-l-gray-400`) | Current status & trends | 5+ data points with citations |
| 3 | **Sankey Diagram** | Purple (`border-l-purple-500`) | Energy/material flow visualization | Interactive Plotly diagram with pedagogical subtitle |
| 4 | **Hidden Dynamics** | Amber (`border-l-amber-500`) | 7-category barrier analysis | 2+ examples per category in responsive grid |
| 5 | **Shift** | Blue (`border-l-blue-500`) | **6 Paradigm Shifts** | See Paradigm Shift Framework above |
| 6 | **Markers** | Teal (`border-l-teal-500`) | Progress indicators | Leading/Lagging/Discourse split (5+/5+/3+) |
| 7 | **Strategies** | Indigo (`border-l-indigo-600`) | Shift-enabling interventions | High/Medium/Foundational leverage with explicit shift mapping |
| 8 | **Economic Impact** | Rose (`border-l-rose-500`) | Costs vs benefits | 3 subsections: Costs/Externalities/Opportunity |
| 9 | **Investments** | Orange (`border-l-orange-500`) | Capital requirements | Capex vs Opex split with funding sources |
| 10 | **Focus Areas** | Red (`border-l-red-500`) | Urgency + Shift-Enabling | Ranked by decision windows + paradigm shift potential |

**Note**: Section 2 (TARGETS) was removed from all sectors. Section numbering now skips from 1 → 3.

### Discovery Methods (Removed from Pages)

**These are now methodology guidance, not user-facing content:**

- **Needle Queries:** Use Grep/Glob for specific file/class/function lookups
- **Exploration:** Use Task tool with `subagent_type=Explore` for open-ended codebase questions
- **Data Extraction:** Use specialized agents (Opus for planning, Sonnet for implementation)

### Color-Coding System

**Section-specific left border colors for visual hierarchy:**

```html
<!-- Example: Hidden Dynamics section -->
<div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8 border-l-4 border-l-amber-500">
  <h3 class="text-xl font-semibold text-gray-900 mb-6">🔍 Hidden Dynamics</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- 7-category cards -->
  </div>
</div>
```

## Troubleshooting

### Styles not updating
```bash
# Stop dev server (Ctrl+C) and restart
npm run dev
```

### Build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Class not working
Check `tailwind.config.js` content array includes your file:
```javascript
content: ["./*.html", "./js/**/*.js"]
```

## Working with Claude Code

### Model Selection for Different Tasks

**For Planning (Research & Design):**
- Use Opus for complex planning, architectural decisions, and exploratory work
- Opus excels at understanding requirements and designing implementation approaches

**For Implementation (Code Writing):**
- Spin up a Sonnet agent to execute the plan and write code
- Sonnet is faster and more cost-effective for implementation work
- Command: Launch a task with `subagent_type: general-purpose` and `model: sonnet`

**Workflow Example:**
1. Use Opus to enter plan mode and design the solution
2. Exit plan mode with approved plan
3. Opus spawns Sonnet agent(s) to implement the code changes
4. Sonnet executes efficiently while Opus monitors progress

## Reference Links

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Project Repository](https://github.com/sathyaseelan)
