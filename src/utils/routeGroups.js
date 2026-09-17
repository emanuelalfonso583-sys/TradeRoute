import { COUNTRIES } from '../data/countries';

// Grafo real de fronteras terrestres: cada país apunta a los países con los
// que limita físicamente por tierra (dataset world-countries / restcountries).
const BORDERS_BY_CODE = COUNTRIES.reduce((acc, country) => {
  acc[country.code] = country.borders;
  return acc;
}, {});

// Determina si existe una posible ruta terrestre entre dos países,
// recorriendo el grafo real de fronteras (BFS). Un país isla sin fronteras
// (ej. Japón, Australia, Filipinas, Reino Unido respecto al continente)
// queda correctamente aislado, sin importar en qué "continente" esté.
export function hayConexionTerrestreEntrePaises(codigoOrigen, codigoDestino) {
  if (!codigoOrigen || !codigoDestino) return false;
  if (codigoOrigen === codigoDestino) return true;
  if (!BORDERS_BY_CODE[codigoOrigen] || !BORDERS_BY_CODE[codigoDestino]) return false;

  const visitados = new Set([codigoOrigen]);
  const pendientes = [codigoOrigen];

  while (pendientes.length > 0) {
    const actual = pendientes.shift();
    const vecinos = BORDERS_BY_CODE[actual] || [];

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
