import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

function docPerfil(uid) {
  return doc(db, 'usuarios', uid);
}

// Guarda los datos de perfil del usuario (además de lo que ya maneja
// Firebase Authentication: correo y nombre) la primera vez que se registra.
export async function guardarPerfil(uid, datos) {
  await setDoc(docPerfil(uid), {
    ...datos,
    creadoEn: serverTimestamp(),
  });
}

export async function obtenerPerfil(uid) {
  const snap = await getDoc(docPerfil(uid));
  return snap.exists() ? snap.data() : null;
}
