# AF Select

Public site for [AF Select](https://fidalgoselect.com), a curated marketplace of high-end cars and properties in Tucumán, Salta and Buenos Aires. Every listing, section and banner is managed by the client from a separate CRM ([AFSelection-CRM](https://github.com/AFSelection/AFSelection-CRM)).

## What it does

- **Catalog driven by the CRM.** Sections, listings and the hero come from Supabase, so the client can add a new category (cars, properties, investments) without a code change. Listings can be filtered and sorted by price, year or mileage.
- **Maps.** Properties are shown on Leaflet maps, with a split list and map view.
- **WhatsApp-first enquiries.** Each enquiry opens WhatsApp with the listing's title, price and link already written. Enquiries, sell requests and contact messages are also stored as leads for the CRM's inbox.
- **Sell your asset.** A form where owners submit a car or property for the team to review.
- **Clean URLs and SEO.** Routes such as `/autos`, `/propiedades`, `/producto/:id`, `/vender`, `/nosotros` and `/contacto` are handled client-side with a Vercel rewrite. Each page sets its own meta tags and JSON-LD, and the site ships a sitemap, `robots.txt` and Search Console verification.

## Image pipeline

Listing photos are the heaviest part of the site, so they get their own tooling:

- `src/utils/imageUrl.js` requests each photo at the size it is displayed, snapped to a small set of widths so CDN variants are reused, and preloads images with a 3.5-second deadline so one slow photo can't hold up the page.
- `scripts/recompress-storage.mjs` fixed a real bug: the previous uploader saved PNGs of 2.7 to 8.4 MB named `.webp`, because the browser silently fell back to PNG. The script re-encodes those originals as real WebP.
- `scripts/warm-images.mjs` pre-generates the resized variants on the CDN, so no visitor pays the first-request resize time.
- `scripts/migrate-to-cloudinary.mjs` moves photos from Supabase Storage to Cloudinary and rewrites their URLs, keeping a backup manifest.

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
