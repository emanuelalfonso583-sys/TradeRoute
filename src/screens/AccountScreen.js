import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme/colors';

export default function AccountScreen() {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color="#FFFFFF" />
        </View>

        <Text style={styles.nombre}>{usuario?.displayName || 'Usuario TradeRoute'}</Text>
        <Text style={styles.correo}>{usuario?.email}</Text>

        <View style={styles.spacer} />

        <View style={styles.botonWrapper}>
          <PrimaryButton title="Cerrar sesión" onPress={cerrarSesion} variant="outline" />
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  nombre: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  correo: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  spacer: {
    height: 32,
  },
  botonWrapper: {
    width: '100%',
  },
});
