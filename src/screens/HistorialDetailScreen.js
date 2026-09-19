import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Text from '../components/AppText';
import PrimaryButton from '../components/PrimaryButton';
import TransportCard from '../components/TransportCard';
import RouteMap from '../components/RouteMap';
import { useShipment } from '../context/ShipmentContext';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';

function formatearFecha(timestamp, idioma) {
  if (!timestamp?.toDate) return '';
  const fecha = timestamp.toDate();
  return (
    fecha.toLocaleDateString(idioma, { day: '2-digit', month: 'long', year: 'numeric' }) +
    ' · ' +
    fecha.toLocaleTimeString(idioma, { hour: '2-digit', minute: '2-digit' })
  );
}

export default function HistorialDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { envio, alternativas = [], recomendacion, creadoEn } = item;
  const { guardarEnvio } = useShipment();
  const { t, idioma } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [mostrarOtras, setMostrarOtras] = useState(false);

  const disponibles = alternativas.filter((a) => a.disponible).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  // Si el envío se guardó con una sola modalidad elegida (no "comparar
  // todas"), se destaca solo esa y el resto queda detrás de "ver segunda
  // opción", igual que en la pantalla de Recomendación.
  const comparandoTodas = !envio.modalidad || envio.modalidad === 'todas';
  const principal = !comparandoTodas ? disponibles.find((a) => a.key === envio.modalidad) : null;
  const tarjetasPrincipales = principal ? [principal] : disponibles;
  const otrasDisponibles = principal ? disponibles.filter((a) => a.key !== principal.key) : [];

  function handleVerAnalisis() {
    guardarEnvio(envio);
    navigation.navigate('MainTabs', { screen: 'Analisis' });
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.fecha}>{formatearFecha(creadoEn, idioma)}</Text>
      <Text style={styles.ruta}>
        {envio.origenCiudad}, {envio.origenPaisNombre} → {envio.destinoCiudad}, {envio.destinoPaisNombre}
      </Text>
      <Text style={styles.detalle}>
        {envio.peso} kg · {envio.volumen} m³ · {envio.unidades} {t('comparador.unidades')}
      </Text>

      {envio.origenLat && envio.destinoLat && (
        <>
          <View style={styles.spacer} />
          <RouteMap
            origen={{ lat: envio.origenLat, lng: envio.origenLng, label: envio.origenCiudad }}
            destino={{ lat: envio.destinoLat, lng: envio.destinoLng, label: envio.destinoCiudad }}
            alto={220}
          />
        </>
      )}

      <View style={styles.spacer} />

      {disponibles.length === 0 ? (
        <Text style={styles.sinDatos}>{t('historial.sinAlternativasDetalle')}</Text>
      ) : (
        tarjetasPrincipales.map((alt) => (
          <TransportCard
            key={alt.key}
            alternativa={alt}
            destacada={comparandoTodas && recomendacion?.key === alt.key}
          />
        ))
      )}

      {!comparandoTodas && otrasDisponibles.length > 0 && (
        <View style={styles.otrasContainer}>
          <PrimaryButton
            title={
              mostrarOtras
                ? t('recomendacion.ocultarOtras')
                : otrasDisponibles.length === 1
                ? t('recomendacion.verSegundaOpcion')
                : t('recomendacion.verOtras')
            }
            onPress={() => setMostrarOtras((v) => !v)}
            variant="outline"
          />
          {mostrarOtras && (
            <View style={styles.otrasLista}>
              {otrasDisponibles.map((alt) => (
                <TransportCard key={alt.key} alternativa={alt} />
              ))}
            </View>
          )}
        </View>
      )}

      <PrimaryButton title={t('historial.verAnalisis')} onPress={handleVerAnalisis} />
      <View style={styles.espacioBoton} />
      <PrimaryButton title={t('historial.repetir')} onPress={() => { guardarEnvio(envio); navigation.navigate('Comparador'); }} variant="outline" />
    </ScrollView>
  );
}

function crearEstilos(colors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: {
      padding: 20,
      paddingBottom: 40,
    },
    fecha: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 6,
    },
    ruta: {
      fontSize: 20,
      fontWeight: '800',
      color: colors.primaryDark,
      marginBottom: 4,
    },
    detalle: {
      fontSize: 13,
      color: colors.textMuted,
    },
    spacer: {
      height: 16,
    },
    espacioBoton: {
      height: 12,
    },
    sinDatos: {
      fontSize: 13,
      color: colors.textMuted,
      fontStyle: 'italic',
      marginBottom: 16,
    },
    otrasContainer: {
      marginBottom: 20,
    },
    otrasLista: {
      marginTop: 14,
    },
  });
}
