import React from 'react';
import { TextInput as TextInputNativo } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

// Igual que AppText, pero para los campos de formulario (TextInput).
export default function TextInput({ style, ...props }) {
  const { fontFamily } = useAppTheme();
  return <TextInputNativo style={fontFamily ? [{ fontFamily }, style] : style} {...props} />;
}
