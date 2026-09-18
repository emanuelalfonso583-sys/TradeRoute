import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import TransportCard from '../components/TransportCard';
import { useShipment } from '../context/ShipmentContext';
import { useLanguage } from '../context/LanguageContext';
import { compararEnvio, obtenerRecomendacion } from '../utils/calculations';
import { obtenerTarifas } from '../firebase/tarifas';
import { colors } from '../theme/colors';

export default function ComparatorScreen({ navigation }) {
  const { envio } = useShipment();
  const { t } = useLanguage();
  const [tarifas, setTarifas] = useState(null);

  useEffect(() => {
    if (!envio.peso) {
      navigation.replace('NuevoEnvio');
    }
  }, [envio.peso, navigation]);

  useEffect(() => {
    obtenerTarifas().then(setTarifas);
  }, []);

  const todasLasAlternativas = useMemo(
    () => (tarifas ? compararEnvio(envio, tarifas, t) : []),
    [envio, tarifas, t]
  );
  const comparandoTodas = !envio.modalidad || envio.modalidad === 'todas';
  const alternativas = useMemo(
    () =>
      comparandoTodas
        ? todasLasAlternativas
        : todasLasAlternativas.filter((a) => a.key === envio.modalidad),
    [todasLasAlternativas, comparandoTodas, envio.modalidad]
  );
  const recomendacion = useMemo(
    () =>
      comparandoTodas
        ? obtenerRecomendacion(todasLasAlternativas)
        : todasLasAlternativas.find((a) => a.key === envio.modalidad && a.disponible) || null,
    [todasLasAlternativas, comparandoTodas, envio.modalidad]
  );

  if (!envio.peso) {
    return null;
  }

  if (!tarifas) {
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color={colors.action} />
        <Text style={styles.cargandoTexto}>{t('comparador.cargandoTarifas')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>
        {comparandoTodas ? t('comparador.tituloTodas') : t('comparador.tituloUna')}
      </Text>
      <Text style={styles.ruta}>
        {envio.origenCiudad}, {envio.origenPaisNombre} → {envio.destinoCiudad}, {envio.destinoPaisNombre}
      </Text>
      <Text style={styles.detalle}>
        {envio.peso} kg · {envio.volumen} m³ · {envio.unidades} {t('comparador.unidades')}
      </Text>

      <View style={styles.spacer} />

      {alternativas.map((alt) => (
        <TransportCard
          key={alt.key}
          alternativa={alt}
          destacada={recomendacion?.key === alt.key}
        />
      ))}

      <Text style={styles.disclaimer}>{t('comparador.disclaimer')}</Text>

      <PrimaryButton
        title={t('comparador.verRecomendacion')}
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
