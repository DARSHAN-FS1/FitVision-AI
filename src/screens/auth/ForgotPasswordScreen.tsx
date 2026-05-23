import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation.types';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/useAuthStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const { forgotPassword, isLoading } = useAuthStore();

  const handleSend = async () => {
    if (!email.trim()) {
      Alert.alert('Missing Email', 'Please enter your email address.');
      return;
    }
    await forgotPassword(email.trim().toLowerCase());
    setSent(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {sent ? (
          <View style={styles.successWrap}>
            <Text style={{ fontSize: 64 }}>📬</Text>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We've sent a password reset link to{'\n'}<Text style={{ color: COLORS.cyan }}>{email}</Text>
            </Text>
            <Button title="Back to Sign In" onPress={() => navigation.replace('Login')} />
          </View>
        ) : (
          <>
            <Text style={styles.emoji}>🔑</Text>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your account email and we'll send you a reset link.
            </Text>

            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
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
              <Button
                title="Send Reset Link"
                onPress={handleSend}
                loading={isLoading}
                size="lg"
                style={{ marginTop: 8 }}
              />
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  back: { position: 'absolute', top: 56, left: SPACING.xl, zIndex: 10, padding: 8 },
  backText: { color: COLORS.white2, fontSize: 14 },
  content: {
    flex: 1, paddingHorizontal: SPACING.xl,
    alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  successWrap: { alignItems: 'center', gap: 16 },
  emoji: { fontSize: 52, marginBottom: 8 },
  title: { color: COLORS.white, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: {
    color: COLORS.white3, fontSize: 14,
    textAlign: 'center', lineHeight: 22, marginBottom: 8,
  },
  form: { width: '100%', gap: 10 },
  label: { color: COLORS.white2, fontSize: 13, fontWeight: '600' },
  input: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14, paddingVertical: 14,
    color: COLORS.white, fontSize: 15,
  },
});
