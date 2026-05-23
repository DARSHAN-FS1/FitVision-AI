import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { ProgressBar } from '../../components/SharedComponents';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfileStore } from '../../store/useProfileStore';
import { calculateBMI, getBMICategory } from '../../utils/calculations';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();
  const { metrics, loadMetrics } = useProfileStore();

  useEffect(() => {
    if (user?.uid) loadMetrics(user.uid);
  }, [user?.uid]);

  const bmi = user ? calculateBMI(user.weightKg, user.heightCm) : 0;
  const bmiInfo = getBMICategory(bmi);
  const bmiProgress = Math.min(1, (bmi - 10) / 30);

  const firstName = user?.displayName?.split(' ')[0] ?? 'Athlete';
  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'FV';

  const SETTINGS = [
    { icon: '🎯', label: 'Fitness Goals', onPress: () => navigation.navigate('EditProfile') },
    { icon: '📊', label: 'Body Metrics', onPress: () => navigation.navigate('EditProfile') },
    { icon: '🔔', label: 'Notifications', onPress: () => {} },
    { icon: '🤖', label: 'AI Preferences', onPress: () => {} },
    { icon: '📈', label: 'Analytics & Progress', onPress: () => {} },
    { icon: '🏋️', label: 'Workout History', onPress: () => {} },
    { icon: '🔒', label: 'Privacy & Data', onPress: () => {} },
    { icon: '❓', label: 'Help & Support', onPress: () => {} },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScreenWrapper scroll>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Text style={{ fontSize: 12 }}>✏️</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user?.displayName ?? 'FitVision User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🔥 {metrics?.streakDays ?? 0} Day Streak</Text>
          </View>
          <View style={[styles.badge, styles.badgePremium]}>
            <Text style={[styles.badgeText, { color: COLORS.amber }]}>⭐ Premium</Text>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <StatBox label="Workouts" value={metrics ? '42' : '—'} icon="💪" />
        <StatBox label="Streak" value={`${metrics?.streakDays ?? 0}d`} icon="🔥" />
        <StatBox label="Scans" value={'18'} icon="🤖" />
        <StatBox label="Calories" value={'84k'} icon="⚡" />
      </View>

      {/* BMI Card */}
      <View style={styles.bmiCard}>
        <Text style={styles.sectionTitle}>Body Stats</Text>
        <View style={styles.bodyStatsRow}>
          <BodyStat label="Age" value={user?.age?.toString() ?? '—'} unit="yrs" />
          <BodyStat label="Height" value={user?.heightCm?.toString() ?? '—'} unit="cm" />
          <BodyStat label="Weight" value={user?.weightKg?.toString() ?? '—'} unit="kg" />
          <BodyStat label="BMI" value={bmi.toString()} unit="" color={bmiInfo.color} />
        </View>
        <View style={styles.bmiRow}>
          <Text style={styles.bmiLabel}>BMI · <Text style={{ color: bmiInfo.color }}>{bmiInfo.label}</Text></Text>
          <Text style={styles.bmiRange}>Normal: 18.5–24.9</Text>
        </View>
        <ProgressBar
          progress={bmiProgress}
          color={bmiInfo.color}
          height={6}
          style={{ marginTop: 4 }}
        />
        {user?.targetWeightKg && (
          <Text style={styles.targetText}>
            Target: {user.targetWeightKg} kg · {Math.abs(user.weightKg - user.targetWeightKg).toFixed(1)} kg to go
          </Text>
        )}
      </View>

      {/* Goal Card */}
      <View style={styles.goalCard}>
        <Text style={styles.goalEmoji}>
          {user?.fitnessGoal === 'weight_loss' ? '🔥' :
           user?.fitnessGoal === 'muscle_gain' ? '💪' :
           user?.fitnessGoal === 'endurance' ? '🏃' : '🎯'}
        </Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.goalLabel}>Current Goal</Text>
          <Text style={styles.goalValue}>
            {user?.fitnessGoal?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) ?? 'General Fitness'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.changeGoalBtn}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.changeGoalText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <Text style={[styles.sectionTitle, { paddingHorizontal: SPACING.xl, marginBottom: 10, marginTop: 20 }]}>
        Settings
      </Text>
      <View style={styles.settingsList}>
        {SETTINGS.map((item, i) => (
          <TouchableOpacity key={i} style={styles.settingItem} onPress={item.onPress} activeOpacity={0.75}>
            <Text style={styles.settingIcon}>{item.icon}</Text>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* App Version */}
      <Text style={styles.version}>FitVision AI · v1.0.0</Text>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪  Sign Out</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const StatBox: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <View style={sbStyles.box}>
    <Text style={sbStyles.icon}>{icon}</Text>
    <Text style={sbStyles.value}>{value}</Text>
    <Text style={sbStyles.label}>{label}</Text>
  </View>
);
const sbStyles = StyleSheet.create({
  box: {
    flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: 12, alignItems: 'center', gap: 3,
  },
  icon: { fontSize: 18 },
  value: { color: COLORS.white, fontSize: 15, fontWeight: '800' },
  label: { color: COLORS.white3, fontSize: 9 },
});

const BodyStat: React.FC<{ label: string; value: string; unit: string; color?: string }> = ({ label, value, unit, color = COLORS.white }) => (
  <View style={{ alignItems: 'center' }}>
    <Text style={{ color, fontSize: 18, fontWeight: '700' }}>{value}<Text style={{ fontSize: 11, color: COLORS.white3 }}>{unit && ` ${unit}`}</Text></Text>
    <Text style={{ color: COLORS.white3, fontSize: 10, marginTop: 2 }}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  avatarWrap: { position: 'relative', marginBottom: 4 },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: COLORS.cyan, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: COLORS.bg, fontSize: 28, fontWeight: '900' },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.bg3, borderWidth: 2, borderColor: COLORS.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  name: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
  email: { color: COLORS.white3, fontSize: 12 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  badge: {
    backgroundColor: COLORS.cyanAlpha12, borderWidth: 1, borderColor: COLORS.border2,
    borderRadius: RADIUS.circle, paddingHorizontal: 12, paddingVertical: 4,
  },
  badgePremium: { backgroundColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)' },
  badgeText: { color: COLORS.cyan, fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 8, paddingHorizontal: SPACING.xl, marginBottom: 16 },
  bmiCard: {
    marginHorizontal: SPACING.xl, backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
  },
  sectionTitle: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  bodyStatsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    marginVertical: 14, paddingVertical: 12,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.border,
  },
  bmiRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  bmiLabel: { color: COLORS.white2, fontSize: 12 },
  bmiRange: { color: COLORS.white3, fontSize: 11 },
  targetText: { color: COLORS.white3, fontSize: 11, marginTop: 6 },
  goalCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: SPACING.xl, backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: 14,
  },
  goalEmoji: { fontSize: 28 },
  goalLabel: { color: COLORS.white3, fontSize: 11 },
  goalValue: { color: COLORS.white, fontSize: 14, fontWeight: '700', marginTop: 2 },
  changeGoalBtn: {
    backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.circle, paddingHorizontal: 12, paddingVertical: 6,
  },
  changeGoalText: { color: COLORS.white2, fontSize: 12, fontWeight: '600' },
  settingsList: { paddingHorizontal: SPACING.xl, gap: 6 },
  settingItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: 14,
  },
  settingIcon: { fontSize: 18, width: 24, textAlign: 'center' },
  settingLabel: { flex: 1, color: COLORS.white, fontSize: 14, fontWeight: '500' },
  settingArrow: { color: COLORS.white3, fontSize: 18 },
  version: { color: COLORS.white3, fontSize: 11, textAlign: 'center', marginTop: 20 },
  logoutBtn: {
    marginHorizontal: SPACING.xl, marginVertical: 12,
    backgroundColor: 'rgba(255,92,92,0.08)', borderWidth: 1, borderColor: 'rgba(255,92,92,0.25)',
    borderRadius: RADIUS.lg, padding: 15, alignItems: 'center',
  },
  logoutText: { color: COLORS.red, fontSize: 15, fontWeight: '700' },
});
