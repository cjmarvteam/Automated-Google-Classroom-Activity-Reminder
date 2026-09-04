// types/index.ts - TypeScript type definitions for the frontend
// Defines all data structures used across the application
// These types mirror the backend Prisma schema + API response format

/**
 * ActivityStatus - Possible states for an activity
 * - pending: Not yet due, awaiting completion
 * - in_progress: Currently being worked on
 * - completed: Finished by the student
 * - overdue: Past due date, not completed (set by reminder scheduler)
 */
export type ActivityStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

/**
 * User - Authenticated user profile
 * Returned by /api/auth/me and stored in authStore
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

/**
 * Classroom - A classroom/course from Google Classroom or manually created
 * googleClassroomId: ID from Google Classroom API (or "manual-{id}" for manual entries)
 */
export interface Classroom {
  id: string;
  googleClassroomId: string;
  name: string;
  section?: string;
  description?: string;
  alternateLink?: string;
}

/**
 * Activity - An assignment/task within a classroom
 * subject: Derived from the classroom name (for backward compatibility)
 * dueDate: ISO 8601 date string
 */
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

/**
 * FocusTechnique - Pomodoro/Deep Work timer configuration
 * name: 'pomodoro' | 'deep-work' | 'custom'
 * studyDuration/breakDuration: In minutes
 */
export interface FocusTechnique {
  name: 'pomodoro' | 'deep-work' | 'custom';
  studyDuration: number;
  breakDuration: number;
  longBreakDuration?: number;
  sessionsBeforeLongBreak?: number;
}

/**
 * UserPreferences - Frontend-local preferences (stored in Zustand + localStorage)
 * Controls focus timer, reminders, quiet hours, and deep work mode
 */
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

/**
 * BackendPreferences - Preferences stored in the database (via /api/preferences)
 * Controls email notifications, study reminders, and timezone settings
 */
export interface BackendPreferences {
  emailNotifications: boolean;
  studyReminders: boolean;
  reminderTime: string;
  timezone: string;
  reminderDaysBefore: number;
}

/**
 * AppNotification - A notification item displayed in the UI
 * type: 'deadline' | 'DAILY_REMINDER' | 'OVERDUE' | 'info'
 * timestamp: ISO 8601 date string
 */
export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  activityId?: string;
}

/**
 * AuthResponse - Response from /api/auth/login and /api/auth/register
 * Contains JWT token and user profile
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * DashboardData - Aggregated stats for the dashboard
 * Returned by /api/dashboard
 */
export interface DashboardData {
  totalClassrooms: number;
  totalActivities: number;
  pendingActivities: number;
  overdueActivities: number;
  completedActivities: number;
  upcomingActivities: Activity[];
}
