import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { guardarPerfil } from '../firebase/perfil';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext(null);

function claveError(codigo) {
  switch (codigo) {
    case 'auth/email-already-in-use':
      return 'auth.error.emailEnUso';
    case 'auth/invalid-email':
      return 'auth.error.correoInvalido';
    case 'auth/weak-password':
      return 'auth.error.contrasenaDebil';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'auth.error.credencialesIncorrectas';
    case 'auth/too-many-requests':
      return 'auth.error.demasiadosIntentos';
    case 'auth/missing-email':
      return 'auth.error.correoFaltante';
    default:
      return 'auth.error.generico';
  }
}

export function AuthProvider({ children }) {
  const { t } = useLanguage();
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      setCargandoSesion(false);
    });
    return unsubscribe;
  }, []);

  async function registrarse(nombre, correo, contrasena, datosPerfil = {}) {
    try {
      const credencial = await createUserWithEmailAndPassword(auth, correo, contrasena);
      if (nombre) {
        await updateProfile(credencial.user, { displayName: nombre });
      }
      await guardarPerfil(credencial.user.uid, {
        nombre,
        correo,
        tipoDocumento: datosPerfil.tipoDocumento || '',
        numeroDocumento: datosPerfil.numeroDocumento || '',
        telefono: datosPerfil.telefono || '',
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: t(claveError(error.code)) };
    }
  }

  async function iniciarSesion(correo, contrasena) {
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: t(claveError(error.code)) };
    }
  }

  async function restablecerContrasena(correo) {
    try {
      await sendPasswordResetEmail(auth, correo);
      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: t(claveError(error.code)) };
    }
  }

  async function cerrarSesion() {
    await signOut(auth);
  }

  const value = {
    usuario,
    cargandoSesion,
    registrarse,
    iniciarSesion,
    restablecerContrasena,
    cerrarSesion,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
