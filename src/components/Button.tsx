import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator,
  StyleSheet, ViewStyle, TextStyle, StyleProp,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, style, textStyle, fullWidth = true,
}) => {
  const containerStyles: StyleProp<ViewStyle> = [
    styles.base,
    styles[`variant_${variant}`],
    styles[`size_${size}`],
    fullWidth ? styles.fullWidth : null,
    (disabled || loading) ? styles.disabled : null,
    style,
  ];

  const textStyles: StyleProp<TextStyle> = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={containerStyles}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? COLORS.bg : COLORS.cyan}
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  variant_primary: {
    backgroundColor: COLORS.cyan,
  },
  variant_secondary: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.cyan,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_danger: {
    backgroundColor: COLORS.red,
  },

  size_sm: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg },
  size_md: { paddingVertical: 14, paddingHorizontal: SPACING.xl },
  size_lg: { paddingVertical: 18, paddingHorizontal: SPACING.xxl },

  text: { fontWeight: '700', letterSpacing: 0.3 },
  text_primary: { color: COLORS.bg },
  text_secondary: { color: COLORS.white },
  text_outline: { color: COLORS.cyan },
  text_ghost: { color: COLORS.white2 },
  text_danger: { color: '#fff' },

  textSize_sm: { fontSize: 13 },
  textSize_md: { fontSize: 15 },
  textSize_lg: { fontSize: 17 },
});
