import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './AppText';
import TransportCard from './TransportCard';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import { generarAlternativaExpresMaritima } from '../utils/calculations';
import { radius } from '../theme/colors';

// Sugerencia opcional que aparece junto a la ruta marítima en recorridos
// largos: una variante más cara pero más rápida (cruzando un canal con
// prioridad de tránsito), para cuando al usuario le conviene más pagar un
// poco más y llegar antes que ahorrar yendo por el camino más largo.
export default function RutaExpresSugerencia({ alternativaMaritima }) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);

  const expres = useMemo(
    () => generarAlternativaExpresMaritima(alternativaMaritima, t),
    [alternativaMaritima, t]
  );

  if (!expres) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{t('rutaExpres.titulo')}</Text>
      <Text style={styles.texto}>{t('rutaExpres.descripcion')}</Text>
      <TransportCard alternativa={expres} />
    </View>
  );
}

function crearEstilos(colors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: 14,
      marginBottom: 18,
    },
    titulo: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primaryDark,
      marginBottom: 4,
    },
    texto: {
      fontSize: 12.5,
      color: colors.textMuted,
      lineHeight: 18,
      marginBottom: 12,
    },
  });
}
