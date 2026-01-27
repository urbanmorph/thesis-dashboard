# Development Guide - India Progress Monitor

## Overview

This project is a 9-page static HTML dashboard that has been migrated to use **Tailwind CSS** with **Vite** as the build tool. All styling is done with Tailwind utility classes inline in the HTML.

## Technology Stack

- **HTML** - 9 static pages (login, index, thesis, resources, sectors, 4 admin pages)
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

## Reference Links

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Project Repository](https://github.com/sathyaseelan)
