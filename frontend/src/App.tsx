// App.tsx - Root component of the React application
// Sets up routing, state management providers, and page transitions
// All pages are wrapped with ProtectedRoute or GuestRoute for auth guard

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/layout/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import Calendar from './pages/Calendar';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Classrooms from './pages/Classrooms';
import { Toast } from './components/ui/Toast';
import { PageTransition } from './components/ui/PageTransition';
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute';

// React Query client configuration
// staleTime: Data is considered fresh for 5 minutes (no refetch)
// refetchOnWindowFocus: Disabled to prevent unnecessary API calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * AppRoutes - Defines all application routes with auth guards
 * - Public: Landing (/), Login (/login), Register (/register)
 * - Protected: Dashboard, Activities, Calendar, Notifications, Settings, Classrooms
 * - Guest: Login, Register (redirect to /dashboard if already authenticated)
 */
function AppRoutes() {
  const location = useLocation();

  return (
    // AnimatePresence enables page transition animations on route changes
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={
          <PageTransition><Landing /></PageTransition>
        } />

        {/* Guest-only routes (redirect to dashboard if logged in) */}
        <Route path="/login" element={
          <GuestRoute><PageTransition><Login /></PageTransition></GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute><PageTransition><Register /></PageTransition></GuestRoute>
        } />

        {/* Protected routes (require authentication) */}
        <Route path="/dashboard" element={
          <ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>
        } />
        <Route path="/activities" element={
          <ProtectedRoute><PageTransition><Activities /></PageTransition></ProtectedRoute>
        } />
        <Route path="/classrooms" element={
          <ProtectedRoute><PageTransition><Classrooms /></PageTransition></ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute><PageTransition><Calendar /></PageTransition></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><PageTransition><Notifications /></PageTransition></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * App - Root component
 * Wraps everything in:
 * 1. QueryClientProvider - React Query for server state management
 * 2. BrowserRouter - React Router for client-side routing
 * 3. Navbar - Persistent navigation bar
 * 4. Toast - Notification toasts (sonner)
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div style={{ background: '#f5f0eb', minHeight: '100vh' }}>
          <Navbar />
          <main className="container-editorial" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
            <AppRoutes />
          </main>
          <Toast />
        </div>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
