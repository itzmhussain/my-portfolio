# Dashboard Templates

Interactive single-page dashboard templates for ecommerce, marketing, digital analytics, social, telecom operations, and channel operations. Each live template is a design view backed by typed sample data.

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The home page is the template gallery; open any card to run that dashboard live.

```bash
npm run build    # production build → dist/
npm run preview  # serve dist/ locally
```

## What’s included

| Template | Status | Data sources |
|----------|--------|--------------|
| Ecommerce Sales | Live | `src/data/ecommerce` |
| Marketing & Analytics | Live | `src/data/marketing`, `src/data/digital-analytics` |
| Telecom Operations | Live | `src/data/telecom-ops`, `src/data/channel-ops` |
| Social Media | Stub | `src/data/social` |
| Channel Operations | Stub | `src/data/channel-ops` |

Shared UI lives in `src/components/`. Template metadata and routes are listed in `src/lib/templates.ts`.

## Sample data

Each domain under `src/data/<domain>/` exports a small API:

- `getSummary(range)` — KPI strip metrics
- time-series helpers — daily points for charts
- breakdown helpers — products, channels, regions, etc.

Ranges are `'7d' | '30d' | '90d'`. Generators use a seeded PRNG so values stay stable across reloads.

## Add a new template

1. Add sample data in `src/data/<domain>/` (or reuse an existing domain).
2. Create `src/templates/<id>/<Name>Page.tsx`.
3. Register meta in `src/lib/templates.ts`.
4. Add a route in `src/App.tsx`.

## Deploy

Static SPA output from `vite build`:

- **Vercel** — `vercel.json` rewrites deep links to `index.html`
- **Netlify** — `public/_redirects` does the same
- **GitHub Pages** — set Vite `base` if the site is not at the domain root

Connect the repo to your host, set the build command to `npm run build`, and the output directory to `dist`.
