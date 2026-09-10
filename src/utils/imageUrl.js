/**
 * Pipeline único de imágenes.
 *
 * Contexto: las fotos guardadas en Supabase Storage se llaman `.webp` pero en
 * realidad son PNG de 2.7 a 8.4 MB (el `canvas.toBlob(..., 'image/webp')` del
 * CRM caía a PNG sin avisar). Servirlas crudas es lo que hacía que el sitio
 * cargara lento, en cortina o en negro.
 *
 * La solución es no servirlas nunca crudas: todo pasa por el endpoint de
 * transformaciones de Supabase, que devuelve WebP real de 30-80 KB y queda
 * cacheado en el CDN. Un PNG de 2.7 MB pedido a width=600 sale 77 KB.
 */

const SUPABASE_OBJECT_PATH = '/storage/v1/object/public/';
const SUPABASE_RENDER_PATH = '/storage/v1/render/image/public/';

/** Ancho real de los originales en Storage. Pedir más solo agranda sin ganar nada. */
const SOURCE_MAX_WIDTH = 1600;

/**
 * Escalera de anchos permitidos.
 *
 * Es deliberado que sea corta. Cada combinación distinta de ancho y calidad es
 * una imagen nueva que Supabase tiene que generar abriendo el original, y la
 * primera vez eso tarda ~2 segundos. Si el ancho saliera de multiplicar el
 * tamaño del contenedor por el devicePixelRatio de cada visitante, habría
 * decenas de variantes por foto y casi ninguna llegaría cacheada.
 *
 * Redondeando hacia arriba a estos seis valores, todos los visitantes comparten
 * las mismas URLs y el CDN responde en milisegundos a partir del segundo.
 */
const WIDTH_LADDER = [200, 400, 640, 960, 1280, 1600];

/** También fija: menos combinaciones, más aciertos de caché. */
const QUALITY_LADDER = [65, 72, 80];

function snapUp(value, ladder) {
  return ladder.find((step) => step >= value) ?? ladder[ladder.length - 1];
}

function isSupabaseStorageUrl(url) {
  return url.includes(SUPABASE_OBJECT_PATH) || url.includes(SUPABASE_RENDER_PATH);
}

/**
 * Devuelve la URL optimizada para el ancho en el que se va a mostrar la imagen.
 *
 * @param {string} url
 * @param {object} [opts]
 * @param {number} [opts.width]   Ancho de render en CSS px.
 * @param {number} [opts.height]  Solo si querés recorte de relación fija.
 * @param {number} [opts.quality] 20-100. 70 es indistinguible a simple vista.
 * @param {'cover'|'contain'|'fill'} [opts.resize]
 */
export function buildImageUrl(url, opts = {}) {
  if (!url || typeof url !== 'string') return url;
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  const { width = 800, height, quality = 72, resize } = opts;
  const w = snapUp(Math.min(Math.round(width), SOURCE_MAX_WIDTH), WIDTH_LADDER);
  const q = snapUp(quality, QUALITY_LADDER);

  if (isSupabaseStorageUrl(url)) {
    // Descartamos cualquier query previa para no acumular transformaciones.
    const base = url.split('?')[0].replace(SUPABASE_OBJECT_PATH, SUPABASE_RENDER_PATH);

    const params = new URLSearchParams();
    params.set('width', String(w));
    if (height) params.set('height', String(Math.round(height)));
    if (resize) params.set('resize', resize);
    params.set('quality', String(q));

    return `${base}?${params.toString()}`;
  }

  if (url.includes('images.unsplash.com')) {
    const base = url.split('?')[0];
    return `${base}?auto=format&fit=crop&w=${w}&q=${q}`;
  }

  return url;
}

/**
 * Resuelve la URL final teniendo en cuenta la densidad de pantalla.
 *
 * A propósito NO usamos `srcSet`: con srcSet el navegador elige la variante y
 * nosotros no sabemos cuál, así que precargaríamos una URL y el `<img>` pediría
 * otra — se perdería la garantía de que lo que pintamos ya está decodificado.
 * Resolviendo por DPR acá, la URL que precargamos es exactamente la que se pide.
 *
 * El DPR se topea en 2: a partir de ahí el peso extra no se percibe.
 */
export function resolveImageUrl(url, opts = {}) {
  const dpr = typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio || 1, 2)
    : 1;

  const { width = 800, height } = opts;

  return buildImageUrl(url, {
    ...opts,
    width: width * dpr,
    height: height ? height * dpr : undefined
  });
}

/* ------------------------------------------------------------------------- *
 * Precarga
 * ------------------------------------------------------------------------- */

/**
 * URLs ya pedidas en esta sesión. Evita relanzar descargas y, sobre todo, nos
 * deja saber de forma sincrónica si una imagen ya está lista — que es lo que
 * permite pintarla sin fundido ni skeleton.
 */
const inFlight = new Map();
const ready = new Set();

export function isImageReady(url) {
  return !!url && ready.has(url);
}

/**
 * Descarga *y decodifica* una imagen. El `decode()` es la parte importante:
 * sin él el navegador decodifica recién al pintar, que es lo que producía el
 * efecto cortina (la foto apareciendo por bandas).
 *
 * Nunca rechaza: una imagen rota no debe poder frenar la precarga entera.
 */
export function preloadImage(url) {
  if (!url || typeof url !== 'string') return Promise.resolve(false);
  if (ready.has(url)) return Promise.resolve(true);
  if (inFlight.has(url)) return inFlight.get(url);

  const task = new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';

    const done = (ok) => {
      if (ok) ready.add(url);
      inFlight.delete(url);
      resolve(ok);
    };

    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(() => done(true)).catch(() => done(true));
      } else {
        done(true);
      }
    };
    img.onerror = () => done(false);

    img.src = url;
  });

  inFlight.set(url, task);
  return task;
}

/**
 * Precarga con concurrencia acotada. Sin el tope, 500 imágenes en paralelo se
 * pelean por las conexiones y la primera tarda tanto como la última.
 */
export function preloadMany(urls, { concurrency = 6 } = {}) {
  const queue = [...new Set((urls || []).filter(Boolean))];
  if (queue.length === 0) return Promise.resolve();

  let cursor = 0;
  const worker = async () => {
    while (cursor < queue.length) {
      const url = queue[cursor++];
      await preloadImage(url);
    }
  };

  return Promise.all(
    Array.from({ length: Math.min(concurrency, queue.length) }, worker)
  );
}

/**
 * Igual que preloadMany pero con techo de tiempo.
 *
 * Existe porque el Loader del home espera a estas imágenes: si Supabase tarda
 * en generar una miniatura (la primera vez tiene que abrir el original y
 * redimensionarlo), o si una foto está rota, no se puede dejar al usuario
 * mirando la pantalla de carga indefinidamente. Vencido el plazo se muestra la
 * página igual y lo que falte sigue bajando por atrás.
 */
export function preloadManyWithDeadline(urls, { timeout = 3500, ...opts } = {}) {
  return Promise.race([
    preloadMany(urls, opts).then(() => 'complete'),
    new Promise((resolve) => setTimeout(() => resolve('timeout'), timeout))
  ]);
}

/**
 * Precarga en segundo plano, sin competir con lo que el usuario está mirando.
 * Devuelve una función para cancelar si el usuario navega a otro lado.
 */
export function preloadInBackground(urls, opts = {}) {
  let cancelled = false;

  const start = () => {
    if (cancelled) return;
    preloadMany(urls, { concurrency: 4, ...opts });
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const id = window.requestIdleCallback(start, { timeout: 1500 });
    return () => { cancelled = true; window.cancelIdleCallback?.(id); };
  }

  const id = setTimeout(start, 300);
  return () => { cancelled = true; clearTimeout(id); };
}
