// Busca en Wikipedia una foto real y una descripción corta de un lugar
// (puerto o aeropuerto) a partir de su nombre. Es gratis, no necesita
// llave/API key, y corre directo desde el teléfono (sin backend propio).
// Intenta primero en español y, si no encuentra nada, en inglés (hay más
// aeropuertos y puertos documentados en la Wikipedia en inglés).
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

  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const paginas = data?.query?.pages;
  if (!paginas) return null;

  const pagina = Object.values(paginas)[0];
  if (!pagina || !pagina.title) return null;

  return {
    titulo: pagina.title,
    imagenUrl: pagina.thumbnail?.source || null,
    extracto: pagina.extract || '',
    urlPagina: `https://${idioma}.wikipedia.org/wiki/${encodeURIComponent(pagina.title.replace(/ /g, '_'))}`,
  };
}

export async function obtenerInfoWiki(nombreLugar) {
  try {
    const resultadoEs = await buscarEnWikipedia('es', nombreLugar);
    if (resultadoEs?.imagenUrl) return resultadoEs;

    const resultadoEn = await buscarEnWikipedia('en', nombreLugar);
    if (resultadoEn?.imagenUrl) return resultadoEn;

    return resultadoEs || resultadoEn || null;
  } catch {
    return null;
  }
}
