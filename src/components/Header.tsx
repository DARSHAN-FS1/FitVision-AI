import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING } from '../constants/theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: { icon: string; onPress: () => void };
}

export const Header: React.FC<HeaderProps> = ({
  title, subtitle, showBack = false, rightAction,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      <View style={styles.titleWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {rightAction ? (
        <TouchableOpacity onPress={rightAction.onPress} style={styles.rightBtn}>
          <Text style={styles.rightIcon}>{rightAction.icon}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.bg,
  },
  backBtn: {
    width: 36, height: 36,
    backgroundColor: COLORS.bg3,
    borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: COLORS.white, fontSize: 18 },
  titleWrap: { flex: 1, alignItems: 'center' },
  title: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  subtitle: { color: COLORS.white3, fontSize: 12, marginTop: 1 },
  placeholder: { width: 36 },
  rightBtn: {
    width: 36, height: 36,
    backgroundColor: COLORS.bg3,
    borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  rightIcon: { fontSize: 18 },
});
