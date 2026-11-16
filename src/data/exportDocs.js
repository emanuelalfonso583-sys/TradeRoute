// Documentos y requisitos reales de comercio exterior para un envío, según
// la modalidad de transporte y el tipo de mercancía. Esto es justo lo que
// una calculadora de costos no puede darte: no basta con saber el precio
// del flete, hay que saber qué papeles se necesitan para poder embarcar.
export const DOCUMENTOS_BASE = ['facturaComercial', 'listaEmpaque', 'seguroCarga'];

export const DOCUMENTO_POR_MODALIDAD = {
  maritima: 'conocimientoEmbarque',
  aerea: 'guiaAerea',
  terrestre: 'cartaPorte',
};

export const DOCUMENTO_POR_MERCANCIA = {
  perecedero: 'certificadoFitosanitario',
  textil: 'certificadoOrigen',
  electronica: 'certificadoConformidad',
  peligrosa: 'declaracionMercanciaPeligrosa',
};

export function documentosRequeridos(modalidadKey, tipoMercancia) {
  const docs = [...DOCUMENTOS_BASE];
  const docModalidad = DOCUMENTO_POR_MODALIDAD[modalidadKey];
  if (docModalidad) docs.push(docModalidad);
  const docMercancia = DOCUMENTO_POR_MERCANCIA[tipoMercancia];
  if (docMercancia && !docs.includes(docMercancia)) docs.push(docMercancia);
  return docs;
}
