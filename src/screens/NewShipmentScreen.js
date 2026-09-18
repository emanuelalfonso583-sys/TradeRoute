import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import PrimaryButton from '../components/PrimaryButton';
import LocationPicker from '../components/LocationPicker';
import { useShipment } from '../context/ShipmentContext';
import { colors, radius } from '../theme/colors';

const TIPOS_MERCANCIA = [
  { label: 'Selecciona un tipo...', value: '' },
  { label: 'General / Carga seca', value: 'general' },
  { label: 'Perecedero', value: 'perecedero' },
  { label: 'Frágil', value: 'fragil' },
  { label: 'Electrónica', value: 'electronica' },
  { label: 'Textil', value: 'textil' },
  { label: 'Mercancía peligrosa', value: 'peligrosa' },
  { label: 'Otro', value: 'otro' },
];

const MODALIDADES = [
  { label: 'Comparar todas', value: 'todas' },
  { label: 'Marítima', value: 'maritima' },
  { label: 'Aérea', value: 'aerea' },
  { label: 'Terrestre', value: 'terrestre' },
];

function parseNumero(texto) {
  if (typeof texto !== 'string') return NaN;
  return parseFloat(texto.replace(',', '.'));
}

function validar(form) {
  const errores = {};

  if (!form.origen?.city) errores.origen = 'Selecciona el país y la ciudad de origen.';
  if (!form.destino?.city) errores.destino = 'Selecciona el país y la ciudad de destino.';
  if (!form.tipoMercancia) errores.tipoMercancia = 'Selecciona el tipo de mercancía.';

  const peso = parseNumero(form.peso);
  if (form.peso === '' || Number.isNaN(peso)) {
    errores.peso = 'Ingresa el peso total.';
  } else if (peso <= 0) {
    errores.peso = 'El peso debe ser mayor que 0.';
  }

  const volumen = parseNumero(form.volumen);
  if (form.volumen === '' || Number.isNaN(volumen)) {
    errores.volumen = 'Ingresa el volumen total.';
  } else if (volumen <= 0) {
    errores.volumen = 'El volumen debe ser mayor que 0.';
  }

  const unidades = parseNumero(form.unidades);
  if (form.unidades === '' || Number.isNaN(unidades)) {
    errores.unidades = 'Ingresa la cantidad de unidades.';
  } else if (unidades <= 0) {
    errores.unidades = 'La cantidad de unidades debe ser mayor que 0.';
  }

  const valor = parseNumero(form.valor);
  if (form.valor === '' || Number.isNaN(valor)) {
    errores.valor = 'Ingresa el valor de la mercancía.';
  } else if (valor < 0) {
    errores.valor = 'El valor debe ser mayor o igual a 0.';
  }

  return errores;
}

export default function NewShipmentScreen({ navigation }) {
  const { envio, guardarEnvio } = useShipment();
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

  function actualizarCampo(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  function handleContinuar() {
    const erroresEncontrados = validar(form);
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) {
      setErrorGeneral('Revisa los campos marcados: falta información obligatoria.');
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
        <Text style={styles.titulo}>Nuevo Envío</Text>
        <Text style={styles.subtitulo}>
          Ingresa los datos del envío para comparar las alternativas de transporte.
        </Text>

        {errorGeneral ? (
          <View style={styles.errorGeneralBox}>
            <Text style={styles.errorGeneralText}>{errorGeneral}</Text>
          </View>
        ) : null}

        <LocationPicker
          label="Origen"
          value={form.origen}
          onChange={(v) => actualizarCampo('origen', v)}
          error={errores.origen}
        />

        <LocationPicker
          label="Destino"
          value={form.destino}
          onChange={(v) => actualizarCampo('destino', v)}
          error={errores.destino}
        />

        <Text style={styles.label}>Tipo de mercancía</Text>
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
          label="Peso total (kg)"
          placeholder="Ej: 500"
          value={form.peso}
          onChangeText={(t) => actualizarCampo('peso', t)}
          error={errores.peso}
          keyboardType="numeric"
        />

        <Campo
          label="Volumen (m³)"
          placeholder="Ej: 2.5"
          value={form.volumen}
          onChangeText={(t) => actualizarCampo('volumen', t)}
          error={errores.volumen}
          keyboardType="numeric"
        />

        <Campo
          label="Cantidad de unidades"
          placeholder="Ej: 100"
          value={form.unidades}
          onChangeText={(t) => actualizarCampo('unidades', t)}
          error={errores.unidades}
          keyboardType="numeric"
        />

        <Campo
          label="Valor de la mercancía (USD)"
          placeholder="Ej: 10000"
          value={form.valor}
          onChangeText={(t) => actualizarCampo('valor', t)}
          error={errores.valor}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Modalidad de transporte</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={form.modalidad}
            onValueChange={(v) => actualizarCampo('modalidad', v)}
          >
            {MODALIDADES.map((op) => (
              <Picker.Item key={op.value} label={op.label} value={op.value} />
            ))}
          </Picker>
        </View>

        <View style={styles.spacer} />
        <PrimaryButton title="Continuar" onPress={handleContinuar} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({ label, error, ...props }) {
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

const styles = StyleSheet.create({
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
});
