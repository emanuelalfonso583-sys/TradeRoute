import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import Text from '../components/AppText';
import { useShipment } from '../context/ShipmentContext';
import { useLanguage } from '../context/LanguageContext';
import { compararEnvio } from '../utils/calculations';
import { obtenerTarifas } from '../firebase/tarifas';
import { puertosCercanos, aeropuertosCercanos } from '../utils/nearestHubs';
import { calcularRutaMaritima } from '../utils/seaRoute';
import RouteMap from '../components/RouteMap';
import HubCard from '../components/HubCard';
import { useAppTheme } from '../context/ThemeContext';
import { radius, shadow } from '../theme/colors';

const CANTIDAD_HUBS = 3;

function SeccionHubs({ titulo, hubs }) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  return (
    <View style={styles.seccionHubs}>
      <Text style={styles.subtitulo}>{titulo}</Text>
      {hubs.length === 0 ? (
        <Text style={styles.sinDatos}>{t('analisis.sinHubs')}</Text>
      ) : (
        hubs.map((hub) => <HubCard key={hub.code} hub={hub} />)
      )}
    </View>
  );
}

function AnalisisMaritimo({ alternativa, envio }) {
  const { t, idioma } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const puertosOrigen = useMemo(
    () => puertosCercanos(envio.origenLat, envio.origenLng, CANTIDAD_HUBS),
    [envio.origenLat, envio.origenLng]
  );
  const puertosDestino = useMemo(
    () => puertosCercanos(envio.destinoLat, envio.destinoLng, CANTIDAD_HUBS),
    [envio.destinoLat, envio.destinoLng]
  );
  const origenRecomendado = puertosOrigen[0];
  const destinoRecomendado = puertosDestino[0];

  const rutaMaritima = useMemo(() => {
    if (!origenRecomendado || !destinoRecomendado) return null;
    return calcularRutaMaritima(origenRecomendado, destinoRecomendado);
  }, [origenRecomendado?.code, destinoRecomendado?.code]);

  return (
    <View>
      <SeccionHubs titulo={t('analisis.puertosOrigen')} hubs={puertosOrigen} />
      <SeccionHubs titulo={t('analisis.puertosDestino')} hubs={puertosDestino} />

      {origenRecomendado && destinoRecomendado && (
        <>
          <Text style={styles.subtitulo}>
            {t('analisis.rutaMaritima', { origen: origenRecomendado.name, destino: destinoRecomendado.name })}
          </Text>
          {rutaMaritima && (
            <Text style={styles.rutaDetalle}>
              {t('analisis.distanciaNavegable', { km: rutaMaritima.distanciaKm.toLocaleString(idioma) })}
            </Text>
          )}
          <RouteMap
            origen={{ lat: origenRecomendado.lat, lng: origenRecomendado.lng, label: origenRecomendado.name }}
            destino={{ lat: destinoRecomendado.lat, lng: destinoRecomendado.lng, label: destinoRecomendado.name }}
            rutaCoordenadas={rutaMaritima?.coordenadas}
            modoRuta={rutaMaritima ? 'coordenadas' : 'linea'}
            alto={260}
          />
        </>
      )}
    </View>
  );
}

function AnalisisAereo({ envio }) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const aeropuertosOrigen = useMemo(
    () => aeropuertosCercanos(envio.origenLat, envio.origenLng, CANTIDAD_HUBS),
    [envio.origenLat, envio.origenLng]
  );
  const aeropuertosDestino = useMemo(
    () => aeropuertosCercanos(envio.destinoLat, envio.destinoLng, CANTIDAD_HUBS),
    [envio.destinoLat, envio.destinoLng]
  );
  const origenRecomendado = aeropuertosOrigen[0];
  const destinoRecomendado = aeropuertosDestino[0];

  return (
    <View>
      <SeccionHubs titulo={t('analisis.aeropuertosOrigen')} hubs={aeropuertosOrigen} />
      <SeccionHubs titulo={t('analisis.aeropuertosDestino')} hubs={aeropuertosDestino} />

      {origenRecomendado && destinoRecomendado && (
        <>
          <Text style={styles.subtitulo}>
            {t('analisis.rutaAerea', { origen: origenRecomendado.name, destino: destinoRecomendado.name })}
          </Text>
          <RouteMap
            origen={{ lat: origenRecomendado.lat, lng: origenRecomendado.lng, label: origenRecomendado.name }}
            destino={{ lat: destinoRecomendado.lat, lng: destinoRecomendado.lng, label: destinoRecomendado.name }}
            alto={260}
          />
        </>
      )}
    </View>
  );
}

function AnalisisTerrestre({ envio }) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  return (
    <View>
      <Text style={styles.subtitulo}>
        {t('analisis.rutaCarretera', { origen: envio.origenCiudad, destino: envio.destinoCiudad })}
      </Text>
      <Text style={styles.rutaDetalle}>{t('analisis.rutaCarreteraDetalle')}</Text>
      <RouteMap
        origen={{ lat: envio.origenLat, lng: envio.origenLng, label: envio.origenCiudad }}
        destino={{ lat: envio.destinoLat, lng: envio.destinoLng, label: envio.destinoCiudad }}
        modoRuta="carretera"
        alto={260}
      />
    </View>
  );
}

function AnalisisModalidad({ alternativa, envio }) {
  if (alternativa.key === 'maritima') return <AnalisisMaritimo alternativa={alternativa} envio={envio} />;
  if (alternativa.key === 'aerea') return <AnalisisAereo envio={envio} />;
  return <AnalisisTerrestre envio={envio} />;
}

function EstadoVacio() {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  return (
    <View style={styles.vacioContainer}>
      <Text style={styles.vacioIcono}>📊</Text>
      <Text style={styles.vacioTitulo}>{t('analisis.vacioTitulo')}</Text>
      <Text style={styles.vacioTexto}>{t('analisis.vacioTexto')}</Text>
    </View>
  );
}

export default function AnalysisScreen() {
  const { envio } = useShipment();
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [tarifas, setTarifas] = useState(null);

  useEffect(() => {
    obtenerTarifas().then(setTarifas);
  }, []);

  const alternativas = useMemo(() => (tarifas ? compararEnvio(envio, tarifas, t) : []), [envio, tarifas, t]);
  // Si el usuario eligió una modalidad específica (no "comparar todas"), el
  // análisis debe mostrar esa, no la que el algoritmo hubiera recomendado.
  const comparandoTodas = !envio.modalidad || envio.modalidad === 'todas';
  const principales = useMemo(() => {
    if (!comparandoTodas) {
      const elegida = alternativas.find((a) => a.key === envio.modalidad && a.disponible);
      return elegida ? [elegida] : [];
    }
    return alternativas
      .filter((a) => a.disponible && a.score !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  }, [alternativas, comparandoTodas, envio.modalidad]);

  if (!envio.peso) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <EstadoVacio />
      </SafeAreaView>
    );
  }

  if (!tarifas) {
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color={colors.action} />
        <Text style={styles.cargandoTexto}>{t('analisis.cargando')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>{t('analisis.titulo')}</Text>
        <Text style={styles.ruta}>
          {envio.origenCiudad}, {envio.origenPaisNombre} → {envio.destinoCiudad}, {envio.destinoPaisNombre}
        </Text>

        {principales.length === 0 ? (
          <Text style={styles.sinDatos}>{t('analisis.sinDatos')}</Text>
        ) : (
          principales.map((alt, index) => (
            <View key={alt.key} style={styles.bloqueModalidad}>
              <View style={styles.encabezadoModalidad}>
                <Text style={styles.encabezadoIcono}>{alt.icono}</Text>
                <View style={styles.flex}>
                  <Text style={styles.encabezadoEtiqueta}>
                    {!comparandoTodas
                      ? t('recomendacion.modalidadSeleccionada')
                      : index === 0
                      ? `🏆 ${t('analisis.opcionRecomendada')}`
                      : t('analisis.segundaOpcion')}
                  </Text>
                  <Text style={styles.encabezadoModalidadTexto}>{alt.label}</Text>
                </View>
              </View>
              <AnalisisModalidad alternativa={alt} envio={envio} />
            </View>
          ))
        )}

        <Text style={styles.disclaimer}>{t('analisis.disclaimer')}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function crearEstilos(colors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    container: {
      padding: 20,
      paddingBottom: 40,
    },
    cargandoContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    cargandoTexto: {
      marginTop: 12,
      color: colors.textMuted,
      fontSize: 13,
    },
    titulo: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.primaryDark,
      marginBottom: 4,
    },
    ruta: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.action,
      marginBottom: 20,
    },
    bloqueModalidad: {
      marginBottom: 28,
    },
    encabezadoModalidad: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primaryDark,
      borderRadius: radius.lg,
      padding: 16,
      marginBottom: 14,
      ...shadow.card,
    },
    encabezadoIcono: {
      fontSize: 30,
      marginRight: 12,
    },
    encabezadoEtiqueta: {
      color: '#C7D2E8',
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    encabezadoModalidadTexto: {
      color: '#FFFFFF',
      fontSize: 19,
      fontWeight: '800',
      marginTop: 2,
    },
    subtitulo: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primaryDark,
      marginBottom: 8,
    },
    seccionHubs: {
      marginBottom: 16,
    },
    sinDatos: {
      fontSize: 13,
      color: colors.textMuted,
      fontStyle: 'italic',
    },
    rutaDetalle: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 10,
      lineHeight: 17,
    },
    disclaimer: {
      fontSize: 11,
      color: colors.textMuted,
      fontStyle: 'italic',
      textAlign: 'center',
      marginTop: 8,
    },
    vacioContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    vacioIcono: {
      fontSize: 48,
      marginBottom: 12,
    },
    vacioTitulo: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.primaryDark,
      marginBottom: 8,
      textAlign: 'center',
    },
    vacioTexto: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
}
