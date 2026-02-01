# Phase 1 Implementation Verification Checklist

## Files to Test

### Option 1: Test Page (Quickest)
Open in browser: `test-table.html`
- Standalone test of table functionality
- No network view, just the table

### Option 2: Full Integration
Open in browser: `systems-map.html`
1. Default view should be Network (Cytoscape)
2. Click "Table View" button
3. Table should appear with 16 rows

## Visual Verification

### View Switcher
- [ ] Two buttons visible: "Network View" and "Table View"
- [ ] "Network View" is blue (active) by default
- [ ] "Table View" is gray (inactive) by default
- [ ] Clicking "Table View" switches views
- [ ] Active button turns blue, inactive turns gray

### Table Structure
- [ ] Table has 7 columns: Source, Target, Type, Layer, Magnitude, Quantification, Citation
- [ ] Table header has sort icons (⇅)
- [ ] 16 rows displayed initially

### Data Display
- [ ] **Type badges** color-coded:
  - Synergy = Green
  - Conflict = Red
  - Cascade = Amber
  - Shared = Gray
- [ ] **Layer badges** color-coded:
  - Governance = Blue
  - Community = Green
  - Technical = Gray
  - Conditional = Purple
- [ ] **Magnitude column** bold and large font
- [ ] **Quantification** shows full text

### Search & Filters (Above Table)
- [ ] Search box on left
- [ ] Type filter checkboxes (4 options)
- [ ] Layer filter checkboxes (4 options)
- [ ] Results count: "Showing 16 of 16 relationships"

## Functional Testing

### Sorting
1. Click "Source" header
   - [ ] Rows sort alphabetically by source
   - [ ] Icon changes to ↑
2. Click "Source" header again
   - [ ] Rows reverse sort
   - [ ] Icon changes to ↓
3. Click "Magnitude" header
   - [ ] Rows sort by magnitude (highest first by default)
4. Test other columns (Target, Type, Layer)

### Search
1. Type "water" in search box
   - [ ] Table filters to show only rows containing "water"
   - [ ] Results count updates (e.g., "Showing 5 of 16")
2. Clear search
   - [ ] All 16 rows return
3. Try: "prosumer", "waste", "energy", "notf"

### Type Filters
1. Uncheck all type checkboxes
   - [ ] Table shows 0 rows
   - [ ] Results count: "Showing 0 of 16"
2. Check only "Synergy"
   - [ ] Table shows ~10-12 synergy rows
   - [ ] All visible type badges are green
3. Check only "Conflict"
   - [ ] Table shows ~0 rows (postShift has no conflicts)
4. Re-check all boxes
   - [ ] All 16 rows return

### Layer Filters
1. Uncheck all layer checkboxes
   - [ ] Table shows 0 rows
2. Check only "Community"
   - [ ] Table shows ~10 community rows
   - [ ] All visible layer badges are green
3. Check only "Governance"
   - [ ] Table shows ~2 governance rows
   - [ ] All visible layer badges are blue
4. Re-check all boxes
   - [ ] All 16 rows return

### Combined Filters
1. Search "ward" + check only "Community" layer
   - [ ] Shows ward-related community rows
   - [ ] Results count updates correctly
2. Clear all filters
   - [ ] Returns to 16 rows

## Data Validation

### Magnitude Extraction Test
Compare these values in the table:

| Quantification | Expected Magnitude |
|----------------|-------------------|
| "100 cities metered = 40% energy savings potential" | 40 |
| "50L prosumer households = potential 50L rainwater collectors" | 50 |
| "Target: 15% → 80% segregation compliance" | 65 |
| "80% segregation = 15% disposal reduction + soil enrichment" | 15 |
| "30-40% NMT trips = 20% PM2.5 reduction potential" | 20 |
| "180M households transition = 30% residential PM2.5 reduction" | 30 |
| "30% functional committees = 60% segregation compliance" | 60 |
| "Community monitoring = 15-20% usage reduction" | 17 (average) |
| "Single platform = cross-sectoral accountability" | 10 (theoretical) |
| "40% loss reduction = less organic waste for segregation" | 40 |

### Citation Links
1. Hover over citation links
   - [ ] Links are blue and underlined
2. Click a citation (e.g., "ref-mohua-water-supply-2024")
   - [ ] Should navigate to resources.html#ref-mohua-water-supply-2024
   - [ ] (Note: Will 404 if not on dev server, but URL should be correct)

## Responsive Design

### Desktop (>1024px)
- [ ] Table fits comfortably
- [ ] All columns visible
- [ ] No horizontal scroll needed

### Tablet (768px - 1024px)
- [ ] Filters wrap to multiple rows
- [ ] Horizontal scroll appears for table
- [ ] Table remains functional

### Mobile (<768px)
- [ ] Search/filters stack vertically
- [ ] Horizontal scroll works smoothly
- [ ] Can scroll to see all columns
- [ ] Touch targets are large enough

## Browser Testing

### Chrome/Edge
- [ ] Table renders correctly
- [ ] All interactions work
- [ ] No console errors

### Firefox
- [ ] Table renders correctly
- [ ] All interactions work
- [ ] No console errors

### Safari
- [ ] Table renders correctly
- [ ] All interactions work
- [ ] No console errors

## Console Errors
Open browser DevTools (F12) and check Console tab:
- [ ] No red errors
- [ ] Should see: "Systems map initialized successfully"
- [ ] Should see: "Table visualization initialized" (if in table view)

## Performance

### Load Time
- [ ] Table view loads instantly (<100ms)
- [ ] No lag when switching views

### Interaction Speed
- [ ] Sorting is instant
- [ ] Search filters in real-time
- [ ] Checkbox filters are instant

## Known Issues

### Expected Warnings (Can Ignore)
- Vite warnings about non-module scripts (existing issue, unrelated)
- 404 for citation links (expected if not on dev server)

### Not Implemented (By Design)
- CSV export (not in Phase 1 scope)
- Copy to clipboard (not in Phase 1 scope)
- Edit functionality (read-only view)
- Scenario toggle for table (postShift only)

## Success Criteria

**Phase 1 is successful if:**
1. ✓ All 16 rows display with correct data
2. ✓ Magnitude extraction is accurate
3. ✓ Sort works for all columns
4. ✓ Search filters correctly
5. ✓ Type/Layer filters work
6. ✓ View switcher toggles correctly
7. ✓ No JavaScript errors
8. ✓ Responsive on mobile

## Next Steps

After validation:
1. Review magnitude values for accuracy
2. Confirm data looks correct
3. Approve to proceed to **Phase 2: Sankey Diagram**

## Troubleshooting

### Table doesn't appear
- Check browser console for errors
- Verify you clicked "Table View" button
- Refresh page and try again

### Data looks wrong
- Check browser console
- Verify `/data/systems-map.json` loads correctly
- Check Network tab in DevTools

### Filters don't work
- Check browser console for errors
- Verify checkboxes are checked
- Clear search box

### Build issues
```bash
npm run build
```
Should complete without errors. If errors:
1. Check syntax in `public/js/d3-table-viz.js`
2. Check import in `public/js/systems-map.js`
3. Verify `systems-map.html` has correct HTML

## Contact

For issues or questions, check:
- `PHASE1_IMPLEMENTATION_SUMMARY.md` (technical details)
- Browser console (error messages)
- Git commit: "Add Phase 1: Data table view for systems map"
