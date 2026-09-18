import React, { useMemo, useState } from 'react';
import { View, Pressable, Image, ActivityIndicator, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './AppText';
import { obtenerInfoWiki } from '../utils/wikiInfo';
import { COUNTRIES } from '../data/countries';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import { radius } from '../theme/colors';

const NOMBRE_PAIS_POR_CODIGO = COUNTRIES.reduce((acc, pais) => {
  acc[pais.code] = pais.name;
  return acc;
}, {});

// Arma varias búsquedas, de la más a la menos específica, para no
// confundir por ejemplo "Cartagena" (Colombia) con una ciudad homónima en
// otro país, ni traer la foto de un lugar distinto.
function consultasWikipedia(hub) {
  if (hub.countryCode) {
    // Puerto: los datos no traen nombre en inglés, se busca en español.
    // Si no hay artículo dedicado al puerto, el de la ciudad también sirve.
    const nombrePais = NOMBRE_PAIS_POR_CODIGO[hub.countryCode];
    return [
      { idioma: 'es', texto: `Puerto de ${hub.name}${nombrePais ? `, ${nombrePais}` : ''}` },
      { idioma: 'en', texto: `Port of ${hub.name}` },
      { idioma: 'es', texto: `${hub.name}${nombrePais ? `, ${nombrePais}` : ''}` },
    ];
  }
  if (hub.country) {
    // Aeropuerto: el nombre ya viene en inglés y suele ser el título exacto
    // del artículo, así que se prueba primero tal cual en Wikipedia inglés.
    return [
      { idioma: 'en', texto: hub.name },
      { idioma: 'es', texto: `${hub.name}, ${hub.country}` },
    ];
  }
  return [{ idioma: 'es', texto: hub.name }];
}

// El texto (extracto y enlace) que trae Wikipedia queda en el idioma de la
// consulta que encontró coincidencia, así que se reordena la lista para
// intentar primero el idioma activo de la app: así, si hay artículo en ese
// idioma, el resultado mostrado coincide con el resto de la interfaz.
function priorizarIdioma(consultas, idioma) {
  const preferidas = consultas.filter((c) => c.idioma === idioma);
  const resto = consultas.filter((c) => c.idioma !== idioma);
  return [...preferidas, ...resto];
}

// Tarjeta de un puerto o aeropuerto. Cualquiera se puede abrir para ver
// una foto real (Wikipedia) y una descripción más amplia del lugar.
export default function HubCard({ hub }) {
  const { t, idioma } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [info, setInfo] = useState(null);
  const [buscado, setBuscado] = useState(false);

  async function alPresionar() {
    const siguiente = !abierto;
    setAbierto(siguiente);
    if (siguiente && !buscado) {
      setBuscado(true);
      setCargando(true);
      const resultado = await obtenerInfoWiki(priorizarIdioma(consultasWikipedia(hub), idioma));
      setInfo(resultado);
      setCargando(false);
    }
  }

  return (
    <Pressable
      onPress={alPresionar}
      style={[styles.hubCard, hub.recomendado && styles.hubCardRecomendado]}
    >
      <View style={styles.hubHeader}>
        <Text style={styles.hubNombre}>{hub.name}</Text>
        <View style={styles.hubBadgeRow}>
          {hub.recomendado && (
            <View style={styles.hubBadge}>
              <Text style={styles.hubBadgeText}>{t('analisis.hub.recomendado')}</Text>
            </View>
          )}
          <Ionicons
            name={abierto ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textMuted}
            style={styles.chevron}
          />
        </View>
      </View>
      <Text style={styles.hubDetalle}>
        {t('analisis.hub.codigo', { codigo: hub.code })} · {hub.city && hub.city !== hub.name ? `${hub.city} · ` : ''}
        {t('analisis.hub.distancia', { km: hub.distanciaCiudadKm.toLocaleString(idioma) })}
      </Text>

      {abierto && (
        <View style={styles.expandido}>
          {cargando ? (
            <ActivityIndicator size="small" color={colors.action} style={styles.cargando} />
          ) : info?.imagenUrl ? (
            <>
              <Image source={{ uri: info.imagenUrl }} style={styles.foto} resizeMode="cover" />
              {info.extracto ? <Text style={styles.extracto}>{info.extracto}</Text> : null}
              <Pressable onPress={() => Linking.openURL(info.urlPagina)}>
                <Text style={styles.enlace}>{t('analisis.hub.verWikipedia')}</Text>
              </Pressable>
            </>
          ) : info?.extracto ? (
            <Text style={styles.extracto}>{info.extracto}</Text>
          ) : (
            <Text style={styles.sinFoto}>{t('analisis.hub.sinFoto')}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

function crearEstilos(colors) {
  return StyleSheet.create({
  hubCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
  },
  hubCardRecomendado: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  hubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hubNombre: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  hubBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hubBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
    marginLeft: 8,
  },
  hubBadgeText: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 11,
  },
  chevron: {
    marginLeft: 6,
  },
  hubDetalle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  expandido: {
    marginTop: 10,
  },
  cargando: {
    marginVertical: 12,
  },
  foto: {
    width: '100%',
    height: 160,
    borderRadius: radius.sm,
    marginBottom: 8,
    backgroundColor: colors.border,
  },
  extracto: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 17,
    marginBottom: 6,
  },
  enlace: {
    fontSize: 12,
    color: colors.action,
    fontWeight: '700',
  },
  sinFoto: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  });
}
