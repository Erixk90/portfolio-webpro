/**
 * whatsapp.js — arma links wa.me válidos.
 *
 * El número debe ser E.164 sin "+" ni espacios (8 a 15 dígitos).
 * Si es inválido, devuelve "#" en lugar de romper el render.
 */
export function buildWaMe(number, text = '') {
  const clean = String(number || '').replace(/[^0-9]/g, '');
  if (!/^\d{8,15}$/.test(clean)) return '#';
  return `https://wa.me/${clean}?text=${encodeURIComponent(text || '')}`;
}

export const isValidWhatsapp = (number) =>
  /^\d{8,15}$/.test(String(number || '').replace(/[^0-9]/g, ''));
