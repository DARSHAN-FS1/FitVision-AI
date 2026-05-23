import { create } from 'zustand';
import { workoutService } from '../services/workoutService';
import { WorkoutSession, WorkoutPlan, LoggedExercise } from '../types/workout.types';
import { WORKOUT_PLANS } from '../constants/exercises';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WorkoutStore {
  plans: WorkoutPlan[];
  recentSessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  favoriteExerciseIds: string[];
  isLoading: boolean;
  error: string | null;
  activeMode: 'gym' | 'home' | 'yoga';

  loadPlans: () => Promise<void>;
  loadRecentSessions: (userId: string) => Promise<void>;
  startSession: (plan: WorkoutPlan, userId: string) => void;
  completeExercise: (exercise: LoggedExercise) => void;
  finishSession: () => Promise<WorkoutSession | null>;
  cancelSession: () => void;
  clearError: () => void;
  toggleFavorite: (exerciseId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  setActiveMode: (mode: 'gym' | 'home' | 'yoga') => void;
}

export const useWorkoutStore = create<WorkoutStore>((set, get) => ({
  plans: WORKOUT_PLANS,
  recentSessions: [],
  activeSession: null,
  favoriteExerciseIds: [],
  isLoading: false,
  error: null,
  activeMode: 'gym',

  loadPlans: async () => {
    set({ isLoading: true });
    try {
      const plans = await workoutService.getWorkoutPlans();
      set({ plans, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  loadRecentSessions: async (userId) => {
    try {
      const sessions = await workoutService.getRecentSessions(userId);
      set({ recentSessions: sessions });
    } catch {
      // Non-blocking
    }
  },

  startSession: (plan, userId) => {
    const session: WorkoutSession = {
      id: `session_${Date.now()}`,
      userId,
      name: plan.name,
      category: plan.category,
      exercises: [],
      durationSeconds: 0,
      totalCalories: 0,
      startedAt: new Date().toISOString(),
      isCompleted: false,
    };
    set({ activeSession: session });
  },

  completeExercise: (exercise) => {
    const current = get().activeSession;
    if (!current) return;
    set({
      activeSession: {
        ...current,
        exercises: [...current.exercises, exercise],
      },
    });
  },

  finishSession: async () => {
    const session = get().activeSession;
    if (!session) return null;

    const totalReps = session.exercises.reduce(
      (acc, e) => acc + e.totalReps, 0
    );
    const totalVolume = session.exercises.reduce(
      (acc, e) => acc + e.totalVolume, 0
    );
    const totalCalories = Math.round(totalVolume * 0.05 + totalReps * 0.8);
    const durationSeconds = Math.round(
      (Date.now() - new Date(session.startedAt).getTime()) / 1000
    );

    const completed: Omit<WorkoutSession, 'id'> = {
      ...session,
      durationSeconds,
      totalCalories,
      completedAt: new Date().toISOString(),
      isCompleted: true,
    };

    try {
      const saved = await workoutService.logSession(completed);
      const current = get().recentSessions;
      set({
        activeSession: null,
        recentSessions: [saved, ...current].slice(0, 20),
      });
      return saved;
    } catch {
      set({ activeSession: null });
      return null;
    }
  },

  cancelSession: () => set({ activeSession: null }),
  clearError: () => set({ error: null }),

  toggleFavorite: async (exerciseId) => {
    const currentFavorites = get().favoriteExerciseIds;
    const isFav = currentFavorites.includes(exerciseId);
    const updated = isFav
      ? currentFavorites.filter(id => id !== exerciseId)
      : [...currentFavorites, exerciseId];

    set({ favoriteExerciseIds: updated });
    try {
      await AsyncStorage.setItem('favorite_exercises', JSON.stringify(updated));
    } catch {
      // Ignored
    }
  },

  loadFavorites: async () => {
    try {
      const raw = await AsyncStorage.getItem('favorite_exercises');
      if (raw) {
        set({ favoriteExerciseIds: JSON.parse(raw) });
      }
    } catch {
      // Ignored
    }
  },

  setActiveMode: (mode) => set({ activeMode: mode }),
}));
