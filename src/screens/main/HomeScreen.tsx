import React, { useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  RefreshControl, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { WorkoutCard } from '../../components/SharedComponents';
import { ProgressBar } from '../../components/SharedComponents';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/useProfileStore';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { useScanStore } from '../../store/useScanStore';
import { getGreeting, formatDuration } from '../../utils/calculations';
import { WORKOUT_PLANS } from '../../constants/exercises';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { metrics, loadMetrics } = useProfileStore();
  const { plans, recentSessions, loadPlans, loadRecentSessions } = useWorkoutStore();
  const { recentSessions: scanSessions, loadRecentSessions: loadScans } = useScanStore();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadMetrics(user.uid);
      loadPlans();
      loadRecentSessions(user.uid);
      loadScans(user.uid);
    }
  }, [user?.uid]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (user?.uid) {
      await Promise.all([
        loadMetrics(user.uid),
        loadRecentSessions(user.uid),
        loadScans(user.uid),
      ]);
    }
    setRefreshing(false);
  }, [user?.uid]);

  const firstName = user?.displayName?.split(' ')[0] ?? 'Athlete';

  const QUICK_ACTIONS = [
    { label: 'Workout', emoji: '💪', bg: 'rgba(0,212,184,0.10)', onPress: () => navigation.navigate('Workout') },
    { label: 'Routine', emoji: '📋', bg: 'rgba(139,92,246,0.10)', onPress: () => navigation.navigate('Routine') },
    { label: 'Yoga',    emoji: '🧘', bg: 'rgba(46,204,143,0.10)', onPress: () => navigation.navigate('Workout') },
    { label: 'Nutrition', emoji: '🥗', bg: 'rgba(245,158,11,0.10)', onPress: () => navigation.navigate('Nutrition') },
    { label: 'AI Scan', emoji: '🤖', bg: COLORS.cyanAlpha12, onPress: () => navigation.navigate('AIScan'), isCyan: true },
    { label: 'Gyms',   emoji: '🗺️', bg: 'rgba(74,158,255,0.10)', onPress: () => navigation.navigate('Gyms') },
  ];

  const AI_INSIGHTS = [
    metrics?.sleepHours && `😴 Sleep ${metrics.sleepHours}h · ${metrics.sleepHours >= 7 ? 'Optimal' : 'Needs work'}`,
    metrics?.streakDays && `🔥 ${metrics.streakDays}-day streak — keep it up!`,
    '📈 Squat depth improved 12% this week',
    `🎯 ${user?.fitnessGoal?.replace('_', ' ') ?? 'Goal'} on track`,
    metrics?.hrv && `💓 HRV ${metrics.hrv}ms · ${metrics.hrv > 50 ? 'Well recovered' : 'Rest today'}`,
  ].filter(Boolean) as string[];

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.cyan}
            colors={[COLORS.cyan]}
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {firstName.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greeting}>{getGreeting()} 👋</Text>
            <Text style={styles.subGreeting}>{firstName} · AI Coach Active</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ── AI Banner ── */}
        <TouchableOpacity
          style={styles.aiBanner}
          onPress={() => navigation.navigate('AIScan')}
          activeOpacity={0.85}
        >
          <View style={styles.aiPulse}>
            <Text style={{ fontSize: 18 }}>⚡</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.aiBannerTitle}>AI Coach Ready</Text>
            <Text style={styles.aiBannerSub}>Tap to start posture analysis</Text>
          </View>
          <View style={styles.aiScanBtn}>
            <Text style={styles.aiScanBtnText}>Scan Now</Text>
          </View>
        </TouchableOpacity>

        {/* ── Daily Summary ── */}
        <SectionHeader title="Daily Summary" right={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} />
        <View style={styles.metricsGrid}>
          <MetricCard
            icon="🔥" label="Calories" color="#ef4444"
            value={metrics?.caloriesBurned ?? 0} unit="kcal"
            progress={(metrics?.caloriesBurned ?? 0) / 1260}
            sub={`Goal: 1,260 kcal`}
          />
          <MetricCard
            icon="💧" label="Hydration" color={COLORS.blue}
            value={metrics?.hydrationLiters ?? 0} unit="L"
            progress={(metrics?.hydrationLiters ?? 0) / 3}
            sub="Goal: 3.0 L"
          />
          <MetricCard
            icon="🔄" label="Recovery" color={COLORS.cyan}
            value={metrics?.recoveryPercent ?? 0} unit="%"
            progress={(metrics?.recoveryPercent ?? 0) / 100}
            sub={`HRV ${metrics?.hrv ?? '—'}ms`}
          />
          <MetricCard
            icon="⚡" label="Streak" color={COLORS.purple}
            value={metrics?.streakDays ?? 0} unit="days"
            progress={Math.min(1, (metrics?.streakDays ?? 0) / 30)}
            sub="Personal best!"
          />
        </View>

        {/* ── CTA ── */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('Workout')}
          activeOpacity={0.85}
        >
          <View>
            <Text style={styles.ctaTitle}>▶  Start Today's Workout</Text>
            <Text style={styles.ctaSub}>Upper Body · 32 min · 4 exercises</Text>
          </View>
          <View style={styles.ctaArrow}>
            <Text style={{ color: COLORS.bg, fontSize: 18 }}>→</Text>
          </View>
        </TouchableOpacity>

        {/* ── Quick Actions ── */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.qaGrid}>
          {QUICK_ACTIONS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.qaItem,
                item.isCyan && { borderColor: COLORS.border2 },
              ]}
              onPress={item.onPress}
              activeOpacity={0.75}
            >
              <View style={[styles.qaIcon, { backgroundColor: item.bg }]}>
                <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
              </View>
              <Text style={[styles.qaLabel, item.isCyan && { color: COLORS.cyan }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Recommended ── */}
        <SectionHeader title="Recommended" right="See all" onRight={() => navigation.navigate('Workout')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {WORKOUT_PLANS.map(plan => (
            <WorkoutCard
              key={plan.id}
              plan={plan}
              onPress={() => navigation.navigate('Workout')}
            />
          ))}
        </ScrollView>

        {/* ── AI Insights ── */}
        <SectionHeader title="AI Insights" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {AI_INSIGHTS.map((insight, i) => (
            <View key={i} style={styles.insightChip}>
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── Recent Activity ── */}
        {(recentSessions.length > 0 || scanSessions.length > 0) && (
          <>
            <SectionHeader title="Recent Activity" right="See all" />
            <View style={styles.recentList}>
              {recentSessions.slice(0, 2).map(s => (
                <View key={s.id} style={styles.recentItem}>
                  <View style={styles.recentIcon}><Text style={{ fontSize: 22 }}>🏋️</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentName}>{s.name}</Text>
                    <Text style={styles.recentMeta}>
                      {formatDuration(s.durationSeconds)} · {s.totalCalories} kcal
                    </Text>
                  </View>
                  <Text style={styles.recentDate}>
                    {new Date(s.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
              ))}
              {scanSessions.slice(0, 1).map(s => (
                <View key={s.id} style={styles.recentItem}>
                  <View style={[styles.recentIcon, { backgroundColor: COLORS.cyanAlpha12 }]}>
                    <Text style={{ fontSize: 22 }}>🤖</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentName}>AI Scan · {s.exerciseType}</Text>
                    <Text style={styles.recentMeta}>
                      {s.totalReps} reps · Form: {Math.round(s.avgFormScore)}%
                    </Text>
                  </View>
                  <Text style={styles.recentDate}>
                    {new Date(s.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const SectionHeader: React.FC<{
  title: string; right?: string; onRight?: () => void;
}> = ({ title, right, onRight }) => (
  <View style={shStyles.row}>
    <Text style={shStyles.title}>{title}</Text>
    {right ? (
      <TouchableOpacity onPress={onRight}>
        <Text style={shStyles.right}>{right}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);
const shStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.xl, marginBottom: 12, marginTop: 20 },
  title: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  right: { color: COLORS.cyan, fontSize: 12, fontWeight: '500' },
});

const MetricCard: React.FC<{
  icon: string; label: string; value: number; unit: string;
  progress: number; sub: string; color: string;
}> = ({ icon, label, value, unit, progress, sub, color }) => (
  <View style={mcStyles.card}>
    <Text style={mcStyles.icon}>{icon}</Text>
    <Text style={mcStyles.label}>{label}</Text>
    <Text style={mcStyles.value}>
      {typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(1)) : value}
      <Text style={mcStyles.unit}> {unit}</Text>
    </Text>
    <ProgressBar progress={progress} color={color} height={4} style={{ marginTop: 8 }} />
    <Text style={mcStyles.sub}>{sub}</Text>
  </View>
);
const mcStyles = StyleSheet.create({
  card: {
    width: (width - SPACING.xl * 2 - 10) / 2,
    backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, padding: 14,
  },
  icon: { fontSize: 20, marginBottom: 6 },
  label: { color: COLORS.white3, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { color: COLORS.white, fontSize: 22, fontWeight: '800', marginTop: 4 },
  unit: { color: COLORS.white3, fontSize: 12, fontWeight: '400' },
  sub: { color: COLORS.white3, fontSize: 10, marginTop: 4 },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: SPACING.xl, paddingVertical: 14,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.cyan,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: COLORS.bg, fontWeight: '800', fontSize: 15 },
  greeting: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
  subGreeting: { color: COLORS.white3, fontSize: 12, marginTop: 1 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.bg3,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.cyan,
    position: 'absolute', top: 8, right: 8,
  },
  aiBanner: {
    marginHorizontal: SPACING.xl, marginBottom: 4,
    backgroundColor: 'rgba(0,212,184,0.07)',
    borderWidth: 1, borderColor: COLORS.border2,
    borderRadius: RADIUS.xl,
    padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  aiPulse: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.cyanAlpha12,
    borderWidth: 1, borderColor: COLORS.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  aiBannerTitle: { color: COLORS.cyan, fontSize: 13, fontWeight: '700' },
  aiBannerSub: { color: COLORS.white3, fontSize: 11, marginTop: 1 },
  aiScanBtn: {
    backgroundColor: COLORS.cyan,
    borderRadius: RADIUS.md,
    paddingVertical: 8, paddingHorizontal: 12,
  },
  aiScanBtnText: { color: COLORS.bg, fontSize: 12, fontWeight: '800' },
  metricsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10, paddingHorizontal: SPACING.xl,
  },
  ctaBtn: {
    marginHorizontal: SPACING.xl, marginTop: 20, marginBottom: 4,
    backgroundColor: COLORS.cyan,
    borderRadius: RADIUS.xl,
    padding: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  ctaTitle: { color: COLORS.bg, fontSize: 16, fontWeight: '800' },
  ctaSub: { color: 'rgba(10,12,15,0.65)', fontSize: 12, marginTop: 2 },
  ctaArrow: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(10,12,15,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  qaGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10, paddingHorizontal: SPACING.xl,
  },
  qaItem: {
    width: (width - SPACING.xl * 2 - 20) / 3,
    backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    alignItems: 'center', gap: 6,
  },
  qaIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  qaLabel: { color: COLORS.white2, fontSize: 11, fontWeight: '600' },
  hScroll: { paddingHorizontal: SPACING.xl, gap: 12, paddingRight: SPACING.xl },
  insightChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.circle,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  insightText: { color: COLORS.white2, fontSize: 12 },
  recentList: { paddingHorizontal: SPACING.xl, gap: 8 },
  recentItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: 12,
  },
  recentIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: COLORS.bg3,
    alignItems: 'center', justifyContent: 'center',
  },
  recentName: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
  recentMeta: { color: COLORS.white3, fontSize: 11, marginTop: 2 },
  recentDate: { color: COLORS.white3, fontSize: 11 },
});
