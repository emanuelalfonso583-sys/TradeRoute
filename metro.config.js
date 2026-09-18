const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// geojson-path-finder (usado por searoute-js para calcular la ruta marítima
// real) hace `require('tinyqueue')` esperando su build CommonJS, pero el
// resolver de Metro elige por defecto el entry point ESM ("module") de
// tinyqueue, lo que rompe `new Queue(...)` en tiempo de ejecución. Se fuerza
// a tinyqueue a resolver siempre a su archivo CommonJS.
const resolverOriginal = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tinyqueue') {
    return context.resolveRequest(context, 'tinyqueue/tinyqueue.js', platform);
  }
  if (resolverOriginal) {
    return resolverOriginal(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
