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
