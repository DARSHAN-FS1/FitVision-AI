import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useNutritionStore } from '../../store/useNutritionStore';
import { useAuthStore } from '../../store/useAuthStore';
import { ProgressBar } from '../../components/SharedComponents';
import { NutritionCard } from '../../components/SharedComponents';
import { format } from 'date-fns';

const TABS = ['Diet Plan', 'Scan Food', 'Calories'] as const;
type Tab = typeof TABS[number];

export const NutritionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { daily, suggestions, isLoading, loadDaily, loadSuggestions, updateWater, logMeal } = useNutritionStore();
  const [activeTab, setActiveTab] = useState<Tab>('Diet Plan');

  useEffect(() => {
    if (user?.uid) {
      loadDaily(user.uid);
      loadSuggestions(user.uid);
    }
  }, [user?.uid]);

  const calPct = daily ? daily.totalCalories / daily.calorieGoal : 0;
  const proteinPct = daily ? daily.totalMacros.proteinG / daily.proteinGoalG : 0;
  const carbsPct = daily ? daily.totalMacros.carbsG / daily.carbsGoalG : 0;
  const fatsPct = daily ? daily.totalMacros.fatsG / daily.fatsGoalG : 0;

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Nutrition</Text>
            <Text style={styles.date}>{format(new Date(), 'EEEE, MMM d')}</Text>
          </View>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {activeTab === 'Diet Plan' && (
          <>
            {/* Calorie Ring Card */}
            <View style={styles.calorieCard}>
              <View style={styles.ringSection}>
                <CalorieRing
                  consumed={daily?.totalCalories ?? 0}
                  goal={daily?.calorieGoal ?? 2200}
                />
                <View style={styles.ringLabels}>
                  <RingLabel label="Consumed" value={`${daily?.totalCalories ?? 0}`} unit="kcal" color={COLORS.cyan} />
                  <RingLabel label="Goal" value={`${daily?.calorieGoal ?? 2200}`} unit="kcal" color={COLORS.white3} />
                  <RingLabel
                    label="Remaining"
                    value={`${Math.max(0, (daily?.calorieGoal ?? 2200) - (daily?.totalCalories ?? 0))}`}
                    unit="kcal"
                    color={COLORS.green}
                  />
                </View>
              </View>

              {/* Macros */}
              <View style={styles.macroRow}>
                <MacroBar label="Protein" value={daily?.totalMacros.proteinG ?? 0} goal={daily?.proteinGoalG ?? 150} unit="g" color={COLORS.blue} pct={proteinPct} />
                <MacroBar label="Carbs"   value={daily?.totalMacros.carbsG ?? 0}   goal={daily?.carbsGoalG ?? 250}   unit="g" color={COLORS.amber} pct={carbsPct} />
                <MacroBar label="Fats"    value={daily?.totalMacros.fatsG ?? 0}    goal={daily?.fatsGoalG ?? 70}     unit="g" color={COLORS.purple} pct={fatsPct} />
              </View>
            </View>

            {/* Water tracker */}
            <View style={styles.waterCard}>
              <View style={styles.waterRow}>
                <Text style={{ fontSize: 22 }}>💧</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.waterTitle}>Hydration</Text>
                  <Text style={styles.waterSub}>{((daily?.waterMl ?? 0) / 1000).toFixed(1)} L / {((daily?.waterGoalMl ?? 3000) / 1000).toFixed(1)} L</Text>
                </View>
                <TouchableOpacity
                  style={styles.addWaterBtn}
                  onPress={() => {
                    updateWater(250);
                    Alert.alert('Hydration Updated 💧', 'Added 250ml of water to your log.');
                  }}
                >
                  <Text style={styles.addWaterText}>+ 250ml</Text>
                </TouchableOpacity>
              </View>
              <ProgressBar progress={(daily?.waterMl ?? 0) / (daily?.waterGoalMl ?? 3000)} color={COLORS.blue} height={6} style={{ marginTop: 10 }} />
            </View>

            {/* Today's Meals */}
            <Text style={styles.sectionTitle}>Today's Meals</Text>
            <View style={styles.mealList}>
              {daily?.meals && daily.meals.length > 0 ? (
                daily.meals.map(meal => (
                  <NutritionCard
                    key={meal.id}
                    emoji={meal.foods[0]?.food.emoji ?? '🍽️'}
                    name={meal.foods.map(f => f.food.name).join(', ')}
                    calories={meal.totalCalories}
                    mealType={meal.mealType}
                    time={new Date(meal.loggedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  />
                ))
              ) : (
                <MockMeals />
              )}
            </View>

            <TouchableOpacity
              style={styles.addMealBtn}
              onPress={() => {
                Alert.alert(
                  'Add Custom Meal',
                  'Log a default balanced healthy meal of 550 kcal (35g Protein, 50g Carbs, 15g Fat)?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Log Meal',
                      onPress: async () => {
                        await logMeal({
                          userId: user?.uid ?? 'guest',
                          date: format(new Date(), 'yyyy-MM-dd'),
                          mealType: 'lunch',
                          foods: [
                            {
                              food: {
                                id: 'custom-meal-' + Date.now(),
                                name: 'Custom Balanced Meal',
                                servingSizeG: 350,
                                calories: 550,
                                macros: {
                                  proteinG: 35,
                                  carbsG: 50,
                                  fatsG: 15,
                                  fiberG: 6,
                                  sugarG: 4,
                                },
                                emoji: '🍽️',
                              },
                              quantityG: 350,
                              calories: 550,
                            }
                          ],
                          totalCalories: 550,
                          totalMacros: {
                            proteinG: 35,
                            carbsG: 50,
                            fatsG: 15,
                            fiberG: 6,
                            sugarG: 4,
                          },
                          loggedAt: new Date().toISOString(),
                        });
                        Alert.alert('Success 🎉', 'Custom balanced meal has been logged!');
                      }
                    }
                  ]
                );
              }}
            >
              <Text style={styles.addMealIcon}>＋</Text>
              <Text style={styles.addMealText}>Add Meal</Text>
            </TouchableOpacity>
          </>
        )}

        {activeTab === 'Scan Food' && (
          <View style={styles.scanFoodTab}>
            <TouchableOpacity style={styles.scanCameraBtn} activeOpacity={0.85}>
              <View style={styles.scanCameraIcon}>
                <Text style={{ fontSize: 48 }}>📷</Text>
              </View>
              <Text style={styles.scanCameraTitle}>Scan Food with AI</Text>
              <Text style={styles.scanCameraSub}>Point camera at any food to instantly get nutrition info</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { paddingHorizontal: 0 }]}>AI Meal Suggestions</Text>
            {suggestions.map(s => (
              <View key={s.id} style={styles.suggestionCard}>
                <View style={styles.sugRow}>
                  <Text style={{ fontSize: 28 }}>{s.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sugName}>{s.name}</Text>
                    <Text style={styles.sugDesc} numberOfLines={2}>{s.description}</Text>
                  </View>
                  <View style={styles.sugCals}>
                    <Text style={styles.sugCalVal}>{s.totalCalories}</Text>
                    <Text style={styles.sugCalUnit}>kcal</Text>
                  </View>
                </View>
                <View style={styles.sugMacros}>
                  <SugMacro label="P" value={Math.round(s.totalMacros.proteinG)} color={COLORS.blue} />
                  <SugMacro label="C" value={Math.round(s.totalMacros.carbsG)} color={COLORS.amber} />
                  <SugMacro label="F" value={Math.round(s.totalMacros.fatsG)} color={COLORS.purple} />
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity
                    style={styles.sugAddBtn}
                    onPress={async () => {
                      await logMeal({
                        userId: user?.uid ?? 'guest',
                        date: format(new Date(), 'yyyy-MM-dd'),
                        mealType: 'snack',
                        foods: s.foods.map(f => ({
                          food: f,
                          quantityG: f.servingSizeG ?? 100,
                          calories: f.calories,
                        })),
                        totalCalories: s.totalCalories,
                        totalMacros: s.totalMacros,
                        loggedAt: new Date().toISOString(),
                      });
                      Alert.alert('Meal Logged 🍽️', `${s.name} has been added to your log.`);
                    }}
                  >
                    <Text style={styles.sugAddText}>Add Meal</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.sugReason}>🤖 {s.reason}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Calories' && (
          <View style={styles.caloriesTab}>
            <Text style={styles.sectionTitle}>Weekly Calories</Text>
            <WeeklyCalorieChart goal={daily?.calorieGoal ?? 2200} />

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Macro Breakdown</Text>
            <View style={styles.macroBreakdown}>
              {[
                { label: 'Protein', value: daily?.totalMacros.proteinG ?? 142, goal: daily?.proteinGoalG ?? 150, color: COLORS.blue, emoji: '🥩' },
                { label: 'Carbs',   value: daily?.totalMacros.carbsG ?? 210,   goal: daily?.carbsGoalG ?? 250,   color: COLORS.amber, emoji: '🍚' },
                { label: 'Fats',    value: daily?.totalMacros.fatsG ?? 54,     goal: daily?.fatsGoalG ?? 70,     color: COLORS.purple, emoji: '🥑' },
                { label: 'Fiber',   value: daily?.totalMacros.fiberG ?? 28,    goal: 35,                         color: COLORS.green, emoji: '🥦' },
              ].map(m => (
                <View key={m.label} style={styles.macroBreakdownItem}>
                  <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={styles.mbRow}>
                      <Text style={styles.mbLabel}>{m.label}</Text>
                      <Text style={[styles.mbValue, { color: m.color }]}>{Math.round(m.value)}g / {m.goal}g</Text>
                    </View>
                    <ProgressBar progress={m.value / m.goal} color={m.color} height={5} style={{ marginTop: 6 }} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const CalorieRing: React.FC<{ consumed: number; goal: number }> = ({ consumed, goal }) => {
  const pct = Math.min(1, consumed / goal);
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  return (
    <View style={crStyles.ringContainer}>
      <Svg width={130} height={130} viewBox="0 0 130 130">
        {/* Background circle */}
        <Circle
          cx="65"
          cy="65"
          r={radius}
          stroke={COLORS.bg3}
          strokeWidth="10"
          fill="transparent"
        />
        {/* Foreground circle */}
        <Circle
          cx="65"
          cy="65"
          r={radius}
          stroke={COLORS.cyan}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${circumference * (1 - pct)}`}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
        />
      </Svg>
      <View style={crStyles.innerAbsolute}>
        <Text style={crStyles.val}>{consumed}</Text>
        <Text style={crStyles.unit}>kcal</Text>
      </View>
    </View>
  );
};
const crStyles = StyleSheet.create({
  ringContainer: {
    width: 130, height: 130,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  innerAbsolute: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  val: { color: COLORS.white, fontSize: 24, fontWeight: '800' },
  unit: { color: COLORS.white3, fontSize: 11 },
});

const RingLabel: React.FC<{ label: string; value: string; unit: string; color: string }> = ({ label, value, unit, color }) => (
  <View>
    <Text style={{ color: COLORS.white3, fontSize: 10 }}>{label}</Text>
    <Text style={{ color, fontSize: 16, fontWeight: '700' }}>{value} <Text style={{ fontSize: 11, color: COLORS.white3 }}>{unit}</Text></Text>
  </View>
);

const MacroBar: React.FC<{ label: string; value: number; goal: number; unit: string; color: string; pct: number }> = ({ label, value, goal, unit, color, pct }) => (
  <View style={{ flex: 1, alignItems: 'center', gap: 4 }}>
    <Text style={{ color, fontSize: 15, fontWeight: '700' }}>{Math.round(value)}<Text style={{ color: COLORS.white3, fontSize: 10 }}>{unit}</Text></Text>
    <ProgressBar progress={pct} color={color} height={5} />
    <Text style={{ color: COLORS.white3, fontSize: 9 }}>{label}</Text>
  </View>
);

const MockMeals: React.FC = () => (
  <View style={{ gap: 8 }}>
    {[
      { emoji: '🥣', name: 'Oats & Banana', type: 'Breakfast', time: '7:30 AM', cals: 420 },
      { emoji: '🍗', name: 'Chicken Rice Bowl', type: 'Lunch', time: '12:45 PM', cals: 680 },
      { emoji: '🥤', name: 'Protein Shake', type: 'Snack', time: '4:00 PM', cals: 280 },
      { emoji: '🥗', name: 'Salmon Salad', type: 'Dinner', time: '8:00 PM', cals: 460 },
    ].map((m, i) => (
      <NutritionCard key={i} emoji={m.emoji} name={m.name} calories={m.cals} mealType={m.type} time={m.time} />
    ))}
  </View>
);

const SugMacro: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <View style={[smStyles.pill, { backgroundColor: `${color}18` }]}>
    <Text style={[smStyles.text, { color }]}>{label} {value}g</Text>
  </View>
);
const smStyles = StyleSheet.create({
  pill: { borderRadius: RADIUS.circle, paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontSize: 10, fontWeight: '700' },
});

const WeeklyCalorieChart: React.FC<{ goal: number }> = ({ goal }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = [1840, 2100, 1950, 2200, 1780, 2350, 1920];
  const maxVal = Math.max(...values, goal);
  return (
    <View style={wccStyles.container}>
      <View style={wccStyles.bars}>
        {days.map((day, i) => {
          const pct = values[i] / maxVal;
          const isOver = values[i] > goal;
          return (
            <View key={day} style={wccStyles.barWrap}>
              <Text style={wccStyles.barVal}>{Math.round(values[i] / 100) * 100}</Text>
              <View style={wccStyles.barTrack}>
                <View style={[wccStyles.barFill, {
                  height: `${pct * 100}%`,
                  backgroundColor: isOver ? COLORS.amber : COLORS.cyan,
                }]} />
              </View>
              <Text style={wccStyles.dayLabel}>{day}</Text>
            </View>
          );
        })}
      </View>
      <View style={[wccStyles.goalLine, { bottom: `${(goal / maxVal) * 100}%` as any }]}>
        <Text style={wccStyles.goalText}>Goal</Text>
      </View>
    </View>
  );
};
const wccStyles = StyleSheet.create({
  container: {
    height: 160, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, padding: 12, position: 'relative',
    marginHorizontal: SPACING.xl,
  },
  bars: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  barWrap: { flex: 1, alignItems: 'center', gap: 3 },
  barVal: { color: COLORS.white3, fontSize: 7, marginBottom: 2 },
  barTrack: { flex: 1, width: '100%', backgroundColor: COLORS.bg3, borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 4 },
  dayLabel: { color: COLORS.white3, fontSize: 9 },
  goalLine: {
    position: 'absolute', left: 12, right: 12, height: 1,
    borderTopWidth: 1, borderColor: COLORS.red, borderStyle: 'dashed',
  },
  goalText: { position: 'absolute', right: 0, top: -14, color: COLORS.red, fontSize: 9 },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingVertical: 16,
  },
  title: { color: COLORS.white, fontSize: 22, fontWeight: '800' },
  date: { color: COLORS.white3, fontSize: 12, marginTop: 2 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  tabsRow: { paddingHorizontal: SPACING.xl, gap: 8, marginBottom: 16 },
  tab: {
    paddingHorizontal: 18, paddingVertical: 9,
    backgroundColor: COLORS.bg3, borderRadius: RADIUS.circle,
    borderWidth: 1, borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.cyan, borderColor: COLORS.cyan },
  tabText: { color: COLORS.white3, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: COLORS.bg },
  calorieCard: {
    marginHorizontal: SPACING.xl, backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.xl, padding: 16, marginBottom: 12,
  },
  ringSection: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 16 },
  ringLabels: { gap: 10 },
  macroRow: { flexDirection: 'row', gap: 12 },
  waterCard: {
    marginHorizontal: SPACING.xl, backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, padding: 14, marginBottom: 16,
  },
  waterRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  waterTitle: { color: COLORS.white, fontSize: 14, fontWeight: '600' },
  waterSub: { color: COLORS.white3, fontSize: 11, marginTop: 2 },
  addWaterBtn: {
    backgroundColor: COLORS.cyanAlpha12, borderWidth: 1, borderColor: COLORS.border2,
    borderRadius: RADIUS.circle, paddingHorizontal: 12, paddingVertical: 6,
  },
  addWaterText: { color: COLORS.cyan, fontSize: 12, fontWeight: '700' },
  sectionTitle: {
    color: COLORS.white, fontSize: 15, fontWeight: '700',
    paddingHorizontal: SPACING.xl, marginBottom: 12,
  },
  mealList: { paddingHorizontal: SPACING.xl, gap: 8, marginBottom: 12 },
  addMealBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginHorizontal: SPACING.xl, marginBottom: 8,
    borderWidth: 1.5, borderColor: COLORS.border2, borderStyle: 'dashed',
    borderRadius: RADIUS.lg, paddingVertical: 14,
  },
  addMealIcon: { color: COLORS.cyan, fontSize: 20, fontWeight: '300' },
  addMealText: { color: COLORS.cyan, fontSize: 14, fontWeight: '600' },
  scanFoodTab: { paddingHorizontal: SPACING.xl, gap: 16 },
  scanCameraBtn: {
    backgroundColor: COLORS.cyanAlpha06, borderWidth: 1.5, borderColor: COLORS.border2, borderStyle: 'dashed',
    borderRadius: RADIUS.xl, padding: 28, alignItems: 'center', gap: 10,
  },
  scanCameraIcon: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: COLORS.cyanAlpha12, alignItems: 'center', justifyContent: 'center',
  },
  scanCameraTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  scanCameraSub: { color: COLORS.white3, fontSize: 13, textAlign: 'center', lineHeight: 20 },
  suggestionCard: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, padding: 14, gap: 10,
  },
  sugRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  sugName: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
  sugDesc: { color: COLORS.white3, fontSize: 11, marginTop: 3, lineHeight: 16 },
  sugCals: { alignItems: 'flex-end' },
  sugCalVal: { color: COLORS.cyan, fontSize: 18, fontWeight: '800' },
  sugCalUnit: { color: COLORS.white3, fontSize: 9 },
  sugMacros: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sugAddBtn: {
    backgroundColor: COLORS.cyan, borderRadius: RADIUS.circle,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  sugAddText: { color: COLORS.bg, fontSize: 11, fontWeight: '700' },
  sugReason: { color: COLORS.white3, fontSize: 11, fontStyle: 'italic' },
  caloriesTab: {},
  macroBreakdown: { paddingHorizontal: SPACING.xl, gap: 14 },
  macroBreakdownItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md, padding: 14,
  },
  mbRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mbLabel: { color: COLORS.white2, fontSize: 13, fontWeight: '600' },
  mbValue: { fontSize: 13, fontWeight: '700' },
});
