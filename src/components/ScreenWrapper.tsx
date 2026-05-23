import React from 'react';
import {
  View, ScrollView, StyleSheet, ViewStyle,
  KeyboardAvoidingView, Platform, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  padBottom?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  keyboardAvoid?: boolean;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  scroll = false,
  style,
  contentStyle,
  padBottom = true,
  refreshing = false,
  onRefresh,
  keyboardAvoid = false,
}) => {
  const inner = scroll ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        padBottom && styles.paddedBottom,
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.cyan}
            colors={[COLORS.cyan]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  const content = keyboardAvoid ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : inner;

  return (
    <SafeAreaView
      style={[styles.container, style]}
      edges={['top', 'left', 'right']}
    >
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  paddedBottom: { paddingBottom: 100 },
});
