import React, { useMemo, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './AppText';
import { radius, shadow } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import { documentosRequeridos } from '../data/exportDocs';

function ItemDocumento({ docKey }) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [abierto, setAbierto] = useState(false);

  return (
    <Pressable style={styles.item} onPress={() => setAbierto((v) => !v)}>
      <View style={styles.itemHeader}>
        <Ionicons name="document-text-outline" size={18} color={colors.action} />
        <Text style={styles.itemNombre}>{t(`documentos.${docKey}.nombre`)}</Text>
        <Ionicons
          name={abierto ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
        />
      </View>
      {abierto && <Text style={styles.itemInfo}>{t(`documentos.${docKey}.info`)}</Text>}
    </Pressable>
  );
}

// Lo que una calculadora de costos no puede darte: según la modalidad de
// transporte elegida y el tipo de mercancía, cuáles son los documentos
// reales que se necesitan para poder embarcar (factura, lista de empaque,
// seguro, el documento de transporte específico de cada modalidad, y el
// certificado adicional que exige ese tipo de carga).
export default function DocumentosRequeridos({ modalidadKey, tipoMercancia }) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const docs = useMemo(
    () => documentosRequeridos(modalidadKey, tipoMercancia),
    [modalidadKey, tipoMercancia]
  );

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>{t('recomendacion.documentosTitulo')}</Text>
      <Text style={styles.subtitulo}>{t('recomendacion.documentosSubtitulo')}</Text>
      {docs.map((docKey) => (
        <ItemDocumento key={docKey} docKey={docKey} />
      ))}
    </View>
  );
}

function crearEstilos(colors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: 16,
      marginBottom: 20,
      ...shadow.card,
    },
    titulo: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.primaryDark,
      marginBottom: 4,
    },
    subtitulo: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 12,
      lineHeight: 17,
    },
    item: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingVertical: 10,
    },
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    itemNombre: {
      flex: 1,
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },
    itemInfo: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 6,
      marginLeft: 26,
      lineHeight: 17,
    },
  });
}
