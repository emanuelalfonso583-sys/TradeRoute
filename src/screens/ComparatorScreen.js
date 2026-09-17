import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TransportCard from '../components/TransportCard';
import { useShipment } from '../context/ShipmentContext';
import { compararEnvio, obtenerRecomendacion } from '../utils/calculations';
import { colors } from '../theme/colors';

export default function ComparatorScreen({ navigation }) {
  const { envio } = useShipment();

  useEffect(() => {
    if (!envio.peso) {
      navigation.replace('NuevoEnvio');
    }
  }, [envio.peso, navigation]);

  const alternativas = useMemo(() => compararEnvio(envio), [envio]);
  const recomendacion = useMemo(() => obtenerRecomendacion(alternativas), [alternativas]);
  const comparandoTodas = !envio.modalidad || envio.modalidad === 'todas';

  if (!envio.peso) {
    return null;
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        {comparandoTodas ? 'Comparación de Rutas' : 'Detalle de la Ruta'}
      </Text>
      <Text style={styles.ruta}>
        {envio.origenCiudad}, {envio.origenPaisNombre} → {envio.destinoCiudad}, {envio.destinoPaisNombre}
      </Text>
      <Text style={styles.detalle}>
        {envio.peso} kg · {envio.volumen} m³ · {envio.unidades} unidades
      </Text>

      <View style={styles.spacer} />

      {alternativas.map((alt) => (
        <TransportCard
          key={alt.key}
          alternativa={alt}
          destacada={recomendacion?.key === alt.key}
        />
      ))}

      <Text style={styles.disclaimer}>
        Los valores son estimaciones académicas para demostrar el funcionamiento del MVP y NO
        representan cotizaciones reales.
      </Text>

      <PrimaryButton
        title="Ver recomendación"
        onPress={() => navigation.navigate('Recomendacion')}
        disabled={!recomendacion}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  ruta: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.action,
  },
  detalle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  spacer: {
    height: 16,
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 18,
    textAlign: 'center',
  },
});
