// Colores de acento seleccionables por el usuario. Se aplican en vivo (sin
// reiniciar la app) a TODA la app: botones, encabezados, fondos oscuros,
// íconos, bordes resaltados y la barra de navegación. Cada opción trae su
// tono principal ("color") y un tono oscuro a juego ("colorOscuro") que
// reemplaza el azul oscuro de marca en encabezados y tarjetas destacadas.
export const PALETAS_ACENTO = [
  { key: 'azul', nombre: 'Azul', color: '#2563EB', colorOscuro: '#0A2A66' },
  { key: 'verde', nombre: 'Verde', color: '#16A34A', colorOscuro: '#14532D' },
  { key: 'morado', nombre: 'Morado', color: '#7C3AED', colorOscuro: '#3B0764' },
  { key: 'rojo', nombre: 'Rojo', color: '#DC2626', colorOscuro: '#7F1D1D' },
  { key: 'naranja', nombre: 'Naranja', color: '#EA580C', colorOscuro: '#7C2D12' },
  { key: 'turquesa', nombre: 'Turquesa', color: '#0D9488', colorOscuro: '#134E4A' },
];

export const ACENTO_POR_DEFECTO = 'azul';

export function obtenerPaleta(claveAcento) {
  return PALETAS_ACENTO.find((p) => p.key === claveAcento) || PALETAS_ACENTO[0];
}

export function obtenerColorAcento(claveAcento) {
  return obtenerPaleta(claveAcento).color;
}
