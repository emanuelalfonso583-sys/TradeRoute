import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Text from '../components/AppText';
import PrimaryButton from '../components/PrimaryButton';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>🌐</Text>
        </View>

        <Text style={styles.title}>TradeRoute</Text>
        <Text style={styles.subtitle}>{t('home.subtitulo')}</Text>

        <Text style={styles.tagline}>{t('home.frase')}</Text>

        <View style={styles.spacer} />

        <View style={styles.buttonWrapper}>
          <PrimaryButton
            title={t('home.comenzar')}
            onPress={() => navigation.navigate('NuevoEnvio')}
          />
        </View>

        <Text style={styles.footer}>{t('home.pie')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 42,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 18,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.action,
    textAlign: 'center',
    marginBottom: 6,
  },
  spacer: {
    height: 48,
  },
  buttonWrapper: {
    width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 8,
    fontSize: 12,
    color: colors.textMuted,
  },
});
