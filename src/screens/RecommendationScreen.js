import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useShipment } from '../context/ShipmentContext';
import { useAuth } from '../context/AuthContext';
import { compararEnvio, obtenerRecomendacion, generarExplicacion } from '../utils/calculations';
import { obtenerTarifas } from '../firebase/tarifas';
import { guardarEnvioEnHistorial } from '../firebase/historial';
import { formatearUsd } from '../utils/format';
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
  const { usuario } = useAuth();
  const [tarifas, setTarifas] = useState(null);
  const guardadoRef = useRef(null);

  useEffect(() => {
    if (!envio.peso) {
      navigation.replace('NuevoEnvio');
    }
  }, [envio.peso, navigation]);

  useEffect(() => {
    obtenerTarifas().then(setTarifas);
  }, []);

  const alternativas = useMemo(
    () => (tarifas ? compararEnvio(envio, tarifas) : []),
    [envio, tarifas]
  );
  const recomendacion = useMemo(() => obtenerRecomendacion(alternativas), [alternativas]);
  const explicacion = useMemo(
    () => generarExplicacion(recomendacion, alternativas),
    [recomendacion, alternativas]
  );

  // Guarda el resultado en el historial del usuario una sola vez por envío
  // (se identifica por sus datos + la modalidad elegida).
  useEffect(() => {
    if (!usuario || !recomendacion) return;
    const idEnvio = JSON.stringify(envio);
    if (guardadoRef.current === idEnvio) return;
    guardadoRef.current = idEnvio;
    guardarEnvioEnHistorial(usuario.uid, envio, alternativas, recomendacion);
  }, [usuario, envio, alternativas, recomendacion]);

  if (!envio.peso) {
    return null;
  }

  if (!tarifas) {
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color={colors.action} />
        <Text style={styles.cargandoTexto}>Cargando recomendación...</Text>
      </View>
    );
  }

  if (!recomendacion) {
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
        {envio.origenCiudad}, {envio.origenPaisNombre} → {envio.destinoCiudad}, {envio.destinoPaisNombre}
      </Text>

      <View style={styles.tarjetaPrincipal}>
        <Text style={styles.trofeo}>🏆</Text>
        <Text style={styles.rutaRecomendadaLabel}>Ruta recomendada</Text>
        <Text style={styles.rutaRecomendadaValor}>
          {recomendacion.icono} {recomendacion.label}
        </Text>

        <Text style={styles.costoRecomendadoValor}>US$ {formatearUsd(recomendacion.costoUsd)}</Text>
        <Text style={styles.costoRecomendadoLabel}>Costo del flete (USD)</Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNumero}>{recomendacion.score}</Text>
          <Text style={styles.scoreSobre}>/100</Text>
        </View>
        <Text style={styles.scoreCaption}>TradeRoute Score</Text>
      </View>

      <Text style={styles.explicacion}>{explicacion}</Text>

      <Text style={styles.seccionTitulo}>Composición del Score</Text>
      <View style={styles.desgloseCard}>
        <BarraContribucion label="Costo" porcentaje="55%" valor={recomendacion.scoreCosto} />
        <BarraContribucion label="Tiempo" porcentaje="30%" valor={recomendacion.scoreTiempo} />
        <BarraContribucion label="CO₂" porcentaje="15%" valor={recomendacion.scoreCo2} />
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
    marginBottom: 4,
  },
  costoRecomendadoValor: {
    color: colors.success,
    fontSize: 34,
    fontWeight: '800',
  },
  costoRecomendadoLabel: {
    color: '#C7D2E8',
    fontSize: 12,
    fontWeight: '600',
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
