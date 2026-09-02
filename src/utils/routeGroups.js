// Agrupación simplificada de países por "bloque continental conectado por tierra".
// Es una aproximación académica: se usa solo para decidir si, en teoría,
// existe una posible ruta terrestre entre origen y destino (mismo bloque)
// o si el envío obligatoriamente debe cruzar un océano (bloques distintos).
const COUNTRY_GROUPS = {
  sudamerica: [
    'colombia', 'argentina', 'brasil', 'brazil', 'chile', 'peru', 'ecuador',
    'venezuela', 'bolivia', 'paraguay', 'uruguay', 'guyana', 'surinam',
  ],
  norteamerica: [
    'mexico', 'estados unidos', 'usa', 'eeuu', 'canada', 'guatemala',
    'honduras', 'el salvador', 'nicaragua', 'costa rica', 'panama', 'belice',
  ],
  europa: [
    'espana', 'francia', 'alemania', 'italia', 'portugal', 'holanda',
    'paises bajos', 'belgica', 'suiza', 'reino unido', 'polonia', 'austria',
    'suecia', 'noruega', 'dinamarca', 'irlanda', 'grecia',
  ],
  asia: [
    'china', 'japon', 'india', 'corea del sur', 'corea', 'tailandia',
    'vietnam', 'indonesia', 'singapur', 'malasia', 'emiratos arabes unidos',
    'arabia saudita', 'turquia', 'filipinas',
  ],
  africa: [
    'sudafrica', 'egipto', 'nigeria', 'marruecos', 'kenia', 'ghana', 'tunez',
  ],
  oceania: ['australia', 'nueva zelanda'],
};

function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Devuelve el bloque continental detectado dentro de un texto tipo "Bogotá, Colombia".
export function detectarGrupo(textoUbicacion) {
  const normalizado = normalizar(textoUbicacion);
  if (!normalizado) return null;

  const paises = Object.entries(COUNTRY_GROUPS).flatMap(([grupo, lista]) =>
    lista.map((pais) => ({ pais, grupo }))
  );
  // Se ordena por longitud descendente para priorizar coincidencias
  // de nombres compuestos ("estados unidos" antes que "unidos").
  paises.sort((a, b) => b.pais.length - a.pais.length);

  const encontrado = paises.find(({ pais }) => normalizado.includes(pais));
  return encontrado ? encontrado.grupo : null;
}

// Determina si, para efectos del MVP, existe conexión terrestre entre origen y destino.
export function hayConexionTerrestre(origen, destino) {
  const grupoOrigen = detectarGrupo(origen);
  const grupoDestino = detectarGrupo(destino);

  // Si no se reconoce el país en el texto, se asume disponible por defecto
  // (no hay suficiente información para descartarlo).
  if (!grupoOrigen || !grupoDestino) return true;

  return grupoOrigen === grupoDestino;
}
