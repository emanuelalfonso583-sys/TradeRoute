import React, { useMemo } from 'react';
import RouteMap from './RouteMap';
import { puertosCercanos, aeropuertosCercanos } from '../utils/nearestHubs';
import { calcularRutaMaritima } from '../utils/seaRoute';

// Siempre muestra la ruta REAL de la modalidad (puertos + red de navegación
// real para marítima, aeropuertos para aérea, carreteras reales para
// terrestre) en vez de una línea recta genérica entre las dos ciudades: esa
// línea recta no sigue canales ni estrechos y puede verse como si el barco
// "diera la vuelta al mundo" cuando en realidad la ruta real es otra.
export default function ModalidadRouteMap({ modalidadKey, envio, alto = 260 }) {
  const puertoOrigen = useMemo(
    () => puertosCercanos(envio.origenLat, envio.origenLng, 1)[0],
    [envio.origenLat, envio.origenLng]
  );
  const puertoDestino = useMemo(
    () => puertosCercanos(envio.destinoLat, envio.destinoLng, 1)[0],
    [envio.destinoLat, envio.destinoLng]
  );
  const aeropuertoOrigen = useMemo(
    () => aeropuertosCercanos(envio.origenLat, envio.origenLng, 1)[0],
    [envio.origenLat, envio.origenLng]
  );
  const aeropuertoDestino = useMemo(
    () => aeropuertosCercanos(envio.destinoLat, envio.destinoLng, 1)[0],
    [envio.destinoLat, envio.destinoLng]
  );

  const rutaMaritima = useMemo(() => {
    if (modalidadKey !== 'maritima' || !puertoOrigen || !puertoDestino) return null;
    return calcularRutaMaritima(puertoOrigen, puertoDestino);
  }, [modalidadKey, puertoOrigen?.code, puertoDestino?.code]);

  if (modalidadKey === 'maritima' && puertoOrigen && puertoDestino) {
    return (
      <RouteMap
        origen={{ lat: puertoOrigen.lat, lng: puertoOrigen.lng, label: puertoOrigen.name }}
        destino={{ lat: puertoDestino.lat, lng: puertoDestino.lng, label: puertoDestino.name }}
        rutaCoordenadas={rutaMaritima?.coordenadas}
        modoRuta={rutaMaritima ? 'coordenadas' : 'linea'}
        alto={alto}
      />
    );
  }

  if (modalidadKey === 'aerea' && aeropuertoOrigen && aeropuertoDestino) {
    return (
      <RouteMap
        origen={{ lat: aeropuertoOrigen.lat, lng: aeropuertoOrigen.lng, label: aeropuertoOrigen.name }}
        destino={{ lat: aeropuertoDestino.lat, lng: aeropuertoDestino.lng, label: aeropuertoDestino.name }}
        alto={alto}
      />
    );
  }

  if (modalidadKey === 'terrestre' && envio.origenLat && envio.destinoLat) {
    return (
      <RouteMap
        origen={{ lat: envio.origenLat, lng: envio.origenLng, label: envio.origenCiudad }}
        destino={{ lat: envio.destinoLat, lng: envio.destinoLng, label: envio.destinoCiudad }}
        modoRuta="carretera"
        alto={alto}
      />
    );
  }

  return null;
}
