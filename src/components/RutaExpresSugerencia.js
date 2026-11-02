import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './AppText';
import TransportCard from './TransportCard';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import { generarAlternativaExpresMaritima } from '../utils/calculations';
import { puertosCercanos } from '../utils/nearestHubs';
import { calcularRutaMaritima } from '../utils/seaRoute';
import { distanciaKm } from '../utils/geo';
import { radius } from '../theme/colors';

// Solo tiene sentido ofrecer la variante exprés (pagar un canal para llegar
// más rápido) cuando la ruta marítima real da un rodeo importante frente a
// la línea recta entre los puertos: eso es justo lo que pasa cuando, sin
// cruzar un canal, el barco tendría que bordear un continente entero. Si la
// ruta real ya es casi directa, cruzar un canal no cambiaría nada y no
// debería ofrecerse en todos los envíos largos.
const UMBRAL_RODEO = 1.4;

// Sugerencia opcional que aparece junto a la ruta marítima cuando, para esa
// ruta puntual, la ruta real da un rodeo importante y cruzar un canal con
// prioridad de tránsito sí representaría una mejora real de tiempo.
export default function RutaExpresSugerencia({ envio, alternativaMaritima }) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);

  const puertoOrigen = useMemo(
    () => (envio ? puertosCercanos(envio.origenLat, envio.origenLng, 1)[0] : null),
    [envio?.origenLat, envio?.origenLng]
  );
  const puertoDestino = useMemo(
    () => (envio ? puertosCercanos(envio.destinoLat, envio.destinoLng, 1)[0] : null),
    [envio?.destinoLat, envio?.destinoLng]
  );

  const hayRodeoImportante = useMemo(() => {
    if (!puertoOrigen || !puertoDestino) return false;
    const rutaReal = calcularRutaMaritima(puertoOrigen, puertoDestino);
    const directaEntrePuertos = distanciaKm(
      puertoOrigen.lat,
      puertoOrigen.lng,
      puertoDestino.lat,
      puertoDestino.lng
    );
    if (!rutaReal || !directaEntrePuertos) return false;
    return rutaReal.distanciaKm / directaEntrePuertos >= UMBRAL_RODEO;
  }, [puertoOrigen?.code, puertoDestino?.code]);

  const expres = useMemo(
    () => (hayRodeoImportante ? generarAlternativaExpresMaritima(alternativaMaritima, t) : null),
    [hayRodeoImportante, alternativaMaritima, t]
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
