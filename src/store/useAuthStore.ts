import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, SignupPayload, LoginPayload } from '../services/authService';
import { UserProfile } from '../types/user.types';

interface AuthStore {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      // Listen for Firebase auth state
      authService.onAuthChange(async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const profile = await authService.fetchProfile(firebaseUser.uid);
            const freshToken = await firebaseUser.getIdToken();
            await AsyncStorage.setItem('auth_token', freshToken);
            set({ user: profile, token: freshToken, isAuthenticated: true });
          } catch {
            set({ isAuthenticated: false, user: null, token: null });
          }
        } else {
          set({ isAuthenticated: false, user: null, token: null });
          await AsyncStorage.removeItem('auth_token');
        }
        set({ isLoading: false });
      });
    } catch {
      set({ isLoading: false, isAuthenticated: false });
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await authService.login(payload);
      const token = await AsyncStorage.getItem('auth_token');
      set({ user: profile, token, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: formatFirebaseError(message), isLoading: false });
    }
  },

  signup: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const profile = await authService.signup(payload);
      const token = await AsyncStorage.getItem('auth_token');
      set({ user: profile, token, isAuthenticated: true, isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed';
      set({ error: formatFirebaseError(message), isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.forgotPassword(email);
      set({ isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reset failed';
      set({ error: formatFirebaseError(message), isLoading: false });
    }
  },

  updateUser: (updates) => {
    const current = get().user;
    if (current) set({ user: { ...current, ...updates } });
  },

  clearError: () => set({ error: null }),
}));

function formatFirebaseError(message: string): string {
  if (message.includes('user-not-found')) return 'No account found with this email.';
  if (message.includes('wrong-password')) return 'Incorrect password.';
  if (message.includes('email-already-in-use')) return 'An account with this email already exists.';
  if (message.includes('weak-password')) return 'Password must be at least 6 characters.';
  if (message.includes('invalid-email')) return 'Please enter a valid email address.';
  if (message.includes('network-request-failed')) return 'Network error. Check your connection.';
  return message;
}
