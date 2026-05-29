# vpickplus.us — Astro site

Modern static site for VPick+, the company behind **VPick+** (voice picking) and **QMS Pro** (quality + maintenance management for distribution centers).

Built with [Astro](https://astro.build). Static output, no server required. Hosted on GitHub Pages, custom domain at vpickplus.us.

## What's in this project

- **Home** (`/`) — diverging hero introducing both products
- **VPick+** (`/vpick`) — voice picking product page
- **QMS Pro** (`/qms`) — quality & maintenance product page **with placeholder screenshots — see "Swapping in real QMS screenshots" below**
- **Why** (`/why`), **Industries** + 5 sub-pages, **Learn** + 8 articles, **Leasing**, **Contact**
- **Site-wide marquee banner** announcing QMS Pro with a CTA to the live demo

The site lives in `src/`. Static images, the CNAME file, and `robots.txt` live in `public/` and are copied as-is into the build output.

## Local development

```bash
npm install
npm run dev        # starts the dev server at http://localhost:4321
npm run build      # builds the site into ./dist
npm run preview    # previews the built site locally
```

Requires Node 20+.

## Deployment

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that auto-builds and deploys on every push to `main`. Setup is one-time:

1. **In your GitHub repo settings**, go to **Pages**
2. Set **Source** to **GitHub Actions** (not "Deploy from a branch")
3. Push to `main` — the workflow builds the site and deploys it

The CNAME file (`public/CNAME`) keeps your custom domain pointed at vpickplus.us through the rebuild.

DNS records in Namecheap should already be configured to point at GitHub Pages (the four `185.199.108-111.153` A records on `@`, and `kruchev4.github.io.` on `www`).

## Swapping in real QMS Pro screenshots

The `/qms` page currently uses placeholder cards. To replace them with real screenshots:

1. Take screenshots of the live demo at `qms.vpickplus.us` (login: `demo@meridian-demo.app` / `MeridianDemo2026!`)
2. Save them in `public/assets/qms/` with these filenames:
   - `dashboard.png` — main dashboard
   - `env.png` — environmental monitoring view
   - `workorders.png` — CMMS work order list
   - `documents.png` — document control
   - `alerts.png` — Smart Alerts feed
   - `training.png` — training compliance dashboard
3. Open `src/pages/qms.astro`, find the `screenshots` array near the top, and change each `placeholder: true` to `placeholder: false`
4. Commit and push — GitHub Actions rebuilds with the real images

Also add a hero screenshot at `public/assets/qms/hero.png` and replace the hero placeholder block in the same file (look for `qms-screenshot-placeholder` inside `.hero-image`).

## Editing content

- **Industry pages** are powered by a single template (`src/pages/industries/[slug].astro`) and content from `src/data/industries.ts`. To edit industry copy, edit the data file. To add a new industry, add a row to that file.
- **Learn articles** are individual `.astro` files in `src/pages/learn/`. Edit them directly.
- **Marquee banner text** lives in `src/components/MarqueeBanner.astro`. Remove it site-wide by deleting `<MarqueeBanner />` from `src/layouts/BaseLayout.astro`, or pass `marquee={false}` to BaseLayout on specific pages.
- **Footer links** are in `src/components/Footer.astro`.

## Old URL preservation

The original site used `.html` extensions (e.g., `/product.html`). The new site uses clean directory URLs (e.g., `/vpick`). If you have inbound links to the old URLs and want to preserve them, add a `_redirects` file to `public/` or use a JavaScript redirect — happy to help with that if needed.

The main migration:

| Old | New |
|-----|-----|
| `/product.html` | `/vpick` |
| `/why.html` | `/why` |
| `/industries/3pl.html` | `/industries/3pl` |
| `/leasing.html` | `/leasing` |
| `/contact.html` | `/contact` |
| `/learn/*.html` | `/learn/*` |

## Project structure

```
.
├── astro.config.mjs               # site config
├── package.json
├── tsconfig.json
├── .github/workflows/deploy.yml   # GitHub Actions: build + deploy
├── public/
│   ├── CNAME                      # vpickplus.us (do not delete)
│   ├── robots.txt
│   └── assets/                    # images, icons, logo (preserved from old site)
└── src/
    ├── layouts/
    │   └── BaseLayout.astro       # head meta, marquee, nav, footer
    ├── components/                # reusable pieces (Nav, Footer, MarqueeBanner, etc.)
    ├── data/
    │   └── industries.ts          # industry content as structured data
    ├── styles/
    │   └── global.css             # design system + components
    └── pages/                     # one file per route
        ├── index.astro
        ├── vpick.astro
        ├── qms.astro
        ├── why.astro
        ├── leasing.astro
        ├── contact.astro
        ├── industries/
        └── learn/
```
