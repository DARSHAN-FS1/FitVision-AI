import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  Pressable,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { COLORS, RADIUS, SPACING, DIFFICULTY_COLORS } from '../../constants/theme';
import { useWorkoutStore } from '../../store/useWorkoutStore';
import { EXERCISES, YOGA_EXERCISES } from '../../constants/exercises';
import { Exercise } from '../../types/workout.types';

// IDs of the specific exercises requested to be at the top of each mode
const GYM_TOP_IDS = ['squat_001', 'deadlift_001', 'bench_001', 'shoulder_press_001', 'bicep_curl_001'];
const HOME_TOP_IDS = ['pushup_001', 'bodyweight_squat_001', 'plank_001', 'walking_lunges_001', 'jumping_jacks_001'];
const YOGA_TOP_IDS = ['yoga_001', 'yoga_004', 'yoga_003', 'yoga_002', 'yoga_006'];

const ALL_EXERCISES = [...EXERCISES, ...YOGA_EXERCISES];

// Mapping custom names for specific items to match user instructions
const getCustomName = (exercise: Exercise) => {
  if (exercise.id === 'walking_lunges_001') return 'Lunges';
  if (exercise.id === 'yoga_004') return 'Cobra';
  if (exercise.id === 'yoga_002') return 'Warrior Pose';
  return exercise.name;
};

// Premium Button Pressable Scale Component (CTA / Actions)
const ButtonPressableScale: React.FC<{
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
}> = ({ onPress, children, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.96,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }], width: '100%', height: '100%' }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

// Premium Card Pressable Scale Component (List Cards)
const CardPressableScale: React.FC<{
  onPress?: () => void;
  children: React.ReactNode;
  style?: any;
}> = ({ onPress, children, style }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.98,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }], width: '100%' }}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export const WorkoutScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const { favoriteExerciseIds, toggleFavorite, loadFavorites } = useWorkoutStore();

  const [mode, setMode] = useState<'gym' | 'home' | 'yoga'>('gym');
  const [search, setSearch] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Smooth fade-in animation value for list switching
  const listFadeAnim = useRef(new Animated.Value(1)).current;

  // Scroll tracking for collapsible card box
  const scrollY = useRef(new Animated.Value(0)).current;
  const smoothScrollY = useRef(new Animated.Value(0)).current;

  const HEADER_HEIGHT = 56 + insets.top;
  const VISUAL_HEADER_BOTTOM = HEADER_HEIGHT - 40; // offsets the header's marginTop: -40
  const CARD_MAX_HEIGHT = 180;
  const CARD_MIN_HEIGHT = 64;
  const CARD_GAP = 12; // vertical gap between header and card
  const SHRINK_DISTANCE = CARD_MAX_HEIGHT - CARD_MIN_HEIGHT; // 116px

  const cardHeight = smoothScrollY.interpolate({
    inputRange: [0, SHRINK_DISTANCE],
    outputRange: [CARD_MAX_HEIGHT, CARD_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const expandedOpacity = smoothScrollY.interpolate({
    inputRange: [0, SHRINK_DISTANCE * 0.5],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const collapsedOpacity = smoothScrollY.interpolate({
    inputRange: [SHRINK_DISTANCE * 0.4, SHRINK_DISTANCE * 0.9],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Smoothly spring animate the card height tracking scroll position
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      Animated.spring(smoothScrollY, {
        toValue: value,
        friction: 9,
        tension: 40,
        useNativeDriver: false,
      }).start();
    });
    return () => scrollY.removeListener(listener);
  }, []);

  useEffect(() => {
    loadFavorites();
  }, []);

  // Listen to scroll to disable clicks on invisible state buttons
  useEffect(() => {
    const listener = scrollY.addListener(({ value }) => {
      if (value > SHRINK_DISTANCE * 0.5) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    });
    return () => scrollY.removeListener(listener);
  }, []);

  // Trigger smooth fade transition when tabs or search results update
  useEffect(() => {
    listFadeAnim.setValue(0.5);
    Animated.timing(listFadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [mode, search]);

  // Format today's date to match: "SAT • 23 MAY"
  const formattedDate = useMemo(() => {
    const date = new Date();
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${days[date.getDay()]} • ${date.getDate()} ${months[date.getMonth()]}`;
  }, []);

  // Filter and order exercises according to the selected mode and search string
  const activeExercises = useMemo(() => {
    let topIds: string[] = [];
    let modeExercises: Exercise[] = [];

    if (mode === 'gym') {
      topIds = GYM_TOP_IDS;
      modeExercises = EXERCISES.filter(e => e.homeGymType === 'gym');
    } else if (mode === 'home') {
      topIds = HOME_TOP_IDS;
      modeExercises = EXERCISES.filter(e => e.homeGymType === 'home' && e.category !== 'yoga');
    } else {
      topIds = YOGA_TOP_IDS;
      modeExercises = YOGA_EXERCISES;
    }

    // Build the ordered list of specific top exercises
    const topList: Exercise[] = [];
    topIds.forEach(id => {
      const found = ALL_EXERCISES.find(e => e.id === id);
      if (found) {
        topList.push(found);
      }
    });

    // Get the remaining exercises for this mode
    const remainingList = modeExercises.filter(e => !topIds.includes(e.id));
    const combined = [...topList, ...remainingList];

    // Filter by search string if typed
    if (search.trim().length > 0) {
      const query = search.toLowerCase();
      return combined.filter(e => {
        const displayName = getCustomName(e);
        return displayName.toLowerCase().includes(query) ||
          e.muscleGroups.some(m => m.toLowerCase().includes(query)) ||
          e.equipment.toLowerCase().includes(query);
      });
    }

    return combined;
  }, [mode, search]);

  return (
    <ScreenWrapper scroll={false} style={styles.container}>
      {/* Scrollable content (rendered first so absolute sticky overlays float correctly on top) */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          styles.scrollView,
          {
            top: VISUAL_HEADER_BOTTOM + CARD_MIN_HEIGHT + CARD_GAP, // starts exactly below collapsed card + gap
          }
        ]}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        stickyHeaderIndices={[1]} // Make the switcher + search bar container sticky
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={8}
      >
        {/* Child 0: Spacer that shrinks in sync with the collapsing card */}
        <View style={{ height: SHRINK_DISTANCE }} />

        {/* Child 1: The Sticky Switcher & Search Bar container */}
        <View style={styles.stickyHeaderContainer}>
          {/* 3. MODE SWITCHER (Floating pill, stronger active cyan) */}
          <View style={styles.modeSwitcher}>
            {(['gym', 'home', 'yoga'] as const).map((m) => {
              const isActive = mode === m;
              return (
                <TouchableOpacity
                  key={m}
                  style={[styles.modeTab, isActive && styles.modeTabActive]}
                  onPress={() => setMode(m)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.modeTabText, isActive && styles.modeTabTextActive]}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 4. SEARCH BAR (Glass dark fill, premium placeholder) */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search exercises, muscles, yoga..."
              placeholderTextColor={COLORS.white3}
              autoCapitalize="none"
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
                <Text style={styles.clearSearchIcon}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 5. STICKY EXERCISE SECTION HEADER */}
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseHeaderTitle}>Exercise</Text>
          </View>
        </View>

        {/* Child 2: Exercise List (Fades smoothly on transition) */}
        <Animated.View style={[styles.listContainer, { opacity: listFadeAnim }]}>
          {activeExercises.map((exercise) => {
            const isLiked = favoriteExerciseIds.includes(exercise.id);
            const customName = getCustomName(exercise);
            const diffColor = DIFFICULTY_COLORS[exercise.difficulty] || COLORS.amber;

            return (
              <CardPressableScale
                key={exercise.id}
                style={cardStyles.cardContainer}
              >
                <View style={cardStyles.card}>
                  {/* Visual preview box with emoji */}
                  <View style={cardStyles.thumbContainer}>
                    <Text style={cardStyles.emoji}>{exercise.thumbnailEmoji}</Text>
                  </View>

                  {/* Info & Tags */}
                  <View style={cardStyles.infoContainer}>
                    <Text style={cardStyles.name} numberOfLines={1}>{customName}</Text>
                    <Text style={cardStyles.details} numberOfLines={1}>
                      {exercise.muscleGroups.map(m => m.charAt(0).toUpperCase() + m.slice(1).replace('_', ' ')).join(', ')}
                    </Text>
                    <View style={cardStyles.tagRow}>
                      <View style={[cardStyles.diffBadge, { backgroundColor: `${diffColor}15` }]}>
                        <Text style={[cardStyles.diffText, { color: diffColor }]}>
                          {exercise.difficulty.toUpperCase()}
                        </Text>
                      </View>
                      {exercise.equipment && (
                        <View style={cardStyles.equipBadge}>
                          <Text style={cardStyles.equipText}>{exercise.equipment.toUpperCase()}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Like Button */}
                  <TouchableOpacity
                    style={cardStyles.likeBtn}
                    onPress={() => toggleFavorite(exercise.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[cardStyles.likeIcon, isLiked && cardStyles.likeIconActive]}>
                      {isLiked ? '❤️' : '♡'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </CardPressableScale>
            );
          })}
        </Animated.View>
      </Animated.ScrollView>

      {/* 1. HEADER (Fixed at the top, Back button removed) */}
      <View style={[styles.header, { height: HEADER_HEIGHT, paddingTop: insets.top }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>My Workout</Text>
        </View>

        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.8}>
          <Text style={styles.headerBtnText}>🔖</Text>
        </TouchableOpacity>
      </View>

      {/* 2. COLLAPSIBLE SMART ROUTINE BOX (Collapses and stays sticky below header) */}
      <Animated.View style={[
        styles.smartCardContainer,
        {
          top: VISUAL_HEADER_BOTTOM + CARD_GAP, // added gap between header and card
          height: cardHeight
        }
      ]}>
        {/* Background Gradient */}
        <LinearGradient
          colors={['rgba(22, 28, 38, 0.95)', 'rgba(10, 12, 15, 0.99)']}
          style={styles.smartCardBg}
        />

        {/* Expanded Card Content */}
        <Animated.View
          style={[styles.expandedContent, { opacity: expandedOpacity }]}
          pointerEvents={isCollapsed ? 'none' : 'auto'}
        >
          <View style={styles.smartCardHeader}>
            <Text style={styles.smartCardDate}>{formattedDate}</Text>
            <View style={styles.smartBadge}>
              <Text style={styles.smartBadgeText}>AI ROUTINE</Text>
            </View>
          </View>

          <Text style={styles.smartCardTitle}>Start Your Fitness Journey</Text>
          <Text style={styles.smartCardSubtitle}>Generate your smart workout routine</Text>

          <ButtonPressableScale style={styles.generateBtnContainer}>
            <View style={styles.shadowCaster}>
              <LinearGradient
                colors={[COLORS.cyan, COLORS.cyan2]}
                style={styles.generateBtn}
              >
                <Text style={styles.generateBtnText}>GENERATE ROUTINE</Text>
              </LinearGradient>
            </View>
          </ButtonPressableScale>
        </Animated.View>

        {/* Collapsed Card Content */}
        <Animated.View
          style={[styles.collapsedContent, { opacity: collapsedOpacity }]}
          pointerEvents={isCollapsed ? 'auto' : 'none'}
        >
          <View style={styles.collapsedLeft}>
            <Text style={styles.collapsedDate}>{formattedDate}</Text>
            <Text style={styles.collapsedTitle}>Start Your Journey</Text>
          </View>

          <ButtonPressableScale style={styles.collapsedBtnContainer}>
            <LinearGradient
              colors={[COLORS.cyan, COLORS.cyan2]}
              style={styles.collapsedBtn}
            >
              <Text style={styles.collapsedBtnText}>GENERATE</Text>
            </LinearGradient>
          </ButtonPressableScale>
        </Animated.View>
      </Animated.View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.bg,
    zIndex: 11,
    marginTop: -40,

  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerSubtitle: {
    color: COLORS.cyan,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '900',
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: {
    fontSize: 18,
  },
  smartCardContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginHorizontal: SPACING.xl,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 184, 0.25)', // soft cyan edge glow
    backgroundColor: 'rgba(22, 28, 38, 0.7)', // glass effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
    zIndex: 10,
  },
  smartCardBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
  },
  expandedContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  collapsedContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  smartCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  smartCardDate: {
    color: COLORS.cyan,
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  smartBadge: {
    backgroundColor: COLORS.cyanAlpha12,
    borderWidth: 1,
    borderColor: COLORS.border2,
    borderRadius: RADIUS.circle,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  smartBadgeText: {
    color: COLORS.cyan,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  smartCardTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 23,
    marginBottom: 8,
  },
  smartCardSubtitle: {
    color: COLORS.white2,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 20,
  },
  generateBtnContainer: {
    width: '100%',
    height: 48,
    borderRadius: RADIUS.md,
  },
  shadowCaster: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.cyan,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  generateBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: RADIUS.md,
  },
  generateBtnText: {
    color: COLORS.bg,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  collapsedLeft: {
    flexDirection: 'column',
  },
  collapsedDate: {
    color: COLORS.cyan,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  collapsedTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  collapsedBtnContainer: {
    width: 100,
    height: 32,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  collapsedBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.sm,
  },
  collapsedBtnText: {
    color: COLORS.bg,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stickyHeaderContainer: {
    backgroundColor: COLORS.bg,
    paddingTop: 12,
    paddingBottom: 0,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: 'rgba(22, 28, 38, 0.65)', // glass dark fill
    borderRadius: 100, // pill shape
    padding: 4,
    marginHorizontal: SPACING.xl,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  modeTabActive: {
    backgroundColor: COLORS.cyan, // active tab stronger cyan
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modeTabText: {
    color: COLORS.white3,
    fontSize: 14,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: COLORS.bg, // dark text on bright active background
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 28, 38, 0.5)', // glass dark fill
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.xl,
    height: 50,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: SPACING.md, // better icon spacing
    color: COLORS.white3,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    height: '100%',
    padding: 0,
  },
  clearSearchIcon: {
    fontSize: 20,
    color: COLORS.white3,
    marginLeft: SPACING.sm,
  },
  exerciseHeader: {
    paddingHorizontal: SPACING.xl,
    paddingTop: 12,
    paddingBottom: 6,
  },
  exerciseHeaderTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: SPACING.md,
  },
});

const cardStyles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbContainer: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emoji: {
    fontSize: 30,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  details: {
    color: COLORS.white2,
    fontSize: 12,
    marginBottom: 6,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  diffText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  equipBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
  },
  equipText: {
    color: COLORS.white2,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  likeBtn: {
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 20,
    color: COLORS.white3,
  },
  likeIconActive: {
    color: COLORS.red,
  },
});
