import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, Auth } from 'firebase/auth';
// @ts-ignore
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.FIREBASE_API_KEY ?? '',
  authDomain: Constants.expoConfig?.extra?.FIREBASE_AUTH_DOMAIN ?? '',
  projectId: Constants.expoConfig?.extra?.FIREBASE_PROJECT_ID ?? '',
  storageBucket: Constants.expoConfig?.extra?.FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: Constants.expoConfig?.extra?.FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: Constants.expoConfig?.extra?.FIREBASE_APP_ID ?? '',
};

// Prevent re-initialization in dev with hot reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let firebaseAuth: Auth;
try {
  firebaseAuth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  firebaseAuth = getAuth(app);
}

export const auth = firebaseAuth;
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
