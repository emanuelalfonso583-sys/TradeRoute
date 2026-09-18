import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/colors';
import { useAppTheme } from '../context/ThemeContext';

export default function PrimaryButton({ title, onPress, variant = 'primary', disabled = false }) {
  const { acento } = useAppTheme();
  const isOutline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isOutline
          ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: acento }
          : { backgroundColor: acento },
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={[styles.text, { color: isOutline ? acento : '#FFFFFF' }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});
