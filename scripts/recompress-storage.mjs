/**
 * Recomprime las fotos que ya están en Supabase Storage.
 *
 * Por qué existe: el compresor viejo del CRM decía guardar WebP pero guardaba
 * PNG (canvas.toBlob caía a PNG sin avisar cuando el navegador no sabía
 * codificar WebP). Quedaron 511 archivos de 2.7 a 8.4 MB con nombre `.webp`.
 * El sitio ya no los sirve crudos — pasa todo por las transformaciones — pero
 * el storage sigue ocupado y cada variante nueva se genera leyendo ese original
 * gigante. Esto los reemplaza por WebP de verdad.
 *
 * Cómo comprime, sin depender de librerías nativas: usa el propio endpoint de
 * transformaciones de Supabase como codificador. Pedir la foto a width=1600 y
 * quality=85 devuelve WebP real; esos bytes se vuelven a subir como el nuevo
 * original. 1600 es el ancho más grande que el sitio llega a mostrar.
 *
 * ─── Seguridad ────────────────────────────────────────────────────────────
 * Toca datos de producción, así que:
 *   · Por defecto NO escribe nada. Hay que pasar --apply.
 *   · Sube el archivo nuevo al lado del viejo. El original no se toca.
 *   · Sólo actualiza la publicación cuando TODAS sus fotos se subieron bien.
 *   · Escribe un manifiesto que permite deshacer todo.
 *   · Los originales se borran únicamente con un comando aparte, después de
 *     que hayas verificado el sitio a ojo.
 *
 * ─── Credenciales ─────────────────────────────────────────────────────────
 * Subir a Storage requiere sesión: la clave anónima está bloqueada por RLS.
 * Poné UNA de las dos opciones en af-selection-client/.env.local (ignorado
 * por git; nunca lo pegues en un chat ni lo comitees):
 *
 *   SUPABASE_SERVICE_ROLE_KEY=...        ← recomendado (Dashboard → Settings → API)
 *
 *   o si preferís usar tu usuario del CRM:
 *   SUPABASE_EMAIL=...
 *   SUPABASE_PASSWORD=...
 *
 * ─── Uso ──────────────────────────────────────────────────────────────────
 *   node scripts/recompress-storage.mjs                    ver qué haría
 *   node scripts/recompress-storage.mjs --limit 1 --apply  probar con 1 publicación
 *   node scripts/recompress-storage.mjs --apply            todo el catálogo
 *   node scripts/recompress-storage.mjs --rollback         deshacer
 *   node scripts/recompress-storage.mjs --delete-originals borrar los viejos
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const MANIFEST = path.join(HERE, '.recompress-manifest.json');

const SUPABASE_URL = 'https://lodmedtdpgeeswdozpow.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZG1lZHRkcGdlZXN3ZG96cG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NzcxMzgsImV4cCI6MjEwMjU1MzEzOH0.H8iis9tZW-mb1aURtx1ailLpLttqNn_ojgWO8z8olAI';

const BUCKET = 'listings';
const OBJECT_PREFIX = `/storage/v1/object/public/${BUCKET}/`;

/** Ancho y calidad con que se guarda el nuevo original. */
const STORE_WIDTH = 1600;
const STORE_QUALITY = 85;

/** Debajo de esto no vale la pena tocar el archivo. */
const SKIP_UNDER_BYTES = 500 * 1024;

/** Si el "ahorro" es menor a esto, se deja el original. */
const MIN_SAVING_RATIO = 0.25;

const CONCURRENCY = 3;
const MAX_RETRIES = 4;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const kb = (b) => `${(b / 1024).toFixed(0)} KB`;
const mb = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`;

/* ------------------------------------------------------------------ *
 * Credenciales
 * ------------------------------------------------------------------ */

function loadEnvLocal() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

/**
 * Devuelve el token con permiso de escritura. Nunca lo imprime.
 *
 * @param {boolean} needsWrite La simulación sólo lee el catálogo, y para eso
 *   alcanza la clave pública: así se puede previsualizar sin configurar nada.
 */
async function resolveAuth(needsWrite) {
  loadEnvLocal();

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    return { apikey: serviceKey, token: serviceKey, modo: 'service role' };
  }

  const email = process.env.SUPABASE_EMAIL;
  const password = process.env.SUPABASE_PASSWORD;
  if (email && password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      throw new Error(`No se pudo iniciar sesión (HTTP ${res.status}). Revisá SUPABASE_EMAIL / SUPABASE_PASSWORD.`);
    }
    const data = await res.json();
    return { apikey: ANON_KEY, token: data.access_token, modo: `usuario ${email}` };
  }

  if (!needsWrite) {
    return { apikey: ANON_KEY, token: ANON_KEY, modo: 'sólo lectura (clave pública)' };
  }

  throw new Error(
    'Faltan credenciales.\n' +
    `Creá ${path.join(ROOT, '.env.local')} con:\n\n` +
    '  SUPABASE_SERVICE_ROLE_KEY=...\n\n' +
    'o bien:\n\n' +
    '  SUPABASE_EMAIL=...\n  SUPABASE_PASSWORD=...\n'
  );
}

let AUTH = null;
const authHeaders = () => ({
  apikey: AUTH.apikey,
  Authorization: `Bearer ${AUTH.token}`
});

/* ------------------------------------------------------------------ *
 * Utilidades de red
 * ------------------------------------------------------------------ */

async function withRetry(label, fn) {
  let wait = 800;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fn();
      if (res.status === 429 || res.status >= 500) {
        if (attempt === MAX_RETRIES) throw new Error(`${label}: HTTP ${res.status}`);
        await sleep(wait); wait *= 2; continue;
      }
      return res;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw new Error(`${label}: ${err.message}`);
      await sleep(wait); wait *= 2;
    }
  }
}

async function rest(pathname, init = {}) {
  const res = await withRetry(`REST ${pathname}`, () =>
    fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
      ...init,
      headers: { ...authHeaders(), 'Content-Type': 'application/json', ...(init.headers || {}) }
    })
  );
  if (!res.ok) throw new Error(`REST ${pathname} → HTTP ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

/* ------------------------------------------------------------------ *
 * Operaciones sobre una imagen
 * ------------------------------------------------------------------ */

function isWebp(buf) {
  return buf.length > 12 &&
    buf.toString('latin1', 0, 4) === 'RIFF' &&
    buf.toString('latin1', 8, 12) === 'WEBP';
}

function storagePathOf(publicUrl) {
  const i = publicUrl.indexOf(OBJECT_PREFIX);
  if (i === -1) return null;
  return decodeURIComponent(publicUrl.slice(i + OBJECT_PREFIX.length).split('?')[0]);
}

async function headOriginal(publicUrl) {
  const res = await withRetry('HEAD original', () => fetch(publicUrl, { method: 'HEAD' }));
  if (!res.ok) return null;
  return {
    bytes: Number(res.headers.get('content-length') || 0),
    type: res.headers.get('content-type') || ''
  };
}

/** Usa el transformador de Supabase como codificador WebP. */
async function encodeViaTransform(publicUrl) {
  const url = publicUrl.replace(
    OBJECT_PREFIX,
    `/storage/v1/render/image/public/${BUCKET}/`
  ).split('?')[0] + `?width=${STORE_WIDTH}&quality=${STORE_QUALITY}`;

  const res = await withRetry('transform', () =>
    fetch(url, { headers: { Accept: 'image/webp,image/*,*/*' } })
  );
  if (!res.ok) throw new Error(`transform → HTTP ${res.status}`);

  const buf = Buffer.from(await res.arrayBuffer());
  if (!isWebp(buf)) {
    throw new Error(`el transformador devolvió ${res.headers.get('content-type')}, no WebP`);
  }
  return buf;
}

async function uploadWebp(storagePath, buf) {
  const res = await withRetry('upload', () =>
    fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`, {
      method: 'POST',
      headers: {
        ...authHeaders(),
        'Content-Type': 'image/webp',
        'cache-control': 'max-age=31536000',
        // Sin esto, un segundo intento sobre una foto que ya se había subido
        // (por ejemplo si la corrida anterior se cortó a la mitad) devolvería
        // 409 y la daría por fallada. Con upsert el script es reejecutable.
        'x-upsert': 'true'
      },
      body: buf
    })
  );
  if (!res.ok) throw new Error(`upload → HTTP ${res.status} ${await res.text()}`);
  return `${SUPABASE_URL}${OBJECT_PREFIX}${storagePath}`;
}

/** Confirma que lo subido se lee y pesa lo que tiene que pesar. */
async function verifyUploaded(publicUrl, expectedBytes) {
  const res = await withRetry('verify', () => fetch(publicUrl));
  if (!res.ok) return { ok: false, motivo: `HTTP ${res.status}` };
  const buf = Buffer.from(await res.arrayBuffer());
  if (!isWebp(buf)) return { ok: false, motivo: 'lo subido no es WebP' };
  if (Math.abs(buf.length - expectedBytes) > 64) {
    return { ok: false, motivo: `tamaño distinto (${buf.length} vs ${expectedBytes})` };
  }
  return { ok: true };
}

async function deleteObject(storagePath) {
  const res = await withRetry('delete', () =>
    fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${storagePath}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
  );
  return res.ok;
}

/**
 * Procesa una foto. Devuelve la URL nueva, o null si conviene dejarla como está.
 */
async function processImage(publicUrl, { apply }) {
  const storagePath = storagePathOf(publicUrl);
  if (!storagePath) return { skip: 'no es de este bucket' };
  if (/_opt\.webp$/.test(storagePath)) return { skip: 'ya recomprimida' };

  const head = await headOriginal(publicUrl);
  if (!head) return { skip: 'no se pudo leer' };

  // Sin content-length no hay con qué comparar el ahorro, y reemplazar a ciegas
  // podría dejar una foto peor que la original. Se deja para revisión manual.
  if (!head.bytes) return { skip: 'el servidor no informó el tamaño' };

  if (head.bytes < SKIP_UNDER_BYTES) {
    return { skip: `ya es chica (${kb(head.bytes)})`, originalBytes: head.bytes };
  }

  const buf = await encodeViaTransform(publicUrl);
  const saving = 1 - buf.length / head.bytes;

  if (saving < MIN_SAVING_RATIO) {
    return { skip: `ahorro insuficiente (${Math.round(saving * 100)}%)`, originalBytes: head.bytes };
  }

  const newPath = storagePath.replace(/\.[^/.]+$/, '') + '_opt.webp';

  if (!apply) {
    return { dryRun: true, originalBytes: head.bytes, newBytes: buf.length, newPath };
  }

  const newUrl = await uploadWebp(newPath, buf);
  const check = await verifyUploaded(newUrl, buf.length);
  if (!check.ok) {
    await deleteObject(newPath).catch(() => {});
    throw new Error(`verificación falló: ${check.motivo}`);
  }

  return {
    originalBytes: head.bytes,
    newBytes: buf.length,
    oldPath: storagePath,
    newUrl
  };
}

/* ------------------------------------------------------------------ *
 * Modos
 * ------------------------------------------------------------------ */

async function runRecompress({ apply, limit }) {
  console.log(apply ? 'MODO REAL — se van a escribir cambios.\n' : 'SIMULACIÓN — no se escribe nada. Usá --apply para ejecutar.\n');

  const listings = await rest('listings?select=id,title,images&order=created_at.desc');
  const scope = limit ? listings.slice(0, limit) : listings;
  console.log(`${scope.length} publicación(es) a revisar.\n`);

  const manifest = { creado: new Date().toISOString(), listings: [], hero: null };
  let totalBefore = 0, totalAfter = 0, converted = 0, skipped = 0, failed = 0;

  for (const listing of scope) {
    const images = listing.images || [];
    if (images.length === 0) continue;

    const results = new Array(images.length);
    let cursor = 0;
    let listingFailed = false;

    const worker = async () => {
      while (cursor < images.length) {
        const i = cursor++;
        try {
          results[i] = await processImage(images[i], { apply });
        } catch (err) {
          results[i] = { error: err.message };
          listingFailed = true;
        }
      }
    };
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, images.length) }, worker));

    const changed = results.filter((r) => r && (r.newUrl || r.dryRun));
    changed.forEach((r) => { totalBefore += r.originalBytes; totalAfter += r.newBytes; });
    converted += changed.length;
    skipped += results.filter((r) => r && r.skip).length;
    failed += results.filter((r) => r && r.error).length;

    const label = (listing.title || listing.id).slice(0, 42).padEnd(42);
    if (changed.length === 0) {
      console.log(`  ${label} sin cambios`);
      continue;
    }

    const before = changed.reduce((s, r) => s + r.originalBytes, 0);
    const after = changed.reduce((s, r) => s + r.newBytes, 0);
    console.log(`  ${label} ${changed.length}/${images.length} fotos · ${mb(before)} → ${mb(after)}`);

    if (!apply) continue;

    if (listingFailed) {
      // Regla deliberada: si una sola foto falló, no se toca la publicación.
      // Mejor dejarla entera con las viejas que mezclar mitad y mitad.
      console.log(`     ↳ se omite la actualización: ${results.filter(r => r?.error).length} foto(s) fallaron`);
      continue;
    }

    const newImages = images.map((url, i) => results[i]?.newUrl || url);
    await rest(`listings?id=eq.${encodeURIComponent(listing.id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ images: newImages })
    });

    manifest.listings.push({
      id: listing.id,
      imagesAntes: images,
      imagesDespues: newImages,
      pathsViejos: results.map((r) => r?.oldPath).filter(Boolean)
    });
  }

  // Hero: vive en site_settings, no en listings.
  try {
    const rows = await rest('site_settings?select=value&key=eq.hero_images');
    const hero = rows?.[0]?.value;
    if (Array.isArray(hero) && hero.length) {
      const out = [];
      const oldPaths = [];
      for (const src of hero) {
        try {
          const r = await processImage(src, { apply });
          if (r.newUrl) { out.push(r.newUrl); oldPaths.push(r.oldPath); totalBefore += r.originalBytes; totalAfter += r.newBytes; converted++; }
          else { out.push(src); if (r.dryRun) { totalBefore += r.originalBytes; totalAfter += r.newBytes; converted++; } }
        } catch { out.push(src); failed++; }
      }
      if (apply && oldPaths.length) {
        await rest('site_settings?key=eq.hero_images', {
          method: 'PATCH',
          headers: { Prefer: 'return=minimal' },
          body: JSON.stringify({ value: out })
        });
        manifest.hero = { antes: hero, despues: out, pathsViejos: oldPaths };
        console.log(`  ${'HERO'.padEnd(42)} ${oldPaths.length} imagen(es) actualizadas`);
      }
    }
  } catch (err) {
    console.warn('  Hero: no se pudo procesar —', err.message);
  }

  console.log('\n─────────────────────────────────────────');
  console.log(`  fotos convertidas : ${converted}`);
  console.log(`  omitidas          : ${skipped}`);
  console.log(`  fallidas          : ${failed}`);
  console.log(`  peso antes        : ${mb(totalBefore)}`);
  console.log(`  peso después      : ${mb(totalAfter)}`);
  if (totalBefore > 0) {
    console.log(`  ahorro            : ${mb(totalBefore - totalAfter)} (${Math.round((1 - totalAfter / totalBefore) * 100)}%)`);
  }

  if (apply && (manifest.listings.length || manifest.hero)) {
    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
    console.log(`\n  Manifiesto: ${MANIFEST}`);
    console.log('  Revisá el sitio. Si algo se ve mal:');
    console.log('    node scripts/recompress-storage.mjs --rollback');
    console.log('  Si está todo bien, para liberar el espacio:');
    console.log('    node scripts/recompress-storage.mjs --delete-originals');
  }
}

async function runRollback() {
  if (!fs.existsSync(MANIFEST)) throw new Error('No hay manifiesto: nada que deshacer.');
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

  console.log(`Deshaciendo el backfill del ${m.creado}…\n`);

  for (const l of m.listings) {
    await rest(`listings?id=eq.${encodeURIComponent(l.id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ images: l.imagesAntes })
    });
    // Los archivos nuevos se borran; los originales nunca se tocaron.
    for (const url of l.imagesDespues) {
      const p = storagePathOf(url);
      if (p && /_opt\.webp$/.test(p)) await deleteObject(p).catch(() => {});
    }
    console.log(`  restaurada ${l.id}`);
  }

  if (m.hero) {
    await rest('site_settings?key=eq.hero_images', {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ value: m.hero.antes })
    });
    for (const url of m.hero.despues) {
      const p = storagePathOf(url);
      if (p && /_opt\.webp$/.test(p)) await deleteObject(p).catch(() => {});
    }
    console.log('  restaurado el hero');
  }

  fs.renameSync(MANIFEST, MANIFEST.replace('.json', `.revertido-${Date.now()}.json`));
  console.log('\nListo. Todo volvió a las fotos originales.');
}

async function runDeleteOriginals() {
  if (!fs.existsSync(MANIFEST)) throw new Error('No hay manifiesto: no sé qué borrar.');
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

  const paths = [
    ...m.listings.flatMap((l) => l.pathsViejos || []),
    ...(m.hero?.pathsViejos || [])
  ];

  console.log(`Se van a borrar ${paths.length} archivos originales.`);
  console.log('IRREVERSIBLE: después de esto ya no se puede hacer --rollback.\n');

  // Comprobación previa: que todos los reemplazos estén realmente en línea.
  console.log('Verificando que los reemplazos existan…');
  const allNew = [
    ...m.listings.flatMap((l) => l.imagesDespues),
    ...(m.hero?.despues || [])
  ].filter((u) => /_opt\.webp$/.test(u));

  for (const url of allNew) {
    const res = await fetch(url, { method: 'HEAD' });
    if (!res.ok) {
      throw new Error(`Falta el reemplazo ${url} (HTTP ${res.status}). No se borra nada.`);
    }
  }
  console.log(`  ${allNew.length} reemplazos verificados.\n`);

  let ok = 0, fail = 0;
  for (const p of paths) {
    if (await deleteObject(p)) ok++; else fail++;
  }

  console.log(`Borrados: ${ok} · fallidos: ${fail}`);
  fs.renameSync(MANIFEST, MANIFEST.replace('.json', `.aplicado-${Date.now()}.json`));
}

/* ------------------------------------------------------------------ */

async function main() {
  const args = process.argv.slice(2);
  const has = (f) => args.includes(f);
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx > -1 ? Number(args[limitIdx + 1]) : null;

  const needsWrite = has('--apply') || has('--rollback') || has('--delete-originals');
  AUTH = await resolveAuth(needsWrite);
  console.log(`Autenticado (${AUTH.modo}).\n`);

  if (has('--rollback')) return runRollback();
  if (has('--delete-originals')) return runDeleteOriginals();
  return runRecompress({ apply: has('--apply'), limit });
}

main().catch((err) => {
  console.error('\n' + err.message);
  process.exit(1);
});
