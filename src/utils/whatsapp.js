/**
 * Centralized WhatsApp utility for AF Select.
 * Number is retrieved from environment variable VITE_WHATSAPP_NUMBER with default fallback.
 */

export function getWhatsAppNumber() {
  const envNumber = import.meta.env?.VITE_WHATSAPP_NUMBER;
  if (envNumber && typeof envNumber === 'string') {
    // Strip non-digit characters in case user enters formatting like +54 9 3813 59-0196
    const cleaned = envNumber.replace(/\D/g, '');
    if (cleaned) return cleaned;
  }
  // Default fallback: +54 9 3813 59-0196 -> 5493813590196
  return '5493813590196';
}

export function getWhatsAppUrl(text = '') {
  const number = getWhatsAppNumber();
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
