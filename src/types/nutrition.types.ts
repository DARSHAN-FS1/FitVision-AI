export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';

export interface MacroNutrients {
  proteinG: number;
  carbsG: number;
  fatsG: number;
  fiberG: number;
  sugarG: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  servingSizeG: number;
  calories: number;
  macros: MacroNutrients;
  emoji: string;
  barcode?: string;
}

export interface MealLog {
  id: string;
  userId: string;
  date: string;
  mealType: MealType;
  foods: Array<{
    food: FoodItem;
    quantityG: number;
    calories: number;
  }>;
  totalCalories: number;
  totalMacros: MacroNutrients;
  loggedAt: string;
  notes?: string;
}

export interface DailyNutrition {
  date: string;
  userId: string;
  meals: MealLog[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  calorieGoal: number;
  proteinGoalG: number;
  carbsGoalG: number;
  fatsGoalG: number;
  waterMl: number;
  waterGoalMl: number;
}

export interface AIMealSuggestion {
  id: string;
  name: string;
  description: string;
  foods: FoodItem[];
  totalCalories: number;
  totalMacros: MacroNutrients;
  preparationMinutes: number;
  tags: string[];
  emoji: string;
  reason: string;
}

export interface NutritionPlan {
  id: string;
  userId: string;
  dailyCalorieGoal: number;
  dailyProteinGoalG: number;
  dailyCarbsGoalG: number;
  dailyFatsGoalG: number;
  mealCount: number;
  goal: 'weight_loss' | 'muscle_gain' | 'maintenance';
  suggestions: AIMealSuggestion[];
  createdAt: string;
}
