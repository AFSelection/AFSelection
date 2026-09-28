/**
 * Encuadre de imágenes elegido desde el CRM.
 *
 * El CRM guarda qué parte de cada foto se tiene que ver pegándolo a la URL
 * como fragmento: `https://.../foto.webp#encuadre=50,30,1.2` (x %, y %, zoom).
 *
 * Va en el fragmento a propósito: el navegador nunca lo manda al servidor, así
 * que la foto se descarga igual, y como viaja dentro del mismo string no hizo
 * falta tocar la base de datos. Al reordenar o borrar fotos el encuadre se
 * mueve con su foto sin que nadie tenga que acordarse.
 *
 * Debe coincidir con af-selection-crm/src/utils/imageFraming.js.
 */

const KEY = 'encuadre';
const FRAGMENT_RE = new RegExp(`#${KEY}=([^#]*)$`);

export const DEFAULT_FRAMING = { x: 50, y: 50, zoom: 1 };

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Separa la URL real del encuadre. Nunca falla: sin encuadre devuelve el centro. */
export function parseFraming(url) {
  if (!url || typeof url !== 'string') return { src: url, framing: null };
  const match = url.match(FRAGMENT_RE);
  if (!match) return { src: url, framing: null };

  const [x, y, zoom] = match[1].split(',').map(Number);
  const framing = {
    x: Number.isFinite(x) ? clamp(x, 0, 100) : 50,
    y: Number.isFinite(y) ? clamp(y, 0, 100) : 50,
    zoom: Number.isFinite(zoom) ? clamp(zoom, 1, 4) : 1
  };
  return { src: url.slice(0, match.index), framing };
}

/** La URL sin el encuadre, para pedirla al CDN o compartirla. */
export function stripFraming(url) {
  return parseFraming(url).src;
}

/**
 * Estilos para un `<img>` con `object-fit: cover`.
 *
 * El zoom usa la propiedad `scale` y no `transform` para que se sume a los
 * efectos que ya tienen las fotos (el paneo del hero, el agrandado al pasar el
 * mouse) en vez de pisarlos.
 *
 * `allowZoom: false` es para imágenes sin un contenedor con overflow hidden,
 * donde agrandar la foto la haría salirse de su lugar.
 *
 * Devuelve undefined si la foto no tiene encuadre, así se respeta el
 * `object-position` que ya define el CSS de cada componente.
 */
export function framingStyle(url, { allowZoom = true } = {}) {
  const { framing } = parseFraming(url);
  if (!framing) return undefined;

  const position = `${framing.x}% ${framing.y}%`;
  const style = { objectPosition: position };
  if (allowZoom && framing.zoom > 1) {
    style.scale = String(framing.zoom);
    style.transformOrigin = position;
  }
  return style;
}
