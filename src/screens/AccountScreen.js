import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../components/AppText';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';
import { obtenerPerfil } from '../firebase/perfil';
import { PALETAS_ACENTO } from '../theme/paletas';
import { FUENTES } from '../theme/fuentes';
import { radius, shadow } from '../theme/colors';

function SeccionDesplegable({ icono, titulo, abierta, onPress, children, acento }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  return (
    <View style={styles.seccion}>
      <Pressable style={styles.seccionHeader} onPress={onPress}>
        <View style={[styles.seccionIconoBox, { backgroundColor: acento + '1A' }]}>
          <Ionicons name={icono} size={18} color={acento} />
        </View>
        <Text style={styles.seccionTitulo}>{titulo}</Text>
        <Ionicons
          name={abierta ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.textMuted}
        />
      </Pressable>
      {abierta && <View style={styles.seccionContenido}>{children}</View>}
    </View>
  );
}

function Fila({ etiqueta, valor }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  return (
    <View style={styles.fila}>
      <Text style={styles.filaEtiqueta}>{etiqueta}</Text>
      <Text style={styles.filaValor}>{valor}</Text>
    </View>
  );
}

export default function AccountScreen() {
  const { usuario, cerrarSesion } = useAuth();
  const { t, idioma, setIdioma } = useLanguage();
  const { colors, acento, claveAcento, setClaveAcento, claveFuente, setClaveFuente } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const [perfil, setPerfil] = useState(null);
  const [seccionAbierta, setSeccionAbierta] = useState(null);

  useEffect(() => {
    if (usuario?.uid) obtenerPerfil(usuario.uid).then(setPerfil);
  }, [usuario?.uid]);

  function alternarSeccion(clave) {
    setSeccionAbierta((actual) => (actual === clave ? null : clave));
  }

  const sinDato = t('cuenta.info.sinDato');
  const fechaCreacion = usuario?.metadata?.creationTime
    ? new Date(usuario.metadata.creationTime).toLocaleDateString(idioma, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : sinDato;
  const ultimoIngreso = usuario?.metadata?.lastSignInTime
    ? new Date(usuario.metadata.lastSignInTime).toLocaleDateString(idioma, {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }) +
      ' · ' +
      new Date(usuario.metadata.lastSignInTime).toLocaleTimeString(idioma, {
        hour: '2-digit',
        minute: '2-digit',
      })
    : sinDato;

  const TIPO_DOCUMENTO_LABEL = {
    cc: t('registro.tipoDocumento.cc'),
    ce: t('registro.tipoDocumento.ce'),
    ti: t('registro.tipoDocumento.ti'),
    pasaporte: t('registro.tipoDocumento.pasaporte'),
    otro: t('registro.tipoDocumento.otro'),
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.perfilBox}>
          <View style={[styles.avatar, { backgroundColor: acento }]}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.nombre}>{usuario?.displayName || t('cuenta.usuarioDefault')}</Text>
          <Text style={styles.correo}>{usuario?.email}</Text>
        </View>

        <SeccionDesplegable
          icono="information-circle-outline"
          titulo={t('cuenta.seccion.info')}
          abierta={seccionAbierta === 'info'}
          onPress={() => alternarSeccion('info')}
          acento={acento}
        >
          <Fila etiqueta={t('cuenta.info.correo')} valor={usuario?.email || sinDato} />
          <Fila
            etiqueta={t('cuenta.info.tipoDocumento')}
            valor={perfil?.tipoDocumento ? TIPO_DOCUMENTO_LABEL[perfil.tipoDocumento] || perfil.tipoDocumento : sinDato}
          />
          <Fila etiqueta={t('cuenta.info.numeroDocumento')} valor={perfil?.numeroDocumento || sinDato} />
          <Fila etiqueta={t('cuenta.info.telefono')} valor={perfil?.telefono || sinDato} />
          <Fila etiqueta={t('cuenta.info.creadaEl')} valor={fechaCreacion} />
          <Fila etiqueta={t('cuenta.info.ultimoIngreso')} valor={ultimoIngreso} />
        </SeccionDesplegable>

        <SeccionDesplegable
          icono="settings-outline"
          titulo={t('cuenta.seccion.configuracion')}
          abierta={seccionAbierta === 'configuracion'}
          onPress={() => alternarSeccion('configuracion')}
          acento={acento}
        >
          <Text style={styles.campoEtiqueta}>{t('cuenta.config.idioma')}</Text>
          <Text style={styles.campoDescripcion}>{t('cuenta.config.idiomaDescripcion')}</Text>
          <View style={styles.opcionesFila}>
            <OpcionChip label="Español" activo={idioma === 'es'} acento={acento} onPress={() => setIdioma('es')} />
            <OpcionChip label="English" activo={idioma === 'en'} acento={acento} onPress={() => setIdioma('en')} />
          </View>
        </SeccionDesplegable>

        <SeccionDesplegable
          icono="color-palette-outline"
          titulo={t('cuenta.seccion.personalizacion')}
          abierta={seccionAbierta === 'personalizacion'}
          onPress={() => alternarSeccion('personalizacion')}
          acento={acento}
        >
          <Text style={styles.campoEtiqueta}>{t('cuenta.personalizacion.color')}</Text>
          <Text style={styles.campoDescripcion}>{t('cuenta.personalizacion.colorDescripcion')}</Text>
          <View style={styles.coloresFila}>
            {PALETAS_ACENTO.map((paleta) => (
              <Pressable
                key={paleta.key}
                onPress={() => setClaveAcento(paleta.key)}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: paleta.color },
                  claveAcento === paleta.key && styles.colorSwatchActivo,
                ]}
              >
                {claveAcento === paleta.key && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </Pressable>
            ))}
          </View>

          <View style={styles.espacioMedio} />

          <Text style={styles.campoEtiqueta}>{t('cuenta.personalizacion.fuente')}</Text>
          <Text style={styles.campoDescripcion}>{t('cuenta.personalizacion.fuenteDescripcion')}</Text>
          <View style={styles.opcionesFila}>
            {FUENTES.map((fuente) => (
              <OpcionChip
                key={fuente.key}
                label={t(`fuente.${fuente.key}`)}
                activo={claveFuente === fuente.key}
                acento={acento}
                onPress={() => setClaveFuente(fuente.key)}
              />
            ))}
          </View>
        </SeccionDesplegable>

        <SeccionDesplegable
          icono="extension-puzzle-outline"
          titulo={t('cuenta.seccion.complementos')}
          abierta={seccionAbierta === 'complementos'}
          onPress={() => alternarSeccion('complementos')}
          acento={acento}
        >
          <Text style={styles.campoDescripcion}>{t('cuenta.complementos.descripcion')}</Text>
          <View style={styles.espacioChico} />
          <ComplementoFila nombre="Firebase (Google)" descripcion={t('cuenta.complementos.firebase')} />
          <ComplementoFila nombre="Mapbox" descripcion={t('cuenta.complementos.mapbox')} />
          <ComplementoFila nombre="Wikipedia" descripcion={t('cuenta.complementos.wikipedia')} />
          <ComplementoFila nombre="UN/LOCODE (UNECE)" descripcion={t('cuenta.complementos.unlocode')} />
          <ComplementoFila nombre="OurAirports" descripcion={t('cuenta.complementos.ourairports')} />
          <ComplementoFila nombre="searoute-js (Eurostat)" descripcion={t('cuenta.complementos.searoute')} />
          <ComplementoFila nombre="world-countries" descripcion={t('cuenta.complementos.worldcountries')} />
        </SeccionDesplegable>

        <SeccionDesplegable
          icono="shield-checkmark-outline"
          titulo={t('cuenta.seccion.privacidad')}
          abierta={seccionAbierta === 'privacidad'}
          onPress={() => alternarSeccion('privacidad')}
          acento={acento}
        >
          <PoliticaPrivacidad />
        </SeccionDesplegable>

        <View style={styles.espacioGrande} />
        <PrimaryButton title={t('cuenta.cerrarSesion')} onPress={cerrarSesion} variant="outline" />
      </ScrollView>
    </SafeAreaView>
  );
}

function OpcionChip({ label, activo, acento, onPress }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        activo && { backgroundColor: acento, borderColor: acento },
      ]}
    >
      <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>{label}</Text>
    </Pressable>
  );
}

function ComplementoFila({ nombre, descripcion }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  return (
    <View style={styles.complementoFila}>
      <Text style={styles.complementoNombre}>{nombre}</Text>
      <Text style={styles.complementoDescripcion}>{descripcion}</Text>
    </View>
  );
}

function PoliticaPrivacidad() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => crearEstilos(colors), [colors]);
  const { t } = useLanguage();
  return (
    <View>
      <Text style={styles.privacidadFecha}>{t('privacidad.fecha')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.intro')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.recopilamos')}</Text>
      <Text style={styles.privacidadParrafo}>
        <Text style={styles.privacidadNegrita}>{t('privacidad.negrita.registrarte')}</Text>
        {t('privacidad.parrafo.registrarte')}
      </Text>
      <Text style={styles.privacidadParrafo}>
        <Text style={styles.privacidadNegrita}>{t('privacidad.negrita.calcularEnvio')}</Text>
        {t('privacidad.parrafo.calcularEnvio')}
      </Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.noRecopilamos')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.paraQueUsamos')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.usos')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.noPublicidad')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.dondeAlmacena')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.dondeAlmacena')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.terceros')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.terceros1')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.terceros2')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.derechos')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.derechos')}</Text>

      <Text style={styles.privacidadSubtitulo}>{t('privacidad.subtitulo.cambios')}</Text>
      <Text style={styles.privacidadParrafo}>{t('privacidad.parrafo.cambios')}</Text>
    </View>
  );
}

function crearEstilos(colors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    container: {
      padding: 20,
      paddingBottom: 40,
    },
    perfilBox: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatar: {
      width: 76,
      height: 76,
      borderRadius: radius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    nombre: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.primaryDark,
    },
    correo: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
    },
    seccion: {
      backgroundColor: colors.background,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      overflow: 'hidden',
      ...shadow.card,
    },
    seccionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
    },
    seccionIconoBox: {
      width: 34,
      height: 34,
      borderRadius: radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    seccionTitulo: {
      flex: 1,
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    seccionContenido: {
      paddingHorizontal: 14,
      paddingBottom: 16,
    },
    fila: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    filaEtiqueta: {
      fontSize: 12,
      color: colors.textMuted,
      flex: 1,
    },
    filaValor: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '600',
      flex: 1,
      textAlign: 'right',
    },
    campoEtiqueta: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primaryDark,
      marginTop: 4,
    },
    campoDescripcion: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
      marginBottom: 10,
      lineHeight: 16,
    },
    opcionesFila: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radius.sm,
      paddingHorizontal: 14,
      paddingVertical: 8,
    },
    chipTexto: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
    },
    chipTextoActivo: {
      color: '#FFFFFF',
    },
    coloresFila: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    colorSwatch: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    colorSwatchActivo: {
      borderColor: colors.text,
    },
    espacioMedio: {
      height: 16,
    },
    espacioChico: {
      height: 6,
    },
    espacioGrande: {
      height: 12,
    },
    complementoFila: {
      paddingVertical: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    complementoNombre: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    complementoDescripcion: {
      fontSize: 12,
      color: colors.textMuted,
      marginTop: 2,
      lineHeight: 16,
    },
    privacidadFecha: {
      fontSize: 11,
      color: colors.textMuted,
      marginBottom: 8,
    },
    privacidadSubtitulo: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primaryDark,
      marginTop: 12,
      marginBottom: 4,
    },
    privacidadParrafo: {
      fontSize: 12.5,
      color: colors.text,
      lineHeight: 18,
      marginBottom: 4,
    },
    privacidadNegrita: {
      fontWeight: '700',
    },
  });
}
