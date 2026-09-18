import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './config';

const COLECCION = 'tarifas';

// Tabla de tarifas semilla, estructurada por ZONA DE DISTANCIA (corto/largo
// recorrido) igual que las tarjetas de tarifas reales que usan navieras,
// aerolíneas y transportistas terrestres: costoBase (manejo/documentación),
// costoPorKg (sobre el peso facturable), tiempoDiasBase + tiempoDiasPorMilKm
// (el tránsito crece con la distancia real), y co2PorKgKm (factor de
// emisión real por modalidad, en kg de CO2 por kg de carga por km).
//
// Referencias de orden de magnitud usadas (no cotizaciones en vivo, sino
// bandas típicas reportadas por la industria de fletes):
// - Marítimo: ~$0.05-0.08 USD/kg facturable en tramos largos, tránsito
//   ~18-20 nudos promedio comercial, huella de CO2 muy baja (~10-15 g/ton-km).
// - Aéreo: ~$3.5-5.5 USD/kg facturable, tránsito de días, huella de CO2 alta
//   (~700-900 g/ton-km).
// - Terrestre: ~$0.12-0.15 USD/kg, tránsito por carretera, huella media
//   (~100-120 g/ton-km).
const TARIFAS_SEMILLA = {
  maritima: {
    corto: { costoBase: 250, costoPorKg: 0.08, tiempoDiasBase: 10, tiempoDiasPorMilKm: 1.5, co2PorKgKm: 0.000015 },
    largo: { costoBase: 400, costoPorKg: 0.05, tiempoDiasBase: 15, tiempoDiasPorMilKm: 1.2, co2PorKgKm: 0.000012 },
  },
  aerea: {
    corto: { costoBase: 100, costoPorKg: 3.5, tiempoDiasBase: 1, tiempoDiasPorMilKm: 0.3, co2PorKgKm: 0.0009 },
    largo: { costoBase: 200, costoPorKg: 5.5, tiempoDiasBase: 2, tiempoDiasPorMilKm: 0.2, co2PorKgKm: 0.0007 },
  },
  terrestre: {
    corto: { costoBase: 150, costoPorKg: 0.15, tiempoDiasBase: 2, tiempoDiasPorMilKm: 2.5, co2PorKgKm: 0.00012 },
    largo: { costoBase: 300, costoPorKg: 0.12, tiempoDiasBase: 4, tiempoDiasPorMilKm: 2.2, co2PorKgKm: 0.0001 },
  },
};

async function sembrarTarifas() {
  const escrituras = Object.entries(TARIFAS_SEMILLA).map(([modalidad, valores]) =>
    setDoc(doc(db, COLECCION, modalidad), valores)
  );
  await Promise.all(escrituras);
  return TARIFAS_SEMILLA;
}

// Trae las tarifas reales desde Firestore. Si la colección todavía no
// existe (primera vez que corre la app contra este proyecto), la crea
// con los valores semilla y los devuelve.
export async function obtenerTarifas() {
  const snapshot = await getDocs(collection(db, COLECCION));

  if (snapshot.empty) {
    return sembrarTarifas();
  }

  const tarifas = {};
  snapshot.forEach((docSnap) => {
    tarifas[docSnap.id] = docSnap.data();
  });

  // Por si la colección existe pero le falta alguna modalidad, se completa
  // con el valor semilla correspondiente para que la app no se rompa.
  return { ...TARIFAS_SEMILLA, ...tarifas };
}
