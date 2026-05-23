import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Dimensions, Animated, ListRenderItemInfo,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { Button } from '../../components/Button';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    emoji: '🤖',
    title: 'AI-Powered\nForm Analysis',
    subtitle:
      'Real-time posture detection powered by MediaPipe. Get instant feedback on every rep — like having a personal trainer in your pocket.',
    accentColor: COLORS.cyan,
  },
  {
    id: '2',
    emoji: '📊',
    title: 'Track Every\nMetric That Matters',
    subtitle:
      'Calories, recovery score, HRV, sleep quality, streaks — all unified in one intelligent dashboard that learns your patterns.',
    accentColor: COLORS.blue,
  },
  {
    id: '3',
    emoji: '🎯',
    title: 'Personalized\nFitness Goals',
    subtitle:
      'Whether it\'s weight loss, muscle gain, or endurance — FitVision AI builds a plan around you and adapts as you improve.',
    accentColor: COLORS.purple,
  },
];

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const renderSlide = ({ item }: ListRenderItemInfo<typeof SLIDES[0]>) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.emojiWrap, { backgroundColor: `${item.accentColor}15`, borderColor: `${item.accentColor}30` }]}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <View style={[styles.glow, { backgroundColor: item.accentColor }]} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={i => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      />

      <View style={styles.footer}>
        {/* Dot indicators */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Continue'}
          onPress={handleNext}
          size="lg"
        />

        {currentIndex === SLIDES.length - 1 && (
          <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>
              Already have an account?{' '}
              <Text style={{ color: COLORS.cyan }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  skipBtn: {
    position: 'absolute', top: 56, right: 24, zIndex: 10,
    padding: 8,
  },
  skipText: { color: COLORS.white3, fontSize: 14, fontWeight: '500' },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
    paddingTop: 40,
  },
  emojiWrap: {
    width: 140, height: 140,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  emoji: { fontSize: 64 },
  glow: {
    position: 'absolute',
    width: 80, height: 80,
    borderRadius: 40,
    opacity: 0.15,
    bottom: -20,
  },
  title: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: COLORS.white2,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 48,
    gap: 16,
    alignItems: 'center',
  },
  dots: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  dot: {
    width: 7, height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.bg3,
  },
  dotActive: { width: 22, backgroundColor: COLORS.cyan },
  loginLink: { marginTop: 4 },
  loginLinkText: { color: COLORS.white3, fontSize: 13 },
});
