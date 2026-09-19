// Busca en Wikipedia una foto real y una descripción corta de un lugar
// (puerto o aeropuerto) a partir de su nombre. Es gratis, no necesita
// llave/API key, y corre directo desde el teléfono (sin backend propio).

const PALABRAS_GENERICAS = new Set([
  'airport', 'international', 'aeropuerto', 'internacional', 'puerto', 'port',
  'de', 'del', 'la', 'el', 'los', 'las', 'y', 'of', 'the',
]);

function normalizar(texto) {
  return (texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function palabrasSignificativas(texto) {
  return normalizar(texto)
    .split(/[^a-z0-9]+/)
    .filter((palabra) => palabra.length > 2 && !PALABRAS_GENERICAS.has(palabra));
}

// Evita mostrar la foto/info de un lugar equivocado: exige que el
// resultado de Wikipedia comparta al menos una palabra clave real con el
// nombre que se buscó (p. ej. "Cuatro" y "Vientos", no solo "Airport").
// La comparación es en ambos sentidos porque un idioma a veces agrega o
// quita una terminación (p. ej. "Antwerp" / "Antwerpen").
function coincideDeVerdad(nombreBuscado, tituloEncontrado) {
  const claves = palabrasSignificativas(nombreBuscado);
  if (claves.length === 0) return true;
  const palabrasTitulo = palabrasSignificativas(tituloEncontrado);
  return claves.some((palabra) =>
    palabrasTitulo.some((palabraTitulo) => palabraTitulo.includes(palabra) || palabra.includes(palabraTitulo))
  );
}

async function buscarEnWikipedia(idioma, consulta) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: consulta,
    gsrlimit: '1',
    prop: 'pageimages|extracts',
    piprop: 'thumbnail',
    pithumbsize: '640',
    exintro: '1',
    explaintext: '1',
    exchars: '400',
    format: 'json',
    origin: '*',
  });
  const url = `https://${idioma}.wikipedia.org/w/api.php?${params.toString()}`;

  // Wikipedia exige identificar quién hace el pedido (User-Agent); sin esto,
  // pedidos desde una app compilada (no un navegador) pueden ser rechazados.
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'TradeRoute-App/1.0 (proyecto academico Comercio Internacional)',
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const paginas = data?.query?.pages;
  if (!paginas) return null;

  const pagina = Object.values(paginas)[0];
  if (!pagina || !pagina.title) return null;
  if (!coincideDeVerdad(consulta, pagina.title)) return null;

  return {
    titulo: pagina.title,
    imagenUrl: pagina.thumbnail?.source || null,
    extracto: pagina.extract || '',
    urlPagina: `https://${idioma}.wikipedia.org/wiki/${encodeURIComponent(pagina.title.replace(/ /g, '_'))}`,
  };
}

// Prueba varias consultas en orden hasta encontrar una coincidencia real
// con foto; si ninguna trae foto, se queda con la primera coincidencia real
// aunque no tenga foto (mejor mostrar texto que nada).
export async function obtenerInfoWiki(consultas) {
  const intentos = Array.isArray(consultas) ? consultas : [consultas];
  let mejorSinFoto = null;

  for (const { idioma, texto } of intentos) {
    try {
      const resultado = await buscarEnWikipedia(idioma, texto);
      if (resultado?.imagenUrl) return resultado;
      if (resultado && !mejorSinFoto) mejorSinFoto = resultado;
    } catch {
      // sigue con el siguiente intento
    }
  }

  return mejorSinFoto;
}
