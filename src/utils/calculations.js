import { hayConexionTerrestreEntrePaises } from './routeGroups';
import { distanciaKm as calcularDistanciaKm } from './geo';

// ---------------------------------------------------------------------------
// Modelo de flete realista: el costo, el tiempo de tránsito y el CO2 ya NO
// dependen solo del peso. Se calculan a partir de:
//   - la DISTANCIA REAL entre origen y destino (fórmula de Haversine sobre
//     las coordenadas reales de cada ciudad),
//   - el PESO FACTURABLE (peso volumétrico/revenue ton, como se cobra de
//     verdad en fletes marítimos y aéreos), y
//   - tarifas por ZONA de distancia (corto/largo recorrido), leídas en
//     tiempo real desde Firestore (ver src/firebase/tarifas.js).
// No es una cotización comercial en vivo (eso requiere pagar un servicio
// como Freightos), pero refleja las variables reales que determinan un
// flete, no solo el peso.
// ---------------------------------------------------------------------------

const DISTANCIA_LIMITE_ZONA_KM = 3000;
const DISTANCIA_RESPALDO_KM = 5000; // si por alguna razón faltan coordenadas

// Peso facturable: lo que realmente se cobra en el flete, no solo el peso
// real. Marítimo usa "revenue ton" (1 m³ ≈ 1000 kg); aéreo usa el estándar
// IATA de peso volumétrico (1 kg ≈ 6000 cm³); terrestre cobra por peso real.
function calcularPesoFacturable(modalidadKey, pesoKg, volumenM3) {
  const volumen = Number(volumenM3) || 0;
  if (modalidadKey === 'maritima') return Math.max(pesoKg, volumen * 1000);
  if (modalidadKey === 'aerea') return Math.max(pesoKg, (volumen * 1_000_000) / 6000);
  return pesoKg;
}

function calcularModalidad(modalidadKey, pesoKg, volumenM3, distanciaReal, tarifasModalidad) {
  const zona = distanciaReal >= DISTANCIA_LIMITE_ZONA_KM ? 'largo' : 'corto';
  const tarifa = tarifasModalidad[zona];

  const pesoFacturable = calcularPesoFacturable(modalidadKey, pesoKg, volumenM3);

  return {
    costoUsd: tarifa.costoBase + pesoFacturable * tarifa.costoPorKg,
    tiempoDias: Math.round(tarifa.tiempoDiasBase + (distanciaReal / 1000) * tarifa.tiempoDiasPorMilKm),
    co2Kg: pesoFacturable * distanciaReal * tarifa.co2PorKgKm,
    pesoFacturable,
    zona,
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
// una trae { corto: {...}, largo: {...} } según la zona de distancia.
//
// Siempre calcula las 3 modalidades (aunque el usuario haya elegido una
// específica en el formulario): así el Score de cada una refleja una
// comparación real contra las demás, y las pantallas pueden mostrar "ver
// otras alternativas" sin tener que recalcular nada.
export function calcularAlternativas(envio, tarifas) {
  const peso = Number(envio.peso);
  const volumen = Number(envio.volumen);

  const distancia =
    calcularDistanciaKm(envio.origenLat, envio.origenLng, envio.destinoLat, envio.destinoLng) ??
    DISTANCIA_RESPALDO_KM;

  const base = {
    maritima: calcularModalidad('maritima', peso, volumen, distancia, tarifas.maritima),
    aerea: calcularModalidad('aerea', peso, volumen, distancia, tarifas.aerea),
    terrestre: calcularModalidad('terrestre', peso, volumen, distancia, tarifas.terrestre),
  };

  const terrestreDisponible = hayConexionTerrestreEntrePaises(envio.origenPais, envio.destinoPais);

  return MODALIDADES.map(({ key, label, icono }) => {
    const disponible = key !== 'terrestre' || terrestreDisponible;

    if (!disponible) {
      return {
        key,
        label,
        icono,
        disponible: false,
      };
    }

    const { costoUsd, tiempoDias, co2Kg, pesoFacturable, zona } = base[key];

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
      distanciaKm: Math.round(distancia),
      pesoFacturableKg: Math.round(pesoFacturable * 10) / 10,
      zona,
    };
  });
}

// Pesos del TradeRoute Score. El costo pesa más que los demás factores
// porque, según indicó el profesor, es el criterio que más le importa a
// quien usa la app al decidir una ruta de envío.
const PESO_COSTO = 0.55;
const PESO_TIEMPO = 0.3;
const PESO_CO2 = 0.15;

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

// El TradeRoute Score solo tiene sentido cuando hay al menos 2 alternativas
// disponibles para comparar entre sí; con una sola, el score sale 100/100
// en todo por definición (no perdió contra nada), lo cual sería engañoso
// mostrar como si fuera un puntaje real.
export function hayComparacionReal(alternativasConScore) {
  return alternativasConScore.filter((a) => a.disponible).length > 1;
}

// Genera una explicación breve y dinámica de por qué se recomendó una
// alternativa, según en qué métricas se destacó frente a las demás disponibles.
export function generarExplicacion(recomendacion, alternativasConScore) {
  if (!recomendacion) return '';

  if (!hayComparacionReal(alternativasConScore)) {
    return `${recomendacion.label} es la única alternativa disponible para esta ruta con los datos ingresados, así que no hay otras opciones con las que compararla.`;
  }

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
    `${recomendacion.label} es la opción recomendada para esta ruta, considerando costo, ` +
    `tiempo de tránsito y emisiones de CO₂ (el costo es el factor que más pesa en la decisión, ` +
    `porque es lo que más le importa a quien envía). ${detalle}`
  );
}

// Explicación para cuando el usuario eligió una modalidad específica en el
// formulario (no "Comparar todas"): no dice que sea "la mejor", solo informa
// su Score real frente a las demás alternativas disponibles para esa ruta.
export function generarExplicacionSeleccion(seleccion, alternativasConScore) {
  if (!seleccion) return '';

  if (!hayComparacionReal(alternativasConScore)) {
    return `${seleccion.label} es la única alternativa disponible para esta ruta con los datos ingresados.`;
  }

  return `Elegiste ${seleccion.label} para este envío. Estos son sus datos frente a las demás alternativas disponibles para esta ruta.`;
}
