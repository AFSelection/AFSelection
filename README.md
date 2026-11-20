# AF Select

Public site for [AF Select](https://fidalgoselect.com), a curated marketplace of high-end cars and properties in Tucumán, Salta and Buenos Aires. Every listing, section and banner is managed by the client from a separate CRM ([AFSelection-CRM](https://github.com/AFSelection/AFSelection-CRM)).

## What it does

- **Catalog driven by the CRM.** Sections, listings and the hero come from Supabase, so the client can add a new category (cars, properties, investments) without a code change. Listings can be filtered and sorted by price, year or mileage.
- **Maps.** Properties are shown on Leaflet maps, with a split list and map view.
- **WhatsApp-first enquiries.** Each enquiry opens WhatsApp with the listing's title, price and link already written. Enquiries, sell requests and contact messages are also stored as leads for the CRM's inbox.
- **Sell your asset.** A form where owners submit a car or property for the team to review.
- **Clean URLs and SEO.** Routes such as `/autos`, `/propiedades`, `/producto/:id`, `/vender`, `/nosotros` and `/contacto` are handled client-side with a Vercel rewrite. Each page sets its own meta tags and JSON-LD, and the site ships a sitemap, `robots.txt` and Search Console verification.

## Image pipeline

Every photo lives in **Cloudinary**, which resizes and converts it on the fly (`w_…,q_…,f_auto`). Supabase Storage is no longer used for images: its image transformations are not enabled on this project (they return `403 FeatureNotEnabled`), and the free plan only allows 1 GB of storage.

- `src/utils/imageUrl.js` requests each photo at the size it is displayed, capped to the screen width and snapped to a small set of widths so CDN variants are reused.
- `src/components/OptimizedImage.jsx` only downloads a photo when it gets close to the viewport, and falls back to the original file if the resized version fails. Opening a listing on a phone downloads about 0.8 MB instead of the whole catalog.
- `scripts/fix-supabase-urls.mjs` finishes the migration from Supabase Storage to Cloudinary. It verifies every database write: the earlier migration (`migrate-to-cloudinary.mjs`) wrote with the anon key, RLS silently ignored it, and 28 listings kept their old URLs.
- `scripts/recompress-storage.mjs` and `scripts/warm-images.mjs` belong to the old Supabase pipeline and are kept for reference only.

## SEO and link previews

- `api/sitemap.js` builds `/sitemap.xml` from the database (every listing and every CRM section), cached for an hour.
- `api/producto.js` serves `/producto/:id` with the listing's title, price, description and a 1200×630 photo **only to link-preview bots** (WhatsApp, Facebook, X, Google…), selected by user agent in `vercel.json`. People get the normal static page. If anything fails, it redirects to `?raw=1`, which serves the regular SPA.

## Security and backups

- Database access rules live in `supabase/seguridad.sql`: the public can read listings and settings and create enquiries; only the CRM account can write, delete or read enquiries. Sign-ups are disabled in Supabase Auth.
- The free Supabase plan has **no automatic backups**. Run `node scripts/respaldo.mjs` to save the three tables as JSON in `../respaldos/<date>/` (outside the repo, because enquiries contain personal data).

## Stack

React 18, JavaScript, Vite, hand-written CSS, Supabase (Postgres), Leaflet, Cloudinary, Vercel.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

`VITE_WHATSAPP_NUMBER` sets the WhatsApp number for enquiries. The maintenance scripts in `scripts/` run with Node and need `SUPABASE_SERVICE_ROLE_KEY` in the environment; never expose that key to the browser.

---

Designed and built by [Giuliana Di Rocco](https://dev.giulianadirocco.com).
