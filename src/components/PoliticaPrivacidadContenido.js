import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './AppText';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';

// Contenido de la política de privacidad, compartido entre la pantalla de
// Cuenta (ya logueado) y el modal de registro (antes de crear la cuenta).
export default function PoliticaPrivacidadContenido() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const { t } = useLanguage();
  return (
    <View>
      <Text style={styles.privacidadFecha}>{t('privacidad.fecha')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.intro')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.recopilamos')}</Text>
      <Text style={styles.privacidadParrafo}>
        <Text style={styles.privacidadNegrita}>{t('privacidad.negrita.registrarte')}</Text>
        {t('privacidad.parrafo.registrarte')}
      </Text>
      <Text style={styles.privacidadParrafo}>
        <Text style={styles.privacidadNegrita}>{t('privacidad.negrita.calcularEnvio')}</Text>
        {t('privacidad.parrafo.calcularEnvio')}
      </Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.noRecopilamos')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.paraQueUsamos')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.usos')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.noPublicidad')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.dondeAlmacena')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.dondeAlmacena')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.terceros')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.terceros1')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.terceros2')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.derechos')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.derechos')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.cambios')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.cambios')}</Text>
    </View>
  );
}

function crearEstilos(colors) {
  return StyleSheet.create({
    privacidadFecha: {
      fontSize: 11,
      color: colors.textMuted,
      marginBottom: 8,
    },
    privacidadSubtitulo: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primaryDark,
      marginTop: 12,
      marginBottom: 4,
    },
    privacidadParrafo: {
      fontSize: 12.5,
      color: colors.text,
      lineHeight: 18,
      marginBottom: 4,
    },
    privacidadNegrita: {
      fontWeight: '700',
    },
  });
}
