/**
 * Pre-genera en el CDN las versiones redimensionadas de todas las fotos.
 *
 * Por qué hace falta: Supabase genera cada variante la primera vez que alguien
 * la pide, y para eso tiene que abrir el original (2 a 8 MB) y redimensionarlo.
 * Esa primera vez tarda ~2 segundos. A partir de la segunda responde el CDN en
 * milisegundos. Este script paga esa primera vez por adelantado, para que
 * ningún visitante se la coma.
 *
 * Cuándo correrlo: una vez ahora, y después de cargar publicaciones nuevas.
 *
 *   node scripts/warm-images.mjs
 *   node scripts/warm-images.mjs --limit 5    (prueba corta)
 */

import { buildImageUrl } from '../src/utils/imageUrl.js';

const SUPABASE_URL = 'https://lodmedtdpgeeswdozpow.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZG1lZHRkcGdlZXN3ZG96cG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NzcxMzgsImV4cCI6MjEwMjU1MzEzOH0.H8iis9tZW-mb1aURtx1ailLpLttqNn_ojgWO8z8olAI';

/**
 * Bajo a propósito. Supabase limita la tasa del generador de transformaciones
 * y responde 429 si se lo empuja: es más rápido ir parejo que reintentar.
 */
const CONCURRENCY = 4;

/** Reintentos ante 429 / errores de red, con espera creciente. */
const MAX_RETRIES = 4;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Variantes que el sitio realmente pide. Tienen que coincidir con lo que
 * produce buildImageUrl en cada componente, o estaríamos calentando URLs que
 * nadie visita.
 */
/*
 * Ojo con el devicePixelRatio: un mismo componente pide anchos distintos según
 * la pantalla del visitante. Una tarjeta de 640 px lógicos se resuelve a 640 en
 * un monitor común, 960 en uno de 1.5x y 1280 en retina. Hay que calentar las
 * tres o los visitantes con pantalla densa igual se comen la espera — que es
 * justo lo que pasó la primera vez que corrí esto.
 */
const VARIANTS = {
  // Toda foto de una galería: miniatura y foto grande de la ficha.
  every: [
    { width: 200, quality: 65 },   // miniatura 1x
    { width: 400, quality: 65 },   // miniatura 2x
    { width: 1280, quality: 80 },  // ficha 1x
    { width: 1600, quality: 80 }   // ficha en pantalla densa / lightbox
  ],
  // La portada, que además aparece como tarjeta en el catálogo.
  cover: [
    { width: 640, quality: 72 },   // tarjeta 1x
    { width: 960, quality: 72 },   // tarjeta 1.5x
    { width: 1280, quality: 72 }   // tarjeta 2x
  ],
  hero: [
    { width: 1600, quality: 80 }
  ]
};

async function fetchJson(path) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
  });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return res.json();
}

async function collectUrls(limit) {
  const listings = await fetchJson('listings?select=id,images&order=created_at.desc');
  const scope = limit ? listings.slice(0, limit) : listings;

  const urls = new Set();

  for (const listing of scope) {
    const images = listing.images || [];
    images.forEach((src, index) => {
      for (const v of VARIANTS.every) urls.add(buildImageUrl(src, v));
      if (index === 0) {
        for (const v of VARIANTS.cover) urls.add(buildImageUrl(src, v));
      }
    });
  }

  // Hero: vive en site_settings, no en listings.
  try {
    const rows = await fetchJson("site_settings?select=value&key=eq.hero_images");
    const hero = rows?.[0]?.value;
    if (Array.isArray(hero)) {
      for (const src of hero) {
        for (const v of VARIANTS.hero) urls.add(buildImageUrl(src, v));
      }
    }
  } catch {
    console.warn('No se pudieron leer las imágenes del hero; se omiten.');
  }

  return [...urls];
}

async function warm(url) {
  let wait = 800;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Accept con webp: es lo que hace que Supabase devuelva WebP y no el
      // formato original. Sin esta cabecera se cachearía la variante equivocada.
      const res = await fetch(url, {
        headers: { Accept: 'image/webp,image/avif,image/*,*/*' }
      });

      // 429 = tope de tasa del generador. No es un fallo de la imagen:
      // conviene esperar y volver, no descartarla.
      if (res.status === 429 || res.status >= 500) {
        if (attempt === MAX_RETRIES) {
          return { ok: false, bytes: 0, cached: false, status: res.status };
        }
        await sleep(wait);
        wait *= 2;
        continue;
      }

      return {
        ok: res.ok,
        bytes: Number(res.headers.get('content-length') || 0),
        cached: res.headers.get('cf-cache-status') === 'HIT',
        status: res.status,
        retries: attempt
      };
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        return { ok: false, bytes: 0, cached: false, status: err.message };
      }
      await sleep(wait);
      wait *= 2;
    }
  }
}

async function main() {
  const limitFlag = process.argv.indexOf('--limit');
  const limit = limitFlag > -1 ? Number(process.argv[limitFlag + 1]) : null;

  console.log('Leyendo catálogo…');
  const urls = await collectUrls(limit);
  console.log(`${urls.length} variantes a preparar (concurrencia ${CONCURRENCY}).\n`);

  let done = 0;
  let failed = 0;
  let alreadyCached = 0;
  let totalBytes = 0;
  const started = Date.now();

  let cursor = 0;
  const worker = async () => {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      const r = await warm(url);

      done++;
      if (!r.ok) {
        failed++;
        if (failed <= 5) console.warn(`  fallo ${r.status}: ${url.slice(-70)}`);
      } else {
        totalBytes += r.bytes;
        if (r.cached) alreadyCached++;
      }

      if (done % 50 === 0 || done === urls.length) {
        const pct = Math.round((done / urls.length) * 100);
        const secs = Math.round((Date.now() - started) / 1000);
        process.stdout.write(`\r  ${done}/${urls.length} (${pct}%) · ${secs}s · ${failed} fallos`);
      }
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker)
  );

  const secs = Math.round((Date.now() - started) / 1000);
  const mb = (totalBytes / 1024 / 1024).toFixed(1);
  const avgKb = done > failed ? (totalBytes / (done - failed) / 1024).toFixed(0) : '?';

  console.log('\n');
  console.log(`Listo en ${secs}s.`);
  console.log(`  variantes preparadas : ${done - failed}`);
  console.log(`  ya estaban en caché  : ${alreadyCached}`);
  console.log(`  fallos               : ${failed}`);
  console.log(`  peso total servido   : ${mb} MB (promedio ${avgKb} KB por imagen)`);
}

main().catch((err) => {
  console.error('\nError:', err.message);
  process.exit(1);
});
