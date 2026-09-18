/**
 * Migra todas las fotos de Supabase Storage a Cloudinary.
 *
 * 1. Lee todas las publicaciones y la configuración del hero de Supabase DB.
 * 2. Por cada imagen guardada en Supabase Storage, la descarga optimizada y la sube a Cloudinary.
 * 3. Reemplaza las URLs en la base de datos de Supabase con las nuevas URLs públicas de Cloudinary CDN.
 * 4. Guarda un manifiesto de respaldo por seguridad.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.join(HERE, '.cloudinary-manifest.json');

const SUPABASE_URL = 'https://lodmedtdpgeeswdozpow.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvZG1lZHRkcGdlZXN3ZG96cG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NzcxMzgsImV4cCI6MjEwMjU1MzEzOH0.H8iis9tZW-mb1aURtx1ailLpLttqNn_ojgWO8z8olAI';

const CLOUD_NAME = 'jm1u0v8b';
const API_KEY = '972187185433841';
const API_SECRET = 'iVSI-ZmPGLC-eaq--dvNxRazLjY';

const BUCKET = 'listings';
const OBJECT_PREFIX = `/storage/v1/object/public/${BUCKET}/`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mb = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`;

async function rest(pathname, init = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    ...init,
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  });
  if (!res.ok) throw new Error(`REST ${pathname} → HTTP ${res.status} ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

/** Sube un buffer de imagen a Cloudinary */
async function uploadToCloudinary(imageBuffer, folder, filename) {
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = filename.replace(/\.[^/.]+$/, '');
  
  // Parámetros a firmar
  const paramsToSign = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}`;
  const signature = crypto.createHash('sha1').update(paramsToSign + API_SECRET).digest('hex');

  const formData = new FormData();
  const blob = new Blob([imageBuffer], { type: 'image/webp' });
  formData.append('file', blob, filename);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp.toString());
  formData.append('signature', signature);
  formData.append('folder', folder);
  formData.append('public_id', publicId);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary upload HTTP ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.secure_url;
}

/** Descarga la imagen de Supabase (usando la transformada optimizada a 1600px si está disponible) */
async function fetchSupabaseImage(url) {
  // Intentar primero con el endpoint de render/transformación para ahorrar ancho de banda y velocidad
  let downloadUrl = url;
  if (url.includes(OBJECT_PREFIX)) {
    downloadUrl = url.replace(OBJECT_PREFIX, `/storage/v1/render/image/public/${BUCKET}/`).split('?')[0] + '?width=1600&quality=85';
  }

  let res = await fetch(downloadUrl);
  if (!res.ok) {
    // Reintentar con la URL original cruda por si acaso
    res = await fetch(url);
  }
  if (!res.ok) throw new Error(`Error al descargar de Supabase: HTTP ${res.status}`);

  const arrayBuf = await res.arrayBuffer();
  return Buffer.from(arrayBuf);
}

/** Procesa y transfiere una imagen */
async function processAndMigrateImage(url, folder, filenameHint) {
  if (url.includes('res.cloudinary.com')) {
    return { url, skipped: true, reason: 'Ya en Cloudinary' };
  }

  const buffer = await fetchSupabaseImage(url);
  const originalSize = buffer.length;

  const folderName = `afselect/${folder}`;
  const filename = filenameHint || `img_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.webp`;

  const cloudinaryUrl = await uploadToCloudinary(buffer, folderName, filename);

  return {
    urlOriginal: url,
    cloudinaryUrl,
    size: originalSize
  };
}

async function main() {
  console.log('🚀 Iniciando migración masiva de fotos a Cloudinary...\n');

  const listings = await rest('listings?select=id,title,images&order=created_at.desc');
  console.log(`📋 ${listings.length} publicaciones encontradas.\n`);

  const manifest = { fecha: new Date().toISOString(), listings: [], hero: null };
  let totalConverted = 0;
  let totalBytes = 0;

  for (let idx = 0; idx < listings.length; idx++) {
    const listing = listings[idx];
    const images = listing.images || [];
    if (images.length === 0) continue;

    const label = `[${idx + 1}/${listings.length}] ${(listing.title || listing.id).slice(0, 35)}`.padEnd(45);
    const newImages = [];
    let listingBytes = 0;
    let listingConverted = 0;

    for (let i = 0; i < images.length; i++) {
      const srcUrl = images[i];
      try {
        const hint = `photo_${i + 1}_${Date.now()}`;
        const res = await processAndMigrateImage(srcUrl, listing.id, hint);
        newImages.push(res.cloudinaryUrl || res.url);
        if (!res.skipped) {
          totalConverted++;
          listingConverted++;
          totalBytes += res.size;
          listingBytes += res.size;
        }
      } catch (err) {
        console.error(`\n  ❌ Error en foto ${i + 1} de ${listing.id}: ${err.message}`);
        newImages.push(srcUrl); // Mantener la original si falla una
      }
    }

    // Actualizar base de datos de Supabase inmediatamente
    await rest(`listings?id=eq.${encodeURIComponent(listing.id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ images: newImages })
    });

    console.log(`  ${label} ${listingConverted}/${images.length} fotos migardas (${mb(listingBytes)})`);
    manifest.listings.push({ id: listing.id, title: listing.title, antes: images, despues: newImages });

    // Pequeña pausa de cortesía
    await sleep(200);
  }

  // Procesar Hero Images
  console.log('\n🖼️  Procesando imágenes del Banner Hero...');
  try {
    const rows = await rest('site_settings?select=value&key=eq.hero_images');
    const hero = rows?.[0]?.value;
    if (Array.isArray(hero) && hero.length > 0) {
      const newHero = [];
      for (let i = 0; i < hero.length; i++) {
        try {
          const res = await processAndMigrateImage(hero[i], 'hero', `hero_${i + 1}_${Date.now()}`);
          newHero.push(res.cloudinaryUrl || res.url);
          if (!res.skipped) { totalConverted++; totalBytes += res.size; }
        } catch {
          newHero.push(hero[i]);
        }
      }
      await rest('site_settings?key=eq.hero_images', {
        method: 'PATCH',
        headers: { Prefer: 'return=minimal' },
        body: JSON.stringify({ value: newHero })
      });
      manifest.hero = { antes: hero, despues: newHero };
      console.log(`  Hero: ${newHero.length} imágenes actualizadas.`);
    }
  } catch (err) {
    console.warn('  Hero error:', err.message);
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

  console.log('\n=========================================');
  console.log('🎉 ¡MIGRACIÓN COMPLETADA CON ÉXITO!');
  console.log(`  Fotos convertidas a Cloudinary : ${totalConverted}`);
  console.log(`  Peso total transferido         : ${mb(totalBytes)}`);
  console.log(`  Manifiesto guardado en         : ${MANIFEST}`);
  console.log('=========================================\n');
}

main().catch((err) => {
  console.error('\n❌ Error fatal durante la migración:', err);
  process.exit(1);
});
