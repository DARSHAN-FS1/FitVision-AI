import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

type GoalOption = { label: string; value: string; emoji: string };

const GOAL_OPTIONS: GoalOption[] = [
  { label: 'Weight Loss', value: 'weight_loss', emoji: '🔥' },
  { label: 'Muscle Gain', value: 'muscle_gain', emoji: '💪' },
  { label: 'Endurance', value: 'endurance', emoji: '🏃' },
  { label: 'Flexibility', value: 'flexibility', emoji: '🧘' },
];

const ACTIVITY_OPTIONS: GoalOption[] = [
  { label: 'Sedentary', value: 'sedentary', emoji: '🪑' },
  { label: 'Light', value: 'light', emoji: '🚶' },
  { label: 'Moderate', value: 'moderate', emoji: '🏋️' },
  { label: 'Very Active', value: 'very_active', emoji: '⚡' },
];

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    age: '',
    heightCm: '',
    weightKg: '',
    gender: 'male',
    fitnessGoal: 'weight_loss',
    activityLevel: 'moderate',
  });
  const [step, setStep] = useState(1);

  const { signup, isLoading, error, clearError } = useAuthStore();

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleNext = () => {
    if (step === 1) {
      if (!form.displayName || !form.email || !form.password) {
        Alert.alert('Missing Fields', 'Please fill all fields to continue.');
        return;
      }
    }
    setStep(2);
  };

  const handleSignup = async () => {
    if (!form.age || !form.heightCm || !form.weightKg) {
      Alert.alert('Missing Fields', 'Please fill your body stats.');
      return;
    }
    clearError();
    await signup({
      ...form,
      age: parseInt(form.age),
      heightCm: parseFloat(form.heightCm),
      weightKg: parseFloat(form.weightKg),
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          {step === 2 && (
            <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
              <Text style={{ color: COLORS.white, fontSize: 18 }}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>
            {step === 1 ? 'Create Account' : 'Your Fitness Profile'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1 ? 'Step 1 of 2 — Account' : 'Step 2 of 2 — Body Stats'}
          </Text>
          {/* Step dots */}
          <View style={styles.stepDots}>
            <View style={[styles.dot, step >= 1 && styles.dotActive]} />
            <View style={[styles.dot, step >= 2 && styles.dotActive]} />
          </View>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠ {error}</Text>
          </View>
        ) : null}

        {step === 1 ? (
          <View style={styles.form}>
            <InputField label="Full Name" placeholder="Arjun Reddy" value={form.displayName} onChangeText={v => update('displayName', v)} />
            <InputField label="Email" placeholder="you@email.com" value={form.email} onChangeText={v => update('email', v)} keyboardType="email-address" />
            <InputField label="Password" placeholder="Min 8 characters" value={form.password} onChangeText={v => update('password', v)} secure />

            <Button title="Continue →" onPress={handleNext} size="lg" style={{ marginTop: 8 }} />
          </View>
        ) : (
          <View style={styles.form}>
            {/* Gender */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.chipRow}>
                {['male', 'female', 'other'].map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, form.gender === g && styles.chipActive]}
                    onPress={() => update('gender', g)}
                  >
                    <Text style={[styles.chipText, form.gender === g && { color: COLORS.bg }]}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.rowInputs}>
              <InputField label="Age" placeholder="24" value={form.age} onChangeText={v => update('age', v)} keyboardType="numeric" style={{ flex: 1 }} />
              <InputField label="Height (cm)" placeholder="178" value={form.heightCm} onChangeText={v => update('heightCm', v)} keyboardType="numeric" style={{ flex: 1 }} />
            </View>

            <InputField label="Weight (kg)" placeholder="75" value={form.weightKg} onChangeText={v => update('weightKg', v)} keyboardType="numeric" />

            {/* Fitness Goal */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fitness Goal</Text>
              <View style={styles.goalGrid}>
                {GOAL_OPTIONS.map(g => (
                  <TouchableOpacity
                    key={g.value}
                    style={[styles.goalCard, form.fitnessGoal === g.value && styles.goalCardActive]}
                    onPress={() => update('fitnessGoal', g.value)}
                  >
                    <Text style={{ fontSize: 22 }}>{g.emoji}</Text>
                    <Text style={[styles.goalLabel, form.fitnessGoal === g.value && { color: COLORS.cyan }]}>{g.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Activity Level */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Activity Level</Text>
              <View style={styles.chipRow}>
                {ACTIVITY_OPTIONS.map(a => (
                  <TouchableOpacity
                    key={a.value}
                    style={[styles.chip, form.activityLevel === a.value && styles.chipActive, { flexShrink: 1 }]}
                    onPress={() => update('activityLevel', a.value)}
                  >
                    <Text style={[styles.chipText, form.activityLevel === a.value && { color: COLORS.bg }]}>
                      {a.emoji} {a.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button title="Create Account" onPress={handleSignup} loading={isLoading} size="lg" style={{ marginTop: 8 }} />
          </View>
        )}

        <TouchableOpacity style={styles.loginLink} onPress={() => navigation.replace('Login')}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={{ color: COLORS.cyan, fontWeight: '700' }}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InputField: React.FC<{
  label: string; placeholder: string; value: string;
  onChangeText: (v: string) => void; keyboardType?: any;
  secure?: boolean; style?: any;
}> = ({ label, placeholder, value, onChangeText, keyboardType, secure, style }) => (
  <View style={[inputStyles.group, style]}>
    <Text style={inputStyles.label}>{label}</Text>
    <TextInput
      style={inputStyles.input}
      placeholder={placeholder}
      placeholderTextColor={COLORS.white3}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType ?? 'default'}
      secureTextEntry={secure}
      autoCapitalize="none"
    />
  </View>
);
const inputStyles = StyleSheet.create({
  group: { gap: 6 },
  label: { color: COLORS.white2, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14, paddingVertical: 14,
    color: COLORS.white, fontSize: 15,
  },
});

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.xl, paddingTop: 56, paddingBottom: 40 },
  header: { marginBottom: 28, gap: 4, position: 'relative' },
  backBtn: {
    position: 'absolute', top: 0, left: -8,
    padding: 8,
  },
  title: { color: COLORS.white, fontSize: 26, fontWeight: '800', marginTop: 28 },
  subtitle: { color: COLORS.white3, fontSize: 13, marginTop: 2 },
  stepDots: { flexDirection: 'row', gap: 6, marginTop: 12 },
  dot: { width: 24, height: 4, borderRadius: 2, backgroundColor: COLORS.bg3 },
  dotActive: { backgroundColor: COLORS.cyan },
  errorBanner: {
    backgroundColor: 'rgba(255,92,92,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,92,92,0.3)',
    borderRadius: RADIUS.md, padding: 12, marginBottom: 12,
  },
  errorText: { color: COLORS.red, fontSize: 13 },
  form: { gap: 16 },
  inputGroup: { gap: 8 },
  label: { color: COLORS.white2, fontSize: 13, fontWeight: '600' },
  rowInputs: { flexDirection: 'row', gap: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9,
    backgroundColor: COLORS.bg3,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.circle,
  },
  chipActive: { backgroundColor: COLORS.cyan, borderColor: COLORS.cyan },
  chipText: { color: COLORS.white2, fontSize: 13, fontWeight: '600' },
  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  goalCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: COLORS.bg3,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    alignItems: 'center', gap: 6,
  },
  goalCardActive: { borderColor: COLORS.cyan, backgroundColor: COLORS.cyanAlpha06 },
  goalLabel: { color: COLORS.white2, fontSize: 12, fontWeight: '600', textAlign: 'center' },
  loginLink: { marginTop: 24, alignItems: 'center' },
  loginText: { color: COLORS.white3, fontSize: 14 },
});
