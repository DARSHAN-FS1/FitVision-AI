import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from '../types/navigation.types';
import { HomeScreen } from '../screens/main/HomeScreen';
import { WorkoutScreen } from '../screens/main/WorkoutScreen';
import { AIScanScreen } from '../screens/main/AIScanScreen';
import { NutritionScreen } from '../screens/main/NutritionScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { COLORS, RADIUS } from '../constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconProps = { focused: boolean; label: string; icon: string };

const TabIcon: React.FC<TabIconProps> = ({ focused, label, icon }) => (
  <View style={[tiStyles.wrap, focused && tiStyles.wrapActive]}>
    <Text style={tiStyles.icon}>{icon}</Text>
    <Text style={[tiStyles.label, focused && tiStyles.labelActive]}>{label}</Text>
  </View>
);

const tiStyles = StyleSheet.create({
  wrap: {
    alignItems: 'center', justifyContent: 'center',
    gap: 2, paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 10,
  },
  wrapActive: { backgroundColor: 'rgba(0,212,184,0.10)' },
  icon: { fontSize: 20 },
  label: { fontSize: 9, fontWeight: '600', color: COLORS.white3 },
  labelActive: { color: COLORS.cyan },
});

const ScanTabButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity style={stbStyles.btn} onPress={onPress} activeOpacity={0.8}>
    <View style={stbStyles.circle}>
      <Text style={{ fontSize: 22, color: COLORS.bg }}>⚡</Text>
    </View>
  </TouchableOpacity>
);
const stbStyles = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center', marginTop: -20 },
  circle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.cyan,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 16, elevation: 8,
  },
});

export const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(14,18,26,0.97)',
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
          position: 'absolute',
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Home" icon="🏠" />
          ),
        }}
      />
      <Tab.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Workout" icon="💪" />
          ),
        }}
      />
      <Tab.Screen
        name="AIScan"
        component={AIScanScreen}
        options={{
          tabBarButton: (props) => (
            <ScanTabButton onPress={props.onPress as () => void} />
          ),
        }}
      />
      <Tab.Screen
        name="Nutrition"
        component={NutritionScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Nutrition" icon="🥗" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Profile" icon="👤" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
