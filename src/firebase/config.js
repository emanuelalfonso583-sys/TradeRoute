import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Config pública del cliente web de Firebase: estas llaves no son secretas,
// están pensadas para vivir en el código del cliente (la seguridad real la
// dan las reglas de Firestore/Authentication, no ocultar esta config).
const firebaseConfig = {
  apiKey: 'AIzaSyA0bdCEAS7a4PfZBxOLmv5iZPlTMyWs_UE',
  authDomain: 'traderoute-c2097.firebaseapp.com',
  projectId: 'traderoute-c2097',
  storageBucket: 'traderoute-c2097.firebasestorage.app',
  messagingSenderId: '371139710800',
  appId: '1:371139710800:web:40b7b6e43cf075ddf1a655',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// En web, initializeAuth con persistencia de AsyncStorage no aplica;
// getAuth basta y usa la persistencia por defecto del navegador.
// El try/catch evita el error "auth already initialized" que ocurre con
// Fast Refresh en desarrollo, cuando este módulo se vuelve a evaluar.
function crearAuth() {
  if (Platform.OS === 'web') return getAuth(app);
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    return getAuth(app);
  }
}

export const auth = crearAuth();

export const db = getFirestore(app);
export default app;
