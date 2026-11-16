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

// Enlaces oficiales verificados, solo para los documentos que de verdad
// tienen una entidad única que los expide (los demás los tramitas
// directamente con tu naviera, aerolínea, transportista o aseguradora,
// así que no tienen un solo sitio "oficial" al cual enlazar).
export const LINK_POR_DOCUMENTO = {
  certificadoFitosanitario: 'https://www.ica.gov.co',
  certificadoOrigen: 'https://www.vuce.gov.co',
  certificadoConformidad: 'https://onac.org.co',
};

export function documentosRequeridos(modalidadKey, tipoMercancia) {
  const docs = [...DOCUMENTOS_BASE];
  const docModalidad = DOCUMENTO_POR_MODALIDAD[modalidadKey];
  if (docModalidad) docs.push(docModalidad);
  const docMercancia = DOCUMENTO_POR_MERCANCIA[tipoMercancia];
  if (docMercancia && !docs.includes(docMercancia)) docs.push(docMercancia);
  return docs;
}
