import { useEffect } from 'react';
import { useTimerStore } from '../store/timerStore';
import { usePreferencesStore } from '../store/preferencesStore';

export const usePomodoro = () => {
  const timer = useTimerStore();
  const { focusTechnique } = usePreferencesStore();

  useEffect(() => {
    const interval = setInterval(() => {
      timer.tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [timer.tick]);

  useEffect(() => {
    // Update timer duration when technique changes
    timer.setDuration(focusTechnique.studyDuration * 60);
  }, [focusTechnique, timer.setDuration]);

  return timer;
};