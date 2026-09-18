import { PORTS } from '../data/ports';
import { AIRPORTS } from '../data/airports';
import { distanciaKm } from './geo';

// Ordena una lista de puertos/aeropuertos reales por cercanía (línea recta)
// a un punto dado, y marca el más cercano como la opción recomendada.
function masCercanos(lista, lat, lng, cantidad) {
  if (typeof lat !== 'number' || typeof lng !== 'number') return [];

  return lista
    .map((item) => ({ ...item, distanciaCiudadKm: Math.round(distanciaKm(lat, lng, item.lat, item.lng)) }))
    .sort((a, b) => a.distanciaCiudadKm - b.distanciaCiudadKm)
    .slice(0, cantidad)
    .map((item, index) => ({ ...item, recomendado: index === 0 }));
}

export function puertosCercanos(lat, lng, cantidad = 3) {
  return masCercanos(PORTS, lat, lng, cantidad);
}

export function aeropuertosCercanos(lat, lng, cantidad = 3) {
  return masCercanos(AIRPORTS, lat, lng, cantidad);
}
