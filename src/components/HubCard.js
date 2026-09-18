import React, { useState } from 'react';
import { View, Text, Pressable, Image, ActivityIndicator, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { obtenerInfoWiki } from '../utils/wikiInfo';
import { COUNTRIES } from '../data/countries';
import { colors, radius } from '../theme/colors';

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
    const nombrePais = NOMBRE_PAIS_POR_CODIGO[hub.countryCode];
    return [
      { idioma: 'es', texto: `Puerto de ${hub.name}${nombrePais ? `, ${nombrePais}` : ''}` },
      { idioma: 'en', texto: `Port of ${hub.name}` },
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

// Tarjeta de un puerto o aeropuerto. Solo la opción recomendada se puede
// abrir para ver una foto real (Wikipedia) y una descripción más amplia del
// lugar; las demás alternativas se muestran como referencia simple.
export default function HubCard({ hub }) {
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [info, setInfo] = useState(null);
  const [buscado, setBuscado] = useState(false);

  async function alPresionar() {
    if (!hub.recomendado) return;
    const siguiente = !abierto;
    setAbierto(siguiente);
    if (siguiente && !buscado) {
      setBuscado(true);
      setCargando(true);
      const resultado = await obtenerInfoWiki(consultasWikipedia(hub));
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
        {hub.recomendado && (
          <View style={styles.hubBadgeRow}>
            <View style={styles.hubBadge}>
              <Text style={styles.hubBadgeText}>Recomendado</Text>
            </View>
            <Ionicons
              name={abierto ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.textMuted}
              style={styles.chevron}
            />
          </View>
        )}
      </View>
      <Text style={styles.hubDetalle}>
        Código {hub.code} · {hub.city && hub.city !== hub.name ? `${hub.city} · ` : ''}
        {hub.distanciaCiudadKm.toLocaleString('es')} km de la ciudad ingresada
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
                <Text style={styles.enlace}>Ver más en Wikipedia →</Text>
              </Pressable>
            </>
          ) : info?.extracto ? (
            <Text style={styles.extracto}>{info.extracto}</Text>
          ) : (
            <Text style={styles.sinFoto}>No se encontró una foto ni información adicional para este lugar.</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
