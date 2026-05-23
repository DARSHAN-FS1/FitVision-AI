import { create } from 'zustand';
import { nutritionService } from '../services/nutritionService';
import { DailyNutrition, MealLog, AIMealSuggestion } from '../types/nutrition.types';
import { format } from 'date-fns';

interface NutritionStore {
  daily: DailyNutrition | null;
  suggestions: AIMealSuggestion[];
  isLoading: boolean;
  selectedDate: string;

  loadDaily: (userId: string, date?: string) => Promise<void>;
  loadSuggestions: (userId: string) => Promise<void>;
  logMeal: (meal: Omit<MealLog, 'id'>) => Promise<void>;
  updateWater: (ml: number) => void;
  setDate: (date: string) => void;
}

export const useNutritionStore = create<NutritionStore>((set, get) => ({
  daily: null,
  suggestions: [],
  isLoading: false,
  selectedDate: format(new Date(), 'yyyy-MM-dd'),

  loadDaily: async (userId, date) => {
    set({ isLoading: true });
    try {
      const daily = await nutritionService.getDailyNutrition(userId, date);
      set({ daily, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  loadSuggestions: async (userId) => {
    try {
      const suggestions = await nutritionService.getAISuggestions(userId);
      set({ suggestions });
    } catch {
      // Non-blocking
    }
  },

  logMeal: async (meal) => {
    try {
      const logged = await nutritionService.logMeal(meal);
      const daily = get().daily;
      if (daily) {
        set({
          daily: {
            ...daily,
            meals: [...daily.meals, logged],
            totalCalories: daily.totalCalories + logged.totalCalories,
            totalMacros: {
              proteinG: daily.totalMacros.proteinG + logged.totalMacros.proteinG,
              carbsG: daily.totalMacros.carbsG + logged.totalMacros.carbsG,
              fatsG: daily.totalMacros.fatsG + logged.totalMacros.fatsG,
              fiberG: daily.totalMacros.fiberG + logged.totalMacros.fiberG,
              sugarG: daily.totalMacros.sugarG + logged.totalMacros.sugarG,
            },
          },
        });
      }
    } catch {
      // Non-blocking
    }
  },

  updateWater: (ml) => {
    const daily = get().daily;
    if (daily) set({ daily: { ...daily, waterMl: daily.waterMl + ml } });
  },

  setDate: (date) => set({ selectedDate: date }),
}));
