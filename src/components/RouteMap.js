import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import Text from './AppText';
import { MAPBOX_TOKEN } from '../mapbox/config';
import { colors, radius } from '../theme/colors';

// Genera la página HTML con un mapa real de Mapbox GL JS: marca origen y
// destino, traza la ruta entre ambos puntos y ajusta el zoom para que se
// vean bien. Es un mapa interactivo de verdad (se puede hacer zoom,
// arrastrar y rotar), no una imagen estática.
//
// Tres formas de trazar la ruta, según `modoRuta`:
//   - 'linea' (por defecto): línea recta entre origen y destino.
//   - 'coordenadas': usa el arreglo real `rutaCoordenadas` ya calculado
//     (por ejemplo la ruta marítima real, calculada con searoute-js).
//   - 'carretera': pide la ruta real por carretera a la API de Direcciones
//     de Mapbox (el mismo proveedor y token del mapa) y dibuja exactamente
//     por dónde pasan las carreteras.
function generarHtmlMapa({ origen, destino, rutaCoordenadas, modoRuta = 'linea' }) {
  const puntoOrigen = JSON.stringify([origen.lng, origen.lat]);
  const puntoDestino = JSON.stringify([destino.lng, destino.lat]);
  const lineaRecta = JSON.stringify([
    [origen.lng, origen.lat],
    [destino.lng, destino.lat],
  ]);
  const coordenadasReales = rutaCoordenadas ? JSON.stringify(rutaCoordenadas) : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <link href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css" rel="stylesheet" />
  <script src="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.js"></script>
  <style>
    body { margin: 0; padding: 0; }
    #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    mapboxgl.accessToken = '${MAPBOX_TOKEN}';
    const origenCoord = ${puntoOrigen};
    const destinoCoord = ${puntoDestino};
    const lineaRecta = ${lineaRecta};
    const coordenadasReales = ${coordenadasReales};
    const modoRuta = '${modoRuta}';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: origenCoord,
    });

    map.addControl(new mapboxgl.NavigationControl());

    new mapboxgl.Marker({ color: '#0A2A66' })
      .setLngLat(origenCoord)
      .setPopup(new mapboxgl.Popup().setText('${origen.label.replace(/'/g, "\\'")}'))
      .addTo(map);

    new mapboxgl.Marker({ color: '#16A34A' })
      .setLngLat(destinoCoord)
      .setPopup(new mapboxgl.Popup().setText('${destino.label.replace(/'/g, "\\'")}'))
      .addTo(map);

    function dibujarRuta(coords) {
      map.addSource('ruta', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: coords },
        },
      });
      map.addLayer({
        id: 'ruta-linea',
        type: 'line',
        source: 'ruta',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: modoRuta === 'linea'
          ? { 'line-color': '#2563EB', 'line-width': 3, 'line-dasharray': [2, 1.5] }
          : { 'line-color': '#2563EB', 'line-width': 4 },
      });

      const bounds = new mapboxgl.LngLatBounds(coords[0], coords[0]);
      coords.forEach((c) => bounds.extend(c));
      map.fitBounds(bounds, { padding: 60, duration: 0 });
    }

    map.on('load', () => {
      if (modoRuta === 'coordenadas' && coordenadasReales) {
        dibujarRuta(coordenadasReales);
      } else if (modoRuta === 'carretera') {
        const url = 'https://api.mapbox.com/directions/v5/mapbox/driving/' +
          origenCoord[0] + ',' + origenCoord[1] + ';' + destinoCoord[0] + ',' + destinoCoord[1] +
          '?geometries=geojson&overview=full&access_token=' + mapboxgl.accessToken;
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            const ruta = data.routes && data.routes[0];
            if (ruta && ruta.geometry && ruta.geometry.coordinates.length > 1) {
              dibujarRuta(ruta.geometry.coordinates);
            } else {
              dibujarRuta(lineaRecta);
            }
          })
          .catch(() => dibujarRuta(lineaRecta));
      } else {
        dibujarRuta(lineaRecta);
      }
    });
  </script>
</body>
</html>
`;
}

export default function RouteMap({ origen, destino, alto = 300, rutaCoordenadas, modoRuta }) {
  if (MAPBOX_TOKEN.startsWith('REEMPLAZAR')) {
    return (
      <View style={[styles.container, { height: alto }, styles.avisoBox]}>
        <Text style={styles.avisoTexto}>
          Falta configurar el token de Mapbox (src/mapbox/config.js) para mostrar el mapa.
        </Text>
      </View>
    );
  }

  if (!origen?.lat || !destino?.lat) {
    return null;
  }

  const modoResuelto = modoRuta || (rutaCoordenadas ? 'coordenadas' : 'linea');
  const html = generarHtmlMapa({ origen, destino, rutaCoordenadas, modoRuta: modoResuelto });

  return (
    <View style={[styles.container, { height: alto }]}>
      {Platform.OS === 'web' ? (
        React.createElement('iframe', {
          srcDoc: html,
          style: { border: 0, width: '100%', height: '100%' },
        })
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  webview: {
    flex: 1,
  },
  avisoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    padding: 16,
  },
  avisoTexto: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});
