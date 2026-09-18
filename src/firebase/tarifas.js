import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './config';

const COLECCION = 'tarifas';

// Valores base de partida (mismos números del modelo académico original).
// Se usan solo para "sembrar" la base de datos la primera vez; después de
// eso, la app siempre lee estos valores desde Firestore, así que se pueden
// editar directamente en la consola de Firebase sin tocar el código.
const TARIFAS_SEMILLA = {
  maritima: { costoBase: 600, costoPorKg: 1.5, tiempoDias: 25, co2PorKg: 0.15 },
  aerea: { costoBase: 700, costoPorKg: 8, tiempoDias: 3, co2PorKg: 2.5 },
  terrestre: { costoBase: 500, costoPorKg: 3, tiempoDias: 10, co2PorKg: 0.8 },
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
