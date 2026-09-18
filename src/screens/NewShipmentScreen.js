import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Text from '../components/AppText';
import TextInput from '../components/AppTextInput';
import PrimaryButton from '../components/PrimaryButton';
import LocationPicker from '../components/LocationPicker';
import { useShipment } from '../context/ShipmentContext';
import { useLanguage } from '../context/LanguageContext';
import { hayConexionTerrestreEntrePaises } from '../utils/routeGroups';
import { compararEnvio, obtenerRecomendacion } from '../utils/calculations';
import { obtenerTarifas } from '../firebase/tarifas';
import { useAppTheme } from '../context/ThemeContext';
import { radius } from '../theme/colors';

function parseNumero(texto) {
  if (typeof texto !== 'string') return NaN;
  return parseFloat(texto.replace(',', '.'));
}

function validar(form, t) {
  const errores = {};

  if (!form.origen?.city) errores.origen = t('nuevoEnvio.error.origen');
  if (!form.destino?.city) errores.destino = t('nuevoEnvio.error.destino');
  if (!form.tipoMercancia) errores.tipoMercancia = t('nuevoEnvio.error.tipoMercancia');

  const peso = parseNumero(form.peso);
  if (form.peso === '' || Number.isNaN(peso)) {
    errores.peso = t('nuevoEnvio.error.pesoVacio');
  } else if (peso <= 0) {
    errores.peso = t('nuevoEnvio.error.pesoNegativo');
  }

  const volumen = parseNumero(form.volumen);
  if (form.volumen === '' || Number.isNaN(volumen)) {
    errores.volumen = t('nuevoEnvio.error.volumenVacio');
  } else if (volumen <= 0) {
    errores.volumen = t('nuevoEnvio.error.volumenNegativo');
  }

  const unidades = parseNumero(form.unidades);
  if (form.unidades === '' || Number.isNaN(unidades)) {
    errores.unidades = t('nuevoEnvio.error.unidadesVacio');
  } else if (unidades <= 0) {
    errores.unidades = t('nuevoEnvio.error.unidadesNegativo');
  }

  const valor = parseNumero(form.valor);
  if (form.valor === '' || Number.isNaN(valor)) {
    errores.valor = t('nuevoEnvio.error.valorVacio');
  } else if (valor < 0) {
    errores.valor = t('nuevoEnvio.error.valorNegativo');
  }

  return errores;
}

export default function NewShipmentScreen({ navigation }) {
  const { envio, guardarEnvio } = useShipment();
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);

  const TIPOS_MERCANCIA = [
    { label: t('nuevoEnvio.tipoMercanciaPlaceholder'), value: '' },
    { label: t('nuevoEnvio.tipoMercancia.general'), value: 'general' },
    { label: t('nuevoEnvio.tipoMercancia.perecedero'), value: 'perecedero' },
    { label: t('nuevoEnvio.tipoMercancia.fragil'), value: 'fragil' },
    { label: t('nuevoEnvio.tipoMercancia.electronica'), value: 'electronica' },
    { label: t('nuevoEnvio.tipoMercancia.textil'), value: 'textil' },
    { label: t('nuevoEnvio.tipoMercancia.peligrosa'), value: 'peligrosa' },
    { label: t('nuevoEnvio.tipoMercancia.otro'), value: 'otro' },
  ];

  const MODALIDADES_BASE = [
    { label: t('nuevoEnvio.modalidad.todas'), value: 'todas' },
    { label: t('modalidad.maritima'), value: 'maritima' },
    { label: t('modalidad.aerea'), value: 'aerea' },
    { label: t('modalidad.terrestre'), value: 'terrestre' },
  ];

  const [form, setForm] = useState({
    origen: envio.origenPais
      ? {
          countryCode: envio.origenPais,
          countryName: envio.origenPaisNombre,
          city: envio.origenCiudad,
          lat: envio.origenLat,
          lng: envio.origenLng,
        }
      : null,
    destino: envio.destinoPais
      ? {
          countryCode: envio.destinoPais,
          countryName: envio.destinoPaisNombre,
          city: envio.destinoCiudad,
          lat: envio.destinoLat,
          lng: envio.destinoLng,
        }
      : null,
    tipoMercancia: envio.tipoMercancia || '',
    peso: envio.peso ? String(envio.peso) : '',
    volumen: envio.volumen ? String(envio.volumen) : '',
    unidades: envio.unidades ? String(envio.unidades) : '',
    valor: envio.valor ? String(envio.valor) : '',
    modalidad: envio.modalidad || 'todas',
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [tarifas, setTarifas] = useState(null);

  useEffect(() => {
    obtenerTarifas().then(setTarifas);
  }, []);

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  // En cuanto hay origen y destino, se sabe si terrestre aplica para esa
  // distancia real (sin necesidad de calcular todo lo demás).
  const terrestreDisponible = useMemo(() => {
    if (!form.origen?.countryCode || !form.destino?.countryCode) return true;
    return hayConexionTerrestreEntrePaises(form.origen.countryCode, form.destino.countryCode);
  }, [form.origen?.countryCode, form.destino?.countryCode]);

  // Si ya hay origen, destino y peso, se calcula de una vez cuál sería la
  // mejor opción, para mostrarlo directamente en el selector de modalidad
  // (así el usuario no elige a ciegas: la app ya le dice cuál conviene más).
  const pesoPreview = parseNumero(form.peso);
  const recomendacionPreliminar = useMemo(() => {
    if (!tarifas) return null;
    if (!form.origen?.lat || !form.destino?.lat) return null;
    if (Number.isNaN(pesoPreview) || pesoPreview <= 0) return null;

    const envioPreview = {
      origenPais: form.origen.countryCode,
      origenLat: form.origen.lat,
      origenLng: form.origen.lng,
      destinoPais: form.destino.countryCode,
      destinoLat: form.destino.lat,
      destinoLng: form.destino.lng,
      peso: pesoPreview,
      volumen: parseNumero(form.volumen) || 0,
    };

    const alternativas = compararEnvio(envioPreview, tarifas, t);
    return obtenerRecomendacion(alternativas);
  }, [tarifas, form.origen, form.destino, pesoPreview, form.volumen, t]);

  const modalidades = useMemo(
    () =>
      MODALIDADES_BASE.map((op) => {
        if (op.value === 'todas') return { ...op, enabled: true };

        const noDisponible = op.value === 'terrestre' && !terrestreDisponible;
        const esRecomendada = !noDisponible && recomendacionPreliminar?.key === op.value;

        let label = op.label;
        if (noDisponible) label += ` (${t('nuevoEnvio.modalidad.noDisponible')})`;
        else if (esRecomendada) label += ` — ${t('nuevoEnvio.modalidad.recomendada')}`;

        return { ...op, label, enabled: !noDisponible };
      }),
    [terrestreDisponible, recomendacionPreliminar, t]
  );

  // Si el usuario tenía elegida "Terrestre" y con el nuevo origen/destino
  // deja de estar disponible, se regresa a "Comparar todas" automáticamente.
  useEffect(() => {
    if (form.modalidad === 'terrestre' && !terrestreDisponible) {
      actualizarCampo('modalidad', 'todas');
    }
  }, [terrestreDisponible, form.modalidad]);

  function handleContinuar() {
    const erroresEncontrados = validar(form, t);
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) {
      setErrorGeneral(t('nuevoEnvio.error.general'));
      return;
    }

    setErrorGeneral('');
    guardarEnvio({
      origenPais: form.origen.countryCode,
      origenPaisNombre: form.origen.countryName,
      origenCiudad: form.origen.city,
      origenLat: form.origen.lat,
      origenLng: form.origen.lng,
      destinoPais: form.destino.countryCode,
      destinoPaisNombre: form.destino.countryName,
      destinoCiudad: form.destino.city,
      destinoLat: form.destino.lat,
      destinoLng: form.destino.lng,
      tipoMercancia: form.tipoMercancia,
      peso: parseNumero(form.peso),
      volumen: parseNumero(form.volumen),
      unidades: parseNumero(form.unidades),
      valor: parseNumero(form.valor),
      modalidad: form.modalidad,
    });
    navigation.navigate('Comparador');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>{t('nuevoEnvio.titulo')}</Text>
        <Text style={styles.subtitulo}>{t('nuevoEnvio.subtitulo')}</Text>

        {errorGeneral ? (
          <View style={styles.errorGeneralBox}>
            <Text style={styles.errorGeneralText}>{errorGeneral}</Text>
          </View>
        ) : null}

        <LocationPicker
          label={t('nuevoEnvio.origen')}
          value={form.origen}
          onChange={(v) => actualizarCampo('origen', v)}
          error={errores.origen}
        />

        <LocationPicker
          label={t('nuevoEnvio.destino')}
          value={form.destino}
          onChange={(v) => actualizarCampo('destino', v)}
          error={errores.destino}
        />

        <Text style={styles.label}>{t('nuevoEnvio.tipoMercancia')}</Text>
        <View style={[styles.pickerBox, errores.tipoMercancia && styles.inputError]}>
          <Picker
            selectedValue={form.tipoMercancia}
            onValueChange={(v) => actualizarCampo('tipoMercancia', v)}
          >
            {TIPOS_MERCANCIA.map((op) => (
              <Picker.Item key={op.value} label={op.label} value={op.value} />
            ))}
          </Picker>
        </View>
        {errores.tipoMercancia ? <Text style={styles.errorText}>{errores.tipoMercancia}</Text> : null}

        <Campo
          label={t('nuevoEnvio.peso')}
          placeholder={t('nuevoEnvio.ejPeso')}
          value={form.peso}
          onChangeText={(v) => actualizarCampo('peso', v)}
          error={errores.peso}
          keyboardType="numeric"
        />

        <Campo
          label={t('nuevoEnvio.volumen')}
          placeholder={t('nuevoEnvio.ejVolumen')}
          value={form.volumen}
          onChangeText={(v) => actualizarCampo('volumen', v)}
          error={errores.volumen}
          keyboardType="numeric"
        />

        <Campo
          label={t('nuevoEnvio.unidades')}
          placeholder={t('nuevoEnvio.ejUnidades')}
          value={form.unidades}
          onChangeText={(v) => actualizarCampo('unidades', v)}
          error={errores.unidades}
          keyboardType="numeric"
        />

        <Campo
          label={t('nuevoEnvio.valor')}
          placeholder={t('nuevoEnvio.ejValor')}
          value={form.valor}
          onChangeText={(v) => actualizarCampo('valor', v)}
          error={errores.valor}
          keyboardType="numeric"
        />

        <Text style={styles.label}>{t('nuevoEnvio.modalidad')}</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={form.modalidad}
            onValueChange={(v) => actualizarCampo('modalidad', v)}
          >
            {modalidades.map((op) => (
              <Picker.Item key={op.value} label={op.label} value={op.value} enabled={op.enabled} />
            ))}
          </Picker>
        </View>
        {!form.origen?.lat || !form.destino?.lat || Number.isNaN(pesoPreview) || pesoPreview <= 0 ? (
          <Text style={styles.ayudaTexto}>{t('nuevoEnvio.ayudaModalidad')}</Text>
        ) : null}

        <View style={styles.spacer} />
        <PrimaryButton title={t('nuevoEnvio.continuar')} onPress={handleContinuar} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({ label, error, ...props }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  return (
    <View style={styles.campoContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.textMuted}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function crearEstilos(colors) {
  return StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: {
      padding: 20,
      paddingBottom: 40,
    },
    titulo: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.primaryDark,
      marginBottom: 4,
    },
    subtitulo: {
      fontSize: 13,
      color: colors.textMuted,
      marginBottom: 18,
    },
    errorGeneralBox: {
      backgroundColor: colors.dangerLight,
      borderRadius: radius.sm,
      padding: 12,
      marginBottom: 16,
    },
    errorGeneralText: {
      color: colors.danger,
      fontWeight: '600',
      fontSize: 13,
    },
    campoContainer: {
      marginBottom: 14,
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
    },
    inputError: {
      borderColor: colors.danger,
    },
    errorText: {
      color: colors.danger,
      fontSize: 12,
      marginTop: 4,
    },
    pickerBox: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      marginBottom: 14,
      overflow: 'hidden',
    },
    spacer: {
      height: 10,
    },
    ayudaTexto: {
      fontSize: 11,
      color: colors.textMuted,
      fontStyle: 'italic',
      marginTop: -8,
      marginBottom: 14,
    },
  });
}
