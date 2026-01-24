# India Climate Action Dashboard

A vanilla JavaScript dashboard for tracking India's climate action initiatives focused on demand efficiency and circular economy.

## Features

### Public Dashboard
- Impact metrics with progress tracking
- Interactive charts showing trajectory
- Priority areas breakdown (Demand Efficiency, Circular Economy, Enablers)
- Sector coverage with coming soon indicators
- NDC alignment visualization
- Geographic focus across 8 priority states

### Admin Dashboard (Password Protected)
- Partner organization management (16 partners + 1 strategic)
- Funding allocation tracking (₹253-270 Cr over 3 years)
- 90-day implementation roadmap
- Risk monitoring and escalation protocols
- Data export functionality

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js
- **Storage**: Supabase Storage (JSON files)
- **Deployment**: Vercel

## Project Structure

```
thesis-dashboard/
├── index.html              # Public dashboard
├── sectors.html            # Sector details
├── about.html              # About page
├── login.html              # Admin login
├── admin.html              # Admin overview
├── admin-partners.html     # Partner management
├── admin-funding.html      # Funding details
├── admin-roadmap.html      # Implementation roadmap
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── config.js           # Configuration
│   ├── supabase.js         # Supabase client
│   ├── auth.js             # Authentication
│   ├── charts.js           # Chart configurations
│   ├── app.js              # Main app logic
│   ├── admin.js            # Admin dashboard
│   ├── admin-partners.js   # Partners page
│   └── admin-funding.js    # Funding page
├── data/
│   ├── metrics.json        # Current metrics
│   ├── partners.json       # Partner data
│   └── funding.json        # Funding data
├── vercel.json             # Vercel configuration
└── README.md
```

## Setup

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/thesis-dashboard.git
   cd thesis-dashboard
   ```

2. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js (npx)
   npx serve
   ```

3. Open `http://localhost:8000` in your browser

### Supabase Setup (Optional)

The dashboard works with local fallback data, but for production:

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Create a storage bucket named `dashboard-data`

3. Upload the JSON files from the `data/` folder to the bucket

4. Update `js/config.js` with your Supabase credentials:
   ```javascript
   supabase: {
       url: 'https://your-project.supabase.co',
       anonKey: 'your-anon-key-here',
       bucket: 'dashboard-data'
   }
   ```

5. Set up bucket policies for public read access (metrics, targets) and authenticated access (admin data)

### Vercel Deployment

1. Push to GitHub

2. Import the repository in Vercel

3. Deploy (no build step required for vanilla JS)

4. (Optional) Add environment variables for Supabase credentials

## Admin Access

Default credentials:
- **Username**: admin
- **Password**: climate2026

To change the password:
1. Generate a SHA-256 hash of your new password
2. Update `CONFIG.auth.credentials.passwordHash` in `js/config.js`

## Data Updates

### Using Local Files
Edit the JSON files in the `data/` folder and redeploy.

### Using Supabase
Upload updated JSON files to the Supabase bucket. The dashboard will automatically fetch the latest data.

## Sectors

### Active
- Energy - Demand Efficiency (Buildings, Transport, Industrial, Agriculture)
- Energy - Circular Economy (Solar/Battery Recycling, EPR)

### Coming Soon
- Waste Management (Q3 2026)
- Water (Q4 2026)
- Air Quality (Q1 2027)

## Impact Targets (2026-2029)

| Metric | Year 1 | Year 3 | 5-Year |
|--------|--------|--------|--------|
| Energy Saved | 2 TWh | 10 TWh | 20 TWh |
| Peak Demand Avoided | 0.5 GW | 3 GW | 8 GW |
| Buildings Optimized | 50,000 | 500,000 | 1,000,000 |
| Recycling Capacity | 5,000 t/yr | 40,000 t/yr | 100,000 t/yr |

## License

Private - All rights reserved

## Contact

For questions about this dashboard, please contact the project administrator.
