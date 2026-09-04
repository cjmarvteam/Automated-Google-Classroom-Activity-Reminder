import { create } from 'zustand';

interface TimerState {
  isRunning: boolean;
  mode: 'study' | 'break';
  secondsLeft: number;
  currentSession: number;
  totalSessions: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setDuration: (seconds: number) => void;
}

export const useTimerStore = create<TimerState>((set) => ({
  isRunning: false,
  mode: 'study',
  secondsLeft: 25 * 60,
  currentSession: 1,
  totalSessions: 4,
  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  reset: () => set({ isRunning: false, secondsLeft: 25 * 60, mode: 'study', currentSession: 1 }),
  tick: () => set((state) => {
    if (!state.isRunning) return state;
    if (state.secondsLeft > 0) {
      return { secondsLeft: state.secondsLeft - 1 };
    }
    const isStudy = state.mode === 'study';
    const nextMode = isStudy ? 'break' : 'study';
    const nextDuration = isStudy ? 5 * 60 : 25 * 60; // default break then study
    const nextSession = isStudy ? state.currentSession : state.currentSession + 1;
    return {
      mode: nextMode,
      secondsLeft: nextDuration,
      currentSession: nextSession > state.totalSessions ? 1 : nextSession,
    };
  }),
  setDuration: (seconds) => set({ secondsLeft: seconds, isRunning: false }),
}));