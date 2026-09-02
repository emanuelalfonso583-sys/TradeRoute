# TradeRoute — MVP (React Native + Expo)

Comparador de rutas logísticas internacionales. Proyecto académico de Comercio
Internacional. **App móvil real**, construida con React Native + Expo
(JavaScript). Sin backend, sin base de datos, sin APIs externas: todos los
resultados se calculan en el dispositivo con fórmulas académicas simplificadas.

## Flujo implementado

Inicio → Nuevo Envío → Comparador → Recomendación

Navegación inferior (bottom tabs) con: **Inicio**, **Análisis**, **Reportes**,
**Configuración** (estas 3 últimas son pantallas placeholder "Próximamente",
preparadas para futuras versiones).

## Requisitos previos

- Node.js 18 LTS o superior (recomendado 20 LTS)
- npm (incluido con Node)
- La app **Expo Go** instalada en tu teléfono:
  - Android: Google Play → "Expo Go"
  - iPhone: App Store → "Expo Go"
- Tu computador y tu teléfono conectados a la **misma red Wi-Fi**

No necesitas Android Studio ni Xcode para probar el MVP: con Expo Go en el
teléfono es suficiente.

## Instalación (pasos exactos)

1. Abre una terminal en la carpeta del proyecto:

   ```bash
   cd TradeRoute
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo de Expo:

   ```bash
   npx expo start
   ```

4. Se abrirá una página en el navegador y en la terminal aparecerá un **código QR**.

5. En tu teléfono:
   - **Android**: abre la app **Expo Go** y escanea el código QR desde ahí.
   - **iPhone**: abre la app de **Cámara** nativa, apunta al código QR y toca
     el aviso para abrirlo en Expo Go.

6. La app **TradeRoute** cargará en tu teléfono en unos segundos.

### Si el QR no conecta (red restringida / VPN / eduroam)

```bash
npx expo start --tunnel
```

Esto crea un túnel público y evita problemas de red local (puede tardar un
poco más en cargar).

## Probar el flujo completo

1. En **Inicio**, toca "Comenzar nuevo envío".
2. Completa el formulario, por ejemplo:
   - Origen: `Bogotá, Colombia`
   - Destino: `Madrid, España`
   - Tipo de mercancía: General
   - Peso: `500`
   - Volumen: `2.5`
   - Unidades: `100`
   - Valor: `10000`
   - Modalidad: `Comparar todas`
3. Toca "Continuar" → verás el **Comparador** con las 3 tarjetas
   (Marítima, Aérea, Terrestre). En este ejemplo, Terrestre debe aparecer
   como **"No disponible"** (no hay conexión terrestre entre Colombia y
   España).
4. Toca "Ver recomendación" → verás la ruta recomendada, el TradeRoute Score
   y la explicación de por qué fue seleccionada.
5. Vuelve a **Nuevo Envío** y cambia el peso (por ejemplo a `5000`): al
   repetir el flujo, los costos, el CO₂ y potencialmente la recomendación
   cambiarán, porque todo se recalcula en JavaScript.

## Estructura del proyecto

```
TradeRoute/
├── App.js
├── app.json
├── babel.config.js
├── package.json
└── src/
    ├── components/       # PrimaryButton, TransportCard
    ├── context/          # ShipmentContext (estado del envío en memoria)
    ├── navigation/        # AppNavigator (stack + bottom tabs)
    ├── screens/           # Inicio, NuevoEnvio, Comparador, Recomendacion, Placeholder
    ├── theme/             # colors.js (paleta de diseño)
    └── utils/
        ├── calculations.js  # Fórmulas de costo/tiempo/CO2 + TradeRoute Score
        └── routeGroups.js   # Lógica de disponibilidad de ruta terrestre
```

## Fórmulas utilizadas (académicas, simplificadas)

| Modalidad  | Costo (USD)        | Tiempo   | CO₂ (kg)      |
|------------|---------------------|----------|---------------|
| Marítima   | 600 + peso × 1.5    | 25 días  | peso × 0.15   |
| Aérea      | 700 + peso × 8      | 3 días   | peso × 2.5    |
| Terrestre  | 500 + peso × 3      | 10 días  | peso × 0.8    |

**TradeRoute Score** (0 a 100, mayor es mejor): se normalizan costo, tiempo y
CO₂ de las alternativas disponibles y se combinan con los pesos:

- 40% costo
- 35% tiempo
- 25% CO₂

La alternativa disponible con mayor score es la recomendada.

**Nota:** estos valores son estimaciones académicas para demostrar el
funcionamiento del MVP y **no representan cotizaciones reales**.

## Próximos pasos (fuera del alcance de este MVP)

- Conectar backend y base de datos reales
- Integrar APIs de tarifas/rutas reales
- Implementar Análisis, Reportes y Configuración
