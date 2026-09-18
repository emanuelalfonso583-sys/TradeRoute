import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { useShipment } from '../context/ShipmentContext';
import { compararEnvio } from '../utils/calculations';
import { obtenerTarifas } from '../firebase/tarifas';
import { puertosCercanos, aeropuertosCercanos } from '../utils/nearestHubs';
import { calcularRutaMaritima } from '../utils/seaRoute';
import RouteMap from '../components/RouteMap';
import HubCard from '../components/HubCard';
import { colors, radius, shadow } from '../theme/colors';

const CANTIDAD_HUBS = 3;

function SeccionHubs({ titulo, hubs }) {
  return (
    <View style={styles.seccionHubs}>
      <Text style={styles.subtitulo}>{titulo}</Text>
      {hubs.length === 0 ? (
        <Text style={styles.sinDatos}>No se encontraron opciones registradas cerca de esta ciudad.</Text>
      ) : (
        hubs.map((hub) => <HubCard key={hub.code} hub={hub} />)
      )}
    </View>
  );
}

function AnalisisMaritimo({ alternativa, envio }) {
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
      <SeccionHubs titulo="Puertos de salida (origen)" hubs={puertosOrigen} />
      <SeccionHubs titulo="Puertos de llegada (destino)" hubs={puertosDestino} />

      {origenRecomendado && destinoRecomendado && (
        <>
          <Text style={styles.subtitulo}>
            Ruta marítima real: {origenRecomendado.name} → {destinoRecomendado.name}
          </Text>
          {rutaMaritima && (
            <Text style={styles.rutaDetalle}>
              Distancia navegable estimada: {rutaMaritima.distanciaKm.toLocaleString('es')} km por la ruta
              marítima real (siguiendo estrechos y canales, no en línea recta).
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
      <SeccionHubs titulo="Aeropuertos de salida (origen)" hubs={aeropuertosOrigen} />
      <SeccionHubs titulo="Aeropuertos de llegada (destino)" hubs={aeropuertosDestino} />

      {origenRecomendado && destinoRecomendado && (
        <>
          <Text style={styles.subtitulo}>
            Ruta aérea: {origenRecomendado.name} → {destinoRecomendado.name}
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
  return (
    <View>
      <Text style={styles.subtitulo}>
        Ruta por carretera: {envio.origenCiudad} → {envio.destinoCiudad}
      </Text>
      <Text style={styles.rutaDetalle}>
        Trazado real sobre las carreteras existentes entre las dos ciudades (no una línea recta).
      </Text>
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
  return (
    <View style={styles.vacioContainer}>
      <Text style={styles.vacioIcono}>📊</Text>
      <Text style={styles.vacioTitulo}>Todavía no hay nada que analizar</Text>
      <Text style={styles.vacioTexto}>
        Calcula un envío desde "Nuevo Envío" y aquí verás el análisis detallado: puertos o aeropuertos
        reales de salida y llegada, cuál es el recomendado, y el mapa real de la ruta.
      </Text>
    </View>
  );
}

export default function AnalysisScreen() {
  const { envio } = useShipment();
  const [tarifas, setTarifas] = useState(null);

  useEffect(() => {
    obtenerTarifas().then(setTarifas);
  }, []);

  const alternativas = useMemo(() => (tarifas ? compararEnvio(envio, tarifas) : []), [envio, tarifas]);
  const principales = useMemo(
    () =>
      alternativas
        .filter((a) => a.disponible && a.score !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, 2),
    [alternativas]
  );

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
        <Text style={styles.cargandoTexto}>Cargando análisis...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Análisis de Ruta</Text>
        <Text style={styles.ruta}>
          {envio.origenCiudad}, {envio.origenPaisNombre} → {envio.destinoCiudad}, {envio.destinoPaisNombre}
        </Text>

        {principales.length === 0 ? (
          <Text style={styles.sinDatos}>No hay alternativas disponibles para analizar en esta ruta.</Text>
        ) : (
          principales.map((alt, index) => (
            <View key={alt.key} style={styles.bloqueModalidad}>
              <View style={styles.encabezadoModalidad}>
                <Text style={styles.encabezadoIcono}>{alt.icono}</Text>
                <View style={styles.flex}>
                  <Text style={styles.encabezadoEtiqueta}>
                    {index === 0 ? '🏆 Opción recomendada' : 'Segunda opción recomendada'}
                  </Text>
                  <Text style={styles.encabezadoModalidadTexto}>{alt.label}</Text>
                </View>
              </View>
              <AnalisisModalidad alternativa={alt} envio={envio} />
            </View>
          ))
        )}

        <Text style={styles.disclaimer}>
          Puertos y aeropuertos son datos reales (UN/LOCODE y OurAirports); toca el recomendado para ver
          una foto real y más información (Wikipedia). La ruta marítima se calcula sobre la red de
          navegación real; la ruta terrestre usa carreteras reales. Los tiempos y costos siguen siendo
          estimaciones académicas.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
