// api.ts - Centralized API client for the frontend
// Handles all HTTP requests to the backend, including auth headers and response mapping
// Each function maps to a specific backend endpoint

import { Activity, AppNotification, UserPreferences, AuthResponse, User, Classroom, DashboardData, BackendPreferences } from '../types';

// API Base URL:
// - In development: empty string (Vite proxy handles /api -> localhost:3000)
// - In production: uses VITE_API_URL environment variable (set in Vercel dashboard)
const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * apiFetch - Generic fetch wrapper
 * Automatically adds:
 * - Content-Type: application/json header
 * - JWT token from localStorage to Authorization header
 * - Error handling for non-OK responses
 */
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  // Attach JWT token if user is logged in
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  // Handle HTTP errors (4xx, 5xx)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Maps backend activity format to frontend Activity type
 * Backend uses camelCase and includes nested classroom object
 * Frontend expects: { id, title, subject (from classroom name), dueDate, status, ... }
 */
function mapBackendActivity(a: any): Activity {
  return {
    id: a.id,
    title: a.title,
    subject: a.classroom?.name || a.classroom?.section || 'Unknown',
    dueDate: a.dueDate ? new Date(a.dueDate).toISOString() : new Date().toISOString(),
    status: (a.status || 'PENDING').toLowerCase() as any,
    description: a.description || '',
    type: a.type,
    maxPoints: a.maxPoints,
    alternateLink: a.alternateLink,
    classroomId: a.classroomId,
    classroom: a.classroom,
  };
}

/**
 * Maps backend notification format to frontend AppNotification type
 * Normalizes timestamp field (backend uses sentAt or createdAt)
 */
function mapBackendNotification(n: any): AppNotification {
  return {
    id: n.id,
    type: n.type || 'deadline',
    title: n.title || '',
    message: n.message || '',
    timestamp: n.sentAt ? new Date(n.sentAt).toISOString() : new Date(n.createdAt).toISOString(),
    read: n.read || false,
    activityId: n.activityId,
  };
}

// ==================== AUTH API ====================

/** POST /api/auth/login - Login with email/password, returns token + user */
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

/** POST /api/auth/register - Create new account, returns token + user */
export const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
};

/** GET /api/auth/google - Get Google OAuth consent screen URL */
export const getGoogleAuthUrl = async (): Promise<{ url: string }> => {
  return apiFetch<{ url: string }>('/api/auth/google');
};

/** GET /api/auth/me - Get current user profile (requires auth) */
export const getProfile = async (): Promise<User> => {
  return apiFetch<User>('/api/auth/me');
};

/** POST /api/auth/logout - Logout (client-side token removal) */
export const logoutApi = async (): Promise<void> => {
  return apiFetch<void>('/api/auth/logout', { method: 'POST' });
};

// ==================== DASHBOARD API ====================

/** GET /api/dashboard - Get dashboard stats (total/pending/overdue activities) */
export const getDashboard = async (): Promise<DashboardData> => {
  return apiFetch<DashboardData>('/api/dashboard');
};

// ==================== ACTIVITIES API ====================

/** GET /api/activities - Get all activities for current user */
export const fetchActivities = async (): Promise<Activity[]> => {
  const data = await apiFetch<{ activities: any[] }>('/api/activities');
  return (data.activities || []).map(mapBackendActivity);
};

/** GET /api/activities/upcoming - Get upcoming activities (due date in future) */
export const fetchUpcomingActivities = async (limit = 5): Promise<Activity[]> => {
  const data = await apiFetch<{ activities: any[] }>('/api/activities/upcoming');
  return (data.activities || []).map(mapBackendActivity).slice(0, limit);
};

// ==================== CLASSROOMS API ====================

/** GET /api/classrooms - Get all classrooms for current user */
export const fetchClassrooms = async (): Promise<Classroom[]> => {
  const data = await apiFetch<{ classrooms: Classroom[] }>('/api/classrooms');
  return data.classrooms || [];
};

/** POST /api/classrooms - Create a new classroom manually */
export const createClassroom = async (data: { name: string; section?: string; description?: string }): Promise<Classroom> => {
  const result = await apiFetch<{ classroom: Classroom }>('/api/classrooms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.classroom;
};

/** DELETE /api/classrooms/:id - Delete a classroom and its activities */
export const deleteClassroom = async (id: string): Promise<void> => {
  await apiFetch(`/api/classrooms/${id}`, { method: 'DELETE' });
};

/** POST /api/classrooms/sync - Sync classrooms from Google Classroom */
export const syncClassrooms = async (): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>('/api/classrooms/sync', { method: 'POST' });
};

// ==================== ACTIVITY SYNC API ====================

/** POST /api/activities/sync/:classroomId - Sync activities from Google Classroom */
export const syncActivities = async (classroomId: string): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>(`/api/activities/sync/${classroomId}`, { method: 'POST' });
};

/** POST /api/activities - Create a new activity manually */
export const createActivity = async (data: any): Promise<Activity> => {
  const result = await apiFetch<{ activity: any }>('/api/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return mapBackendActivity(result.activity);
};

/** PUT /api/activities/:id - Update activity status (PENDING -> COMPLETED, etc.) */
export const updateActivityStatus = async (id: string, status: string): Promise<void> => {
  await apiFetch(`/api/activities/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status: status.toUpperCase() }),
  });
};

/** DELETE /api/activities/:id - Delete an activity */
export const deleteActivity = async (id: string): Promise<void> => {
  await apiFetch(`/api/activities/${id}`, { method: 'DELETE' });
};

// ==================== NOTIFICATIONS API ====================

/** GET /api/notifications - Get all notifications for current user */
export const fetchNotifications = async (): Promise<AppNotification[]> => {
  const data = await apiFetch<any[]>('/api/notifications');
  return data.map(mapBackendNotification);
};

/** PUT /api/notifications/:id/read - Mark a single notification as read */
export const markNotificationRead = async (id: string): Promise<void> => {
  await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
};

/** PUT /api/notifications/read-all - Mark all notifications as read */
export const markAllNotificationsRead = async (): Promise<void> => {
  await apiFetch('/api/notifications/read-all', { method: 'PUT' });
};

/** DELETE /api/notifications/:id - Delete a notification */
export const deleteNotification = async (id: string): Promise<void> => {
  await apiFetch(`/api/notifications/${id}`, { method: 'DELETE' });
};

// ==================== PREFERENCES API ====================

/** GET /api/preferences - Get user's notification/study preferences from backend */
export const getPreferences = async (): Promise<BackendPreferences> => {
  return apiFetch<BackendPreferences>('/api/preferences');
};

/** PUT /api/preferences - Update user's notification/study preferences */
export const updatePreferences = async (prefs: Partial<BackendPreferences>): Promise<BackendPreferences> => {
  return apiFetch<BackendPreferences>('/api/preferences', {
    method: 'PUT',
    body: JSON.stringify(prefs),
  });
};
