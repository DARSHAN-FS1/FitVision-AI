import {
  collection, addDoc, getDocs, query,
  where, orderBy, doc, setDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseService';
import { api } from './api';
import { DailyNutrition, MealLog, FoodItem, AIMealSuggestion } from '../types/nutrition.types';
import { format } from 'date-fns';

const MOCK_FOODS: FoodItem[] = [
  {
    id: 'food_001', name: 'Oats', servingSizeG: 100,
    calories: 389, macros: { proteinG: 17, carbsG: 66, fatsG: 7, fiberG: 11, sugarG: 1 },
    emoji: '🥣',
  },
  {
    id: 'food_002', name: 'Chicken Breast', servingSizeG: 100,
    calories: 165, macros: { proteinG: 31, carbsG: 0, fatsG: 3.6, fiberG: 0, sugarG: 0 },
    emoji: '🍗',
  },
  {
    id: 'food_003', name: 'Brown Rice', servingSizeG: 100,
    calories: 216, macros: { proteinG: 4.5, carbsG: 45, fatsG: 1.8, fiberG: 3.5, sugarG: 0.7 },
    emoji: '🍚',
  },
  {
    id: 'food_004', name: 'Salmon', servingSizeG: 100,
    calories: 208, macros: { proteinG: 20, carbsG: 0, fatsG: 13, fiberG: 0, sugarG: 0 },
    emoji: '🐟',
  },
  {
    id: 'food_005', name: 'Banana', servingSizeG: 118,
    calories: 105, macros: { proteinG: 1.3, carbsG: 27, fatsG: 0.4, fiberG: 3.1, sugarG: 14 },
    emoji: '🍌',
  },
  {
    id: 'food_006', name: 'Whey Protein', servingSizeG: 30,
    calories: 120, macros: { proteinG: 25, carbsG: 3, fatsG: 1.5, fiberG: 0, sugarG: 2 },
    emoji: '🥤',
  },
];

class NutritionService {
  async getDailyNutrition(userId: string, date?: string): Promise<DailyNutrition> {
    const targetDate = date ?? format(new Date(), 'yyyy-MM-dd');

    try {
      const q = query(
        collection(db, 'nutrition_logs'),
        where('userId', '==', userId),
        where('date', '==', targetDate),
        orderBy('loggedAt', 'asc')
      );
      const snap = await getDocs(q);
      const meals = snap.docs.map(d => ({ id: d.id, ...d.data() } as MealLog));

      return this.aggregateDailyNutrition(userId, targetDate, meals);
    } catch {
      return this.getEmptyDailyNutrition(userId, targetDate);
    }
  }

  async logMeal(meal: Omit<MealLog, 'id'>): Promise<MealLog> {
    const ref = await addDoc(collection(db, 'nutrition_logs'), {
      ...meal,
      savedAt: serverTimestamp(),
    });

    try {
      await api.post('/nutrition/log-meal', { ...meal, id: ref.id });
    } catch {
      // Non-blocking
    }

    return { ...meal, id: ref.id };
  }

  async searchFoods(query_: string): Promise<FoodItem[]> {
    try {
      const results = await api.get<FoodItem[]>(`/nutrition/foods/search?q=${query_}`);
      return results;
    } catch {
      return MOCK_FOODS.filter(f =>
        f.name.toLowerCase().includes(query_.toLowerCase())
      );
    }
  }

  async getAISuggestions(userId: string): Promise<AIMealSuggestion[]> {
    try {
      return await api.get<AIMealSuggestion[]>(`/nutrition/ai-suggestions/${userId}`);
    } catch {
      return this.getMockSuggestions();
    }
  }

  private aggregateDailyNutrition(
    userId: string,
    date: string,
    meals: MealLog[]
  ): DailyNutrition {
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totalCalories,
        proteinG: acc.proteinG + meal.totalMacros.proteinG,
        carbsG: acc.carbsG + meal.totalMacros.carbsG,
        fatsG: acc.fatsG + meal.totalMacros.fatsG,
        fiberG: acc.fiberG + meal.totalMacros.fiberG,
        sugarG: acc.sugarG + meal.totalMacros.sugarG,
      }),
      { calories: 0, proteinG: 0, carbsG: 0, fatsG: 0, fiberG: 0, sugarG: 0 }
    );

    return {
      date,
      userId,
      meals,
      totalCalories: totals.calories,
      totalMacros: totals,
      calorieGoal: 2200,
      proteinGoalG: 150,
      carbsGoalG: 250,
      fatsGoalG: 70,
      waterMl: 1800,
      waterGoalMl: 3000,
    };
  }

  private getEmptyDailyNutrition(userId: string, date: string): DailyNutrition {
    return {
      date,
      userId,
      meals: [],
      totalCalories: 0,
      totalMacros: { proteinG: 0, carbsG: 0, fatsG: 0, fiberG: 0, sugarG: 0 },
      calorieGoal: 2200,
      proteinGoalG: 150,
      carbsGoalG: 250,
      fatsGoalG: 70,
      waterMl: 0,
      waterGoalMl: 3000,
    };
  }

  private getMockSuggestions(): AIMealSuggestion[] {
    return [
      {
        id: 'sug_001',
        name: 'High Protein Breakfast',
        description: 'Oats with banana and whey protein for sustained energy',
        foods: [MOCK_FOODS[0], MOCK_FOODS[4], MOCK_FOODS[5]],
        totalCalories: 614,
        totalMacros: { proteinG: 43, carbsG: 96, fatsG: 9, fiberG: 14, sugarG: 17 },
        preparationMinutes: 10,
        tags: ['breakfast', 'high-protein', 'quick'],
        emoji: '🥣',
        reason: 'Matches your muscle gain goal with balanced macros',
      },
      {
        id: 'sug_002',
        name: 'Lean Muscle Lunch',
        description: 'Chicken breast with brown rice for post-workout recovery',
        foods: [MOCK_FOODS[1], MOCK_FOODS[2]],
        totalCalories: 381,
        totalMacros: { proteinG: 35.5, carbsG: 45, fatsG: 5.4, fiberG: 3.5, sugarG: 0.7 },
        preparationMinutes: 25,
        tags: ['lunch', 'post-workout', 'lean'],
        emoji: '🍗',
        reason: 'Ideal post-workout recovery meal ratio',
      },
    ];
  }
}

export const nutritionService = new NutritionService();
