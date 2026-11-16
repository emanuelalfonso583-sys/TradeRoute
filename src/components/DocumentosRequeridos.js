import React, { useMemo, useState } from 'react';
import { View, Pressable, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './AppText';
import { radius, shadow } from '../theme/colors';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import { documentosRequeridos, LINK_POR_DOCUMENTO } from '../data/exportDocs';

function ItemDocumento({ docKey }) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [abierto, setAbierto] = useState(false);
  const pasos = t(`documentos.${docKey}.pasos`)
    .split('\n')
    .map((paso) => paso.trim())
    .filter(Boolean);
  const link = LINK_POR_DOCUMENTO[docKey];

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
      {abierto && (
        <View style={styles.itemExpandido}>
          <Text style={styles.itemInfo}>{t(`documentos.${docKey}.info`)}</Text>

          <Text style={styles.pasosTitulo}>{t('documentos.comoObtenerlo')}</Text>
          {pasos.map((paso, i) => (
            <View key={i} style={styles.pasoFila}>
              <View style={styles.pasoNumeroCirculo}>
                <Text style={styles.pasoNumeroTexto}>{i + 1}</Text>
              </View>
              <Text style={styles.pasoTexto}>{paso}</Text>
            </View>
          ))}

          {link && (
            <Pressable style={styles.enlaceBox} onPress={() => Linking.openURL(link)}>
              <Ionicons name="open-outline" size={15} color={colors.action} />
              <Text style={styles.enlaceTexto}>{t(`documentos.${docKey}.linkLabel`)}</Text>
            </Pressable>
          )}
        </View>
      )}
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
    itemExpandido: {
      marginTop: 6,
      marginLeft: 26,
    },
    itemInfo: {
      fontSize: 12,
      color: colors.textMuted,
      lineHeight: 17,
    },
    pasosTitulo: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primaryDark,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 12,
      marginBottom: 8,
    },
    pasoFila: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      marginBottom: 8,
    },
    pasoNumeroCirculo: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.action,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 1,
    },
    pasoNumeroTexto: {
      fontSize: 10,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    pasoTexto: {
      flex: 1,
      fontSize: 12.5,
      color: colors.text,
      lineHeight: 18,
    },
    enlaceBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 4,
      alignSelf: 'flex-start',
    },
    enlaceTexto: {
      fontSize: 12.5,
      fontWeight: '600',
      color: colors.action,
      textDecorationLine: 'underline',
    },
  });
}
