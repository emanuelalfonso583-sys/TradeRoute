import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Text, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETAS_ACENTO, ACENTO_POR_DEFECTO, obtenerColorAcento } from '../theme/paletas';
import { FUENTES, FUENTE_POR_DEFECTO, obtenerFontFamily } from '../theme/fuentes';

const CLAVE_STORAGE_ACENTO = '@traderoute_acento';
const CLAVE_STORAGE_FUENTE = '@traderoute_fuente';

const ThemeContext = createContext(null);

// Aplica la fuente elegida a todos los <Text> y <TextInput> de la app de
// una sola vez, sin tener que tocar cada pantalla: React arma cada elemento
// de texto combinando sus props con este "defaultProps", así que basta con
// mutarlo y volver a renderizar.
function aplicarFontFamilyGlobal(fontFamily) {
  const estilo = fontFamily ? { fontFamily } : {};
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [Text.defaultProps.style, estilo].filter(Boolean);
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.style = [TextInput.defaultProps.style, estilo].filter(Boolean);
}

export function ThemeProvider({ children }) {
  const [claveAcento, setClaveAcentoState] = useState(ACENTO_POR_DEFECTO);
  const [claveFuente, setClaveFuenteState] = useState(FUENTE_POR_DEFECTO);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_STORAGE_ACENTO).then((valor) => {
      if (valor && PALETAS_ACENTO.some((p) => p.key === valor)) setClaveAcentoState(valor);
    });
    AsyncStorage.getItem(CLAVE_STORAGE_FUENTE).then((valor) => {
      if (valor && FUENTES.some((f) => f.key === valor)) {
        setClaveFuenteState(valor);
        aplicarFontFamilyGlobal(obtenerFontFamily(valor));
      }
    });
  }, []);

  function setClaveAcento(clave) {
    setClaveAcentoState(clave);
    AsyncStorage.setItem(CLAVE_STORAGE_ACENTO, clave).catch(() => {});
  }

  function setClaveFuente(clave) {
    aplicarFontFamilyGlobal(obtenerFontFamily(clave));
    setClaveFuenteState(clave);
    AsyncStorage.setItem(CLAVE_STORAGE_FUENTE, clave).catch(() => {});
  }

  const value = useMemo(
    () => ({
      claveAcento,
      acento: obtenerColorAcento(claveAcento),
      setClaveAcento,
      claveFuente,
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
