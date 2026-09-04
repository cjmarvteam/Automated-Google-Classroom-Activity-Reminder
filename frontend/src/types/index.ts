export type ActivityStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Classroom {
  id: string;
  googleClassroomId: string;
  name: string;
  section?: string;
  description?: string;
  alternateLink?: string;
}

export interface Activity {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: ActivityStatus;
  description?: string;
  type?: string;
  maxPoints?: number;
  alternateLink?: string;
  classroomId?: string;
  classroom?: Classroom;
}

export interface FocusTechnique {
  name: 'pomodoro' | 'deep-work' | 'custom';
  studyDuration: number;
  breakDuration: number;
  longBreakDuration?: number;
  sessionsBeforeLongBreak?: number;
}

export interface UserPreferences {
  focusTechnique: FocusTechnique;
  reminderTiming: number;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  deepWorkMode: boolean;
}

export interface BackendPreferences {
  emailNotifications: boolean;
  studyReminders: boolean;
  reminderTime: string;
  timezone: string;
  reminderDaysBefore: number;
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  activityId?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardData {
  totalClassrooms: number;
  totalActivities: number;
  pendingActivities: number;
  overdueActivities: number;
  completedActivities: number;
  upcomingActivities: Activity[];
}
