import { JointAngles, FormAnalysis, PostureState, ExerciseType } from '../types/scan.types';

interface FormRule {
  name: string;
  check: (angles: JointAngles) => boolean;
  correction: string;
  positive: string;
  weight: number; // importance 0–1
}

const SQUAT_RULES: FormRule[] = [
  {
    name: 'knee_depth',
    check: (a) => a.leftKneeAngle >= 70 && a.leftKneeAngle <= 105,
    correction: 'Lower hips until thighs are parallel — aim for 80–95° knee angle',
    positive: 'Good squat depth',
    weight: 0.3,
  },
  {
    name: 'back_upright',
    check: (a) => a.backAngle >= 150,
    correction: 'Keep chest tall — back is leaning too far forward',
    positive: 'Back is upright',
    weight: 0.25,
  },
  {
    name: 'hip_hinge',
    check: (a) => a.leftHipAngle >= 60 && a.leftHipAngle <= 130,
    correction: 'Push hips back further — initiate movement from hips',
    positive: 'Good hip hinge',
    weight: 0.2,
  },
  {
    name: 'knee_symmetry',
    check: (a) => Math.abs(a.leftKneeAngle - a.rightKneeAngle) < 15,
    correction: 'Knees are uneven — distribute weight equally',
    positive: 'Even weight distribution',
    weight: 0.15,
  },
  {
    name: 'neck_neutral',
    check: (a) => a.neckAngle >= 150,
    correction: 'Keep gaze forward — neck is tilting down',
    positive: 'Good neck alignment',
    weight: 0.1,
  },
];

const PUSHUP_RULES: FormRule[] = [
  {
    name: 'back_straight',
    check: (a) => a.backAngle >= 160,
    correction: 'Keep body in straight line — hips are sagging or piking',
    positive: 'Body in straight line',
    weight: 0.35,
  },
  {
    name: 'elbow_angle',
    check: (a) => a.leftShoulderAngle >= 30 && a.leftShoulderAngle <= 80,
    correction: 'Tuck elbows at 45° angle — do not flare out wide',
    positive: 'Good elbow position',
    weight: 0.3,
  },
  {
    name: 'shoulder_symmetry',
    check: (a) => Math.abs(a.leftShoulderAngle - a.rightShoulderAngle) < 20,
    correction: 'Shoulders are uneven — keep both sides level',
    positive: 'Shoulders level',
    weight: 0.2,
  },
  {
    name: 'neck_neutral',
    check: (a) => a.neckAngle >= 150,
    correction: 'Neutral neck — do not crane head up or drop chin',
    positive: 'Neck neutral',
    weight: 0.15,
  },
];

const DEADLIFT_RULES: FormRule[] = [
  {
    name: 'back_flat',
    check: (a) => a.backAngle >= 140,
    correction: 'CRITICAL: Flatten your back — rounding lower back risks injury',
    positive: 'Back is flat',
    weight: 0.4,
  },
  {
    name: 'hip_angle',
    check: (a) => a.leftHipAngle >= 45 && a.leftHipAngle <= 100,
    correction: 'Hinge deeper at hips — push hips back to initiate',
    positive: 'Good hip hinge',
    weight: 0.3,
  },
  {
    name: 'knee_drive',
    check: (a) => a.leftKneeAngle >= 90 && a.leftKneeAngle <= 165,
    correction: 'Drive knees out — do not let them cave inward',
    positive: 'Good knee drive',
    weight: 0.2,
  },
  {
    name: 'neck_neutral',
    check: (a) => a.neckAngle >= 145,
    correction: 'Keep neck neutral — look at a spot 6 feet ahead on floor',
    positive: 'Head in neutral',
    weight: 0.1,
  },
];

const PLANK_RULES: FormRule[] = [
  {
    name: 'body_straight',
    check: (a) => a.backAngle >= 165,
    correction: 'Hips are sagging — squeeze glutes and brace core',
    positive: 'Perfect plank position',
    weight: 0.5,
  },
  {
    name: 'neck_neutral',
    check: (a) => a.neckAngle >= 155,
    correction: 'Keep gaze at floor — do not lift or drop head',
    positive: 'Neck in line with spine',
    weight: 0.3,
  },
  {
    name: 'shoulder_alignment',
    check: (a) => Math.abs(a.leftShoulderAngle - a.rightShoulderAngle) < 15,
    correction: 'Shift weight to center — one shoulder is higher',
    positive: 'Shoulders level',
    weight: 0.2,
  },
];

const RULES_MAP: Record<ExerciseType, FormRule[]> = {
  squat: SQUAT_RULES,
  pushup: PUSHUP_RULES,
  deadlift: DEADLIFT_RULES,
  plank: PLANK_RULES,
  lunge: SQUAT_RULES,
  pullup: PUSHUP_RULES,
  custom: SQUAT_RULES,
};

export function analyzeForm(
  angles: JointAngles,
  exerciseType: ExerciseType,
  confidence: number
): FormAnalysis {
  const rules = RULES_MAP[exerciseType] ?? SQUAT_RULES;

  let weightedScore = 0;
  let totalWeight = 0;
  const corrections: string[] = [];
  const positives: string[] = [];

  for (const rule of rules) {
    totalWeight += rule.weight;
    if (rule.check(angles)) {
      weightedScore += rule.weight;
      positives.push(rule.positive);
    } else {
      corrections.push(rule.correction);
    }
  }

  const rawScore = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
  const overallScore = Math.round(rawScore * 10) / 10;

  let postureState: PostureState;
  if (confidence < 0.5) {
    postureState = 'idle';
  } else if (overallScore >= 80) {
    postureState = 'correct';
  } else if (overallScore >= 55) {
    postureState = 'adjusting';
  } else {
    postureState = 'incorrect';
  }

  return {
    postureState,
    overallScore,
    jointAngles: angles,
    corrections: corrections.slice(0, 3), // max 3 corrections at once
    positives,
    confidence,
  };
}
