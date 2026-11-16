import { COUNTRIES } from '../data/countries';

// Grafo real de fronteras terrestres: cada país apunta a los países con los
// que limita físicamente por tierra (dataset world-countries / restcountries).
const BORDERS_BY_CODE = COUNTRIES.reduce((acc, country) => {
  acc[country.code] = country.borders;
  return acc;
}, {});

// Pares de países que SÍ comparten frontera política (están en el dataset de
// fronteras) pero NO tienen ninguna carretera real que los conecte, porque
// la frontera es geográficamente intransitable para carga. El caso real más
// relevante para este MVP: el Tapón del Darién, el único tramo sin
// terminar de la Carretera Panamericana (selva densa y pantanos entre
// Colombia y Panamá) — por eso Suramérica no tiene conexión terrestre real
// con Centroamérica/Norteamérica, aunque Colombia y Panamá "limiten" en el
// dataset. Se excluye esta arista del grafo antes de buscar la ruta.
const PARES_SIN_CARRETERA_REAL = new Set(['COL-PAN', 'PAN-COL']);

function fronterasTransitables(codigo) {
  return (BORDERS_BY_CODE[codigo] || []).filter(
    (vecino) => !PARES_SIN_CARRETERA_REAL.has(`${codigo}-${vecino}`)
  );
}

// Determina si existe una posible ruta terrestre entre dos países,
// recorriendo el grafo real de fronteras TRANSITABLES (BFS). Un país isla
// sin fronteras (ej. Japón, Australia, Filipinas, Reino Unido respecto al
// continente) queda correctamente aislado, sin importar en qué "continente"
// esté; lo mismo pasa con Suramérica frente a Centro/Norteamérica por el
// Tapón del Darién (ver PARES_SIN_CARRETERA_REAL arriba).
function existeCaminoBFS(codigoOrigen, codigoDestino, obtenerVecinos) {
  if (codigoOrigen === codigoDestino) return true;

  const visitados = new Set([codigoOrigen]);
  const pendientes = [codigoOrigen];

  while (pendientes.length > 0) {
    const actual = pendientes.shift();
    const vecinos = obtenerVecinos(actual);

    for (const vecino of vecinos) {
      if (vecino === codigoDestino) return true;
      if (!visitados.has(vecino)) {
        visitados.add(vecino);
        pendientes.push(vecino);
      }
    }
  }

  return false;
}

export function hayConexionTerrestreEntrePaises(codigoOrigen, codigoDestino) {
  if (!codigoOrigen || !codigoDestino) return false;
  if (codigoOrigen === codigoDestino) return true;
  if (!BORDERS_BY_CODE[codigoOrigen] || !BORDERS_BY_CODE[codigoDestino]) return false;

  return existeCaminoBFS(codigoOrigen, codigoDestino, fronterasTransitables);
}

// Igual que hayConexionTerrestreEntrePaises, pero además indica POR QUÉ no
// hay ruta terrestre cuando no la hay, para poder explicárselo al usuario
// en vez de solo mostrar "no disponible":
// - 'ISLA_ORIGEN' / 'ISLA_DESTINO': el país no tiene ninguna frontera
//   terrestre (es una isla o no limita con nadie transitable).
// - 'DARIEN': el único camino posible pasa por el Tapón del Darién
//   (Colombia-Panamá), el tramo sin terminar de la Panamericana, así que
//   Suramérica queda sin conexión terrestre real con Centro/Norteamérica.
// - 'SIN_RUTA_CONTINENTAL': los países están en masas de tierra distintas
//   sin ningún camino de fronteras posible (ni siquiera cruzando el Darién).
export function evaluarConexionTerrestre(codigoOrigen, codigoDestino) {
  if (!codigoOrigen || !codigoDestino) return { disponible: false, motivo: null };
  if (codigoOrigen === codigoDestino) return { disponible: true, motivo: null };

  const bordersOrigen = BORDERS_BY_CODE[codigoOrigen] || [];
  const bordersDestino = BORDERS_BY_CODE[codigoDestino] || [];

  if (bordersOrigen.length === 0) return { disponible: false, motivo: 'ISLA_ORIGEN' };
  if (bordersDestino.length === 0) return { disponible: false, motivo: 'ISLA_DESTINO' };

  const disponible = existeCaminoBFS(codigoOrigen, codigoDestino, fronterasTransitables);
  if (disponible) return { disponible: true, motivo: null };

  const existeIgnorandoDarien = existeCaminoBFS(
    codigoOrigen,
    codigoDestino,
    (codigo) => BORDERS_BY_CODE[codigo] || []
  );

  return {
    disponible: false,
    motivo: existeIgnorandoDarien ? 'DARIEN' : 'SIN_RUTA_CONTINENTAL',
  };
}
