import { useRef, useCallback, useEffect, useState } from 'react';
import { poseDetector } from '../ai/poseDetector';
import { computeJointAngles } from '../ai/jointAngles';
import { analyzeForm } from '../ai/formAnalyzer';
import { useScanStore } from '../store/useScanStore';
import { ExerciseType, JointAngles } from '../types/scan.types';

const simulateAngles = (exercise: ExerciseType, timestamp: number): JointAngles => {
  const cycleDuration = 3500; // 3.5s per rep
  const elapsedCycle = timestamp % cycleDuration;
  const ratio = elapsedCycle / cycleDuration;
  const sineProgress = Math.sin(ratio * 2 * Math.PI - Math.PI / 2);
  const progress = (sineProgress + 1) / 2; // 0 to 1

  // Base angles (completely standing / default posture)
  let leftKneeAngle = 170;
  let rightKneeAngle = 170;
  let leftHipAngle = 170;
  let rightHipAngle = 170;
  let leftShoulderAngle = 20;
  let rightShoulderAngle = 20;
  let backAngle = 170;
  let neckAngle = 165;

  switch (exercise) {
    case 'squat':
      leftKneeAngle = 85 + 85 * progress;
      rightKneeAngle = 85 + 85 * progress;
      leftHipAngle = 90 + 80 * progress;
      rightHipAngle = 90 + 80 * progress;
      backAngle = 160 + 10 * progress;
      break;
    case 'lunge':
      leftKneeAngle = 90 + 75 * progress;
      rightKneeAngle = 90 + 75 * progress;
      leftHipAngle = 100 + 65 * progress;
      rightHipAngle = 100 + 65 * progress;
      backAngle = 165;
      break;
    case 'pushup':
      leftShoulderAngle = 80 + 80 * progress;
      rightShoulderAngle = 80 + 80 * progress;
      backAngle = 165 + 5 * progress;
      leftHipAngle = 170;
      rightHipAngle = 170;
      break;
    case 'pullup':
      leftShoulderAngle = 75 + 85 * progress;
      rightShoulderAngle = 75 + 85 * progress;
      leftHipAngle = 170;
      rightHipAngle = 170;
      backAngle = 165;
      break;
    case 'deadlift':
      leftHipAngle = 70 + 100 * progress;
      rightHipAngle = 70 + 100 * progress;
      leftKneeAngle = 110 + 55 * progress;
      rightKneeAngle = 110 + 55 * progress;
      backAngle = 150 + 20 * progress;
      break;
    case 'plank':
      // Oscillate back angle to simulate plank hold but cross the threshold to count hold reps
      backAngle = 85 + 80 * progress;
      break;
    default:
      leftKneeAngle = 90 + 80 * progress;
      rightKneeAngle = 90 + 80 * progress;
      break;
  }

  return {
    leftKneeAngle: Math.round(leftKneeAngle * 10) / 10,
    rightKneeAngle: Math.round(rightKneeAngle * 10) / 10,
    leftHipAngle: Math.round(leftHipAngle * 10) / 10,
    rightHipAngle: Math.round(rightHipAngle * 10) / 10,
    leftShoulderAngle: Math.round(leftShoulderAngle * 10) / 10,
    rightShoulderAngle: Math.round(rightShoulderAngle * 10) / 10,
    backAngle: Math.round(backAngle * 10) / 10,
    neckAngle: Math.round(neckAngle * 10) / 10,
  };
};

export function usePoseDetection() {
  const [isDetectorReady, setIsDetectorReady] = useState(false);
  const [fps, setFps] = useState(0);
  const frameRef = useRef(0);
  const fpsTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { isScanning, isPaused, selectedExercise, updateFormAnalysis } = useScanStore();

  useEffect(() => {
    const init = async () => {
      await poseDetector.initialize();
      setIsDetectorReady(true);
    };
    init();

    return () => {
      poseDetector.close();
    };
  }, []);

  // Simulated Pose loop running when scanning and not paused
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isScanning && !isPaused) {
      interval = setInterval(() => {
        const timestamp = Date.now();
        const angles = simulateAngles(selectedExercise, timestamp);
        const analysis = analyzeForm(angles, selectedExercise, 0.98);
        updateFormAnalysis(analysis, timestamp);
        frameRef.current += 1;
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning, isPaused, selectedExercise, updateFormAnalysis]);

  // FPS counter
  useEffect(() => {
    fpsTimerRef.current = setInterval(() => {
      setFps(frameRef.current);
      frameRef.current = 0;
    }, 1000);
    return () => {
      if (fpsTimerRef.current) clearInterval(fpsTimerRef.current);
    };
  }, []);

  const processFrame = useCallback(
    (videoElement: unknown) => {
      if (!isDetectorReady || !isScanning || isPaused) return;

      const timestamp = Date.now();
      try {
        const result = poseDetector.detectForVideo(videoElement, timestamp);
        frameRef.current += 1;

        if (!result.landmarks) return;

        const angles = computeJointAngles(result.landmarks);
        if (!angles) return;

        const analysis = analyzeForm(
          angles,
          selectedExercise,
          result.confidence
        );

        updateFormAnalysis(analysis, timestamp);
      } catch {
        // Frame processing error - skip frame
      }
    },
    [isDetectorReady, isScanning, isPaused, selectedExercise, updateFormAnalysis]
  );

  return { isDetectorReady, fps, processFrame };
}
