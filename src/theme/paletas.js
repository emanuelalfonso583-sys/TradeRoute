// Colores de acento seleccionables por el usuario. Se aplican en vivo (sin
// reiniciar la app) a los botones principales y a la pestaña activa de la
// barra de navegación inferior.
export const PALETAS_ACENTO = [
  { key: 'azul', nombre: 'Azul', color: '#2563EB' },
  { key: 'verde', nombre: 'Verde', color: '#16A34A' },
  { key: 'morado', nombre: 'Morado', color: '#7C3AED' },
  { key: 'rojo', nombre: 'Rojo', color: '#DC2626' },
  { key: 'naranja', nombre: 'Naranja', color: '#EA580C' },
  { key: 'turquesa', nombre: 'Turquesa', color: '#0D9488' },
];

export const ACENTO_POR_DEFECTO = 'azul';

export function obtenerColorAcento(claveAcento) {
  return PALETAS_ACENTO.find((p) => p.key === claveAcento)?.color || PALETAS_ACENTO[0].color;
}
