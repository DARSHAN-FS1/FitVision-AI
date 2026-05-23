export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  | 'forearms' | 'core' | 'quads' | 'hamstrings' | 'glutes'
  | 'calves' | 'full_body';

export type WorkoutCategory = 'strength' | 'cardio' | 'yoga' | 'beginner' | 'hiit' | 'flexibility';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  category: WorkoutCategory;
  muscleGroups: MuscleGroup[];
  difficulty: Difficulty;
  sets?: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
  instructions: string[];
  tips: string[];
  aiReady: boolean;
  thumbnailEmoji: string;
  videoUrl?: string;
  equipment: string;
  homeGymType: 'home' | 'gym';
  caloriesEstimate: number;
}

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weightKg?: number;
  durationSeconds?: number;
  formScore?: number;
  completedAt: string;
}

export interface LoggedExercise {
  exercise: Exercise;
  sets: WorkoutSet[];
  totalReps: number;
  totalVolume: number;
  avgFormScore?: number;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  name: string;
  category: WorkoutCategory;
  exercises: LoggedExercise[];
  durationSeconds: number;
  totalCalories: number;
  avgFormScore?: number;
  startedAt: string;
  completedAt?: string;
  notes?: string;
  isCompleted: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  category: WorkoutCategory;
  difficulty: Difficulty;
  durationMinutes: number;
  exercises: Exercise[];
  thumbnailEmoji: string;
  isAIRecommended: boolean;
  tags: string[];
}
