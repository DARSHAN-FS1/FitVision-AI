export const DAILY_CALORIE_GOALS = {
  weight_loss: { sedentary: 1500, light: 1700, moderate: 1900, active: 2100, very_active: 2300 },
  muscle_gain: { sedentary: 2500, light: 2700, moderate: 2900, active: 3200, very_active: 3500 },
  general_fitness: { sedentary: 2000, light: 2200, moderate: 2400, active: 2600, very_active: 2800 },
  endurance: { sedentary: 2200, light: 2500, moderate: 2800, active: 3100, very_active: 3400 },
  flexibility: { sedentary: 1800, light: 2000, moderate: 2200, active: 2400, very_active: 2600 },
} as const;

export const MACRO_RATIOS = {
  weight_loss:    { protein: 0.35, carbs: 0.35, fats: 0.30 },
  muscle_gain:    { protein: 0.30, carbs: 0.50, fats: 0.20 },
  general_fitness:{ protein: 0.25, carbs: 0.50, fats: 0.25 },
  endurance:      { protein: 0.20, carbs: 0.60, fats: 0.20 },
  flexibility:    { protein: 0.25, carbs: 0.50, fats: 0.25 },
} as const;

export const CALORIES_PER_GRAM = { protein: 4, carbs: 4, fats: 9 } as const;

export const WATER_GOAL_ML = 3000;

export const MEAL_EMOJIS: Record<string, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
  pre_workout: '⚡',
  post_workout: '💪',
};

export function calculateMacroGoals(
  dailyCalories: number,
  goal: keyof typeof MACRO_RATIOS
): { proteinG: number; carbsG: number; fatsG: number } {
  const ratio = MACRO_RATIOS[goal];
  return {
    proteinG: Math.round((dailyCalories * ratio.protein) / CALORIES_PER_GRAM.protein),
    carbsG:   Math.round((dailyCalories * ratio.carbs)   / CALORIES_PER_GRAM.carbs),
    fatsG:    Math.round((dailyCalories * ratio.fats)    / CALORIES_PER_GRAM.fats),
  };
}
