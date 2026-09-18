import React, { useMemo, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './AppText';
import { radius, shadow } from '../theme/colors';
import { formatearUsd } from '../utils/format';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';

function IconoInfo({ onPress, colorIcono, tamano = 15 }) {
  const { colors } = useAppTheme();
  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Ionicons
        name="information-circle-outline"
        size={tamano}
        color={colorIcono || colors.action}
        style={styles.infoIcono}
      />
    </Pressable>
  );
}

function CajaInfo({ texto }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoTexto}>{texto}</Text>
    </View>
  );
}

function Metric({ label, value, info }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <View>
      <View style={styles.metricRow}>
        <View style={styles.metricLabelBox}>
          <Text style={styles.metricLabel}>{label}</Text>
          {info && <IconoInfo onPress={() => setMostrarInfo((v) => !v)} />}
        </View>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
      {info && mostrarInfo && <CajaInfo texto={info} />}
    </View>
  );
}

export default function TransportCard({ alternativa, destacada = false }) {
  const { icono, label, disponible } = alternativa;
  const { t, idioma } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [mostrarInfoCosto, setMostrarInfoCosto] = useState(false);

  const EXPLICACIONES = {
    costo: {
      maritima: t('tarjeta.info.costo.maritima'),
      aerea: t('tarjeta.info.costo.aerea'),
      terrestre: t('tarjeta.info.costo.terrestre'),
    },
    tiempo: t('tarjeta.info.tiempo'),
    distancia: t('tarjeta.info.distancia'),
    co2: t('tarjeta.info.co2'),
    pesoFacturable: {
      maritima: t('tarjeta.info.pesoFacturable.maritima'),
      aerea: t('tarjeta.info.pesoFacturable.aerea'),
      terrestre: t('tarjeta.info.pesoFacturable.terrestre'),
    },
  };

  return (
    <View style={[styles.card, destacada && styles.cardDestacada]}>
      <View style={styles.header}>
        <Text style={styles.icono}>{icono}</Text>
        <Text style={styles.titulo}>{label}</Text>
        {destacada && (
          <View style={styles.badgeRecomendada}>
            <Text style={styles.badgeRecomendadaText}>{t('tarjeta.recomendada')}</Text>
          </View>
        )}
      </View>

      {!disponible ? (
        <View style={styles.noDisponibleBox}>
          <Text style={styles.noDisponibleText}>{t('tarjeta.noDisponible')}</Text>
          <Text style={styles.noDisponibleSubtext}>{t('tarjeta.noDisponibleSub')}</Text>
        </View>
      ) : (
        <View>
          <View style={styles.costoDestacadoBox}>
            <View style={styles.costoDestacadoLabelBox}>
              <Text style={styles.costoDestacadoLabel}>{t('tarjeta.costo')}</Text>
              <IconoInfo
                onPress={() => setMostrarInfoCosto((v) => !v)}
                colorIcono={colors.textMuted}
              />
            </View>
            <Text style={styles.costoDestacadoValor}>US$ {formatearUsd(alternativa.costoUsd)}</Text>
            <Text style={styles.costoDestacadoSubtexto}>
              US$ {formatearUsd(alternativa.costoPorKg)} {t('tarjeta.porKg')}
            </Text>
            {mostrarInfoCosto && <CajaInfo texto={EXPLICACIONES.costo[alternativa.key]} />}
          </View>

          <Metric
            label={t('tarjeta.tiempoEstimado')}
            value={`${alternativa.tiempoDias} ${alternativa.tiempoDias === 1 ? t('comun.dia') : t('comun.dias')}`}
            info={EXPLICACIONES.tiempo}
          />
          <Metric
            label={t('tarjeta.distanciaReal')}
            value={`${alternativa.distanciaKm.toLocaleString(idioma)} ${t('comun.km')}`}
            info={EXPLICACIONES.distancia}
          />
          <Metric label={t('tarjeta.huellaCo2')} value={`${alternativa.co2Kg.toFixed(2)} kg`} info={EXPLICACIONES.co2} />
          <Metric
            label={t('tarjeta.pesoFacturable')}
            value={`${alternativa.pesoFacturableKg} kg`}
            info={EXPLICACIONES.pesoFacturable[alternativa.key]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  infoIcono: {
    marginLeft: 4,
  },
});

function crearEstilos(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 18,
      marginBottom: 16,
      ...shadow.card,
    },
    cardDestacada: {
      borderColor: colors.success,
      borderWidth: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    icono: {
      fontSize: 26,
      marginRight: 10,
    },
    titulo: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primaryDark,
      flex: 1,
    },
    badgeRecomendada: {
      backgroundColor: colors.successLight,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: radius.sm,
    },
    badgeRecomendadaText: {
      color: colors.success,
      fontWeight: '700',
      fontSize: 12,
    },
    costoDestacadoBox: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 12,
    },
    costoDestacadoLabelBox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    costoDestacadoLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    costoDestacadoValor: {
      fontSize: 32,
      fontWeight: '800',
      color: colors.primaryDark,
      marginTop: 2,
    },
    costoDestacadoSubtexto: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
    },
    metricRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    metricLabelBox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metricLabel: {
      color: colors.textMuted,
      fontSize: 14,
    },
    infoBox: {
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      padding: 10,
      marginBottom: 6,
    },
    infoTexto: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 17,
    },
    metricValue: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    noDisponibleBox: {
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      padding: 14,
    },
    noDisponibleText: {
      color: colors.textMuted,
      fontWeight: '700',
      fontSize: 15,
      marginBottom: 4,
    },
    noDisponibleSubtext: {
      color: colors.textMuted,
      fontSize: 12,
    },
  });
}
