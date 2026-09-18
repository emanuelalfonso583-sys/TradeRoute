import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  const { iniciarSesion } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleIniciarSesion() {
    if (!correo.trim() || !contrasena) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    setError('');
    setCargando(true);
    const resultado = await iniciarSesion(correo.trim(), contrasena);
    setCargando(false);
    if (!resultado.ok) {
      setError(resultado.mensaje);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>🌐 TradeRoute</Text>
        <Text style={styles.titulo}>Iniciar sesión</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTexto}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tucorreo@ejemplo.com"
          placeholderTextColor={colors.textMuted}
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu contraseña"
          placeholderTextColor={colors.textMuted}
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <View style={styles.spacer} />
        <PrimaryButton
          title={cargando ? 'Ingresando...' : 'Iniciar sesión'}
          onPress={handleIniciarSesion}
          disabled={cargando}
        />

        <View style={styles.pieContainer}>
          <Text style={styles.pieTexto}>¿No tienes cuenta?</Text>
          <Text style={styles.pieLink} onPress={() => navigation.navigate('Registro')}>
            {' '}
            Crear una cuenta
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 6,
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    borderRadius: radius.sm,
    padding: 12,
    marginBottom: 16,
  },
  errorTexto: {
    color: colors.danger,
    fontWeight: '600',
    fontSize: 13,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    marginBottom: 14,
  },
  spacer: {
    height: 6,
  },
  pieContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  pieTexto: {
    color: colors.textMuted,
    fontSize: 14,
  },
  pieLink: {
    color: colors.action,
    fontWeight: '700',
    fontSize: 14,
  },
});
