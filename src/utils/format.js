// Formatea un monto en dólares de forma inequívoca: coma para miles, punto
// para decimales (convención en inglés/USD), para que "525.00" nunca se
// pueda confundir con "525.000" (como se leería el punto en español).
export function formatearUsd(valor) {
  const numero = Number(valor) || 0;
  return numero.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// La ciudad de destino es opcional (el usuario puede ingresar solo el país),
// así que "ciudad, país" se reduce a solo "país" cuando no hay ciudad, en
// vez de dejar una coma colgando ("→ , Panamá").
export function formatearLugar(ciudad, pais) {
  return ciudad ? `${ciudad}, ${pais}` : pais;
}
