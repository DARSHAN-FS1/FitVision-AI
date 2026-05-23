import { PoseLandmarks, JointAngles } from '../types/scan.types';

// MediaPipe Pose landmark indices
export const LANDMARKS = {
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
} as const;

interface Point3D {
  x: number;
  y: number;
  z: number;
}

function toPoint(landmark: { x: number; y: number; z: number }): Point3D {
  return { x: landmark.x, y: landmark.y, z: landmark.z };
}

/**
 * Calculate angle between three points (in degrees)
 * Point b is the vertex of the angle
 */
export function calculateAngle(a: Point3D, b: Point3D, c: Point3D): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180 / Math.PI));
  if (angle > 180) angle = 360 - angle;
  return Math.round(angle * 10) / 10;
}

/**
 * Calculate angle between two vectors from the same point
 */
export function calculateVectorAngle(
  origin: Point3D,
  point1: Point3D,
  point2: Point3D
): number {
  const v1 = { x: point1.x - origin.x, y: point1.y - origin.y, z: point1.z - origin.z };
  const v2 = { x: point2.x - origin.x, y: point2.y - origin.y, z: point2.z - origin.z };

  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2);
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2.z ** 2);

  if (mag1 === 0 || mag2 === 0) return 0;

  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return Math.round(Math.acos(cosAngle) * (180 / Math.PI) * 10) / 10;
}

export function computeJointAngles(landmarks: PoseLandmarks): JointAngles | null {
  try {
    const lm = landmarks;

    const leftKneeAngle = calculateAngle(
      toPoint(lm[LANDMARKS.LEFT_HIP]),
      toPoint(lm[LANDMARKS.LEFT_KNEE]),
      toPoint(lm[LANDMARKS.LEFT_ANKLE])
    );

    const rightKneeAngle = calculateAngle(
      toPoint(lm[LANDMARKS.RIGHT_HIP]),
      toPoint(lm[LANDMARKS.RIGHT_KNEE]),
      toPoint(lm[LANDMARKS.RIGHT_ANKLE])
    );

    const leftHipAngle = calculateAngle(
      toPoint(lm[LANDMARKS.LEFT_SHOULDER]),
      toPoint(lm[LANDMARKS.LEFT_HIP]),
      toPoint(lm[LANDMARKS.LEFT_KNEE])
    );

    const rightHipAngle = calculateAngle(
      toPoint(lm[LANDMARKS.RIGHT_SHOULDER]),
      toPoint(lm[LANDMARKS.RIGHT_HIP]),
      toPoint(lm[LANDMARKS.RIGHT_KNEE])
    );

    const leftShoulderAngle = calculateAngle(
      toPoint(lm[LANDMARKS.LEFT_ELBOW]),
      toPoint(lm[LANDMARKS.LEFT_SHOULDER]),
      toPoint(lm[LANDMARKS.LEFT_HIP])
    );

    const rightShoulderAngle = calculateAngle(
      toPoint(lm[LANDMARKS.RIGHT_ELBOW]),
      toPoint(lm[LANDMARKS.RIGHT_SHOULDER]),
      toPoint(lm[LANDMARKS.RIGHT_HIP])
    );

    // Back angle: angle of spine relative to vertical
    const midShoulder = {
      x: (lm[LANDMARKS.LEFT_SHOULDER].x + lm[LANDMARKS.RIGHT_SHOULDER].x) / 2,
      y: (lm[LANDMARKS.LEFT_SHOULDER].y + lm[LANDMARKS.RIGHT_SHOULDER].y) / 2,
      z: (lm[LANDMARKS.LEFT_SHOULDER].z + lm[LANDMARKS.RIGHT_SHOULDER].z) / 2,
    };
    const midHip = {
      x: (lm[LANDMARKS.LEFT_HIP].x + lm[LANDMARKS.RIGHT_HIP].x) / 2,
      y: (lm[LANDMARKS.LEFT_HIP].y + lm[LANDMARKS.RIGHT_HIP].y) / 2,
      z: (lm[LANDMARKS.LEFT_HIP].z + lm[LANDMARKS.RIGHT_HIP].z) / 2,
    };
    const vertical = { x: midHip.x, y: midHip.y - 1, z: midHip.z };
    const backAngle = calculateAngle(toPoint(midShoulder), midHip, vertical);

    const neckAngle = calculateAngle(
      midShoulder,
      toPoint(lm[LANDMARKS.NOSE]),
      { x: lm[LANDMARKS.NOSE].x, y: lm[LANDMARKS.NOSE].y - 1, z: lm[LANDMARKS.NOSE].z }
    );

    return {
      leftKneeAngle,
      rightKneeAngle,
      leftHipAngle,
      rightHipAngle,
      leftShoulderAngle,
      rightShoulderAngle,
      backAngle,
      neckAngle,
    };
  } catch {
    return null;
  }
}

export function getLandmarkVisibility(landmarks: PoseLandmarks, indices: number[]): number {
  const visibilities = indices
    .map(i => landmarks[i]?.visibility ?? 0)
    .filter(v => v > 0);
  if (visibilities.length === 0) return 0;
  return visibilities.reduce((a, b) => a + b, 0) / visibilities.length;
}
