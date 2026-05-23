import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { PostureState } from '../types/scan.types';

type FeedbackEvent =
  | 'session_start'
  | 'session_end'
  | 'rep_complete'
  | 'form_correct'
  | 'form_incorrect'
  | 'form_adjusting'
  | 'milestone';

export class FeedbackEngine {
  private lastFeedbackTime = 0;
  private lastPostureState: PostureState = 'idle';
  private readonly FEEDBACK_COOLDOWN_MS = 2000;
  private soundEnabled = true;
  private hapticEnabled = true;

  async triggerFeedback(
    event: FeedbackEvent,
    options?: { force?: boolean }
  ): Promise<void> {
    const now = Date.now();
    const isThrottled = now - this.lastFeedbackTime < this.FEEDBACK_COOLDOWN_MS;

    if (isThrottled && !options?.force) return;

    this.lastFeedbackTime = now;

    switch (event) {
      case 'session_start':
        await this.haptic('notification', Haptics.NotificationFeedbackType.Success);
        break;

      case 'session_end':
        await this.haptic('notification', Haptics.NotificationFeedbackType.Success);
        await this.haptic('impact', Haptics.ImpactFeedbackStyle.Heavy);
        break;

      case 'rep_complete':
        await this.haptic('impact', Haptics.ImpactFeedbackStyle.Light);
        break;

      case 'form_correct':
        await this.haptic('impact', Haptics.ImpactFeedbackStyle.Light);
        break;

      case 'form_incorrect':
        await this.haptic('notification', Haptics.NotificationFeedbackType.Warning);
        break;

      case 'milestone':
        await this.haptic('notification', Haptics.NotificationFeedbackType.Success);
        break;

      case 'form_adjusting':
        await this.haptic('selection');
        break;
    }
  }

  async onPostureStateChange(newState: PostureState): Promise<void> {
    if (newState === this.lastPostureState) return;

    this.lastPostureState = newState;

    switch (newState) {
      case 'correct':
        await this.triggerFeedback('form_correct');
        break;
      case 'incorrect':
        await this.triggerFeedback('form_incorrect', { force: true });
        break;
      case 'adjusting':
        await this.triggerFeedback('form_adjusting');
        break;
    }
  }

  async onRepCompleted(repCount: number): Promise<void> {
    await this.triggerFeedback('rep_complete', { force: true });

    // Milestone every 5 reps
    if (repCount % 5 === 0 && repCount > 0) {
      setTimeout(() => {
        this.triggerFeedback('milestone', { force: true });
      }, 300);
    }
  }

  private async haptic(
    type: 'impact' | 'notification' | 'selection',
    style?: Haptics.ImpactFeedbackStyle | Haptics.NotificationFeedbackType
  ): Promise<void> {
    if (!this.hapticEnabled) return;
    try {
      if (type === 'impact') {
        await Haptics.impactAsync(
          style as Haptics.ImpactFeedbackStyle ?? Haptics.ImpactFeedbackStyle.Medium
        );
      } else if (type === 'notification') {
        await Haptics.notificationAsync(
          style as Haptics.NotificationFeedbackType ?? Haptics.NotificationFeedbackType.Success
        );
      } else {
        await Haptics.selectionAsync();
      }
    } catch {
      // Haptics not available on simulator
    }
  }

  setHapticEnabled(enabled: boolean): void {
    this.hapticEnabled = enabled;
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
  }

  reset(): void {
    this.lastFeedbackTime = 0;
    this.lastPostureState = 'idle';
  }
}

export const feedbackEngine = new FeedbackEngine();
