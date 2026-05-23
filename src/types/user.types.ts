export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type FitnessGoal = 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_fitness';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  bmi: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyMetrics {
  date: string;
  caloriesBurned: number;
  caloriesConsumed: number;
  hydrationLiters: number;
  recoveryPercent: number;
  hrv: number;
  sleepHours: number;
  streakDays: number;
  stepsCount: number;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
