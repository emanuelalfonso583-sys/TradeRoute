// Token público de Mapbox: se lee desde una variable de entorno (archivo
// .env, NO subido a git) en vez de estar escrito directo en el código.
// Los tokens "pk." de Mapbox están hechos para vivir en el cliente (el
// control de uso/abuso lo hace Mapbox por dominio/cuota), pero de todas
// formas GitHub los bloquea al detectarlos en un commit, así que se
// mantienen fuera del control de versiones.
export const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || 'REEMPLAZAR_CON_TU_TOKEN_PK';
