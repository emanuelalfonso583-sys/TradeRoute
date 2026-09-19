import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import Text from '../components/AppText';
import TextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import { radius } from '../theme/colors';

function ModalRecuperar({ visible, onCerrar, correoInicial }) {
  const { restablecerContrasena } = useAuth();
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [correo, setCorreo] = useState(correoInicial);
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function handleEnviar() {
    if (!correo.trim()) {
      setMensaje(t('login.recuperar.errorSinCorreo'));
      setEsError(true);
      return;
    }
    setEnviando(true);
    setMensaje('');
    const resultado = await restablecerContrasena(correo.trim());
    setEnviando(false);
    if (resultado.ok) {
      setEsError(false);
      setMensaje(t('login.recuperar.exito'));
    } else {
      setEsError(true);
      setMensaje(resultado.mensaje);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onCerrar}>
      <KeyboardAvoidingView
        style={styles.modalFondo}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalCaja}>
          <Text style={styles.modalTitulo}>{t('login.recuperar.titulo')}</Text>
          <Text style={styles.modalDescripcion}>{t('login.recuperar.descripcion')}</Text>

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

          {mensaje ? (
            <View style={[styles.errorBox, !esError && styles.exitoBox]}>
              <Text style={[styles.errorTexto, !esError && styles.exitoTexto]}>{mensaje}</Text>
            </View>
          ) : null}

          <PrimaryButton
            title={enviando ? t('login.recuperar.enviando') : t('login.recuperar.boton')}
            onPress={handleEnviar}
            disabled={enviando}
          />
          <View style={styles.espacioChico} />
          <PrimaryButton title={t('comun.cerrar')} onPress={onCerrar} variant="outline" />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function LoginScreen({ navigation }) {
  const { iniciarSesion } = useAuth();
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [modalRecuperarVisible, setModalRecuperarVisible] = useState(false);

  async function handleIniciarSesion() {
    if (!correo.trim() || !contrasena) {
      setError(t('login.errorCamposVacios'));
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
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>🌐 TradeRoute</Text>
        <Text style={styles.titulo}>{t('login.titulo')}</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTexto}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>{t('login.correo')}</Text>
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

        <Text style={styles.label}>{t('login.contrasena')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('login.contrasenaPlaceholder')}
          placeholderTextColor={colors.textMuted}
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <Text style={styles.olvideLink} onPress={() => setModalRecuperarVisible(true)}>
          {t('login.olvidasteContrasena')}
        </Text>

        <View style={styles.spacer} />
        <PrimaryButton
          title={cargando ? t('login.ingresando') : t('login.boton')}
          onPress={handleIniciarSesion}
          disabled={cargando}
        />

        <View style={styles.pieContainer}>
          <Text style={styles.pieTexto}>{t('login.sinCuenta')}</Text>
          <Text style={styles.pieLink} onPress={() => navigation.navigate('Registro')}>
            {' '}
            {t('login.crearCuenta')}
          </Text>
        </View>
      </ScrollView>

      <ModalRecuperar
        visible={modalRecuperarVisible}
        onCerrar={() => setModalRecuperarVisible(false)}
        correoInicial={correo}
      />
    </KeyboardAvoidingView>
  );
}

function crearEstilos(colors) {
  return StyleSheet.create({
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
    exitoBox: {
      backgroundColor: colors.successLight,
    },
    exitoTexto: {
      color: colors.success,
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
    olvideLink: {
      color: colors.action,
      fontWeight: '600',
      fontSize: 13,
      textAlign: 'right',
      marginBottom: 6,
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
    modalFondo: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      justifyContent: 'center',
      padding: 24,
    },
    modalCaja: {
      backgroundColor: colors.background,
      borderRadius: radius.lg,
      padding: 22,
    },
    modalTitulo: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.primaryDark,
      marginBottom: 8,
    },
    modalDescripcion: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 16,
      lineHeight: 18,
    },
    espacioChico: {
      height: 10,
    },
  });
}
