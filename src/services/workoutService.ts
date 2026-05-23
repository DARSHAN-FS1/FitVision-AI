import {
  collection, addDoc, getDocs, query,
  where, orderBy, limit, doc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseService';
import { api } from './api';
import { WorkoutSession, WorkoutPlan } from '../types/workout.types';
import { WORKOUT_PLANS } from '../constants/exercises';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY_SESSIONS = 'cached_workout_sessions';
const CACHE_KEY_PENDING = 'pending_workout_sync';

class WorkoutService {
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    try {
      const remote = await api.get<WorkoutPlan[]>('/workouts/plans');
      return remote;
    } catch {
      return WORKOUT_PLANS; // fallback to local
    }
  }

  async getRecentSessions(userId: string, count = 10): Promise<WorkoutSession[]> {
    try {
      const q = query(
        collection(db, 'workout_sessions'),
        where('userId', '==', userId),
        orderBy('startedAt', 'desc'),
        limit(count)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as WorkoutSession));
    } catch {
      const cached = await AsyncStorage.getItem(CACHE_KEY_SESSIONS);
      return cached ? JSON.parse(cached) : [];
    }
  }

  async logSession(session: Omit<WorkoutSession, 'id'>): Promise<WorkoutSession> {
    // Save locally first (offline-first)
    const localId = `local_${Date.now()}`;
    const pending = await this.getPendingSync();
    pending.push({ ...session, id: localId });
    await AsyncStorage.setItem(CACHE_KEY_PENDING, JSON.stringify(pending));

    try {
      // Try Firestore
      const ref = await addDoc(collection(db, 'workout_sessions'), {
        ...session,
        createdAt: serverTimestamp(),
      });

      // Try backend analytics
      await api.post('/workouts/log', { ...session, id: ref.id });

      // Remove from pending
      await this.removePending(localId);

      return { ...session, id: ref.id };
    } catch {
      // Return local version — will sync later
      return { ...session, id: localId };
    }
  }

  async syncPendingSessions(): Promise<void> {
    const pending = await this.getPendingSync();
    const synced: string[] = [];

    for (const session of pending) {
      try {
        const ref = await addDoc(collection(db, 'workout_sessions'), session);
        await api.post('/workouts/log', { ...session, id: ref.id });
        synced.push(session.id);
      } catch {
        // Will retry next sync
      }
    }

    const remaining = pending.filter(s => !synced.includes(s.id));
    await AsyncStorage.setItem(CACHE_KEY_PENDING, JSON.stringify(remaining));
  }

  private async getPendingSync(): Promise<WorkoutSession[]> {
    const raw = await AsyncStorage.getItem(CACHE_KEY_PENDING);
    return raw ? JSON.parse(raw) : [];
  }

  private async removePending(id: string): Promise<void> {
    const pending = await this.getPendingSync();
    const filtered = pending.filter(s => s.id !== id);
    await AsyncStorage.setItem(CACHE_KEY_PENDING, JSON.stringify(filtered));
  }

  async updateSession(id: string, updates: Partial<WorkoutSession>): Promise<void> {
    await updateDoc(doc(db, 'workout_sessions', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  }
}

export const workoutService = new WorkoutService();
