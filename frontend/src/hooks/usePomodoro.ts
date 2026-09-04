import { useEffect, useRef } from 'react';
import { useTimerStore } from '../store/timerStore';
import { usePreferencesStore } from '../store/preferencesStore';

export const usePomodoro = () => {
  const timer = useTimerStore();
  const { focusTechnique } = usePreferencesStore();
  const tickRef = useRef(timer.tick);

  useEffect(() => {
    tickRef.current = timer.tick;
  }, [timer.tick]);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    timer.setDuration(focusTechnique.studyDuration * 60);
    if (focusTechnique.sessionsBeforeLongBreak) {
      timer.setTotalSessions(focusTechnique.sessionsBeforeLongBreak);
    }
  }, [focusTechnique, timer.setDuration, timer.setTotalSessions]);

  return timer;
};
