import {
  collection, addDoc, getDocs, query,
  where, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebaseService';
import { api } from './api';
import { ScanSession, ScanReport, SuggestionItem } from '../types/scan.types';

class ScanService {
  async startSession(userId: string, exerciseType: string): Promise<string> {
    const ref = await addDoc(collection(db, 'scan_sessions'), {
      userId,
      exerciseType,
      startedAt: new Date().toISOString(),
      isCompleted: false,
      createdAt: serverTimestamp(),
    });

    try {
      await api.post('/scan/start', { sessionId: ref.id, userId, exerciseType });
    } catch {
      // Non-blocking
    }

    return ref.id;
  }

  async saveSession(session: Omit<ScanSession, 'id'>): Promise<ScanSession> {
    const ref = await addDoc(collection(db, 'scan_sessions'), {
      ...session,
      isCompleted: true,
      savedAt: serverTimestamp(),
    });

    const saved = { ...session, id: ref.id };

    try {
      await api.post('/scan/result', saved);
    } catch {
      // Non-blocking
    }

    return saved;
  }

  async getRecentSessions(userId: string, count = 5): Promise<ScanSession[]> {
    try {
      const q = query(
        collection(db, 'scan_sessions'),
        where('userId', '==', userId),
        where('isCompleted', '==', true),
        orderBy('startedAt', 'desc'),
        limit(count)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ScanSession));
    } catch {
      return [];
    }
  }

  generateReport(session: ScanSession): ScanReport {
    const suggestions: SuggestionItem[] = [];

    if (session.avgKneeAngle < 80) {
      suggestions.push({
        type: 'warning',
        title: 'Knee Angle Too Shallow',
        description: `Your average knee angle was ${Math.round(session.avgKneeAngle)}°. Aim for 80–95° for optimal squat depth and muscle activation.`,
        priority: 'high',
      });
    }

    if (session.avgBackAngle < 155) {
      suggestions.push({
        type: 'warning',
        title: 'Back Not Upright Enough',
        description: `Back angle averaged ${Math.round(session.avgBackAngle)}°. Keep your chest tall to protect your lumbar spine.`,
        priority: 'high',
      });
    }

    if (session.avgFormScore >= 85) {
      suggestions.push({
        type: 'success',
        title: 'Excellent Form!',
        description: `You maintained ${Math.round(session.avgFormScore)}% form accuracy. Great consistency throughout the session.`,
        priority: 'low',
      });
    }

    if (session.totalReps >= 10) {
      suggestions.push({
        type: 'tip',
        title: 'Volume Achievement',
        description: `${session.totalReps} reps completed. Consider increasing weight by 5% next session to continue progressive overload.`,
        priority: 'medium',
      });
    }

    suggestions.push({
      type: 'tip',
      title: 'Recovery Recommendation',
      description: 'Allow 48 hours before training this muscle group again for optimal recovery and growth.',
      priority: 'low',
    });

    return {
      session,
      postureScore: session.avgFormScore,
      suggestions,
      improvements: suggestions
        .filter(s => s.type === 'warning')
        .map(s => s.title),
      nextSteps: [
        'Warm up with bodyweight squats next session',
        'Focus on controlled descent (3 seconds down)',
        'Consider filming from the side for better angle feedback',
      ],
    };
  }
}

export const scanService = new ScanService();
