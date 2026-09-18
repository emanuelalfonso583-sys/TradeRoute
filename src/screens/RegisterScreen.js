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

export default function RegisterScreen({ navigation }) {
  const { registrarse } = useAuth();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleRegistrarse() {
    if (!nombre.trim() || !correo.trim() || !contrasena) {
      setError('Completa todos los campos.');
      return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (contrasena !== confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');
    setCargando(true);
    const resultado = await registrarse(nombre.trim(), correo.trim(), contrasena);
    setCargando(false);
    if (!resultado.ok) {
      setError(resultado.mensaje);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>🌐 TradeRoute</Text>
        <Text style={styles.titulo}>Crear cuenta</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTexto}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          placeholderTextColor={colors.textMuted}
          value={nombre}
          onChangeText={setNombre}
        />

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
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor={colors.textMuted}
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          placeholderTextColor={colors.textMuted}
          value={confirmar}
          onChangeText={setConfirmar}
          secureTextEntry
        />

        <View style={styles.spacer} />
        <PrimaryButton
          title={cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          onPress={handleRegistrarse}
          disabled={cargando}
        />

        <View style={styles.pieContainer}>
          <Text style={styles.pieTexto}>¿Ya tienes cuenta?</Text>
          <Text style={styles.pieLink} onPress={() => navigation.navigate('Login')}>
            {' '}
            Iniciar sesión
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
