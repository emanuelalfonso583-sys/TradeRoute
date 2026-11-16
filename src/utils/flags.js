import { ALPHA3_TO_ALPHA2 } from '../data/alpha2';

const BASE_CODEPOINT = 0x1f1e6;
const A_CHARCODE = 'A'.charCodeAt(0);

function emojiDesdeAlpha2(alpha2) {
  if (!alpha2 || alpha2.length !== 2) return '';
  const chars = alpha2.toUpperCase().split('');
  return chars
    .map((c) => String.fromCodePoint(BASE_CODEPOINT + (c.charCodeAt(0) - A_CHARCODE)))
    .join('');
}

export function banderaDesdePais(codigoAlpha3) {
  const alpha2 = ALPHA3_TO_ALPHA2[codigoAlpha3];
  if (!alpha2) return '';
  return emojiDesdeAlpha2(alpha2);
}
