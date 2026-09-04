// authStore.ts - Zustand store for authentication state management
// Manages JWT token, user data, and authentication status
// Persists to localStorage for session persistence across page reloads

import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initialize state from localStorage (persists across page reloads)
  token: localStorage.getItem('token'),
  user: (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })(),
  isAuthenticated: !!localStorage.getItem('token'),

  /**
   * setAuth - Called after successful login/register
   * Saves token and user to both state and localStorage
   */
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  /**
   * setUser - Update user data (e.g., after profile update)
   * Only updates the user object, not the token
   */
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  /**
   * logout - Clear all auth data
   * Removes from both state and localStorage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  getToken: () => get().token,
}));
