/**
 * Vista previa de una ficha para WhatsApp, Facebook, Instagram, X, Google, etc.
 *
 * El sitio es una SPA: los títulos y la foto de cada ficha los pone React en
 * el navegador. Los robots que arman la vista previa de un link no ejecutan
 * JavaScript, así que veían siempre la portada genérica. vercel.json manda acá
 * SOLO a esos robots (por user-agent); las personas siguen recibiendo el
 * index.html estático de siempre, sin demora extra.
 *
 * Toma el index.html publicado y le inyecta título, descripción, foto y URL
 * de la publicación. Si algo falla, redirige a la misma ficha con ?raw=1,
 * que vercel.json sirve como la SPA normal: nunca deja una página rota.
 */

const SITE = 'https://fidalgoselect.com';
const SUPABASE_URL = 'https://lodmedtdpgeeswdozpow.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZG1lZHRkcGdlZXN3ZG96cG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NzcxMzgsImV4cCI6MjEwMjU1MzEzOH0.H8iis9tZW-mb1aURtx1ailLpLttqNn_ojgWO8z8olAI';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Foto para la vista previa: 1200×630 (lo que piden WhatsApp/Facebook), JPG liviano. */
function previewImage(url) {
  if (!url) return `${SITE}/favicon.svg`;
  const clean = String(url).split('#')[0];
  if (clean.includes('res.cloudinary.com') && clean.includes('/upload/')) {
    return clean.replace(/\/upload\/(w_[^/]+\/)?/, '/upload/w_1200,h_630,c_fill,g_auto,q_auto,f_jpg/');
  }
  return clean;
}

function formatPrice(l) {
  if (!l.price) return '';
  return `${l.currency || 'USD'} ${Number(l.price).toLocaleString('es-AR')}`;
}

export default async function handler(req, res) {
  const id = String(req.query?.id || '');
  const fallback = `/producto/${encodeURIComponent(id)}?raw=1`;

  try {
    const [pageRes, rowsRes] = await Promise.all([
      fetch(`${SITE}/index.html`),
      fetch(`${SUPABASE_URL}/rest/v1/listings?select=id,title,description,subtitle,price,currency,images,location&id=eq.${encodeURIComponent(id)}`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
      })
    ]);
    if (!pageRes.ok || !rowsRes.ok) throw new Error(`index ${pageRes.status} / supabase ${rowsRes.status}`);

    let html = await pageRes.text();
    const listing = (await rowsRes.json())?.[0];
    if (!listing) {
      // Publicación borrada: el HTML de siempre, que muestra el home.
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=300');
      return res.status(200).send(html);
    }

    const price = formatPrice(listing);
    const title = `${listing.title}${price ? ` (${price})` : ''} | AF SELECT`;
    const rawDesc = listing.description || listing.subtitle || `${listing.title}${listing.location ? ` en ${listing.location}` : ''}. Trato directo con Agustín Fidalgo.`;
    const description = rawDesc.replace(/\s+/g, ' ').trim().slice(0, 180);
    const url = `${SITE}/producto/${encodeURIComponent(listing.id)}`;
    const image = previewImage(listing.images?.[0]);

    const tags = [
      `<title>${esc(title)}</title>`,
      `<meta name="description" content="${esc(description)}" />`,
      `<link rel="canonical" href="${esc(url)}" />`,
      `<meta property="og:type" content="product" />`,
      `<meta property="og:site_name" content="AF SELECT" />`,
      `<meta property="og:title" content="${esc(title)}" />`,
      `<meta property="og:description" content="${esc(description)}" />`,
      `<meta property="og:url" content="${esc(url)}" />`,
      `<meta property="og:image" content="${esc(image)}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:locale" content="es_AR" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${esc(title)}" />`,
      `<meta name="twitter:description" content="${esc(description)}" />`,
      `<meta name="twitter:image" content="${esc(image)}" />`
    ].join('\n    ');

    // Se sacan los genéricos del index para no dejar dos valores distintos.
    html = html
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta\s+(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/gi, '')
      .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
      .replace(/<head>/i, `<head>\n    ${tags}`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=86400');
    return res.status(200).send(html);
  } catch (err) {
    console.error('producto preview:', err);
    res.setHeader('Cache-Control', 'no-store');
    return res.redirect(307, fallback);
  }
}
