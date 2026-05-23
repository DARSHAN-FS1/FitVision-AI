import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { WORKOUT_PLANS } from '../../constants/exercises';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type DayPlan = { planId: string; label: string; emoji: string } | null;

const DEFAULT_ROUTINE: DayPlan[] = [
  { planId: 'plan_ppl',  label: 'Push Pull Legs', emoji: '🏋️' },
  { planId: 'plan_hiit', label: 'HIIT Cardio',     emoji: '🔥' },
  { planId: 'plan_ppl',  label: 'Push Pull Legs', emoji: '🏋️' },
  null,
  { planId: 'plan_morning_yoga', label: 'Yoga Flow', emoji: '🧘' },
  { planId: 'plan_ppl',  label: 'Push Pull Legs', emoji: '🏋️' },
  null,
];

export const RoutineScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [routine, setRoutine] = useState<DayPlan[]>(DEFAULT_ROUTINE);
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  return (
    <ScreenWrapper scroll>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: COLORS.white, fontSize: 18 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Weekly Routine</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Week Overview */}
      <View style={styles.weekRow}>
        {DAYS.map((day, i) => {
          const hasWorkout = routine[i] !== null;
          const isToday = i === todayIdx;
          return (
            <View key={day} style={[styles.dayDot, isToday && styles.dayDotToday]}>
              <View style={[
                styles.dotIndicator,
                hasWorkout ? styles.dotFilled : styles.dotEmpty,
              ]} />
              <Text style={[styles.dayLabel, isToday && { color: COLORS.cyan }]}>{day}</Text>
            </View>
          );
        })}
      </View>

      {/* Schedule */}
      <View style={styles.schedule}>
        {DAYS.map((day, i) => {
          const plan = routine[i];
          const isToday = i === todayIdx;
          return (
            <View key={day} style={[styles.dayRow, isToday && styles.dayRowToday]}>
              <View style={styles.dayHeader}>
                <Text style={[styles.dayName, isToday && { color: COLORS.cyan }]}>{day}</Text>
                {isToday && <View style={styles.todayBadge}><Text style={styles.todayText}>Today</Text></View>}
              </View>
              {plan ? (
                <TouchableOpacity
                  style={[styles.planCard, isToday && styles.planCardToday]}
                  activeOpacity={0.8}
                >
                  <Text style={{ fontSize: 24 }}>{plan.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.planName}>{plan.label}</Text>
                    <Text style={styles.planMeta}>
                      {WORKOUT_PLANS.find(p => p.id === plan.planId)?.durationMinutes ?? 30} min
                    </Text>
                  </View>
                  {isToday && (
                    <TouchableOpacity style={styles.startBtn}>
                      <Text style={styles.startBtnText}>Start</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.restDay}>
                  <Text style={styles.restDayText}>😴 Rest Day</Text>
                  <Text style={styles.addText}>+ Add workout</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {/* Reminders */}
      <View style={styles.remindersCard}>
        <Text style={styles.sectionTitle}>Workout Reminders</Text>
        {[
          { day: 'Weekdays', time: '6:30 AM', active: true },
          { day: 'Weekends', time: '8:00 AM', active: false },
        ].map((r, i) => (
          <View key={i} style={styles.reminderItem}>
            <Text style={styles.reminderDay}>{r.day}</Text>
            <Text style={styles.reminderTime}>{r.time}</Text>
            <View style={[styles.toggle, r.active && styles.toggleActive]}>
              <View style={[styles.toggleThumb, r.active && styles.toggleThumbActive]} />
            </View>
          </View>
        ))}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingVertical: 16,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  editBtn: {
    backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.circle, paddingHorizontal: 14, paddingVertical: 7,
  },
  editText: { color: COLORS.cyan, fontSize: 13, fontWeight: '600' },
  weekRow: {
    flexDirection: 'row', paddingHorizontal: SPACING.xl,
    marginBottom: 20, justifyContent: 'space-between',
  },
  dayDot: { alignItems: 'center', gap: 4 },
  dayDotToday: {},
  dotIndicator: { width: 8, height: 8, borderRadius: 4 },
  dotFilled: { backgroundColor: COLORS.cyan },
  dotEmpty: { backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border },
  dayLabel: { color: COLORS.white3, fontSize: 11 },
  schedule: { paddingHorizontal: SPACING.xl, gap: 12 },
  dayRow: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, padding: 14, gap: 10,
  },
  dayRowToday: { borderColor: COLORS.border2, backgroundColor: COLORS.cyanAlpha06 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dayName: { color: COLORS.white2, fontSize: 13, fontWeight: '700' },
  todayBadge: {
    backgroundColor: COLORS.cyan, borderRadius: RADIUS.circle,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  todayText: { color: COLORS.bg, fontSize: 10, fontWeight: '800' },
  planCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.md, padding: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  planCardToday: { borderColor: COLORS.border2, backgroundColor: COLORS.bg2 },
  planName: { color: COLORS.white, fontSize: 13, fontWeight: '600' },
  planMeta: { color: COLORS.white3, fontSize: 11, marginTop: 2 },
  startBtn: {
    backgroundColor: COLORS.cyan, borderRadius: RADIUS.circle,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  startBtnText: { color: COLORS.bg, fontSize: 12, fontWeight: '800' },
  restDay: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.md, padding: 12,
    borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed',
  },
  restDayText: { color: COLORS.white3, fontSize: 13 },
  addText: { color: COLORS.cyan, fontSize: 12, fontWeight: '600' },
  remindersCard: {
    marginHorizontal: SPACING.xl, marginTop: 20, marginBottom: 20,
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.xl, padding: 16, gap: 14,
  },
  sectionTitle: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  reminderItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 12, borderTopWidth: 1, borderColor: COLORS.border,
  },
  reminderDay: { flex: 1, color: COLORS.white2, fontSize: 13, fontWeight: '500' },
  reminderTime: { color: COLORS.cyan, fontSize: 13, fontWeight: '600', marginRight: 12 },
  toggle: {
    width: 44, height: 24, borderRadius: 12,
    backgroundColor: COLORS.bg3, padding: 2,
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: COLORS.cyan },
  toggleThumb: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.white3,
  },
  toggleThumbActive: { backgroundColor: COLORS.bg, transform: [{ translateX: 20 }] },
});
