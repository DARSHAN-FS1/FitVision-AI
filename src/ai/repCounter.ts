import { RepCount, ExerciseType } from '../types/scan.types';
import { JointAngles } from '../types/scan.types';

type RepPhase = 'up' | 'down' | 'transition';

interface ExerciseThresholds {
  downAngle: number;   // angle at bottom of rep (e.g. knee flexed)
  upAngle: number;     // angle at top of rep (e.g. knee extended)
  getAngle: (angles: JointAngles) => number;
}

const THRESHOLDS: Record<ExerciseType, ExerciseThresholds> = {
  squat: {
    downAngle: 100,  // knee angle ≤ 100 = "down" position
    upAngle: 160,    // knee angle ≥ 160 = "up" (standing)
    getAngle: (a) => (a.leftKneeAngle + a.rightKneeAngle) / 2,
  },
  lunge: {
    downAngle: 100,
    upAngle: 160,
    getAngle: (a) => (a.leftKneeAngle + a.rightKneeAngle) / 2,
  },
  pushup: {
    downAngle: 90,   // elbow angle ≤ 90 = "down"
    upAngle: 160,    // elbow angle ≥ 160 = "up" (arms extended)
    getAngle: (a) => (a.leftShoulderAngle + a.rightShoulderAngle) / 2,
  },
  pullup: {
    downAngle: 80,
    upAngle: 160,
    getAngle: (a) => (a.leftShoulderAngle + a.rightShoulderAngle) / 2,
  },
  deadlift: {
    downAngle: 100,  // hip angle ≤ 100 = "bottom"
    upAngle: 170,    // hip angle ≥ 170 = "lockout"
    getAngle: (a) => (a.leftHipAngle + a.rightHipAngle) / 2,
  },
  plank: {
    downAngle: 90,
    upAngle: 160,
    getAngle: (a) => a.backAngle,
  },
  custom: {
    downAngle: 100,
    upAngle: 160,
    getAngle: (a) => (a.leftKneeAngle + a.rightKneeAngle) / 2,
  },
};

export class RepCounter {
  private phase: RepPhase = 'up';
  private count = 0;
  private lastRepTimestamp = 0;
  private readonly DEBOUNCE_MS = 500;
  private exerciseType: ExerciseType;
  private angleHistory: number[] = [];
  private readonly SMOOTHING_WINDOW = 5;

  constructor(exerciseType: ExerciseType) {
    this.exerciseType = exerciseType;
  }

  update(angles: JointAngles, timestamp: number): RepCount {
    const thresholds = THRESHOLDS[this.exerciseType];
    const rawAngle = thresholds.getAngle(angles);

    // Smooth angle with moving average
    this.angleHistory.push(rawAngle);
    if (this.angleHistory.length > this.SMOOTHING_WINDOW) {
      this.angleHistory.shift();
    }
    const smoothedAngle =
      this.angleHistory.reduce((a, b) => a + b, 0) / this.angleHistory.length;

    const prevPhase = this.phase;

    // State machine transitions
    if (smoothedAngle <= thresholds.downAngle) {
      this.phase = 'down';
    } else if (smoothedAngle >= thresholds.upAngle) {
      if (prevPhase === 'down') {
        // Completed a rep: went down then came back up
        const elapsed = timestamp - this.lastRepTimestamp;
        if (elapsed > this.DEBOUNCE_MS) {
          this.count += 1;
          this.lastRepTimestamp = timestamp;
        }
      }
      this.phase = 'up';
    } else {
      this.phase = 'transition';
    }

    return {
      total: this.count,
      current: this.count,
      state: this.phase,
      lastRepAt: this.lastRepTimestamp > 0 ? this.lastRepTimestamp : undefined,
    };
  }

  reset(): void {
    this.phase = 'up';
    this.count = 0;
    this.lastRepTimestamp = 0;
    this.angleHistory = [];
  }

  getCount(): number {
    return this.count;
  }
}
