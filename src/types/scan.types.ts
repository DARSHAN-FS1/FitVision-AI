export type PostureState = 'correct' | 'incorrect' | 'adjusting' | 'idle';
export type ExerciseType = 'squat' | 'pushup' | 'deadlift' | 'lunge' | 'pullup' | 'plank' | 'custom';

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export type PoseLandmarks = Record<string, PoseLandmark>;

export interface JointAngles {
  leftKneeAngle: number;
  rightKneeAngle: number;
  leftHipAngle: number;
  rightHipAngle: number;
  leftShoulderAngle: number;
  rightShoulderAngle: number;
  backAngle: number;
  neckAngle: number;
}

export interface FormAnalysis {
  postureState: PostureState;
  overallScore: number;
  jointAngles: JointAngles;
  corrections: string[];
  positives: string[];
  confidence: number;
}

export interface RepCount {
  total: number;
  current: number;
  state: 'up' | 'down' | 'transition';
  lastRepAt?: number;
}

export interface ScanFrame {
  landmarks: PoseLandmarks;
  formAnalysis: FormAnalysis;
  repCount: RepCount;
  timestamp: number;
}

export interface ScanSession {
  id: string;
  userId: string;
  exerciseType: ExerciseType;
  startedAt: string;
  endedAt?: string;
  durationSeconds: number;
  totalReps: number;
  avgFormScore: number;
  avgKneeAngle: number;
  avgBackAngle: number;
  postureAccuracy: number;
  caloriesBurned: number;
  peakFormScore: number;
  corrections: string[];
  frames?: ScanFrame[];
  isCompleted: boolean;
}

export interface ScanReport {
  session: ScanSession;
  postureScore: number;
  suggestions: SuggestionItem[];
  improvements: string[];
  nextSteps: string[];
}

export interface SuggestionItem {
  type: 'warning' | 'tip' | 'success';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}
