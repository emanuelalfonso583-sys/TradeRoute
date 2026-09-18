import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETAS_ACENTO, ACENTO_POR_DEFECTO, obtenerColorAcento } from '../theme/paletas';
import { FUENTES, FUENTE_POR_DEFECTO, obtenerFontFamily } from '../theme/fuentes';

const CLAVE_STORAGE_ACENTO = '@traderoute_acento';
const CLAVE_STORAGE_FUENTE = '@traderoute_fuente';

const ThemeContext = createContext(null);

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

  const value = useMemo(
    () => ({
      claveAcento,
      acento: obtenerColorAcento(claveAcento),
      setClaveAcento,
      claveFuente,
      fontFamily: obtenerFontFamily(claveFuente),
      setClaveFuente,
    }),
    [claveAcento, claveFuente]
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
