import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';
import { PostureState } from '../types/scan.types';

// ─── CameraOverlay ────────────────────────────────────────────────────────────
interface CameraOverlayProps {
  postureState: PostureState;
  confidence: number;
  exerciseName: string;
  fps?: number;
}

export const CameraOverlay: React.FC<CameraOverlayProps> = ({
  postureState, confidence, exerciseName, fps,
}) => {
  const stateColor: Record<PostureState, string> = {
    correct: COLORS.green,
    incorrect: COLORS.red,
    adjusting: COLORS.amber,
    idle: COLORS.white3,
  };
  const stateLabel: Record<PostureState, string> = {
    correct: 'CORRECT FORM ✓',
    incorrect: 'ADJUST FORM ⚠',
    adjusting: 'ADJUSTING...',
    idle: 'DETECTING...',
  };

  const color = stateColor[postureState];

  return (
    <View style={ovStyles.container} pointerEvents="none">
      {/* Corner brackets */}
      <View style={[ovStyles.corner, ovStyles.tl, { borderColor: color }]} />
      <View style={[ovStyles.corner, ovStyles.tr, { borderColor: color }]} />
      <View style={[ovStyles.corner, ovStyles.bl, { borderColor: color }]} />
      <View style={[ovStyles.corner, ovStyles.br, { borderColor: color }]} />

      {/* Top left status */}
      <View style={ovStyles.topLeft}>
        <View style={[ovStyles.statusPill, { borderColor: color, backgroundColor: `${color}20` }]}>
          <View style={[ovStyles.statusDot, { backgroundColor: color }]} />
          <Text style={[ovStyles.statusText, { color }]}>{stateLabel[postureState]}</Text>
        </View>
      </View>

      {/* Top right - exercise + AI */}
      <View style={ovStyles.topRight}>
        <View style={ovStyles.exerciseBadge}>
          <Text style={ovStyles.exerciseText}>{exerciseName}</Text>
        </View>
        {fps !== undefined && (
          <Text style={ovStyles.fps}>{fps} fps</Text>
        )}
      </View>

      {/* Grid overlay */}
      <View style={ovStyles.gridH1} />
      <View style={ovStyles.gridH2} />
      <View style={ovStyles.gridV1} />
      <View style={ovStyles.gridV2} />
    </View>
  );
};

const ovStyles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  corner: { position: 'absolute', width: 28, height: 28, borderStyle: 'solid' },
  tl: { top: 16, left: 16, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderRadius: 3 },
  tr: { top: 16, right: 16, borderTopWidth: 2.5, borderRightWidth: 2.5, borderRadius: 3 },
  bl: { bottom: 16, left: 16, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderRadius: 3 },
  br: { bottom: 16, right: 16, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderRadius: 3 },
  topLeft: { position: 'absolute', top: 14, left: 14 },
  topRight: { position: 'absolute', top: 14, right: 14, alignItems: 'flex-end', gap: 4 },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: RADIUS.circle,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  exerciseBadge: {
    backgroundColor: 'rgba(0,212,184,0.15)',
    borderWidth: 1, borderColor: COLORS.border2,
    borderRadius: RADIUS.circle,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  exerciseText: { color: COLORS.cyan, fontSize: 10, fontWeight: '700' },
  fps: { color: COLORS.white3, fontSize: 9 },
  gridH1: { position: 'absolute', left: 0, right: 0, top: '33%', height: 1, backgroundColor: 'rgba(0,212,184,0.06)' },
  gridH2: { position: 'absolute', left: 0, right: 0, top: '66%', height: 1, backgroundColor: 'rgba(0,212,184,0.06)' },
  gridV1: { position: 'absolute', top: 0, bottom: 0, left: '33%', width: 1, backgroundColor: 'rgba(0,212,184,0.06)' },
  gridV2: { position: 'absolute', top: 0, bottom: 0, left: '66%', width: 1, backgroundColor: 'rgba(0,212,184,0.06)' },
});


// ─── FloatingControls ─────────────────────────────────────────────────────────
interface FloatingControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onEnd: () => void;
  onFlip?: () => void;
  onResume?: () => void;
  style?: ViewStyle;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isRunning, isPaused, onStart, onPause, onEnd, onFlip, onResume, style,
}) => (
  <View style={[fcStyles.container, style]}>
    {/* Flip camera */}
    <ControlButton icon="🔄" label="Flip" onPress={onFlip ?? (() => {})} />

    {/* Primary action */}
    {!isRunning ? (
      <ControlButton
        icon="▶"
        label="Start"
        primary
        color={COLORS.cyan}
        onPress={onStart}
        size={68}
      />
    ) : (
      <ControlButton
        icon="⏹"
        label="End"
        primary
        color={COLORS.red}
        onPress={onEnd}
        size={68}
      />
    )}

    {/* Pause / resume */}
    {isRunning ? (
      <ControlButton
        icon={isPaused ? '▶' : '⏸'}
        label={isPaused ? 'Resume' : 'Pause'}
        onPress={isPaused ? (onResume ?? onStart) : onPause}
      />
    ) : (
      <View style={{ width: 52 }} />
    )}
  </View>
);

interface ControlButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  primary?: boolean;
  color?: string;
  size?: number;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  icon, label, onPress, primary, color = COLORS.bg3, size = 52,
}) => (
  <TouchableOpacity style={fcStyles.btn} onPress={onPress} activeOpacity={0.7}>
    <View style={[
      fcStyles.circle,
      { width: size, height: size, backgroundColor: primary ? color : COLORS.bg3 },
      primary && { borderColor: color, shadowColor: color, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
    ]}>
      <Text style={{ fontSize: primary ? 22 : 18, color: primary ? (color === COLORS.cyan ? COLORS.bg : '#fff') : COLORS.white }}>{icon}</Text>
    </View>
    <Text style={fcStyles.label}>{label}</Text>
  </TouchableOpacity>
);

const fcStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 20,
  },
  btn: { alignItems: 'center', gap: 5 },
  circle: {
    borderRadius: RADIUS.circle,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { color: COLORS.white3, fontSize: 10, fontWeight: '500' },
});
