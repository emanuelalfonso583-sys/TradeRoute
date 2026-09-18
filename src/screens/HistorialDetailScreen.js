import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TransportCard from '../components/TransportCard';
import RouteMap from '../components/RouteMap';
import { useShipment } from '../context/ShipmentContext';
import { colors } from '../theme/colors';

function formatearFecha(timestamp) {
  if (!timestamp?.toDate) return '';
  const fecha = timestamp.toDate();
  return (
    fecha.toLocaleDateString('es', { day: '2-digit', month: 'long', year: 'numeric' }) +
    ' · ' +
    fecha.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  );
}

export default function HistorialDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { envio, alternativas = [], recomendacion, creadoEn } = item;
  const { guardarEnvio } = useShipment();

  const disponibles = alternativas.filter((a) => a.disponible).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  function handleVerAnalisis() {
    guardarEnvio(envio);
    navigation.navigate('MainTabs', { screen: 'Analisis' });
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.fecha}>{formatearFecha(creadoEn)}</Text>
      <Text style={styles.ruta}>
        {envio.origenCiudad}, {envio.origenPaisNombre} → {envio.destinoCiudad}, {envio.destinoPaisNombre}
      </Text>
      <Text style={styles.detalle}>
        {envio.peso} kg · {envio.volumen} m³ · {envio.unidades} unidades
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
        <Text style={styles.sinDatos}>No había alternativas disponibles para esta ruta.</Text>
      ) : (
        disponibles.map((alt) => (
          <TransportCard key={alt.key} alternativa={alt} destacada={recomendacion?.key === alt.key} />
        ))
      )}

      <PrimaryButton title="Ver análisis de este envío" onPress={handleVerAnalisis} />
      <View style={styles.espacioBoton} />
      <PrimaryButton title="Repetir este envío" onPress={() => { guardarEnvio(envio); navigation.navigate('Comparador'); }} variant="outline" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
