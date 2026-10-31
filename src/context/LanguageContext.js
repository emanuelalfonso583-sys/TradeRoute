import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { es } from '../i18n/es';
import { en } from '../i18n/en';
import { pt } from '../i18n/pt';

const DICCIONARIOS = { es, en, pt };
const IDIOMAS_VALIDOS = new Set(['es', 'en', 'pt']);
const CLAVE_STORAGE = '@traderoute_idioma';

const LanguageContext = createContext(null);

function interpolar(texto, variables) {
  if (!variables) return texto;
  return Object.keys(variables).reduce(
    (acc, clave) => acc.replace(new RegExp(`{{${clave}}}`, 'g'), variables[clave]),
    texto
  );
}

export function LanguageProvider({ children }) {
  const [idioma, setIdiomaState] = useState('es');

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_STORAGE).then((valor) => {
      if (IDIOMAS_VALIDOS.has(valor)) setIdiomaState(valor);
    });
  }, []);

  function setIdioma(nuevoIdioma) {
    setIdiomaState(nuevoIdioma);
    AsyncStorage.setItem(CLAVE_STORAGE, nuevoIdioma).catch(() => {});
  }

  const t = useMemo(() => {
    const diccionario = DICCIONARIOS[idioma] || es;
    return (clave, variables) => interpolar(diccionario[clave] ?? clave, variables);
  }, [idioma]);

  const value = useMemo(() => ({ idioma, setIdioma, t }), [idioma, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de un LanguageProvider');
  }
  return context;
}
