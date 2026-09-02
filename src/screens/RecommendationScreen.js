import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useShipment } from '../context/ShipmentContext';
import { compararEnvio, obtenerRecomendacion, generarExplicacion } from '../utils/calculations';
import { colors, radius, shadow } from '../theme/colors';

function BarraContribucion({ label, porcentaje, valor }) {
  return (
    <View style={styles.barraContainer}>
      <View style={styles.barraHeader}>
        <Text style={styles.barraLabel}>{label}</Text>
        <Text style={styles.barraValor}>{Math.round(valor)}/100</Text>
      </View>
      <View style={styles.barraTrack}>
        <View style={[styles.barraFill, { width: `${Math.max(0, Math.min(100, valor))}%` }]} />
      </View>
      <Text style={styles.barraPeso}>Peso en el score: {porcentaje}</Text>
    </View>
  );
}

export default function RecommendationScreen({ navigation }) {
  const { envio, reiniciarEnvio } = useShipment();

  useEffect(() => {
    if (!envio.peso) {
      navigation.replace('NuevoEnvio');
    }
  }, [envio.peso, navigation]);

  const alternativas = useMemo(() => compararEnvio(envio), [envio]);
  const recomendacion = useMemo(() => obtenerRecomendacion(alternativas), [alternativas]);
  const explicacion = useMemo(
    () => generarExplicacion(recomendacion, alternativas),
    [recomendacion, alternativas]
  );

  if (!envio.peso || !recomendacion) {
    return null;
  }

  function handleNuevoEnvio() {
    reiniciarEnvio();
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Recomendación de Ruta</Text>
      <Text style={styles.ruta}>
        {envio.origen} → {envio.destino}
      </Text>

      <View style={styles.tarjetaPrincipal}>
        <Text style={styles.trofeo}>🏆</Text>
        <Text style={styles.rutaRecomendadaLabel}>Ruta recomendada</Text>
        <Text style={styles.rutaRecomendadaValor}>
          {recomendacion.icono} {recomendacion.label}
        </Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumero}>{recomendacion.score}</Text>
          <Text style={styles.scoreSobre}>/100</Text>
        </View>
        <Text style={styles.scoreCaption}>TradeRoute Score</Text>
      </View>

      <Text style={styles.explicacion}>{explicacion}</Text>

      <Text style={styles.seccionTitulo}>Composición del Score</Text>
      <View style={styles.desgloseCard}>
        <BarraContribucion label="Costo" porcentaje="40%" valor={recomendacion.scoreCosto} />
        <BarraContribucion label="Tiempo" porcentaje="35%" valor={recomendacion.scoreTiempo} />
        <BarraContribucion label="CO₂" porcentaje="25%" valor={recomendacion.scoreCo2} />
      </View>

      <Text style={styles.disclaimer}>
        Los valores son estimaciones académicas y no representan cotizaciones reales. La
        recomendación se recalcula automáticamente si cambian los datos del envío.
      </Text>

      <PrimaryButton title="Comparar de nuevo" onPress={() => navigation.navigate('Comparador')} />
      <View style={styles.espacioBoton} />
      <PrimaryButton title="Nuevo envío" onPress={handleNuevoEnvio} variant="outline" />
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
    fontSize: 15,
    fontWeight: '600',
    color: colors.action,
    marginBottom: 18,
  },
  tarjetaPrincipal: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius.xl,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 18,
    ...shadow.card,
  },
  trofeo: {
    fontSize: 44,
    marginBottom: 6,
  },
  rutaRecomendadaLabel: {
    color: '#C7D2E8',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  rutaRecomendadaValor: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 18,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  scoreNumero: {
    color: colors.success,
    fontSize: 48,
    fontWeight: '800',
  },
  scoreSobre: {
    color: '#C7D2E8',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  scoreCaption: {
    color: '#C7D2E8',
    fontSize: 12,
    marginTop: 2,
  },
  explicacion: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 22,
  },
  seccionTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 10,
  },
  desgloseCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 20,
  },
  barraContainer: {
    marginBottom: 14,
  },
  barraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barraLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  barraValor: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.success,
  },
  barraTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraFill: {
    height: 8,
    backgroundColor: colors.success,
    borderRadius: 4,
  },
  barraPeso: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
  },
  disclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginBottom: 18,
    textAlign: 'center',
  },
  espacioBoton: {
    height: 12,
  },
});
