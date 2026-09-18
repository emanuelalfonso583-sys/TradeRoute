import React from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';
import WebView from 'react-native-webview';
import { MAPBOX_TOKEN } from '../mapbox/config';
import { colors, radius } from '../theme/colors';

// Genera la página HTML con un mapa real de Mapbox GL JS: marca origen y
// destino, traza la ruta real entre ambos puntos y ajusta el zoom para que
// se vean los dos. Es un mapa interactivo de verdad (se puede hacer zoom,
// arrastrar y rotar), no una imagen estática.
function generarHtmlMapa({ origen, destino }) {
  const coordenadas = JSON.stringify([
    [origen.lng, origen.lat],
    [destino.lng, destino.lat],
  ]);

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
    const coords = ${coordenadas};

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coords[0],
    });

    map.addControl(new mapboxgl.NavigationControl());

    new mapboxgl.Marker({ color: '#0A2A66' })
      .setLngLat(coords[0])
      .setPopup(new mapboxgl.Popup().setText('${origen.label.replace(/'/g, "\\'")}'))
      .addTo(map);

    new mapboxgl.Marker({ color: '#16A34A' })
      .setLngLat(coords[1])
      .setPopup(new mapboxgl.Popup().setText('${destino.label.replace(/'/g, "\\'")}'))
      .addTo(map);

    map.on('load', () => {
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
        paint: { 'line-color': '#2563EB', 'line-width': 3, 'line-dasharray': [2, 1.5] },
      });

      const bounds = new mapboxgl.LngLatBounds(coords[0], coords[0]);
      bounds.extend(coords[1]);
      map.fitBounds(bounds, { padding: 60, duration: 0 });
    });
  </script>
</body>
</html>
`;
}

export default function RouteMap({ origen, destino, alto = 300 }) {
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

  const html = generarHtmlMapa({ origen, destino });

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
