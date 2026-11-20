/**
 * sitemap.xml dinámico (función serverless de Vercel; vercel.json lo sirve en
 * /sitemap.xml).
 *
 * Antes era un archivo fijo con 6 páginas: ninguna publicación ni las
 * secciones creadas desde el CRM. Ahora se arma con lo que hay en Supabase,
 * así que cada publicación nueva aparece sola, sin volver a desplegar.
 * Vercel lo guarda en caché una hora.
 */

const SITE = 'https://fidalgoselect.com';
const SUPABASE_URL = 'https://lodmedtdpgeeswdozpow.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZG1lZHRkcGdlZXN3ZG96cG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NzcxMzgsImV4cCI6MjEwMjU1MzEzOH0.H8iis9tZW-mb1aURtx1ailLpLttqNn_ojgWO8z8olAI';

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/autos', priority: '0.9', changefreq: 'daily' },
  { path: '/propiedades', priority: '0.9', changefreq: 'daily' },
  { path: '/nosotros', priority: '0.5', changefreq: 'monthly' },
  { path: '/contacto', priority: '0.5', changefreq: 'monthly' },
  { path: '/vender', priority: '0.6', changefreq: 'monthly' }
];

async function rest(pathname) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  return res.json();
}

const escapeXml = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));

function urlEntry({ path, lastmod, changefreq, priority }) {
  return [
    '  <url>',
    `    <loc>${escapeXml(SITE + path)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>'
  ].filter(Boolean).join('\n');
}

export default async function handler(req, res) {
  const entries = [...STATIC_PAGES];

  // Si Supabase no responde, igual devolvemos las páginas fijas: un sitemap
  // incompleto es mejor que un error.
  try {
    const [listings, settings] = await Promise.all([
      rest('listings?select=id,created_at&order=created_at.desc'),
      rest('site_settings?select=value&key=eq.site_sections')
    ]);

    const sections = Array.isArray(settings?.[0]?.value) ? settings[0].value : [];
    for (const s of sections) {
      if (!s?.id || entries.some((e) => e.path === `/${s.id}`)) continue;
      entries.push({ path: `/${encodeURIComponent(s.id)}`, priority: '0.8', changefreq: 'daily' });
    }

    for (const l of listings) {
      entries.push({
        path: `/producto/${encodeURIComponent(l.id)}`,
        lastmod: l.created_at ? new Date(l.created_at).toISOString().slice(0, 10) : undefined,
        priority: '0.7',
        changefreq: 'weekly'
      });
    }
  } catch (err) {
    console.error('sitemap: no se pudo leer Supabase', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(urlEntry).join('\n')}\n</urlset>\n`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
