import { Platform } from 'react-native';

// Tipos de letra seleccionables. Se aplican a toda la app al instante
// (sin reiniciar) usando la familia tipográfica real de cada plataforma.
// El nombre visible de cada fuente se traduce en pantalla con la clave
// i18n 'fuente.<key>' (ver src/i18n/es.js y en.js), no aquí.
export const FUENTES = [
  { key: 'sistema', fontFamily: undefined },
  {
    key: 'serif',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' }),
  },
  {
    key: 'mono',
    fontFamily: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
  },
];

export const FUENTE_POR_DEFECTO = 'sistema';

export function obtenerFontFamily(claveFuente) {
  return FUENTES.find((f) => f.key === claveFuente)?.fontFamily;
}
