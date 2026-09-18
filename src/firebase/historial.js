import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

function coleccionHistorial(uid) {
  return collection(db, 'usuarios', uid, 'historial');
}

// Guarda un envío calculado (datos del formulario + resultado de la
// comparación) en el historial del usuario autenticado.
export async function guardarEnvioEnHistorial(uid, envio, alternativas, recomendacion) {
  await addDoc(coleccionHistorial(uid), {
    envio,
    alternativas,
    recomendacion: recomendacion ? { key: recomendacion.key, label: recomendacion.label, score: recomendacion.score } : null,
    creadoEn: serverTimestamp(),
  });
}

// Trae el historial de envíos del usuario, más reciente primero.
export async function obtenerHistorial(uid) {
  const q = query(coleccionHistorial(uid), orderBy('creadoEn', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}
