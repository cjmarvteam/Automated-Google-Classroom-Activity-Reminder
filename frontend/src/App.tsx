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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><Landing /></PageTransition>
        } />
        <Route path="/login" element={
          <GuestRoute><PageTransition><Login /></PageTransition></GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute><PageTransition><Register /></PageTransition></GuestRoute>
        } />
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
