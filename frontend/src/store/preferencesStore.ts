import { create } from 'zustand';
import { FocusTechnique, UserPreferences } from '../types';

interface PreferencesState extends UserPreferences {
  setFocusTechnique: (technique: FocusTechnique) => void;
  setQuietHours: (enabled: boolean, start?: string, end?: string) => void;
  toggleDeepWorkMode: () => void;
  setReminderTiming: (minutes: number) => void;
}

const defaultPreferences: UserPreferences = {
  focusTechnique: {
    name: 'pomodoro',
    studyDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
  },
  reminderTiming: 30,
  quietHours: { enabled: false, start: '22:00', end: '07:00' },
  deepWorkMode: false,
};

export const usePreferencesStore = create<PreferencesState>((set) => ({
  ...defaultPreferences,
  setFocusTechnique: (technique) => set({ focusTechnique: technique }),
  setQuietHours: (enabled, start, end) => set((state) => ({
    quietHours: {
      enabled,
      start: start ?? state.quietHours.start,
      end: end ?? state.quietHours.end,
    },
  })),
  toggleDeepWorkMode: () => set((state) => ({ deepWorkMode: !state.deepWorkMode })),
  setReminderTiming: (reminderTiming) => set({ reminderTiming }),
}));
