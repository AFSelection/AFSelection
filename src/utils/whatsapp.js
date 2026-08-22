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
