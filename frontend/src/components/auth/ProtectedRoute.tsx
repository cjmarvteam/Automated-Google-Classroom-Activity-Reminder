// ProtectedRoute.tsx - Auth guard components for route protection
// ProtectedRoute: Redirects to /login if user is not authenticated
// GuestRoute: Redirects to /dashboard if user is already authenticated

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * ProtectedRoute - Wraps routes that require authentication
 * If user is not logged in, redirects to /login
 * Preserves the original location in state for redirect after login
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, passing current location for post-login redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/**
 * GuestRoute - Wraps routes only for non-authenticated users (login, register)
 * If user is already logged in, redirects to /dashboard
 * Prevents logged-in users from seeing login/register pages
 */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
