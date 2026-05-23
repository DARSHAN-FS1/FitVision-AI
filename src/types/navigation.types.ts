export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Workout: undefined;
  AIScan: undefined;
  Nutrition: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  ScanReport: { sessionId: string };
  ExerciseDetail: { exerciseId: string };
  WorkoutSession: { planId: string };
  Routine: undefined;
  Gyms: undefined;
  Analytics: undefined;
  EditProfile: undefined;
  MealDetail: { mealId: string };
  FoodScan: undefined;
  WorkoutComplete: { session: any };
};
