// --- BMI ---
export function calculateBMI(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: '#4a9eff' };
  if (bmi < 25)   return { label: 'Normal', color: '#2ecc8f' };
  if (bmi < 30)   return { label: 'Overweight', color: '#f59e0b' };
  return { label: 'Obese', color: '#ff5c5c' };
}

// --- Calories ---
export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
  activityLevel: string
): number {
  // Mifflin-St Jeor
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * (multipliers[activityLevel] ?? 1.55));
}

// --- Time ---
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

// --- Numbers ---
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function formatNumber(n: number, decimals = 0): string {
  return n.toLocaleString('en-IN', { maximumFractionDigits: decimals });
}

// --- Validation ---
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

// --- Score to label ---
export function getFormScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 55) return 'Fair';
  return 'Needs Work';
}

export function getFormScoreColor(score: number): string {
  if (score >= 80) return '#2ecc8f';
  if (score >= 55) return '#f59e0b';
  return '#ff5c5c';
}
