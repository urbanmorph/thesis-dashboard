# Sankey-Style Flow Diagrams for Missing Sectors

## 1. Waste Sector - Material Flow Cascade

Insert after line 1658 (after Baseline, before Shift/Targets):

```html
<!-- Waste Flow Cascade -->
<div class="bg-gradient-to-br from-green-50 to-transparent border border-gray-200 rounded-lg p-6 shadow-sm mb-8 border-l-4 border-l-green-500">
    <h3 style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1.25rem;">🗑️</span> The Waste Value Leakage
        <span style="font-size: 0.75rem; font-weight: normal; color: #6b7280; margin-left: auto;">Where 92% of circular value is lost</span>
    </h3>
    <p style="color: #4b5563; margin-bottom: 1rem; font-style: italic;">Officials claim 97% collection and 70% processing. Reality: 32% unaccounted, 75% plants idle, 8% true circularity. ₹30,000 Cr/year in recyclables goes to landfills.</p>

    <!-- Sankey-style Flow Diagram -->
    <div style="background: #f9fafb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; overflow-x: auto;">
        <div style="font-family: monospace; font-size: 0.8rem; line-height: 1.6; white-space: pre; min-width: 600px;">
<span style="color: #4b5563;">WASTE GENERATED</span>                      <span style="color: #4b5563;">OFFICIAL CLAIM</span>                      <span style="color: #4b5563;">ACTUAL OUTCOME</span>
<span style="color: #4b5563;">170,000 TPD (100%)</span>                      <span style="color: #4b5563;">Managed: 97%</span>                          <span style="color: #4b5563;">Circular: 8%</span>

<span style="font-weight: bold; color: #22c55e;">████████████████████████████████████████████████████████████████████████████████████████████████</span> 100%
        │
        ├──<span style="color: #dc2626;">████████████████████████████████</span> 32% <span style="color: #dc2626;">← UNACCOUNTED (50,655 TPD) — data integrity crisis</span>
        │
        ▼
<span style="font-weight: bold; color: #3b82f6;">████████████████████████████████████████████████████████████████</span> 68% "Collected"
        │
        ├──<span style="color: #f59e0b;">████████████████████████</span> 25% <span style="color: #f59e0b;">← LANDFILLED directly (4,000 plants at 25% capacity)</span>
        │
        ▼
<span style="font-weight: bold; color: #8b5cf6;">████████████████████████████████████████</span> 43% Reaches processing
        │
        ├── FORMAL SECTOR (20%)
        │   │
        │   ├──<span style="color: #dc2626;">███████</span> 8% <span style="color: #dc2626;">← Plant underutilization + segregation failure</span>
        │   │
        │   ▼
        │   <span style="color: #22c55e;">████</span> 4% → Recycled via formal plants
        │
        └── INFORMAL SECTOR (23%)
            │
            ├──<span style="color: #f59e0b;">██████████</span> 10% <span style="color: #f59e0b;">← Value captured by aggregators (90% of ₹30K Cr)</span>
            │
            ├── <span style="color: #3b82f6;">█████████</span> 9% <span style="color: #3b82f6;">← 4M+ waste pickers do 70-80% of actual recycling</span>
            │
            ▼
            <span style="font-weight: bold; color: #22c55e;">████</span> 4% → Recycled via informal (pickers get 5-10% of value)

<span style="font-weight: bold; color: #22c55e;">████████</span> 8% <span style="font-weight: bold; color: #22c55e;">← TRUE CIRCULARITY (plastic, e-waste, C&D combined)</span>

<span style="color: #dc2626;">LOST TO LANDFILLS: 92%</span>  │  <span style="color: #22c55e;">POTENTIAL VALUE: ₹30,000 Cr/year</span>
        </div>
    </div>

    <!-- Key Statistics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Data Integrity Crisis</h4>
            <ul class="text-sm">
                <li>"97% collection" claimed — <strong>31.7% unaccounted</strong> (50,655 TPD) <a href="resources.html#references" style="font-size: 0.7rem;">[85]</a></li>
                <li>"70% processing" — reality <strong>"wildly at odds"</strong> <a href="resources.html#references" style="font-size: 0.7rem;">[119]</a></li>
                <li>Self-reported metrics with zero verification</li>
                <li>MoHUA dashboard: cosmetic compliance theater</li>
            </ul>
        </div>
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Plant Underutilization</h4>
            <ul class="text-sm">
                <li><strong>4,000+</strong> plants built — only <strong>25%</strong> at capacity <a href="resources.html#references" style="font-size: 0.7rem;">[122]</a></li>
                <li>Tonnage contracts reward collection over diversion</li>
                <li>No segregation at source = plant inefficiency</li>
                <li>Mumbai: 11K TPD generated vs 5K capacity <a href="resources.html#references" style="font-size: 0.7rem;">[121]</a></li>
            </ul>
        </div>
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Informal Paradox</h4>
            <ul class="text-sm">
                <li><strong>4M+</strong> waste pickers do <strong>70-80%</strong> of recycling <a href="resources.html#references" style="font-size: 0.7rem;">[96,132]</a></li>
                <li>Get <strong>5-10%</strong> of ₹30K Cr value; aggregators take 90%</li>
                <li>Formalization via companies excludes them</li>
                <li>₹55 Cr/year municipal savings from 1.5M pickers</li>
            </ul>
        </div>
    </div>
    <p style="font-size: 0.75rem; color: #6b7280; margin-top: 1rem;">Sources: CPCB Annual Reports 2024, MoHUA SBM Dashboard, CEEW Circularity Study, ILO Informal Sector Data</p>
</div>
```

## 2. Food Sector - Supply Chain Loss Cascade

Insert after Food Baseline section (around line 2750):

```html
<!-- Food Loss Cascade -->
<div class="bg-gradient-to-br from-amber-50 to-transparent border border-gray-200 rounded-lg p-6 shadow-sm mb-8 border-l-4 border-l-amber-500">
    <h3 style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1.25rem;">🌾</span> The Food Loss Cascade
        <span style="font-size: 0.75rem; font-weight: normal; color: #6b7280; margin-left: auto;">67 MT (₹92,000 Cr) lost before it reaches consumers</span>
    </h3>
    <p style="color: #4b5563; margin-bottom: 1rem; font-style: italic;">16% of food production never reaches consumers. No cold chain, no packhouses, no grading infrastructure. Farmers bear 90% of loss burden while getting 25% of retail price.</p>

    <!-- Sankey-style Flow Diagram -->
    <div style="background: #f9fafb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; overflow-x: auto;">
        <div style="font-family: monospace; font-size: 0.8rem; line-height: 1.6; white-space: pre; min-width: 600px;">
<span style="color: #4b5563;">FARM PRODUCTION</span>                      <span style="color: #4b5563;">POST-HARVEST</span>                        <span style="color: #4b5563;">REACHES CONSUMER</span>
<span style="color: #4b5563;">420 MT produced</span>                        <span style="color: #4b5563;">Handled: 353 MT</span>                      <span style="color: #4b5563;">Consumed: 353 MT</span>

<span style="font-weight: bold; color: #22c55e;">███████████████████████████████████████████████████████████████████████████████████████████</span> 100%
        │
        ├──<span style="color: #dc2626;">██████████████</span> 16% <span style="color: #dc2626;">← POST-HARVEST LOSSES (67 MT = ₹92,000 Cr/year)</span>
        │   │
        │   ├── Farm-gate: <span style="color: #dc2626;">4.7%</span> — No packhouse, improper handling
        │   ├── Storage: <span style="color: #dc2626;">5.8%</span> — 15M MT shortfall vs 60M MT need
        │   ├── Transport: <span style="color: #dc2626;">3.2%</span> — No cold chain (4% cold vs 50% global)
        │   └── Processing: <span style="color: #dc2626;">2.3%</span> — Inadequate grading, wastage
        │
        ▼
<span style="font-weight: bold; color: #3b82f6;">████████████████████████████████████████████████████████████████████████</span> 84% Reaches market

<span style="color: #4b5563;">VALUE DISTRIBUTION (of ₹100 retail):</span>
<span style="color: #f59e0b;">█████████████████████████</span> Farmer gets: <strong>25%</strong>
<span style="color: #8b5cf6;">███████████████████████████████████████████████████████████████</span> Middlemen take: <strong>65%</strong>
<span style="color: #22c55e;">██████████</span> Processor/Retailer: <strong>10%</strong>

<span style="color: #dc2626;">LOSS BREAKDOWN BY CROP:</span>
Fruits & Veg: <span style="color: #dc2626;">5.8-18%</span> loss  │  Cereals: <span style="color: #f59e0b;">4.7-5.6%</span>  │  Pulses: <span style="color: #f59e0b;">6.4-8.4%</span>
        </div>
    </div>

    <!-- Key Statistics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Cold Chain Catastrophe</h4>
            <ul class="text-sm">
                <li>India: <strong>4%</strong> food in cold chain vs <strong>50%</strong> global average <a href="resources.html#references" style="font-size: 0.7rem;">[147]</a></li>
                <li>Warehousing shortfall: <strong>15M MT</strong> gap (vs 60M MT need) <a href="resources.html#references" style="font-size: 0.7rem;">[147]</a></li>
                <li>Transport loss: 3.2% due to no refrigeration</li>
                <li>FPOs lack capital for packhouse + cold storage</li>
            </ul>
        </div>
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Middlemen Value Capture</h4>
            <ul class="text-sm">
                <li>Farmer gets <strong>25%</strong> of retail price</li>
                <li>Middlemen take <strong>65%</strong> (5-7 intermediaries)</li>
                <li>No direct farm-to-retail linkages at scale</li>
                <li>MSP system benefits 6% of farmers (Punjab/Haryana)</li>
            </ul>
        </div>
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Infrastructure Missing</h4>
            <ul class="text-sm">
                <li><strong>Zero</strong> packhouses at farm-gate for most FPOs</li>
                <li>No grading/sorting → 15-20% price loss</li>
                <li>FPO capital access: <strong>&lt;10%</strong> get institutional credit</li>
                <li>₹92K Cr annual loss = 2x farmer welfare spending</li>
            </ul>
        </div>
    </div>
    <p style="font-size: 0.75rem; color: #6b7280; margin-top: 1rem;">Sources: ICAR Post-Harvest Loss Study, NABARD FPO Survey, NCCD Infrastructure Gap Report</p>
</div>
```

## 3. Transport Sector - Modal Split & Efficiency

Insert after Transport Baseline section (around line 490):

```html
<!-- Transport Modal Split & Efficiency -->
<div class="bg-gradient-to-br from-pink-50 to-transparent border border-gray-200 rounded-lg p-6 shadow-sm mb-8 border-l-4 border-l-pink-500">
    <h3 style="display: flex; align-items: center; gap: 0.5rem;">
        <span style="font-size: 1.25rem;">🚌</span> The Transport Efficiency Gap
        <span style="font-size: 0.75rem; font-weight: normal; color: #6b7280; margin-left: auto;">13.5% of emissions from 4.31% of trips</span>
    </h3>
    <p style="color: #4b5563; margin-bottom: 1rem; font-style: italic;">Walk/cycle = 50% of trips but zero investment. Public transport = 36% ridership but declining. Private vehicles = 4% of trips but 60%+ of space and emissions.</p>

    <!-- Sankey-style Flow Diagram -->
    <div style="background: #f9fafb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; overflow-x: auto;">
        <div style="font-family: monospace; font-size: 0.8rem; line-height: 1.6; white-space: pre; min-width: 600px;">
<span style="color: #4b5563;">URBAN TRIPS (Mode Share)</span>             <span style="color: #4b5563;">ROAD SPACE</span>                          <span style="color: #4b5563;">EMISSIONS</span>

<span style="font-weight: bold; color: #22c55e;">██████████████████████████████████████████████████</span> 50% <span style="font-weight: bold; color: #22c55e;">WALK/CYCLE</span> → <span style="color: #4b5563;">Space: 5%</span> → <span style="color: #22c55e;">Emissions: 0%</span>
<span style="font-weight: bold; color: #3b82f6;">████████████████████████████████████</span> 36% <span style="font-weight: bold; color: #3b82f6;">PUBLIC TRANSIT</span> → <span style="color: #4b5563;">Space: 20%</span> → <span style="color: #3b82f6;">Emissions: 25%</span>
<span style="font-weight: bold; color: #ec4899;">████████████</span> 10% <span style="font-weight: bold; color: #ec4899;">PARATRANSIT</span> → <span style="color: #4b5563;">Space: 15%</span> → <span style="color: #f59e0b;">Emissions: 15%</span>
<span style="font-weight: bold; color: #dc2626;">████</span> 4% <span style="font-weight: bold; color: #dc2626;">PRIVATE VEHICLES</span> → <span style="color: #dc2626;">Space: 60%</span> → <span style="color: #dc2626;">Emissions: 60%</span>

<span style="color: #4b5563;">TRANSPORT ENERGY EFFICIENCY:</span>

IC ENGINE VEHICLES (92% of transport energy):
<span style="color: #dc2626;">████████████████████</span> 20-25% efficiency → <span style="color: #dc2626;">75-80% LOST AS HEAT</span>
<span style="color: #f59e0b;">███████</span> 7-10% idling loss → Traffic congestion, signals
<span style="font-weight: bold; color: #22c55e;">████</span> <strong>12-15%</strong> → Actual motion energy delivered

<span style="color: #4b5563;">PARKING SUBSIDY (hidden cost):</span>
<span style="color: #dc2626;">██████████████████████████████████████████</span> ₹1,000s Cr/year in free parking → <strong>$25/hr equivalent value</strong>

<span style="color: #4b5563;">THE WALKING/CYCLING GAP:</span>
Modal share: <span style="font-weight: bold; color: #22c55e;">50%</span>  │  Budget share: <span style="font-weight: bold; color: #dc2626;">&lt;1%</span>  │  Road space: <span style="font-weight: bold; color: #dc2626;">5%</span>
        </div>
    </div>

    <!-- Key Statistics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Split Incentives</h4>
            <ul class="text-sm">
                <li>Free parking worth <strong>₹1000s Cr/year</strong> → Drives car ownership</li>
                <li>No congestion charging despite traffic externalities</li>
                <li>Property tax doesn't reflect parking value ($25/hr US)</li>
                <li>Result: 4% trips take 60% road space</li>
            </ul>
        </div>
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Active Transport Neglect</h4>
            <ul class="text-sm">
                <li><strong>50%</strong> of trips are walk/cycle</li>
                <li><strong>&lt;1%</strong> of urban transport budget</li>
                <li><strong>5%</strong> of road space despite 50% mode share</li>
                <li>70% feel unsafe cycling in Indian cities <a href="resources.html#references" style="font-size: 0.7rem;">[30]</a></li>
            </ul>
        </div>
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Paratransit Paradox</h4>
            <ul class="text-sm">
                <li><strong>4.31%</strong> of work trips via auto/taxi</li>
                <li>More than private cars but zero planning inclusion</li>
                <li><strong>10M+</strong> drivers with no social protection</li>
                <li>App platforms take 25-30% commission</li>
            </ul>
        </div>
    </div>
    <p style="font-size: 0.75rem; color: #6b7280; margin-top: 1rem;">Sources: Census 2011 Modal Split, CEEW Transport Study, ITDP Paratransit Report, IEA Transport Efficiency</p>
</div>
```

## Implementation Notes:

1. **Waste diagram** shows the 92% circularity loss through collection → processing → recycling cascade
2. **Food diagram** shows 16% post-harvest loss and 65% value capture by middlemen
3. **Transport diagram** shows modal split vs space/emissions inequality

All diagrams follow the Energy sector's style with:
- Monospace font for alignment
- Color-coded bars (green = good, red = loss, amber = inefficiency)
- Specific statistics with citations
- "Hidden Dynamics" framing

These reveal the system failures that technical solutions alone can't fix.
