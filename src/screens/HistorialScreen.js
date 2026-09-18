import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { obtenerHistorial } from '../firebase/historial';
import { formatearUsd } from '../utils/format';
import { colors, radius, shadow } from '../theme/colors';

function formatearFecha(timestamp) {
  if (!timestamp?.toDate) return '';
  const fecha = timestamp.toDate();
  return fecha.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' · ' +
    fecha.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}

function TarjetaHistorial({ item, onPress }) {
  const { envio, recomendacion } = item;
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPresionada]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.ruta}>
          {envio.origenCiudad}, {envio.origenPaisNombre} → {envio.destinoCiudad}, {envio.destinoPaisNombre}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
      <Text style={styles.detalle}>
        {envio.peso} kg · {envio.volumen} m³ · {envio.unidades} unidades
      </Text>
      {recomendacion ? (
        <View style={styles.recomendacionBox}>
          <Text style={styles.recomendacionCosto}>US$ {formatearUsd(recomendacion.costoUsd)}</Text>
          <Text style={styles.recomendacionTexto}>🏆 {recomendacion.label}</Text>
        </View>
      ) : (
        <Text style={styles.sinRecomendacion}>Sin alternativas disponibles para esta ruta</Text>
      )}
      <Text style={styles.fecha}>{formatearFecha(item.creadoEn)}</Text>
    </Pressable>
  );
}

export default function HistorialScreen({ navigation }) {
  const { usuario } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarHistorial = useCallback(async () => {
    if (!usuario) return;
    setCargando(true);
    try {
      const datos = await obtenerHistorial(usuario.uid);
      setHistorial(datos);
    } finally {
      setCargando(false);
    }
  }, [usuario]);

  useFocusEffect(
    useCallback(() => {
      cargarHistorial();
    }, [cargarHistorial])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Historial de Envíos</Text>
        <Text style={styles.subtitulo}>Tus comparaciones guardadas, más recientes primero.</Text>
      </View>

      <FlatList
        data={historial}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContainer}
        refreshControl={
          <RefreshControl refreshing={cargando} onRefresh={cargarHistorial} tintColor={colors.action} />
        }
        renderItem={({ item }) => (
          <TarjetaHistorial item={item} onPress={() => navigation.navigate('HistorialDetalle', { item })} />
        )}
        ListEmptyComponent={
          !cargando ? (
            <View style={styles.vacioContainer}>
              <Text style={styles.vacioIcono}>📦</Text>
              <Text style={styles.vacioTexto}>
                Todavía no has calculado ningún envío. Cuando lo hagas, aparecerá aquí.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  listaContainer: {
    padding: 20,
    paddingTop: 8,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
    ...shadow.card,
  },
  cardPresionada: {
    backgroundColor: colors.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ruta: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 4,
  },
  detalle: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 10,
  },
  recomendacionBox: {
    backgroundColor: colors.successLight,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  recomendacionCosto: {
    color: colors.primaryDark,
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 2,
  },
  recomendacionTexto: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 13,
  },
  sinRecomendacion: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
  fecha: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 10,
    textAlign: 'right',
  },
  vacioContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  vacioIcono: {
    fontSize: 40,
    marginBottom: 12,
  },
  vacioTexto: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
