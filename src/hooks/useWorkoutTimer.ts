import { useState, useRef, useCallback, useEffect } from 'react';

export function useWorkoutTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedRef = useRef<number>(0);

  const start = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = Date.now();
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed(accumulatedRef.current + Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    accumulatedRef.current += Math.floor((Date.now() - startTimeRef.current) / 1000);
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [isRunning]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    accumulatedRef.current = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const toggle = useCallback(() => {
    if (isRunning) pause();
    else start();
  }, [isRunning, start, pause]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
    elapsed,
    isRunning,
    formatted: formatTime(elapsed),
    start,
    pause,
    reset,
    toggle,
  };
}
