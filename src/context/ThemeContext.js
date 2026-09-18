import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors as coloresBase } from '../theme/colors';
import { PALETAS_ACENTO, ACENTO_POR_DEFECTO, obtenerPaleta } from '../theme/paletas';
import { FUENTES, FUENTE_POR_DEFECTO, obtenerFontFamily } from '../theme/fuentes';

const CLAVE_STORAGE_ACENTO = '@traderoute_acento';
const CLAVE_STORAGE_FUENTE = '@traderoute_fuente';

const ThemeContext = createContext(null);

// A partir de los colores base de la app, reemplaza únicamente los tonos de
// marca (el azul oscuro de encabezados/tarjetas y el azul de botones/enlaces)
// por el acento que haya elegido el usuario. Los colores de estado (verde de
// éxito, rojo de error, etc.) se dejan igual: no cambian de significado
// aunque el usuario elija otro color de acento.
function construirColoresTema(claveAcento) {
  const paleta = obtenerPaleta(claveAcento);
  return {
    ...coloresBase,
    primaryDark: paleta.colorOscuro,
    primary: paleta.colorOscuro,
    action: paleta.color,
  };
}

export function ThemeProvider({ children }) {
  const [claveAcento, setClaveAcentoState] = useState(ACENTO_POR_DEFECTO);
  const [claveFuente, setClaveFuenteState] = useState(FUENTE_POR_DEFECTO);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_STORAGE_ACENTO).then((valor) => {
      if (valor && PALETAS_ACENTO.some((p) => p.key === valor)) setClaveAcentoState(valor);
    });
    AsyncStorage.getItem(CLAVE_STORAGE_FUENTE).then((valor) => {
      if (valor && FUENTES.some((f) => f.key === valor)) setClaveFuenteState(valor);
    });
  }, []);

  function setClaveAcento(clave) {
    setClaveAcentoState(clave);
    AsyncStorage.setItem(CLAVE_STORAGE_ACENTO, clave).catch(() => {});
  }

  function setClaveFuente(clave) {
    setClaveFuenteState(clave);
    AsyncStorage.setItem(CLAVE_STORAGE_FUENTE, clave).catch(() => {});
  }

  const colors = useMemo(() => construirColoresTema(claveAcento), [claveAcento]);

  const value = useMemo(
    () => ({
      claveAcento,
      acento: colors.action,
      colors,
      setClaveAcento,
      claveFuente,
      fontFamily: obtenerFontFamily(claveFuente),
      setClaveFuente,
    }),
    [claveAcento, colors, claveFuente]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme debe usarse dentro de un ThemeProvider');
  }
  return context;
}
