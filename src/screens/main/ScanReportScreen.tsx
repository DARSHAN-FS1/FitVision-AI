import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Circle } from 'react-native-svg';
import { MainStackParamList } from '../../types/navigation.types';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { Button } from '../../components/Button';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useScanStore } from '../../store/useScanStore';
import { formatDuration, getFormScoreColor, getFormScoreLabel } from '../../utils/calculations';
import { SuggestionItem } from '../../types/scan.types';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<MainStackParamList, 'ScanReport'>;

export const ScanReportScreen: React.FC<Props> = ({ navigation }) => {
  const { lastReport, clearReport } = useScanStore();

  const report = lastReport;
  const session = report?.session;

  if (!report || !session) {
    return (
      <ScreenWrapper>
        <View style={styles.emptyWrap}>
          <Text style={{ fontSize: 48 }}>📋</Text>
          <Text style={styles.emptyText}>No report available</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} fullWidth={false} />
        </View>
      </ScreenWrapper>
    );
  }

  const scoreColor = getFormScoreColor(report.postureScore);
  const scoreLabel = getFormScoreLabel(report.postureScore);
  const scoreCircumference = 2 * Math.PI * 54; // r=54
  const strokeDash = (report.postureScore / 100) * scoreCircumference;

  const handleShare = async () => {
    await Share.share({
      message: `FitVision AI Session Report\n\nExercise: ${session.exerciseType}\nPosture Score: ${Math.round(report.postureScore)}%\nTotal Reps: ${session.totalReps}\nDuration: ${formatDuration(session.durationSeconds)}\nCalories: ~${session.caloriesBurned} kcal\n\nPowered by FitVision AI 🤖`,
    });
  };

  return (
    <ScreenWrapper scroll>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Report</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Text style={{ fontSize: 18 }}>📤</Text>
        </TouchableOpacity>
      </View>

      {/* Score Ring */}
      <View style={styles.scoreSection}>
        <View style={styles.scoreRingWrap}>
          <View style={styles.scoreRingContainer}>
            <Svg width={130} height={130} viewBox="0 0 130 130">
              {/* Background circle */}
              <Circle
                cx="65"
                cy="65"
                r="55"
                stroke={COLORS.bg3}
                strokeWidth="10"
                fill="transparent"
              />
              {/* Foreground circle */}
              <Circle
                cx="65"
                cy="65"
                r="55"
                stroke={scoreColor}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 55}`}
                strokeDashoffset={`${2 * Math.PI * 55 * (1 - report.postureScore / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
              />
            </Svg>
            <View style={styles.scoreInnerAbsolute}>
              <Text style={[styles.scoreVal, { color: scoreColor }]}>
                {Math.round(report.postureScore)}
                <Text style={styles.scorePercent}>%</Text>
              </Text>
              <Text style={styles.scoreLabel}>{scoreLabel}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.exerciseName}>{session.exerciseType.toUpperCase()} SESSION</Text>
        <Text style={styles.sessionDate}>
          {new Date(session.startedAt).toLocaleDateString('en-IN', {
            weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
          })}
        </Text>
      </View>

      {/* Metric Row */}
      <View style={styles.metricsRow}>
        <MetricBox icon="🔁" value={session.totalReps.toString()} label="Total Reps" />
        <MetricBox icon="⏱" value={formatDuration(session.durationSeconds)} label="Duration" />
        <MetricBox icon="🔥" value={`${session.caloriesBurned}`} label="Calories" unit="kcal" />
        <MetricBox icon="🎯" value={`${Math.round(session.postureAccuracy)}%`} label="Accuracy" color={scoreColor} />
      </View>

      {/* Joint Angles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Joint Analysis</Text>
        <View style={styles.anglesGrid}>
          <AngleCard label="Avg Knee Angle" value={session.avgKneeAngle} ideal="80–95°" good={session.avgKneeAngle >= 80 && session.avgKneeAngle <= 105} />
          <AngleCard label="Back Alignment" value={session.avgBackAngle} ideal=">155°" good={session.avgBackAngle >= 155} />
          <AngleCard label="Peak Form" value={session.peakFormScore} ideal=">85%" good={session.peakFormScore >= 85} suffix="%" />
          <AngleCard label="Confidence" value={Math.round((session.postureAccuracy / 100) * 98)} ideal=">80%" good={session.postureAccuracy >= 75} suffix="%" />
        </View>
      </View>

      {/* Suggestions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Feedback</Text>
        <View style={styles.suggestionList}>
          {report.suggestions.map((s, i) => (
            <SuggestionCard key={i} item={s} />
          ))}
        </View>
      </View>

      {/* Next Steps */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Steps</Text>
        <View style={styles.nextStepList}>
          {report.nextSteps.map((step, i) => (
            <View key={i} style={styles.nextStep}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="🤖  Scan Again"
          onPress={() => {
            clearReport();
            navigation.replace('AIScan' as any);
          }}
          size="lg"
        />
        <Button
          title="Go to Home"
          onPress={() => {
            clearReport();
            navigation.navigate('MainTabs' as any);
          }}
          variant="secondary"
          size="lg"
        />
      </View>
    </ScreenWrapper>
  );
};

const MetricBox: React.FC<{
  icon: string; value: string; label: string; unit?: string; color?: string;
}> = ({ icon, value, label, unit, color = COLORS.white }) => (
  <View style={mbStyles.box}>
    <Text style={mbStyles.icon}>{icon}</Text>
    <Text style={[mbStyles.value, { color }]}>{value}</Text>
    {unit && <Text style={mbStyles.unit}>{unit}</Text>}
    <Text style={mbStyles.label}>{label}</Text>
  </View>
);
const mbStyles = StyleSheet.create({
  box: {
    flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: 12, alignItems: 'center', gap: 2,
  },
  icon: { fontSize: 18, marginBottom: 2 },
  value: { fontSize: 18, fontWeight: '800' },
  unit: { color: COLORS.white3, fontSize: 9 },
  label: { color: COLORS.white3, fontSize: 9, textAlign: 'center', marginTop: 2 },
});

const AngleCard: React.FC<{
  label: string; value: number; ideal: string; good: boolean; suffix?: string;
}> = ({ label, value, ideal, good, suffix = '°' }) => (
  <View style={[acStyles.card, good ? acStyles.good : acStyles.warn]}>
    <Text style={[acStyles.icon]}>{good ? '✅' : '⚠️'}</Text>
    <Text style={acStyles.label}>{label}</Text>
    <Text style={[acStyles.value, { color: good ? COLORS.green : COLORS.amber }]}>
      {Math.round(value)}{suffix}
    </Text>
    <Text style={acStyles.ideal}>Ideal: {ideal}</Text>
  </View>
);
const acStyles = StyleSheet.create({
  card: {
    width: (width - SPACING.xl * 2 - 8) / 2,
    borderWidth: 1, borderRadius: RADIUS.md, padding: 12, alignItems: 'center', gap: 3,
  },
  good: { backgroundColor: 'rgba(46,204,143,0.06)', borderColor: 'rgba(46,204,143,0.25)' },
  warn: { backgroundColor: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.25)' },
  icon: { fontSize: 16 },
  label: { color: COLORS.white3, fontSize: 9, textAlign: 'center' },
  value: { fontSize: 18, fontWeight: '800' },
  ideal: { color: COLORS.white3, fontSize: 9 },
});

const SuggestionCard: React.FC<{ item: SuggestionItem }> = ({ item }) => {
  const colors = {
    warning: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', text: COLORS.amber, icon: '⚠️' },
    tip:     { bg: 'rgba(74,158,255,0.08)', border: 'rgba(74,158,255,0.3)', text: COLORS.blue,  icon: '💡' },
    success: { bg: 'rgba(46,204,143,0.08)', border: 'rgba(46,204,143,0.3)', text: COLORS.green, icon: '✅' },
  };
  const c = colors[item.type];
  return (
    <View style={[sgStyles.card, { backgroundColor: c.bg, borderColor: c.border }]}>
      <View style={sgStyles.row}>
        <Text style={{ fontSize: 18 }}>{c.icon}</Text>
        <Text style={[sgStyles.title, { color: c.text }]}>{item.title}</Text>
      </View>
      <Text style={sgStyles.desc}>{item.description}</Text>
    </View>
  );
};
const sgStyles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: RADIUS.md, padding: 14, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 13, fontWeight: '700', flex: 1 },
  desc: { color: COLORS.white2, fontSize: 12, lineHeight: 18 },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingVertical: 14,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: COLORS.white, fontSize: 18 },
  headerTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  shareBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  scoreSection: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  scoreRingWrap: { marginBottom: 8 },
  scoreRingContainer: {
    width: 130, height: 130,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  scoreInnerAbsolute: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreVal: { fontSize: 34, fontWeight: '900', lineHeight: 38 },
  scorePercent: { color: COLORS.white3, fontSize: 13 },
  scoreLabel: { color: COLORS.white3, fontSize: 11, marginTop: 2 },
  exerciseName: { color: COLORS.cyan, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  sessionDate: { color: COLORS.white3, fontSize: 12 },
  metricsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: SPACING.xl, marginBottom: 8 },
  section: { paddingHorizontal: SPACING.xl, marginBottom: 20 },
  sectionTitle: { color: COLORS.white, fontSize: 15, fontWeight: '700', marginBottom: 12 },
  anglesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestionList: { gap: 8 },
  nextStepList: { gap: 10 },
  nextStep: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.cyan, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  stepNumText: { color: COLORS.bg, fontSize: 11, fontWeight: '800' },
  stepText: { color: COLORS.white2, fontSize: 13, lineHeight: 20, flex: 1 },
  actions: { paddingHorizontal: SPACING.xl, gap: 10, marginBottom: 20 },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { color: COLORS.white2, fontSize: 16, fontWeight: '600' },
});
