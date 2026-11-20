/**
 * Respaldo de la base (publicaciones, ajustes del sitio y consultas).
 *
 * El plan gratis de Supabase NO hace respaldos automáticos. Esto baja las tres
 * tablas a JSON en Documents/AFSelect/respaldos/<fecha>/, fuera del repo
 * (las consultas tienen datos personales de clientes: nunca van a GitHub).
 *
 * Las fotos no hace falta respaldarlas acá: viven en Cloudinary.
 *
 * Uso (necesita SUPABASE_SERVICE_ROLE_KEY en .env.local):
 *   node scripts/respaldo.mjs
 *
 * Para volver a cargar un respaldo, ver la nota al final del README.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const SUPABASE_URL = 'https://lodmedtdpgeeswdozpow.supabase.co';
const TABLES = ['listings', 'site_settings', 'leads'];

const env = fs.existsSync(path.join(ROOT, '.env.local'))
  ? fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8')
  : '';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.match(/^SUPABASE_SERVICE_ROLE_KEY=(.*)$/m)?.[1]?.trim();
if (!KEY) {
  console.error('Falta SUPABASE_SERVICE_ROLE_KEY en .env.local');
  process.exit(1);
}

const stamp = new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-');
const dir = path.join(ROOT, '..', 'respaldos', stamp);
fs.mkdirSync(dir, { recursive: true });

for (const table of TABLES) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: { apikey: KEY, ...(KEY.startsWith('sb_') ? {} : { Authorization: `Bearer ${KEY}` }) }
  });
  if (!res.ok) {
    console.error(`${table}: HTTP ${res.status} ${await res.text()}`);
    process.exit(1);
  }
  const rows = await res.json();
  fs.writeFileSync(path.join(dir, `${table}.json`), JSON.stringify(rows, null, 2));
  console.log(`  ${table.padEnd(14)} ${rows.length} filas`);
}

console.log(`\nRespaldo guardado en ${dir}\n`);
