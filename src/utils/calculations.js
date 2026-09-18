import { hayConexionTerrestreEntrePaises } from './routeGroups';

// ---------------------------------------------------------------------------
// Las tarifas (costo base, costo por kg, tiempo, CO2 por kg) ya NO están
// fijas en el código: se leen en tiempo real desde Firestore
// (ver src/firebase/tarifas.js) y se reciben aquí como parámetro `tarifas`.
// Todos los resultados se calculan en tiempo de ejecución a partir del peso
// y de esas tarifas.
// ---------------------------------------------------------------------------

function calcularModalidad(pesoKg, tarifa) {
  return {
    costoUsd: tarifa.costoBase + pesoKg * tarifa.costoPorKg,
    tiempoDias: tarifa.tiempoDias,
    co2Kg: pesoKg * tarifa.co2PorKg,
  };
}

export const MODALIDADES = [
  { key: 'maritima', label: 'Marítima', icono: '🚢' },
  { key: 'aerea', label: 'Aérea', icono: '✈️' },
  { key: 'terrestre', label: 'Terrestre', icono: '🚛' },
];

// Construye las 3 alternativas de transporte para un envío dado, marcando
// como no disponible la opción terrestre cuando no existe conexión terrestre
// entre el origen y el destino ingresados. `tarifas` viene de Firestore
// (obtenerTarifas()), con la forma { maritima, aerea, terrestre } donde cada
// una trae { costoBase, costoPorKg, tiempoDias, co2PorKg }.
export function calcularAlternativas(envio, tarifas) {
  const peso = Number(envio.peso);

  const base = {
    maritima: calcularModalidad(peso, tarifas.maritima),
    aerea: calcularModalidad(peso, tarifas.aerea),
    terrestre: calcularModalidad(peso, tarifas.terrestre),
  };

  const terrestreDisponible = hayConexionTerrestreEntrePaises(envio.origenPais, envio.destinoPais);

  // Si el usuario eligió una modalidad específica (no "Comparar todas"),
  // solo se calcula y muestra esa modalidad.
  const modalidadesAMostrar =
    envio.modalidad && envio.modalidad !== 'todas'
      ? MODALIDADES.filter((m) => m.key === envio.modalidad)
      : MODALIDADES;

  return modalidadesAMostrar.map(({ key, label, icono }) => {
    const disponible = key !== 'terrestre' || terrestreDisponible;

    if (!disponible) {
      return {
        key,
        label,
        icono,
        disponible: false,
      };
    }

    const { costoUsd, tiempoDias, co2Kg } = base[key];

    return {
      key,
      label,
      icono,
      disponible: true,
      costoUsd,
      tiempoDias,
      co2Kg,
      costoPorKg: peso > 0 ? costoUsd / peso : 0,
      co2PorKg: peso > 0 ? co2Kg / peso : 0,
    };
  });
}

// Pesos del TradeRoute Score.
const PESO_COSTO = 0.4;
const PESO_TIEMPO = 0.35;
const PESO_CO2 = 0.25;

// Normaliza un valor donde "menor es mejor" a una escala de 0 a 100
// dentro del rango [min, max] observado entre las alternativas disponibles.
function normalizarInverso(valor, min, max) {
  if (max === min) return 100;
  return (100 * (max - valor)) / (max - min);
}

// Calcula el TradeRoute Score (0-100) de cada alternativa disponible,
// comparándolas entre sí por costo, tiempo y emisiones de CO2.
// El score cambia automáticamente si cambian los datos del envío, porque
// siempre se recalcula a partir de las alternativas recién generadas.
export function calcularScores(alternativas) {
  const disponibles = alternativas.filter((a) => a.disponible);

  if (disponibles.length === 0) {
    return alternativas.map((a) => ({ ...a, score: null }));
  }

  const costos = disponibles.map((a) => a.costoUsd);
  const tiempos = disponibles.map((a) => a.tiempoDias);
  const co2s = disponibles.map((a) => a.co2Kg);

  const rango = (valores) => ({ min: Math.min(...valores), max: Math.max(...valores) });
  const rangoCosto = rango(costos);
  const rangoTiempo = rango(tiempos);
  const rangoCo2 = rango(co2s);

  return alternativas.map((alternativa) => {
    if (!alternativa.disponible) {
      return { ...alternativa, score: null };
    }

    const scoreCosto = normalizarInverso(alternativa.costoUsd, rangoCosto.min, rangoCosto.max);
    const scoreTiempo = normalizarInverso(alternativa.tiempoDias, rangoTiempo.min, rangoTiempo.max);
    const scoreCo2 = normalizarInverso(alternativa.co2Kg, rangoCo2.min, rangoCo2.max);

    const scoreTotal =
      scoreCosto * PESO_COSTO + scoreTiempo * PESO_TIEMPO + scoreCo2 * PESO_CO2;

    return {
      ...alternativa,
      scoreCosto,
      scoreTiempo,
      scoreCo2,
      score: Math.round(scoreTotal),
    };
  });
}

// Pipeline completo: a partir de los datos del envío y las tarifas vigentes
// (Firestore), devuelve las alternativas con costo/tiempo/CO2/score ya calculados.
export function compararEnvio(envio, tarifas) {
  const alternativas = calcularAlternativas(envio, tarifas);
  return calcularScores(alternativas);
}

// Elige la alternativa disponible con mejor (mayor) TradeRoute Score.
export function obtenerRecomendacion(alternativasConScore) {
  const disponibles = alternativasConScore.filter((a) => a.disponible && a.score !== null);
  if (disponibles.length === 0) return null;

  return disponibles.reduce((mejor, actual) => (actual.score > mejor.score ? actual : mejor));
}

// Genera una explicación breve y dinámica de por qué se recomendó una
// alternativa, según en qué métricas se destacó frente a las demás disponibles.
export function generarExplicacion(recomendacion, alternativasConScore) {
  if (!recomendacion) return '';

  const disponibles = alternativasConScore.filter((a) => a.disponible);
  const esMejorEn = (campo, comparador) =>
    disponibles.every((a) => comparador(recomendacion[campo], a[campo]));

  const fortalezas = [];
  if (esMejorEn('costoUsd', (r, a) => r <= a)) fortalezas.push('el menor costo estimado');
  if (esMejorEn('tiempoDias', (r, a) => r <= a)) fortalezas.push('el menor tiempo de tránsito');
  if (esMejorEn('co2Kg', (r, a) => r <= a)) fortalezas.push('la menor huella de CO₂');

  const detalle =
    fortalezas.length > 0
      ? `Ofrece ${fortalezas.join(', ')} entre las alternativas disponibles.`
      : 'Presenta el mejor equilibrio general entre costo, tiempo de tránsito y emisiones de CO₂.';

  return (
    `${recomendacion.label} obtuvo el TradeRoute Score más alto (${recomendacion.score}/100), ` +
    `calculado con 40% costo, 35% tiempo y 25% CO₂. ${detalle}`
  );
}
