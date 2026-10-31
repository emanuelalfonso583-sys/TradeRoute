import React, { useMemo, useState } from 'react';
import {
  View,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './AppText';
import TextInput from './AppTextInput';
import { COUNTRIES } from '../data/countries';
import { CITIES_BY_COUNTRY } from '../data/cities';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import { radius } from '../theme/colors';

function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function ListaBusqueda({ visible, titulo, datos, obtenerTexto, onSeleccionar, onCerrar }) {
  const { t } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [busqueda, setBusqueda] = useState('');

  const filtrados = useMemo(() => {
    if (!busqueda.trim()) return datos;
    const q = normalizar(busqueda);
    return datos.filter((item) => normalizar(obtenerTexto(item)).includes(q));
  }, [busqueda, datos, obtenerTexto]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCerrar}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitulo}>{titulo}</Text>
          <Pressable onPress={onCerrar} hitSlop={12}>
            <Ionicons name="close" size={26} color={colors.primaryDark} />
          </Pressable>
        </View>

        <View style={styles.buscadorBox}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.buscadorInput}
            placeholder={t('ubicacion.buscar')}
            placeholderTextColor={colors.textMuted}
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        <FlatList
          data={filtrados}
          keyExtractor={(item, index) => obtenerTexto(item) + index}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.filaItem, pressed && styles.filaItemPresionada]}
              onPress={() => {
                setBusqueda('');
                onSeleccionar(item);
              }}
            >
              <Text style={styles.filaTexto}>{obtenerTexto(item)}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.sinResultados}>{t('ubicacion.sinResultados')}</Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

function nombrePais(pais, idioma) {
  if (idioma === 'en') return pais.nameEn || pais.name;
  if (idioma === 'pt') return pais.namePt || pais.name;
  return pais.name;
}

// País y ciudad son dos campos independientes: cada uno abre su propia
// lista directamente. Así, si el usuario solo quiere corregir la ciudad,
// no tiene que volver a elegir el país (y viceversa).
export default function LocationPicker({ label, value, onChange, error }) {
  const { t, idioma } = useLanguage();
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [modalPaisVisible, setModalPaisVisible] = useState(false);
  const [modalCiudadVisible, setModalCiudadVisible] = useState(false);

  const ciudadesDelPais = value?.countryCode ? CITIES_BY_COUNTRY[value.countryCode] || [] : [];
  const hayPais = !!value?.countryCode;

  function seleccionarPais(pais) {
    setModalPaisVisible(false);
    // Si cambia a un país distinto, la ciudad anterior ya no aplica y se
    // abre de una vez el selector de ciudad para completar el dato.
    const esMismoPais = value?.countryCode === pais.code;
    onChange({
      countryCode: pais.code,
      countryName: nombrePais(pais, idioma),
      city: esMismoPais ? value.city : '',
      lat: esMismoPais ? value.lat : undefined,
      lng: esMismoPais ? value.lng : undefined,
    });
    if (!esMismoPais) setModalCiudadVisible(true);
  }

  function seleccionarCiudad(ciudad) {
    setModalCiudadVisible(false);
    onChange({ ...value, city: ciudad.name, lat: ciudad.lat, lng: ciudad.lng });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.filaCampos}>
        <View style={styles.campoMitad}>
          <Text style={styles.subLabel}>{t('ubicacion.pais')}</Text>
          <Pressable
            style={[styles.campo, error && !value?.countryName && styles.campoError]}
            onPress={() => setModalPaisVisible(true)}
          >
            <Text style={[styles.campoTexto, !value?.countryName && styles.campoPlaceholder]} numberOfLines={1}>
              {value?.countryName || t('ubicacion.seleccionaPais')}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.campoMitad}>
          <Text style={styles.subLabel}>{t('ubicacion.ciudad')}</Text>
          <Pressable
            style={[
              styles.campo,
              !hayPais && styles.campoDeshabilitado,
              error && hayPais && !value?.city && styles.campoError,
            ]}
            disabled={!hayPais}
            onPress={() => setModalCiudadVisible(true)}
          >
            <Text style={[styles.campoTexto, !value?.city && styles.campoPlaceholder]} numberOfLines={1}>
              {value?.city || (hayPais ? t('ubicacion.seleccionaCiudadCorta') : t('ubicacion.primeroPais'))}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
          </Pressable>
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <ListaBusqueda
        visible={modalPaisVisible}
        titulo={t('ubicacion.seleccionaPais')}
        datos={COUNTRIES}
        obtenerTexto={(pais) => nombrePais(pais, idioma)}
        onSeleccionar={seleccionarPais}
        onCerrar={() => setModalPaisVisible(false)}
      />

      <ListaBusqueda
        visible={modalCiudadVisible}
        titulo={t('ubicacion.cuidadEn', { pais: value?.countryName || '' })}
        datos={ciudadesDelPais}
        obtenerTexto={(ciudad) => ciudad.name}
        onSeleccionar={seleccionarCiudad}
        onCerrar={() => setModalCiudadVisible(false)}
      />
    </View>
  );
}

function crearEstilos(colors) {
  return StyleSheet.create({
    container: {
      marginBottom: 14,
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primaryDark,
      marginBottom: 6,
    },
    filaCampos: {
      flexDirection: 'row',
      gap: 10,
    },
    campoMitad: {
      flex: 1,
    },
    subLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
      marginBottom: 4,
    },
    campo: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    campoDeshabilitado: {
      opacity: 0.5,
    },
    campoError: {
      borderColor: colors.danger,
    },
    campoTexto: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    campoPlaceholder: {
      color: colors.textMuted,
    },
    errorText: {
      color: colors.danger,
      fontSize: 12,
      marginTop: 4,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    modalTitulo: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.primaryDark,
    },
    buscadorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.sm,
      marginHorizontal: 20,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 8,
      gap: 8,
    },
    buscadorInput: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
    },
    filaItem: {
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filaItemPresionada: {
      backgroundColor: colors.surface,
    },
    filaTexto: {
      fontSize: 15,
      color: colors.text,
    },
    sinResultados: {
      textAlign: 'center',
      color: colors.textMuted,
      marginTop: 30,
      fontSize: 14,
    },
  });
}
