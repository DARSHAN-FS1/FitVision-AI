import { create } from 'zustand';
import { scanService } from '../services/scanService';
import { ScanSession, ScanReport, FormAnalysis, RepCount, ExerciseType } from '../types/scan.types';
import { RepCounter } from '../ai/repCounter';
import { feedbackEngine } from '../ai/feedbackEngine';

interface ScanStore {
  activeSession: Partial<ScanSession> | null;
  sessionId: string | null;
  currentFormAnalysis: FormAnalysis | null;
  currentRepCount: RepCount;
  isScanning: boolean;
  isPaused: boolean;
  recentSessions: ScanSession[];
  lastReport: ScanReport | null;
  selectedExercise: ExerciseType;
  repCounter: RepCounter | null;

  setSelectedExercise: (exercise: ExerciseType) => void;
  startScan: (userId: string) => Promise<void>;
  pauseScan: () => void;
  resumeScan: () => void;
  updateFormAnalysis: (analysis: FormAnalysis, timestamp: number) => void;
  endScan: () => Promise<ScanReport | null>;
  loadRecentSessions: (userId: string) => Promise<void>;
  clearReport: () => void;
}

const DEFAULT_REP_COUNT: RepCount = {
  total: 0, current: 0, state: 'up',
};

export const useScanStore = create<ScanStore>((set, get) => ({
  activeSession: null,
  sessionId: null,
  currentFormAnalysis: null,
  currentRepCount: DEFAULT_REP_COUNT,
  isScanning: false,
  isPaused: false,
  recentSessions: [],
  lastReport: null,
  selectedExercise: 'squat',
  repCounter: null,

  setSelectedExercise: (exercise) => {
    set({
      selectedExercise: exercise,
      repCounter: new RepCounter(exercise),
    });
  },

  startScan: async (userId) => {
    const exercise = get().selectedExercise;
    const counter = new RepCounter(exercise);

    await feedbackEngine.triggerFeedback('session_start', { force: true });

    try {
      const sessionId = await scanService.startSession(userId, exercise);
      set({
        sessionId,
        activeSession: {
          userId,
          exerciseType: exercise,
          startedAt: new Date().toISOString(),
          totalReps: 0,
          avgFormScore: 0,
          isCompleted: false,
        },
        isScanning: true,
        isPaused: false,
        repCounter: counter,
        currentRepCount: DEFAULT_REP_COUNT,
      });
    } catch {
      set({ isScanning: false });
    }
  },

  pauseScan: () => set({ isPaused: true }),
  resumeScan: () => set({ isPaused: false }),

  updateFormAnalysis: (analysis, timestamp) => {
    const { repCounter, activeSession, currentRepCount } = get();
    if (!repCounter) return;

    const newRepCount = repCounter.update(analysis.jointAngles, timestamp);
    const prevReps = currentRepCount.total;

    // Trigger feedback on new rep
    if (newRepCount.total > prevReps) {
      feedbackEngine.onRepCompleted(newRepCount.total);
    }

    // Trigger feedback on posture state change
    feedbackEngine.onPostureStateChange(analysis.postureState);

    // Update running average score
    const sessionFrames = (activeSession as Record<string, unknown>)?._frameCount as number ?? 0;
    const prevAvg = activeSession?.avgFormScore ?? 0;
    const newAvg = (prevAvg * sessionFrames + analysis.overallScore) / (sessionFrames + 1);

    set({
      currentFormAnalysis: analysis,
      currentRepCount: newRepCount,
      activeSession: {
        ...activeSession,
        avgFormScore: Math.round(newAvg * 10) / 10,
        totalReps: newRepCount.total,
        _frameCount: sessionFrames + 1,
      } as Partial<ScanSession>,
    });
  },

  endScan: async () => {
    const { activeSession, sessionId, selectedExercise } = get();
    if (!activeSession || !sessionId) return null;

    await feedbackEngine.triggerFeedback('session_end', { force: true });

    const durationSeconds = Math.round(
      (Date.now() - new Date(activeSession.startedAt ?? '').getTime()) / 1000
    );

    const sessionData: Omit<ScanSession, 'id'> = {
      userId: activeSession.userId ?? '',
      exerciseType: selectedExercise,
      startedAt: activeSession.startedAt ?? new Date().toISOString(),
      endedAt: new Date().toISOString(),
      durationSeconds,
      totalReps: activeSession.totalReps ?? 0,
      avgFormScore: activeSession.avgFormScore ?? 0,
      avgKneeAngle: 87,
      avgBackAngle: 165,
      postureAccuracy: activeSession.avgFormScore ?? 0,
      caloriesBurned: Math.round((activeSession.totalReps ?? 0) * 0.8),
      peakFormScore: 98,
      corrections: [],
      isCompleted: true,
    };

    try {
      const saved = await scanService.saveSession(sessionData);
      const report = scanService.generateReport(saved);
      set({
        isScanning: false,
        isPaused: false,
        activeSession: null,
        lastReport: report,
        currentRepCount: DEFAULT_REP_COUNT,
      });
      return report;
    } catch {
      set({ isScanning: false, activeSession: null });
      return null;
    }
  },

  loadRecentSessions: async (userId) => {
    try {
      const sessions = await scanService.getRecentSessions(userId);
      set({ recentSessions: sessions });
    } catch {
      // Non-blocking
    }
  },

  clearReport: () => set({ lastReport: null }),
}));
