import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Text from '../components/AppText';
import TextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { colors, radius } from '../theme/colors';

export default function RegisterScreen({ navigation }) {
  const { registrarse } = useAuth();
  const { t } = useLanguage();
  const [nombre, setNombre] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const TIPOS_DOCUMENTO = [
    { value: '', label: t('registro.tipoDocumentoPlaceholder') },
    { value: 'cc', label: t('registro.tipoDocumento.cc') },
    { value: 'ce', label: t('registro.tipoDocumento.ce') },
    { value: 'ti', label: t('registro.tipoDocumento.ti') },
    { value: 'pasaporte', label: t('registro.tipoDocumento.pasaporte') },
    { value: 'otro', label: t('registro.tipoDocumento.otro') },
  ];

  async function handleRegistrarse() {
    if (
      !nombre.trim() ||
      !correo.trim() ||
      !contrasena ||
      !tipoDocumento ||
      !numeroDocumento.trim() ||
      !telefono.trim()
    ) {
      setError(t('registro.errorCamposVacios'));
      return;
    }
    if (contrasena.length < 6) {
      setError(t('registro.errorContrasenaCorta'));
      return;
    }
    if (contrasena !== confirmar) {
      setError(t('registro.errorContrasenasNoCoinciden'));
      return;
    }

    setError('');
    setCargando(true);
    const resultado = await registrarse(nombre.trim(), correo.trim(), contrasena, {
      tipoDocumento,
      numeroDocumento: numeroDocumento.trim(),
      telefono: telefono.trim(),
    });
    setCargando(false);
    if (!resultado.ok) {
      setError(resultado.mensaje);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>🌐 TradeRoute</Text>
        <Text style={styles.titulo}>{t('registro.titulo')}</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTexto}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>{t('registro.nombre')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('registro.nombrePlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>{t('registro.tipoDocumento')}</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={tipoDocumento} onValueChange={setTipoDocumento}>
            {TIPOS_DOCUMENTO.map((op) => (
              <Picker.Item key={op.value} label={op.label} value={op.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{t('registro.numeroDocumento')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('registro.numeroDocumentoPlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={numeroDocumento}
          onChangeText={setNumeroDocumento}
          keyboardType="number-pad"
        />

        <Text style={styles.label}>{t('registro.telefono')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('registro.telefonoPlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>{t('registro.correo')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('login.correoPlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <Text style={styles.label}>{t('registro.contrasena')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('registro.contrasenaPlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <Text style={styles.label}>{t('registro.confirmar')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('registro.confirmarPlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={confirmar}
          onChangeText={setConfirmar}
          secureTextEntry
        />

        <View style={styles.spacer} />
        <PrimaryButton
          title={cargando ? t('registro.creando') : t('registro.boton')}
          onPress={handleRegistrarse}
          disabled={cargando}
        />

        <View style={styles.pieContainer}>
          <Text style={styles.pieTexto}>{t('registro.yaTieneCuenta')}</Text>
          <Text style={styles.pieLink} onPress={() => navigation.navigate('Login')}>
            {' '}
            {t('registro.iniciarSesion')}
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
  pickerBox: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
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
