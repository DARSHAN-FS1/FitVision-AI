import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    clearError();
    await login({ email: email.trim().toLowerCase(), password });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logo}>
            <Text style={{ fontSize: 32 }}>⚡</Text>
          </View>
          <Text style={styles.brand}>FitVision AI</Text>
          <Text style={styles.welcomeText}>Welcome back</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@email.com"
              placeholderTextColor={COLORS.white3}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>Password</Text>
              <TouchableOpacity onPress={() => navigation.push('ForgotPassword')}>
                <Text style={styles.forgotText}>Forgot?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.pwdWrap}>
              <TextInput
                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                placeholder="••••••••"
                placeholderTextColor={COLORS.white3}
                secureTextEntry={!showPwd}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPwd(!showPwd)}
              >
                <Text style={styles.eyeIcon}>{showPwd ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            size="lg"
            style={{ marginTop: 8 }}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social (layout ready) */}
          <View style={styles.socialRow}>
            {['G  Google', '  Apple'].map((label, i) => (
              <TouchableOpacity key={i} style={styles.socialBtn}>
                <Text style={styles.socialText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => navigation.push('Signup')}
        >
          <Text style={styles.signupText}>
            Don't have an account?{' '}
            <Text style={{ color: COLORS.cyan, fontWeight: '700' }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.xl, paddingTop: 60, paddingBottom: 40 },
  logoWrap: { alignItems: 'center', gap: 10, marginBottom: 36 },
  logo: {
    width: 68, height: 68, borderRadius: 20,
    backgroundColor: COLORS.cyanAlpha12,
    borderWidth: 1, borderColor: COLORS.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  brand: { color: COLORS.white, fontSize: 22, fontWeight: '800' },
  welcomeText: { color: COLORS.white3, fontSize: 14 },
  form: { gap: 16 },
  errorBanner: {
    backgroundColor: 'rgba(255,92,92,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,92,92,0.3)',
    borderRadius: RADIUS.md,
    padding: 12,
  },
  errorText: { color: COLORS.red, fontSize: 13 },
  inputGroup: { gap: 6 },
  inputLabel: { color: COLORS.white2, fontSize: 13, fontWeight: '600' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotText: { color: COLORS.cyan, fontSize: 13 },
  input: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14, paddingVertical: 14,
    color: COLORS.white, fontSize: 15,
  },
  pwdWrap: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg3,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    paddingRight: 14,
  },
  eyeBtn: { padding: 4 },
  eyeIcon: { fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { color: COLORS.white3, fontSize: 12 },
  socialRow: { flexDirection: 'row', gap: 10 },
  socialBtn: {
    flex: 1,
    backgroundColor: COLORS.bg3,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    alignItems: 'center',
  },
  socialText: { color: COLORS.white2, fontSize: 14, fontWeight: '600' },
  signupLink: { marginTop: 24, alignItems: 'center' },
  signupText: { color: COLORS.white3, fontSize: 14 },
});
