import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebaseService';
import { api } from './api';
import { UserProfile } from '../types/user.types';
import Constants from 'expo-constants';

export interface SignupPayload {
  email: string;
  password: string;
  displayName: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  fitnessGoal: string;
  activityLevel: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const isMock = !Constants.expoConfig?.extra?.FIREBASE_API_KEY ||
               Constants.expoConfig?.extra?.FIREBASE_API_KEY.includes('YOUR_FIREBASE_API_KEY');

class AuthService {
  async signup(payload: SignupPayload): Promise<UserProfile> {
    if (isMock) {
      const profile: UserProfile = {
        uid: 'mock-user-123',
        email: payload.email,
        displayName: payload.displayName,
        age: payload.age,
        gender: payload.gender as UserProfile['gender'],
        heightCm: payload.heightCm,
        weightKg: payload.weightKg,
        targetWeightKg: payload.weightKg,
        activityLevel: payload.activityLevel as UserProfile['activityLevel'],
        fitnessGoal: payload.fitnessGoal as UserProfile['fitnessGoal'],
        bmi: this.calculateBMI(payload.weightKg, payload.heightCm),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('auth_token', 'mock-token-123');
      await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
      try {
        await api.post('/profile/create', profile);
      } catch {
        console.warn('Backend profile sync failed');
      }
      return profile;
    }

    const credential = await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );

    await updateProfile(credential.user, {
      displayName: payload.displayName,
    });

    const bmi = this.calculateBMI(payload.weightKg, payload.heightCm);

    const profile: UserProfile = {
      uid: credential.user.uid,
      email: payload.email,
      displayName: payload.displayName,
      age: payload.age,
      gender: payload.gender as UserProfile['gender'],
      heightCm: payload.heightCm,
      weightKg: payload.weightKg,
      targetWeightKg: payload.weightKg,
      activityLevel: payload.activityLevel as UserProfile['activityLevel'],
      fitnessGoal: payload.fitnessGoal as UserProfile['fitnessGoal'],
      bmi,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', credential.user.uid), {
      ...profile,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Sync to FastAPI backend
    const token = await credential.user.getIdToken();
    await AsyncStorage.setItem('auth_token', token);

    try {
      await api.post('/profile/create', profile);
    } catch {
      // Backend sync failure is non-blocking
      console.warn('Backend profile sync failed, will retry later');
    }

    return profile;
  }

  async login(payload: LoginPayload): Promise<UserProfile> {
    if (isMock) {
      await AsyncStorage.setItem('auth_token', 'mock-token-123');
      let profile: UserProfile;
      try {
        const stored = await AsyncStorage.getItem('user_profile');
        if (stored) {
          profile = JSON.parse(stored);
        } else {
          profile = {
            uid: 'mock-user-123',
            email: payload.email || 'developer@fitvision.ai',
            displayName: 'FitVision Developer',
            age: 28,
            gender: 'male',
            heightCm: 180,
            weightKg: 75,
            targetWeightKg: 75,
            activityLevel: 'active',
            fitnessGoal: 'muscle_gain',
            bmi: 23.1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
        }
      } catch {
        profile = {
          uid: 'mock-user-123',
          email: payload.email || 'developer@fitvision.ai',
          displayName: 'FitVision Developer',
          age: 28,
          gender: 'male',
          heightCm: 180,
          weightKg: 75,
          targetWeightKg: 75,
          activityLevel: 'active',
          fitnessGoal: 'muscle_gain',
          bmi: 23.1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      try {
        await api.post('/profile/create', profile);
      } catch {
        // Ignored
      }
      return profile;
    }

    const credential = await signInWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );

    const token = await credential.user.getIdToken();
    await AsyncStorage.setItem('auth_token', token);

    const profile = await this.fetchProfile(credential.user.uid);
    return profile;
  }

  async logout(): Promise<void> {
    if (isMock) {
      await AsyncStorage.multiRemove(['auth_token', 'user_profile']);
      return;
    }
    await signOut(auth);
    await AsyncStorage.multiRemove(['auth_token', 'user_profile']);
  }

  async forgotPassword(email: string): Promise<void> {
    if (isMock) return;
    await sendPasswordResetEmail(auth, email);
  }

  async fetchProfile(uid: string): Promise<UserProfile> {
    if (isMock) {
      const stored = await AsyncStorage.getItem('user_profile');
      if (stored) return JSON.parse(stored);
      return {
        uid: 'mock-user-123',
        email: 'developer@fitvision.ai',
        displayName: 'FitVision Developer',
        age: 28,
        gender: 'male',
        heightCm: 180,
        weightKg: 75,
        targetWeightKg: 75,
        activityLevel: 'active',
        fitnessGoal: 'muscle_gain',
        bmi: 23.1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) throw new Error('Profile not found');
    return snap.data() as UserProfile;
  }

  onAuthChange(callback: (user: FirebaseUser | null) => void) {
    if (isMock) {
      const mockFirebaseUser = {
        uid: 'mock-user-123',
        email: 'developer@fitvision.ai',
        displayName: 'FitVision Developer',
        getIdToken: async () => 'mock-token-123',
      } as unknown as FirebaseUser;
      
      setTimeout(() => callback(mockFirebaseUser), 0);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }

  private calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  }

  async refreshToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    const token = await user.getIdToken(true);
    await AsyncStorage.setItem('auth_token', token);
    return token;
  }
}

export const authService = new AuthService();
