import { StyleSheet } from 'react-native';

export const COLORS = {
  // Backgrounds
  bg: '#0a0c0f',
  bg2: '#111418',
  bg3: '#181c22',
  bg4: '#1e2430',

  // Cards
  card: '#161b24',
  card2: '#1c2235',

  // Brand
  cyan: '#00d4b8',
  cyan2: '#00b8a0',
  cyanAlpha12: 'rgba(0,212,184,0.12)',
  cyanAlpha06: 'rgba(0,212,184,0.06)',
  cyanAlpha20: 'rgba(0,212,184,0.20)',

  // Text
  white: '#f0f4f8',
  white2: '#a8b4c0',
  white3: '#6b7885',

  // Semantic
  red: '#ff5c5c',
  green: '#2ecc8f',
  amber: '#f59e0b',
  blue: '#4a9eff',
  purple: '#8b5cf6',

  // Borders
  border: 'rgba(255,255,255,0.07)',
  border2: 'rgba(0,212,184,0.2)',
  border3: 'rgba(255,255,255,0.12)',
} as const;

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  display: 'System',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 100,
  circle: 9999,
} as const;

export const SHADOWS = {
  glow: {
    shadowColor: '#00d4b8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  none: {},
} as const;

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: COLORS.green,
  intermediate: COLORS.amber,
  advanced: COLORS.red,
};

export const CATEGORY_EMOJIS: Record<string, string> = {
  strength: '🏋️',
  cardio: '🏃',
  yoga: '🧘',
  beginner: '⭐',
  hiit: '🔥',
  flexibility: '🤸',
};

export const POSTURE_COLORS: Record<string, string> = {
  correct: COLORS.green,
  incorrect: COLORS.red,
  adjusting: COLORS.amber,
  idle: COLORS.white3,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  screenPadding: {
    paddingHorizontal: SPACING.xl,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: COLORS.white,
    fontSize: 14,
  },
  textSecondary: {
    color: COLORS.white2,
    fontSize: 13,
  },
  textMuted: {
    color: COLORS.white3,
    fontSize: 12,
  },
  heading: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  cyanText: {
    color: COLORS.cyan,
  },
});
