import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation.types';
import { TabNavigator } from './TabNavigator';
import { ScanReportScreen } from '../screens/main/ScanReportScreen';
import { ExerciseDetailScreen } from '../screens/main/ExerciseDetailScreen';
import { WorkoutSessionScreen } from '../screens/main/WorkoutSessionScreen';
import { WorkoutCompleteScreen } from '../screens/main/WorkoutCompleteScreen';
import { RoutineScreen } from '../screens/modals/RoutineScreen';
import { GymsScreen } from '../screens/modals/GymsScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: COLORS.bg },
    }}
  >
    <Stack.Screen name="MainTabs" component={TabNavigator} />
    <Stack.Screen
      name="ScanReport"
      component={ScanReportScreen}
      options={{ animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name="ExerciseDetail"
      component={ExerciseDetailScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <Stack.Screen
      name="WorkoutSession"
      component={WorkoutSessionScreen}
      options={{ animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name="WorkoutComplete"
      component={WorkoutCompleteScreen}
      options={{ animation: 'slide_from_bottom' }}
    />
    <Stack.Screen
      name="Routine"
      component={RoutineScreen}
      options={{ animation: 'slide_from_right' }}
    />
    <Stack.Screen
      name="Gyms"
      component={GymsScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </Stack.Navigator>
);
