import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Platform, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, RADIUS, POSTURE_COLORS } from '../../constants/theme';
import { CameraOverlay, FloatingControls } from '../../components/CameraOverlay';
import { useScanStore } from '../../store/useScanStore';
import { useAuthStore } from '../../store/useAuthStore';
import { usePoseDetection } from '../../hooks/usePoseDetection';
import { useWorkoutTimer } from '../../hooks/useWorkoutTimer';
import { ExerciseType } from '../../types/scan.types';

const { width, height } = Dimensions.get('window');
const CAMERA_HEIGHT = height * 0.58;

const EXERCISE_OPTIONS: { label: string; value: ExerciseType; emoji: string }[] = [
  { label: 'Squat',    value: 'squat',    emoji: '🏋️' },
  { label: 'Push Up',  value: 'pushup',   emoji: '💪' },
  { label: 'Deadlift', value: 'deadlift', emoji: '⚡' },
  { label: 'Lunge',    value: 'lunge',    emoji: '🦵' },
  { label: 'Pull Up',  value: 'pullup',   emoji: '🔝' },
  { label: 'Plank',    value: 'plank',    emoji: '🤸' },
];

export const AIScanScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const {
    isScanning, isPaused, selectedExercise,
    currentFormAnalysis, currentRepCount,
    setSelectedExercise, startScan, pauseScan, resumeScan, endScan,
  } = useScanStore();
  const { isDetectorReady, fps } = usePoseDetection();
  const { elapsed, formatted, start: startTimer, pause: pauseTimer, reset: resetTimer } = useWorkoutTimer();
  const [showExercisePicker, setShowExercisePicker] = useState(!isScanning);

  const postureState = currentFormAnalysis?.postureState ?? 'idle';
  const formScore = currentFormAnalysis?.overallScore ?? 0;
  const repCount = currentRepCount.total;
  const confidence = currentFormAnalysis?.confidence ?? 0;

  const handleStart = async () => {
    if (!user?.uid) return;
    setShowExercisePicker(false);
    await startScan(user.uid);
    startTimer();
  };

  const handlePause = () => {
    pauseScan();
    pauseTimer();
  };

  const handleResume = () => {
    resumeScan();
    startTimer();
  };

  const handleEnd = () => {
    Alert.alert(
      'End Session?',
      `You've completed ${repCount} reps. Save this session?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End & Save',
          style: 'default',
          onPress: async () => {
            pauseTimer();
            const report = await endScan();
            if (report) {
              navigation.navigate('ScanReport', { sessionId: report.session.id ?? '' });
            }
            resetTimer();
          },
        },
      ]
    );
  };

  const postureColor = POSTURE_COLORS[postureState];

  return (
    <View style={styles.container}>
      {/* ── Camera Area ── */}
      <View style={[styles.cameraWrap, { marginTop: insets.top }]}>
        {/* Simulated Camera Feed */}
        <View style={styles.cameraFeed}>
          {/* Grid overlay */}
          <View style={styles.gridOverlay} pointerEvents="none">
            {[1, 2].map(i => (
              <View key={`h${i}`} style={[styles.gridLine, { top: `${i * 33}%` as any, width: '100%', height: 1 }]} />
            ))}
            {[1, 2].map(i => (
              <View key={`v${i}`} style={[styles.gridLine, { left: `${i * 33}%` as any, height: '100%', width: 1 }]} />
            ))}
          </View>

          {/* Skeleton Figure */}
          <SkeletonOverlay postureColor={postureColor} repPhase={currentRepCount.state} />

          {/* Camera Overlay (corners, status, exercise label) */}
          <CameraOverlay
            postureState={postureState}
            confidence={confidence}
            exerciseName={EXERCISE_OPTIONS.find(e => e.value === selectedExercise)?.label ?? 'Exercise'}
            fps={isScanning ? fps : undefined}
          />

          {/* Live Metrics — right side */}
          <View style={styles.liveMetrics} pointerEvents="none">
            <LiveBadge value={repCount.toString()} label="Reps" color={COLORS.white} />
            <LiveBadge
              value={`${Math.round(formScore)}%`}
              label="Form"
              color={postureColor}
            />
            <LiveBadge
              value={currentFormAnalysis?.jointAngles?.leftKneeAngle
                ? `${Math.round(currentFormAnalysis.jointAngles.leftKneeAngle)}°`
                : '—'}
              label="Knee"
              color={COLORS.white}
            />
          </View>

          {/* Bottom status bar */}
          {isScanning && (
            <View style={styles.bottomStatus} pointerEvents="none">
              <View style={[styles.statusPill, { borderColor: postureColor, backgroundColor: `${postureColor}20` }]}>
                <View style={[styles.statusDot, { backgroundColor: postureColor }]} />
                <Text style={[styles.statusText, { color: postureColor }]}>
                  {postureState === 'correct' ? 'PERFECT FORM' :
                   postureState === 'incorrect' ? 'ADJUST FORM' :
                   postureState === 'adjusting' ? 'ADJUSTING...' : 'DETECTING...'}
                </Text>
              </View>
              {currentFormAnalysis?.corrections?.[0] && (
                <Text style={styles.correctionHint} numberOfLines={1}>
                  💡 {currentFormAnalysis.corrections[0]}
                </Text>
              )}
            </View>
          )}

          {/* Not scanning overlay */}
          {!isScanning && (
            <View style={styles.idleOverlay}>
              <Text style={styles.idleEmoji}>📷</Text>
              <Text style={styles.idleText}>
                {isDetectorReady ? 'AI Ready · Select exercise to start' : 'Initializing AI...'}
              </Text>
            </View>
          )}
        </View>

        {/* Timer bar */}
        {isScanning && (
          <View style={styles.timerBar}>
            <View style={styles.timerLeft}>
              <View style={[styles.recDot, isPaused && { backgroundColor: COLORS.amber }]} />
              <Text style={styles.timerText}>{formatted}</Text>
            </View>
            <Text style={styles.calEstimate}>
              ~{Math.round(repCount * 0.8)} kcal
            </Text>
          </View>
        )}
      </View>

      {/* ── Exercise Picker (pre-scan) ── */}
      {showExercisePicker && !isScanning && (
        <View style={styles.picker}>
          <Text style={styles.pickerTitle}>Select Exercise</Text>
          <View style={styles.pickerGrid}>
            {EXERCISE_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.pickerItem,
                  selectedExercise === opt.value && styles.pickerItemActive,
                ]}
                onPress={() => setSelectedExercise(opt.value)}
              >
                <Text style={{ fontSize: 22 }}>{opt.emoji}</Text>
                <Text style={[
                  styles.pickerLabel,
                  selectedExercise === opt.value && { color: COLORS.cyan },
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ── Controls ── */}
      <FloatingControls
        isRunning={isScanning}
        isPaused={isPaused}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onEnd={handleEnd}
        onFlip={() => {}}
        style={styles.controls}
      />

      {/* ── Session Stats Strip ── */}
      {isScanning && (
        <View style={styles.statsStrip}>
          <StatChip label="State" value={postureState} color={postureColor} />
          <StatChip label="Duration" value={formatted} color={COLORS.white} />
          <StatChip label="Total Reps" value={repCount.toString()} color={COLORS.cyan} />
          <StatChip label="Accuracy" value={`${Math.round(formScore)}%`} color={postureColor} />
        </View>
      )}

      {/* ── Back button ── */}
      <TouchableOpacity
        style={[styles.backBtn, { top: insets.top + 8 }]}
        onPress={() => {
          if (isScanning) {
            Alert.alert('Leave Session?', 'Your current scan progress will be lost.', [
              { text: 'Stay', style: 'cancel' },
              { text: 'Leave', style: 'destructive', onPress: () => navigation.goBack() },
            ]);
          } else {
            navigation.goBack();
          }
        }}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
    </View>
  );
};

// Skeleton figure drawn with Views (replaces actual MediaPipe canvas in prod)
const SkeletonOverlay: React.FC<{ postureColor: string; repPhase: string }> = ({
  postureColor, repPhase,
}) => (
  <View style={skelStyles.container} pointerEvents="none">
    {/* Head */}
    <View style={[skelStyles.head, { borderColor: postureColor }]} />
    {/* Neck */}
    <View style={[skelStyles.neck, { backgroundColor: postureColor }]} />
    {/* Shoulders */}
    <View style={[skelStyles.shoulders, { backgroundColor: postureColor }]} />
    {/* Left arm */}
    <View style={[skelStyles.lArm, { backgroundColor: postureColor }]} />
    {/* Right arm */}
    <View style={[skelStyles.rArm, { backgroundColor: postureColor }]} />
    {/* Torso */}
    <View style={[skelStyles.torso, { backgroundColor: postureColor }]} />
    {/* Hips */}
    <View style={[skelStyles.hips, { backgroundColor: postureColor }]} />
    {/* Left leg */}
    <View style={[skelStyles.lLeg, { backgroundColor: postureColor, opacity: repPhase === 'down' ? 1 : 0.6 }]} />
    {/* Right leg */}
    <View style={[skelStyles.rLeg, { backgroundColor: postureColor, opacity: repPhase === 'down' ? 1 : 0.6 }]} />
    {/* Joint dots */}
    {[
      { top: '17%', left: '43%' }, { top: '17%', right: '43%' },
      { top: '38%', left: '40%' }, { top: '38%', right: '40%' },
      { top: '62%', left: '38%' }, { top: '62%', right: '38%' },
    ].map((pos, i) => (
      <View key={i} style={[skelStyles.dot, pos as any, { backgroundColor: postureColor }]} />
    ))}
  </View>
);

const skelStyles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  head: {
    position: 'absolute', width: 36, height: 36, borderRadius: 18,
    borderWidth: 2, top: '6%', alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  neck: { position: 'absolute', width: 3, height: 24, top: '14%', alignSelf: 'center', borderRadius: 2 },
  shoulders: { position: 'absolute', height: 3, width: '50%', top: '20%', alignSelf: 'center', borderRadius: 2 },
  lArm: { position: 'absolute', width: 3, height: 52, top: '20%', left: '26%', borderRadius: 2, transform: [{ rotate: '12deg' }] },
  rArm: { position: 'absolute', width: 3, height: 52, top: '20%', right: '26%', borderRadius: 2, transform: [{ rotate: '-12deg' }] },
  torso: { position: 'absolute', width: 3, height: 70, top: '20%', alignSelf: 'center', borderRadius: 2 },
  hips: { position: 'absolute', height: 3, width: '36%', top: '43%', alignSelf: 'center', borderRadius: 2 },
  lLeg: { position: 'absolute', width: 3, height: 80, top: '43%', left: '34%', borderRadius: 2, transform: [{ rotate: '8deg' }] },
  rLeg: { position: 'absolute', width: 3, height: 80, top: '43%', right: '34%', borderRadius: 2, transform: [{ rotate: '-8deg' }] },
  dot: { position: 'absolute', width: 10, height: 10, borderRadius: 5 },
});

const LiveBadge: React.FC<{ value: string; label: string; color: string }> = ({ value, label, color }) => (
  <View style={lbStyles.badge}>
    <Text style={[lbStyles.value, { color }]}>{value}</Text>
    <Text style={lbStyles.label}>{label}</Text>
  </View>
);
const lbStyles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(10,12,15,0.82)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md, padding: 8, alignItems: 'center', minWidth: 52,
  },
  value: { fontSize: 17, fontWeight: '800' },
  label: { color: COLORS.white3, fontSize: 9, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.4 },
});

const StatChip: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <View style={scStyles.chip}>
    <Text style={[scStyles.value, { color }]}>{value}</Text>
    <Text style={scStyles.label}>{label}</Text>
  </View>
);
const scStyles = StyleSheet.create({
  chip: { flex: 1, alignItems: 'center', backgroundColor: COLORS.card, borderRadius: RADIUS.md, padding: 10, borderWidth: 1, borderColor: COLORS.border },
  value: { fontSize: 14, fontWeight: '700' },
  label: { color: COLORS.white3, fontSize: 9, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  cameraWrap: { marginHorizontal: 12 },
  cameraFeed: {
    height: CAMERA_HEIGHT, backgroundColor: COLORS.bg2,
    borderRadius: 24, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
    position: 'relative',
  },
  gridOverlay: { ...StyleSheet.absoluteFillObject },
  gridLine: { position: 'absolute', backgroundColor: 'rgba(0,212,184,0.05)' },
  liveMetrics: {
    position: 'absolute', right: 12, top: 60,
    gap: 8, zIndex: 20,
  },
  bottomStatus: {
    position: 'absolute', bottom: 14, left: 0, right: 0,
    alignItems: 'center', gap: 6, paddingHorizontal: 20,
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: RADIUS.circle,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  correctionHint: {
    color: COLORS.white3, fontSize: 11,
    backgroundColor: 'rgba(10,12,15,0.8)',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: RADIUS.circle,
  },
  idleOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(10,12,15,0.65)', gap: 10,
  },
  idleEmoji: { fontSize: 48 },
  idleText: { color: COLORS.white2, fontSize: 14, fontWeight: '500' },
  timerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 8,
  },
  timerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.red },
  timerText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  calEstimate: { color: COLORS.white3, fontSize: 12 },
  picker: { paddingHorizontal: 16, paddingTop: 8 },
  pickerTitle: { color: COLORS.white2, fontSize: 13, fontWeight: '600', marginBottom: 10 },
  pickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.circle, paddingHorizontal: 14, paddingVertical: 8,
  },
  pickerItemActive: { borderColor: COLORS.cyan, backgroundColor: COLORS.cyanAlpha12 },
  pickerLabel: { color: COLORS.white2, fontSize: 13, fontWeight: '600' },
  controls: { marginTop: 4 },
  statsStrip: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: {
    position: 'absolute', left: 20, zIndex: 100,
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(10,12,15,0.8)', borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: COLORS.white, fontSize: 18 },
});
