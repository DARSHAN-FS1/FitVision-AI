import { create } from 'zustand';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebaseService';
import { api } from '../services/api';
import { UserProfile, DailyMetrics } from '../types/user.types';
import { useAuthStore } from './useAuthStore';

interface ProfileStore {
  metrics: DailyMetrics | null;
  isLoading: boolean;

  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loadMetrics: (userId: string) => Promise<void>;
  updateMetrics: (updates: Partial<DailyMetrics>) => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  metrics: null,
  isLoading: false,

  updateProfile: async (updates) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ isLoading: true });
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      await api.patch(`/profile/${user.uid}`, updates);
      useAuthStore.getState().updateUser(updates);
    } catch {
      // Non-blocking
    } finally {
      set({ isLoading: false });
    }
  },

  loadMetrics: async (userId) => {
    try {
      const metrics = await api.get<DailyMetrics>(`/analytics/daily/${userId}`);
      set({ metrics });
    } catch {
      // Use mock data for dev
      set({
        metrics: {
          date: new Date().toISOString().split('T')[0],
          caloriesBurned: 842,
          caloriesConsumed: 1840,
          hydrationLiters: 1.8,
          recoveryPercent: 78,
          hrv: 54,
          sleepHours: 7.2,
          streakDays: 12,
          stepsCount: 8420,
        },
      });
    }
  },

  updateMetrics: (updates) => {
    const current = get().metrics;
    if (current) set({ metrics: { ...current, ...updates } });
  },
}));
