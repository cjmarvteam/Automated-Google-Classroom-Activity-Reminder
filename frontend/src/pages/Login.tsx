import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { login as loginApi, getGoogleAuthUrl } from '../services/api';
import { GraduationCap, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      setAuth(res.token, res.user);
      toast.success('Welcome back!');
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await getGoogleAuthUrl();
      window.location.href = res.url;
    } catch (err: any) {
      toast.error('Failed to initiate Google login');
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          border: '1px solid rgba(44, 36, 30, 0.08)',
          borderRadius: '8px',
          padding: '2.5rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            width: '48px',
            height: '48px',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            background: '#c4845a',
            color: '#fdf7f2',
            marginBottom: '1rem',
          }}>
            <GraduationCap style={{ width: '24px', height: '24px' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#2c241e' }}>Welcome Back</h1>
          <p style={{ fontSize: '0.875rem', color: 'rgba(44, 36, 30, 0.5)', marginTop: '0.25rem' }}>
            Sign in to continue to ClassRemind
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#2c241e', display: 'block', marginBottom: '0.375rem' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(44, 36, 30, 0.3)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem 0.625rem 2.5rem',
                  fontSize: '0.875rem',
                  border: '1px solid rgba(44, 36, 30, 0.12)',
                  borderRadius: '6px',
                  outline: 'none',
                  background: '#faf8f5',
                  color: '#2c241e',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#c4845a'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(44, 36, 30, 0.12)'}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#2c241e', display: 'block', marginBottom: '0.375rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(44, 36, 30, 0.3)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '0.625rem 2.5rem 0.625rem 2.5rem',
                  fontSize: '0.875rem',
                  border: '1px solid rgba(44, 36, 30, 0.12)',
                  borderRadius: '6px',
                  outline: 'none',
                  background: '#faf8f5',
                  color: '#2c241e',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#c4845a'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(44, 36, 30, 0.12)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: 'rgba(44, 36, 30, 0.3)',
                }}
              >
                {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '6px',
              border: 'none',
              background: loading ? 'rgba(196, 132, 90, 0.6)' : '#c4845a',
              color: '#fdf7f2',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              marginTop: '0.5rem',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight style={{ width: '16px', height: '16px' }} />}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(44, 36, 30, 0.08)' }} />
          <span style={{ fontSize: '0.75rem', color: 'rgba(44, 36, 30, 0.4)' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(44, 36, 30, 0.08)' }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            borderRadius: '6px',
            border: '1px solid rgba(44, 36, 30, 0.12)',
            background: '#ffffff',
            color: '#2c241e',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(44, 36, 30, 0.25)';
            e.currentTarget.style.background = 'rgba(44, 36, 30, 0.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(44, 36, 30, 0.12)';
            e.currentTarget.style.background = '#ffffff';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(44, 36, 30, 0.5)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#c4845a', textDecoration: 'none', fontWeight: 500 }}>
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
