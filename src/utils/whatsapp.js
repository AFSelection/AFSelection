/**
 * Centralized WhatsApp utility for AF Select.
 * Numbers are retrieved from environment variables with default fallbacks:
 *  - VITE_WHATSAPP_NUMBER        -> general (propiedades, inversiones, resto)
 *  - VITE_WHATSAPP_NUMBER_AUTOS  -> solo publicaciones y secciones de autos
 */

// +54 9 3813 59-0196
const DEFAULT_NUMBER = '5493813590196';
// +54 9 3813 42-4771
const DEFAULT_AUTOS_NUMBER = '5493813424771';

function cleanNumber(value) {
  if (value && typeof value === 'string') {
    // Strip non-digit characters in case user enters formatting like +54 9 3813 59-0196
    const cleaned = value.replace(/\D/g, '');
    if (cleaned) return cleaned;
  }
  return null;
}

/** true si la publicación es un auto (sección "autos"). */
export function isAutoItem(item) {
  return item?.sectionId === 'autos';
}

/**
 * Devuelve el número de WhatsApp a usar.
 * @param {object|boolean} [context] publicación (item) o `true` si estamos en la sección autos.
 */
export function getWhatsAppNumber(context) {
  const isAutos = context === true || isAutoItem(context);
  if (isAutos) {
    return cleanNumber(import.meta.env?.VITE_WHATSAPP_NUMBER_AUTOS) || DEFAULT_AUTOS_NUMBER;
  }
  return cleanNumber(import.meta.env?.VITE_WHATSAPP_NUMBER) || DEFAULT_NUMBER;
}

/**
 * @param {string} [text] mensaje precargado
 * @param {object|boolean} [context] publicación (item) o `true` para la sección autos
 */
export function getWhatsAppUrl(text = '', context) {
  const number = getWhatsAppNumber(context);
  if (!text) {
    return `https://wa.me/${number}`;
  }
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function getItemWhatsAppMessage(item) {
  if (!item) return 'Hola Agustín! Quisiera consultar sobre una publicación.';

  const productUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/producto/${item.id}`
    : `https://afselect.com.ar/producto/${item.id}`;

  const currency = item.currency || 'USD';
  const priceFormatted = item.price ? `${currency} ${Number(item.price).toLocaleString('es-AR')}` : '';
  const priceText = priceFormatted ? ` (${priceFormatted})` : '';

  return `Hola Agustín! Me interesa esta publicación:\n\n*${item.title}*${priceText}\nLink: ${productUrl}\n\n¿Me podrías brindar más información?`;
}
