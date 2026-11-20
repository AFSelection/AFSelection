/**
 * Termina la migración de fotos de Supabase Storage a Cloudinary.
 *
 * Por qué existe (nov 2026): la migración de septiembre (migrate-to-cloudinary.mjs)
 * subió las fotos a Cloudinary pero escribía en la base con la clave anónima.
 * RLS bloquea esas escrituras SIN dar error (PATCH → 200 con 0 filas), así que
 * el script las dio por hechas y 25 publicaciones quedaron apuntando a
 * Supabase. Encima, el endpoint de transformaciones de Supabase no está
 * habilitado (403 FeatureNotEnabled): esas fotos no se veían en el sitio.
 *
 * Qué hace:
 *   · Publicaciones (`listings.images`) y ajustes (`site_settings`) con URLs de
 *     Supabase Storage.
 *   · Si la foto ya se había subido en septiembre, reusa esa URL de Cloudinary
 *     (sale del manifiesto .cloudinary-manifest.json). Si no, la sube ahora,
 *     limitada a 1600 px de ancho.
 *   · Respeta el encuadre del CRM (`#encuadre=…`).
 *   · Escribe con la service role key y VERIFICA que la fila cambió.
 *
 * Seguridad:
 *   · Por defecto NO escribe nada ni sube nada: muestra el plan. Hay que pasar --apply.
 *   · Antes de escribir guarda un manifiesto con el valor anterior de cada fila.
 *   · `--revert <manifiesto>` vuelve todo a como estaba.
 *   · No borra nada de Supabase Storage.
 *
 * Credenciales en af-selection-client/.env.local (ignorado por git):
 *   SUPABASE_SERVICE_ROLE_KEY=...   Dashboard → Project Settings → API Keys →
 *                                   "Secret keys" (sb_secret_…) o la service_role legacy
 *   CLOUDINARY_API_KEY=...
 *   CLOUDINARY_API_SECRET=...
 *
 * Uso:
 *   node scripts/fix-supabase-urls.mjs                ver qué haría
 *   node scripts/fix-supabase-urls.mjs --apply        hacerlo
 *   node scripts/fix-supabase-urls.mjs --revert scripts/.fix-urls-manifest-XXXX.json
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');

const SUPABASE_URL = 'https://lodmedtdpgeeswdozpow.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZG1lZHRkcGdlZXN3ZG96cG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NzcxMzgsImV4cCI6MjEwMjU1MzEzOH0.H8iis9tZW-mb1aURtx1ailLpLttqNn_ojgWO8z8olAI';
const CLOUD_NAME = 'jm1u0v8b';
const STORAGE_MARK = '.supabase.co/storage/v1/';
const SETTINGS_KEYS = ['staggered_showcase', 'testimonials_section', 'hero_images', 'site_sections'];

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const REVERT = args.includes('--revert') ? args[args.indexOf('--revert') + 1] : null;

function loadEnv() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
loadEnv();

const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CLD_KEY = process.env.CLOUDINARY_API_KEY;
const CLD_SECRET = process.env.CLOUDINARY_API_SECRET;

function requireEnv(names) {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    console.error(`\nFaltan en .env.local: ${missing.join(', ')}\n`);
    process.exit(1);
  }
}

async function rest(pathname, { method = 'GET', body, key = ANON_KEY } = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    method,
    headers: {
      apikey: key,
      // Las claves nuevas (sb_secret_… / sb_publishable_…) no son JWT: van
      // sólo en `apikey`. Las viejas (eyJ…) también en Authorization.
      ...(key.startsWith('sb_') ? {} : { Authorization: `Bearer ${key}` }),
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`REST ${method} ${pathname} → HTTP ${res.status} ${text}`);
  return text ? JSON.parse(text) : null;
}

/**
 * Escribe y comprueba que de verdad cambió UNA fila. Es exactamente lo que
 * faltó en septiembre: RLS devuelve 200 aunque no toque nada.
 */
async function patchVerified(table, keyCol, keyVal, patch) {
  const rows = await rest(`${table}?${keyCol}=eq.${encodeURIComponent(keyVal)}`, {
    method: 'PATCH', body: patch, key: SERVICE_KEY
  });
  if (!Array.isArray(rows) || rows.length !== 1) {
    throw new Error(`${table} ${keyVal}: se esperaba 1 fila actualizada y volvieron ${rows?.length ?? 0}`);
  }
  const col = Object.keys(patch)[0];
  if (JSON.stringify(rows[0][col]) !== JSON.stringify(patch[col])) {
    throw new Error(`${table} ${keyVal}: la fila no quedó con el valor nuevo`);
  }
}

const splitFraming = (url) => {
  const i = url.indexOf('#');
  return i === -1 ? [url, ''] : [url.slice(0, i), url.slice(i)];
};
const isSupabase = (u) => typeof u === 'string' && u.includes(STORAGE_MARK);

/** URLs ya subidas en septiembre: original de Supabase → Cloudinary. */
function loadPreviousUploads() {
  const map = new Map();
  const file = path.join(HERE, '.cloudinary-manifest.json');
  if (!fs.existsSync(file)) return map;
  const m = JSON.parse(fs.readFileSync(file, 'utf8'));
  const pairs = [...(m.listings || []), ...(m.hero ? [m.hero] : [])];
  for (const { antes = [], despues = [] } of pairs) {
    antes.forEach((a, i) => {
      const d = despues[i];
      if (isSupabase(a) && typeof d === 'string' && d.includes('res.cloudinary.com')) {
        map.set(splitFraming(a)[0].split('?')[0], splitFraming(d)[0]);
      }
    });
  }
  return map;
}

async function existsOnCloudinary(url) {
  const res = await fetch(url, { method: 'HEAD' });
  return res.ok;
}

async function uploadToCloudinary(sourceUrl, folder) {
  const src = await fetch(sourceUrl);
  if (!src.ok) throw new Error(`No se pudo bajar ${sourceUrl}: HTTP ${src.status}`);
  const buf = Buffer.from(await src.arrayBuffer());
  const type = src.headers.get('content-type') || 'image/jpeg';

  const timestamp = Math.floor(Date.now() / 1000);
  // Transformación de entrada: se guarda ya limitada a 1600 px (lo más grande
  // que muestra el sitio). Ahorra almacenamiento, que en Cloudinary cuesta créditos.
  const params = { folder, timestamp, transformation: 'c_limit,w_1600' };
  const toSign = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join('&');
  const signature = crypto.createHash('sha1').update(toSign + CLD_SECRET).digest('hex');

  const form = new FormData();
  form.append('file', new Blob([buf], { type }), path.basename(new URL(sourceUrl).pathname));
  for (const [k, v] of Object.entries(params)) form.append(k, String(v));
  form.append('api_key', CLD_KEY);
  form.append('signature', signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Cloudinary HTTP ${res.status}: ${await res.text()}`);
  return (await res.json()).secure_url;
}

/** Resuelve la URL nueva de una foto. En modo plan no sube nada. */
async function resolveUrl(url, folder, previous, stats) {
  const [base, framing] = splitFraming(url);
  const clean = base.split('?')[0];
  const reused = previous.get(clean);
  if (reused && await existsOnCloudinary(reused)) {
    stats.reused++;
    return reused + framing;
  }
  stats.upload++;
  if (!APPLY) return `(subir) ${clean}${framing}`;
  return (await uploadToCloudinary(clean, folder)) + framing;
}

/** Recorre cualquier JSON y reemplaza las URLs de Supabase. */
async function replaceDeep(value, folder, previous, stats) {
  if (isSupabase(value)) return resolveUrl(value, folder, previous, stats);
  if (Array.isArray(value)) {
    const out = [];
    for (const v of value) out.push(await replaceDeep(v, folder, previous, stats));
    return out;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = await replaceDeep(v, folder, previous, stats);
    return out;
  }
  return value;
}

async function revert(file) {
  requireEnv(['SUPABASE_SERVICE_ROLE_KEY']);
  const m = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  for (const l of m.listings) {
    await patchVerified('listings', 'id', l.id, { images: l.antes });
    console.log(`  revertida ${l.id}`);
  }
  for (const s of m.settings) {
    await patchVerified('site_settings', 'key', s.key, { value: s.antes });
    console.log(`  revertido ajuste ${s.key}`);
  }
  console.log('\nListo: todo volvió a como estaba.\n');
}

async function main() {
  if (REVERT) return revert(REVERT);
  if (APPLY) requireEnv(['SUPABASE_SERVICE_ROLE_KEY', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']);

  console.log(APPLY ? '\nAPLICANDO cambios.\n' : '\nModo plan: no se sube ni se escribe nada. Usá --apply para hacerlo.\n');

  const previous = loadPreviousUploads();
  const stats = { reused: 0, upload: 0 };
  const manifest = { fecha: new Date().toISOString(), listings: [], settings: [] };
  const manifestFile = path.join(HERE, `.fix-urls-manifest-${Date.now()}.json`);
  const save = () => { if (APPLY) fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2)); };

  const listings = await rest('listings?select=id,title,images&order=created_at.desc');
  const pending = listings.filter((l) => (l.images || []).some(isSupabase));
  console.log(`${pending.length} de ${listings.length} publicaciones tienen fotos en Supabase.\n`);

  for (const l of pending) {
    const before = { ...stats };
    const images = await replaceDeep(l.images, `afselect/${l.id}`, previous, stats);
    const label = (l.title || l.id).slice(0, 40).padEnd(42);
    console.log(`  ${label} reusa ${stats.reused - before.reused}, sube ${stats.upload - before.upload}`);
    if (!APPLY) continue;
    manifest.listings.push({ id: l.id, antes: l.images, despues: images });
    save(); // el manifiesto queda en disco antes de cada escritura
    await patchVerified('listings', 'id', l.id, { images });
  }

  const settings = await rest(`site_settings?select=key,value&key=in.(${SETTINGS_KEYS.join(',')})`);
  for (const s of settings) {
    if (!JSON.stringify(s.value).includes(STORAGE_MARK)) continue;
    const before = { ...stats };
    const value = await replaceDeep(s.value, 'afselect/sections', previous, stats);
    console.log(`  ajuste ${s.key.padEnd(34)} reusa ${stats.reused - before.reused}, sube ${stats.upload - before.upload}`);
    if (!APPLY) continue;
    manifest.settings.push({ key: s.key, antes: s.value, despues: value });
    save();
    await patchVerified('site_settings', 'key', s.key, { value });
  }

  console.log(`\nTotal: ${stats.reused} fotos ya estaban en Cloudinary, ${stats.upload} ${APPLY ? 'subidas' : 'para subir'}.`);
  if (APPLY) console.log(`Manifiesto para revertir: ${manifestFile}\n`);
}

main().catch((err) => {
  console.error('\nError:', err.message);
  console.error('Lo que ya se escribió está en el manifiesto; se puede revertir con --revert.\n');
  process.exit(1);
});
