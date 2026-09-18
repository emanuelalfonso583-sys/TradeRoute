import { point } from '@turf/helpers';
import searoute from 'searoute-js';

// Calcula la ruta marítima real entre dos puertos: no es una línea recta,
// es el camino que de verdad seguiría un barco sobre la red de rutas
// marítimas reales (estrechos, canales como Suez o Panamá, etc.), usando
// la red de navegación de Eurostat (searoute-js). Corre localmente en el
// teléfono, sin necesidad de conexión a un servicio pago.
export function calcularRutaMaritima(puertoOrigen, puertoDestino) {
  if (!puertoOrigen?.lat || !puertoDestino?.lat) return null;

  try {
    const linea = searoute(
      point([puertoOrigen.lng, puertoOrigen.lat]),
      point([puertoDestino.lng, puertoDestino.lat]),
      'kilometers'
    );
    if (!linea) return null;

    return {
      coordenadas: linea.geometry.coordinates,
      distanciaKm: Math.round(linea.properties.length),
    };
  } catch {
    return null;
  }
}
