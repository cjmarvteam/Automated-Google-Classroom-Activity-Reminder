import { Activity, AppNotification, UserPreferences, AuthResponse, User, Classroom, DashboardData, BackendPreferences } from '../types';

const API_BASE = '';

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

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

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const register = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
};

export const getGoogleAuthUrl = async (): Promise<{ url: string }> => {
  return apiFetch<{ url: string }>('/api/auth/google');
};

export const getProfile = async (): Promise<User> => {
  return apiFetch<User>('/api/auth/me');
};

export const logoutApi = async (): Promise<void> => {
  return apiFetch<void>('/api/auth/logout', { method: 'POST' });
};

export const getDashboard = async (): Promise<DashboardData> => {
  return apiFetch<DashboardData>('/api/dashboard');
};

export const fetchActivities = async (): Promise<Activity[]> => {
  const data = await apiFetch<any[]>('/api/activities');
  return data.map(mapBackendActivity);
};

export const fetchUpcomingActivities = async (limit = 5): Promise<Activity[]> => {
  const data = await apiFetch<any[]>('/api/activities/upcoming');
  return data.map(mapBackendActivity).slice(0, limit);
};

export const fetchClassrooms = async (): Promise<Classroom[]> => {
  return apiFetch<Classroom[]>('/api/classrooms');
};

export const syncClassrooms = async (): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>('/api/classrooms/sync', { method: 'POST' });
};

export const syncActivities = async (classroomId: string): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>(`/api/activities/sync/${classroomId}`, { method: 'POST' });
};

export const createActivity = async (data: any): Promise<Activity> => {
  const result = await apiFetch<any>('/api/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return mapBackendActivity(result);
};

export const updateActivityStatus = async (id: string, status: string): Promise<void> => {
  await apiFetch(`/api/activities/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status: status.toUpperCase() }),
  });
};

export const deleteActivity = async (id: string): Promise<void> => {
  await apiFetch(`/api/activities/${id}`, { method: 'DELETE' });
};

export const fetchNotifications = async (): Promise<AppNotification[]> => {
  const data = await apiFetch<any[]>('/api/notifications');
  return data.map(mapBackendNotification);
};

export const markNotificationRead = async (id: string): Promise<void> => {
  await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await apiFetch('/api/notifications/read-all', { method: 'PUT' });
};

export const deleteNotification = async (id: string): Promise<void> => {
  await apiFetch(`/api/notifications/${id}`, { method: 'DELETE' });
};

export const getPreferences = async (): Promise<BackendPreferences> => {
  return apiFetch<BackendPreferences>('/api/preferences');
};

export const updatePreferences = async (prefs: Partial<BackendPreferences>): Promise<BackendPreferences> => {
  return apiFetch<BackendPreferences>('/api/preferences', {
    method: 'PUT',
    body: JSON.stringify(prefs),
  });
};
