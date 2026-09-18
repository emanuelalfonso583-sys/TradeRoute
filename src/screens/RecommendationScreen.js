import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TransportCard from '../components/TransportCard';
import { useShipment } from '../context/ShipmentContext';
import { useAuth } from '../context/AuthContext';
import {
  compararEnvio,
  obtenerRecomendacion,
  generarExplicacion,
  generarExplicacionSeleccion,
  hayComparacionReal,
} from '../utils/calculations';
import { obtenerTarifas } from '../firebase/tarifas';
import { guardarEnvioEnHistorial } from '../firebase/historial';
import { formatearUsd } from '../utils/format';
import RouteMap from '../components/RouteMap';
import { colors, radius, shadow } from '../theme/colors';

// Muestra la cuenta exacta detrás del TradeRoute Score, factor por factor,
// para que se pueda verificar con calculadora: subpuntaje × peso = puntos.
function DesgloseScore({ recomendacion }) {
  const filas = [
    { label: 'Costo', sub: recomendacion.scoreCosto, peso: 0.55 },
    { label: 'Tiempo', sub: recomendacion.scoreTiempo, peso: 0.3 },
    { label: 'CO₂', sub: recomendacion.scoreCo2, peso: 0.15 },
  ];

  return (
    <View style={styles.desgloseCard}>
      {filas.map((fila) => (
        <View key={fila.label} style={styles.desgloseFila}>
          <Text style={styles.desgloseTexto}>
            {fila.label}: {Math.round(fila.sub)}/100 × {Math.round(fila.peso * 100)}%
          </Text>
          <Text style={styles.desglosePuntos}>
            = {(fila.sub * fila.peso).toFixed(1)} pts
          </Text>
        </View>
      ))}
      <View style={styles.desgloseDivider} />
      <View style={styles.desgloseFila}>
        <Text style={styles.desgloseTotalTexto}>Total</Text>
        <Text style={styles.desgloseTotalPuntos}>{recomendacion.score}/100</Text>
      </View>
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

  const [mostrarOtras, setMostrarOtras] = useState(false);

  const todasLasAlternativas = useMemo(
    () => (tarifas ? compararEnvio(envio, tarifas) : []),
    [envio, tarifas]
  );
  const comparandoTodas = !envio.modalidad || envio.modalidad === 'todas';
  const recomendacion = useMemo(
    () =>
      comparandoTodas
        ? obtenerRecomendacion(todasLasAlternativas)
        : todasLasAlternativas.find((a) => a.key === envio.modalidad && a.disponible) || null,
    [todasLasAlternativas, comparandoTodas, envio.modalidad]
  );
  const explicacion = useMemo(
    () =>
      comparandoTodas
        ? generarExplicacion(recomendacion, todasLasAlternativas)
        : generarExplicacionSeleccion(recomendacion, todasLasAlternativas),
    [comparandoTodas, recomendacion, todasLasAlternativas]
  );
  const conComparacion = useMemo(
    () => hayComparacionReal(todasLasAlternativas),
    [todasLasAlternativas]
  );
  const otrasDisponibles = useMemo(
    () => todasLasAlternativas.filter((a) => a.disponible && a.key !== recomendacion?.key),
    [todasLasAlternativas, recomendacion]
  );

  // Guarda el resultado en el historial del usuario una sola vez por envío
  // (se identifica por sus datos + la modalidad elegida).
  useEffect(() => {
    if (!usuario || !recomendacion) return;
    const idEnvio = JSON.stringify(envio);
    if (guardadoRef.current === idEnvio) return;
    guardadoRef.current = idEnvio;
    guardarEnvioEnHistorial(usuario.uid, envio, todasLasAlternativas, recomendacion);
  }, [usuario, envio, todasLasAlternativas, recomendacion]);

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
      <Text style={styles.titulo}>{conComparacion ? 'Recomendación de Ruta' : 'Detalle de la Ruta'}</Text>
      <Text style={styles.ruta}>
        {envio.origenCiudad}, {envio.origenPaisNombre} → {envio.destinoCiudad}, {envio.destinoPaisNombre}
      </Text>

      <View style={styles.tarjetaPrincipal}>
        <Text style={styles.trofeo}>{conComparacion ? '🏆' : recomendacion.icono}</Text>
        <Text style={styles.rutaRecomendadaLabel}>
          {conComparacion ? 'Ruta recomendada' : 'Modalidad seleccionada'}
        </Text>
        <Text style={styles.rutaRecomendadaValor}>
          {recomendacion.icono} {recomendacion.label}
        </Text>

        <Text style={styles.costoRecomendadoValor}>US$ {formatearUsd(recomendacion.costoUsd)}</Text>
        <Text style={styles.costoRecomendadoLabel}>Costo del flete (USD)</Text>

        {conComparacion && (
          <>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumero}>{recomendacion.score}</Text>
              <Text style={styles.scoreSobre}>/100</Text>
            </View>
            <Text style={styles.scoreCaption}>TradeRoute Score</Text>
          </>
        )}
      </View>

      <Text style={styles.seccionTitulo}>Mapa de la ruta</Text>
      <RouteMap
        origen={{
          lat: envio.origenLat,
          lng: envio.origenLng,
          label: `${envio.origenCiudad}, ${envio.origenPaisNombre}`,
        }}
        destino={{
          lat: envio.destinoLat,
          lng: envio.destinoLng,
          label: `${envio.destinoCiudad}, ${envio.destinoPaisNombre}`,
        }}
      />

      <Text style={styles.explicacion}>{explicacion}</Text>

      {conComparacion && (
        <>
          <Text style={styles.seccionTitulo}>Cómo se calculó el Score</Text>
          <DesgloseScore recomendacion={recomendacion} />
        </>
      )}

      {!comparandoTodas && otrasDisponibles.length > 0 && (
        <View style={styles.otrasContainer}>
          <PrimaryButton
            title={
              mostrarOtras
                ? 'Ocultar otras alternativas'
                : otrasDisponibles.length === 1
                ? 'Ver segunda opción recomendada'
                : 'Ver otras alternativas disponibles'
            }
            onPress={() => setMostrarOtras((v) => !v)}
            variant="outline"
          />
          {mostrarOtras && (
            <View style={styles.otrasLista}>
              {otrasDisponibles.map((alt) => (
                <TransportCard key={alt.key} alternativa={alt} mostrarScore={conComparacion} />
              ))}
            </View>
          )}
        </View>
      )}

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
  otrasContainer: {
    marginBottom: 20,
  },
  otrasLista: {
    marginTop: 14,
  },
  desgloseCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 20,
  },
  desgloseFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  desgloseTexto: {
    fontSize: 13,
    color: colors.text,
  },
  desglosePuntos: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  desgloseDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  desgloseTotalTexto: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  desgloseTotalPuntos: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.success,
  },
});
