import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/ScreenWrapper';
import { COLORS } from '../../constants/theme';

export const WorkoutCompleteScreen: React.FC = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.text}>Workout Complete (Reset)</Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.white3,
  },
});
