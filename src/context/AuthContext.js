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

const AuthContext = createContext(null);

function mensajeError(codigo) {
  switch (codigo) {
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta registrada con ese correo.';
    case 'auth/invalid-email':
      return 'El correo ingresado no es válido.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.';
    case 'auth/missing-email':
      return 'Ingresa tu correo electrónico.';
    default:
      return 'Ocurrió un error. Inténtalo de nuevo.';
  }
}

export function AuthProvider({ children }) {
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
      return { ok: false, mensaje: mensajeError(error.code) };
    }
  }

  async function iniciarSesion(correo, contrasena) {
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: mensajeError(error.code) };
    }
  }

  async function restablecerContrasena(correo) {
    try {
      await sendPasswordResetEmail(auth, correo);
      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: mensajeError(error.code) };
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
