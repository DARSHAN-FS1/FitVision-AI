import React from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator,
  TouchableOpacity, ViewStyle,
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { WorkoutPlan } from '../types/workout.types';
import { formatDuration } from '../utils/calculations';

// ─── MetricChip ─────────────────────────────────────────────────────────────
interface MetricChipProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  color?: string;
  style?: ViewStyle;
}

export const MetricChip: React.FC<MetricChipProps> = ({
  label, value, unit, icon, color = COLORS.cyan, style,
}) => (
  <View style={[chipStyles.container, style]}>
    {icon ? <Text style={chipStyles.icon}>{icon}</Text> : null}
    <View>
      <Text style={[chipStyles.value, { color }]}>
        {value}
        {unit ? <Text style={chipStyles.unit}> {unit}</Text> : null}
      </Text>
      <Text style={chipStyles.label}>{label}</Text>
    </View>
  </View>
);

const chipStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  icon: { fontSize: 20 },
  value: { fontSize: 18, fontWeight: '700' },
  unit: { fontSize: 12, color: COLORS.white3, fontWeight: '400' },
  label: { fontSize: 10, color: COLORS.white3, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
});


// ─── ProgressBar ─────────────────────────────────────────────────────────────
interface ProgressBarProps {
  progress: number; // 0–1
  color?: string;
  height?: number;
  style?: ViewStyle;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress, color = COLORS.cyan, height = 5, style, showLabel = false,
}) => {
  const pct = Math.min(1, Math.max(0, progress));
  return (
    <View style={style}>
      {showLabel && (
        <Text style={pbStyles.label}>{Math.round(pct * 100)}%</Text>
      )}
      <View style={[pbStyles.track, { height }]}>
        <View style={[pbStyles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const pbStyles = StyleSheet.create({
  track: {
    backgroundColor: COLORS.bg3,
    borderRadius: RADIUS.circle,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.circle,
  },
  label: {
    color: COLORS.white3,
    fontSize: 10,
    marginBottom: 4,
    textAlign: 'right',
  },
});


// ─── WorkoutCard ─────────────────────────────────────────────────────────────
interface WorkoutCardProps {
  plan: WorkoutPlan;
  onPress: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ plan, onPress }) => (
  <TouchableOpacity style={wcStyles.card} onPress={onPress} activeOpacity={0.8}>
    <View style={wcStyles.emoji}>
      <Text style={{ fontSize: 32 }}>{plan.thumbnailEmoji}</Text>
    </View>
    <View style={wcStyles.body}>
      <Text style={wcStyles.name} numberOfLines={1}>{plan.name}</Text>
      <Text style={wcStyles.meta}>
        {plan.exercises.length} exercises · {plan.durationMinutes}m
      </Text>
      <View style={wcStyles.tags}>
        <View style={[wcStyles.tag, { backgroundColor: 'rgba(0,212,184,0.12)' }]}>
          <Text style={[wcStyles.tagText, { color: COLORS.cyan }]}>
            {plan.category}
          </Text>
        </View>
        {plan.isAIRecommended && (
          <View style={[wcStyles.tag, { backgroundColor: 'rgba(139,92,246,0.12)' }]}>
            <Text style={[wcStyles.tagText, { color: COLORS.purple }]}>AI Pick</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const wcStyles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  emoji: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg3,
  },
  body: { padding: 12 },
  name: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  meta: { color: COLORS.white3, fontSize: 10, marginTop: 3 },
  tags: { flexDirection: 'row', gap: 4, marginTop: 8 },
  tag: { borderRadius: RADIUS.circle, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
});


// ─── NutritionCard ────────────────────────────────────────────────────────────
interface NutritionCardProps {
  emoji: string;
  name: string;
  calories: number;
  mealType: string;
  time?: string;
  onPress?: () => void;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({
  emoji, name, calories, mealType, time, onPress,
}) => (
  <TouchableOpacity style={ncStyles.card} onPress={onPress} activeOpacity={0.8}>
    <Text style={ncStyles.emoji}>{emoji}</Text>
    <View style={{ flex: 1 }}>
      <Text style={ncStyles.name}>{name}</Text>
      <Text style={ncStyles.meta}>{mealType}{time ? ` · ${time}` : ''}</Text>
    </View>
    <View style={ncStyles.calWrap}>
      <Text style={ncStyles.cals}>{calories}</Text>
      <Text style={ncStyles.kcal}>kcal</Text>
    </View>
  </TouchableOpacity>
);

const ncStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  emoji: { fontSize: 28 },
  name: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
  meta: { color: COLORS.white3, fontSize: 10, marginTop: 2 },
  calWrap: { alignItems: 'flex-end' },
  cals: { color: COLORS.cyan, fontSize: 16, fontWeight: '700' },
  kcal: { color: COLORS.white3, fontSize: 9 },
});


// ─── EmptyState ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭', title, description, actionLabel, onAction,
}) => (
  <View style={esStyles.container}>
    <Text style={esStyles.icon}>{icon}</Text>
    <Text style={esStyles.title}>{title}</Text>
    {description ? <Text style={esStyles.description}>{description}</Text> : null}
    {actionLabel && onAction ? (
      <TouchableOpacity style={esStyles.btn} onPress={onAction}>
        <Text style={esStyles.btnText}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const esStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
    gap: SPACING.md,
  },
  icon: { fontSize: 48, marginBottom: 8 },
  title: { color: COLORS.white, fontSize: 17, fontWeight: '700', textAlign: 'center' },
  description: { color: COLORS.white3, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  btn: {
    marginTop: 8,
    backgroundColor: COLORS.cyan,
    borderRadius: RADIUS.xl,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  btnText: { color: COLORS.bg, fontWeight: '700', fontSize: 14 },
});


// ─── Loader ───────────────────────────────────────────────────────────────────
export const Loader: React.FC<{ size?: 'small' | 'large'; color?: string }> = ({
  size = 'large', color = COLORS.cyan,
}) => (
  <View style={loaderStyles.container}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

const loaderStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
  },
});
