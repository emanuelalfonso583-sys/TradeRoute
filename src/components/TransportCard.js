import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow } from '../theme/colors';
import { formatearUsd } from '../utils/format';

function Metric({ label, value, info }) {
  const [mostrarInfo, setMostrarInfo] = useState(false);

  return (
    <View>
      <View style={styles.metricRow}>
        <View style={styles.metricLabelBox}>
          <Text style={styles.metricLabel}>{label}</Text>
          {info && (
            <Pressable onPress={() => setMostrarInfo((v) => !v)} hitSlop={8}>
              <Ionicons
                name="information-circle-outline"
                size={15}
                color={colors.action}
                style={styles.infoIcono}
              />
            </Pressable>
          )}
        </View>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
      {info && mostrarInfo && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTexto}>{info}</Text>
        </View>
      )}
    </View>
  );
}

const EXPLICACION_PESO_FACTURABLE = {
  maritima:
    'Es el mayor valor entre tu peso real y tu volumen convertido a peso (1 m³ se factura como 1000 kg, el estándar de carga marítima). Se cobra por lo que "ocupa", no solo por lo que pesa.',
  aerea:
    'Es el mayor valor entre tu peso real y tu peso volumétrico (volumen ÷ 6000, la fórmula estándar de IATA para aerolíneas). Una carga grande pero liviana se cobra como si pesara más, porque ocupa espacio en el avión.',
  terrestre: 'En transporte terrestre se cobra por el peso real de la carga.',
};

export default function TransportCard({ alternativa, destacada = false, mostrarScore = true }) {
  const { icono, label, disponible } = alternativa;

  return (
    <View style={[styles.card, destacada && styles.cardDestacada]}>
      <View style={styles.header}>
        <Text style={styles.icono}>{icono}</Text>
        <Text style={styles.titulo}>{label}</Text>
        {destacada && (
          <View style={styles.badgeRecomendada}>
            <Text style={styles.badgeRecomendadaText}>Recomendada</Text>
          </View>
        )}
      </View>

      {!disponible ? (
        <View style={styles.noDisponibleBox}>
          <Text style={styles.noDisponibleText}>No disponible</Text>
          <Text style={styles.noDisponibleSubtext}>
            Sin conexión terrestre directa entre origen y destino.
          </Text>
        </View>
      ) : (
        <View>
          <View style={styles.costoDestacadoBox}>
            <Text style={styles.costoDestacadoLabel}>Costo del flete (USD)</Text>
            <Text style={styles.costoDestacadoValor}>US$ {formatearUsd(alternativa.costoUsd)}</Text>
            <Text style={styles.costoDestacadoSubtexto}>
              US$ {formatearUsd(alternativa.costoPorKg)} por kg
            </Text>
          </View>

          <Metric label="Tiempo estimado" value={`${alternativa.tiempoDias} días`} />
          <Metric label="Distancia real" value={`${alternativa.distanciaKm.toLocaleString('es')} km`} />
          <Metric label="Huella de CO₂" value={`${alternativa.co2Kg.toFixed(2)} kg`} />
          <Metric
            label="Peso facturable"
            value={`${alternativa.pesoFacturableKg} kg`}
            info={EXPLICACION_PESO_FACTURABLE[alternativa.key]}
          />
          {mostrarScore && (
            <>
              <View style={styles.divider} />
              <View style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>TradeRoute Score</Text>
                <Text style={styles.scoreValue}>{alternativa.score}/100</Text>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  infoIcono: {
    marginLeft: 4,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.success,
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
