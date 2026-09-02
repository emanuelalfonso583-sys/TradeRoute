import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../theme/colors';

export default function PlaceholderScreen({ icono, titulo, descripcion }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.icono}>{icono}</Text>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Próximamente</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  icono: {
    fontSize: 48,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 18,
  },
  badge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: colors.action,
    fontWeight: '700',
    fontSize: 12,
  },
});
