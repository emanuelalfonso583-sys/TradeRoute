import React, { createContext, useContext, useState, useMemo } from 'react';

const ShipmentContext = createContext(null);

const ENVIO_VACIO = {
  origenPais: '',
  origenPaisNombre: '',
  origenCiudad: '',
  destinoPais: '',
  destinoPaisNombre: '',
  destinoCiudad: '',
  tipoMercancia: '',
  peso: '',
  volumen: '',
  unidades: '',
  valor: '',
  modalidad: 'todas',
};

export function ShipmentProvider({ children }) {
  const [envio, setEnvio] = useState(ENVIO_VACIO);

  const value = useMemo(
    () => ({
      envio,
      guardarEnvio: (datos) => setEnvio(datos),
      reiniciarEnvio: () => setEnvio(ENVIO_VACIO),
    }),
    [envio]
  );

  return <ShipmentContext.Provider value={value}>{children}</ShipmentContext.Provider>;
}

export function useShipment() {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipment debe usarse dentro de un ShipmentProvider');
  }
  return context;
}
