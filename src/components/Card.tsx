import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  glow?: boolean;
  variant?: 'default' | 'elevated' | 'cyan';
}

export const Card: React.FC<CardProps> = ({
  children, style, onPress, glow = false, variant = 'default',
}) => {
  const cardStyle = [
    styles.card,
    styles[`variant_${variant}`],
    glow && styles.glow,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  variant_default: {},
  variant_elevated: {
    backgroundColor: COLORS.card2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  variant_cyan: {
    backgroundColor: 'rgba(0,212,184,0.06)',
    borderColor: COLORS.border2,
  },
  glow: {
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
});
