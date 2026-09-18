import React from 'react';
import { Text as TextNativo } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

// Reemplazo directo de <Text> de React Native que aplica el tipo de letra
// elegido por el usuario en Personalización. En React Native moderno, Text
// es un componente de función (no de clase) y ya no lee `defaultProps`, así
// que la única forma real de que el cambio de fuente se vea en toda la app
// es que cada <Text> pase por aquí en vez de por el original.
export default function Text({ style, ...props }) {
  const { fontFamily } = useAppTheme();
  return <TextNativo style={fontFamily ? [{ fontFamily }, style] : style} {...props} />;
}
