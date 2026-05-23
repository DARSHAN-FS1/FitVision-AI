import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { COLORS } from '../../constants/theme';
import { useAuthStore } from '../../store/useAuthStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          navigation.replace('Onboarding'); // or 'Login' based on onboarding done flag
        } else {
          navigation.replace('Onboarding');
        }
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>⚡</Text>
        </View>
        <Text style={styles.brand}>FitVision AI</Text>
        <Text style={styles.tagline}>Your AI-powered coach</Text>
      </Animated.View>

      <View style={styles.bottom}>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: { alignItems: 'center', gap: 16 },
  logoCircle: {
    width: 96, height: 96,
    borderRadius: 28,
    backgroundColor: COLORS.cyanAlpha12,
    borderWidth: 1, borderColor: COLORS.border2,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  logoEmoji: { fontSize: 44 },
  brand: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: { color: COLORS.white3, fontSize: 14 },
  bottom: { position: 'absolute', bottom: 40 },
  version: { color: COLORS.white3, fontSize: 12 },
});
