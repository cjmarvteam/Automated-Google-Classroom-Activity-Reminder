import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Bell, Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from './UserMenu';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const { unreadCount } = useNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/classrooms', label: 'Classrooms' },
    { to: '/activities', label: 'Activities' },
    { to: '/calendar', label: 'Calendar' },
  ];

  return (
    <motion.header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        transition: 'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        background: scrolled ? 'rgba(245, 240, 235, 0.85)' : 'rgba(245, 240, 235, 0.5)',
        backdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)',
        borderBottom: scrolled ? '1px solid rgba(44, 36, 30, 0.06)' : '1px solid rgba(44, 36, 30, 0.04)',
      }}
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container-editorial" style={{ display: 'flex', height: '64px', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
          <motion.div
            style={{
              display: 'flex', width: '32px', height: '32px', alignItems: 'center', justifyContent: 'center',
              borderRadius: '6px', background: '#c4845a', color: '#fdf7f2', transition: 'background 0.2s ease',
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#a86d47')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#c4845a')}
          >
            <GraduationCap style={{ width: '16px', height: '16px' }} />
          </motion.div>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '-0.02em', color: '#2c241e' }}>
            Google Classroom<span style={{ color: '#c4845a' }}> Reminder</span>
          </span>
        </Link>

        {isAuthenticated && (
          <nav style={{ display: 'none', alignItems: 'center', gap: '0.25rem' }} className="md:flex">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={{
                    position: 'relative', padding: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 500,
                    borderRadius: '4px', color: isActive ? '#2c241e' : 'rgba(44, 36, 30, 0.4)',
                    transition: 'color 0.2s ease', textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#2c241e'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'rgba(44, 36, 30, 0.4)'; }}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      style={{ position: 'absolute', bottom: '0', left: '1rem', right: '1rem', height: '2px', background: '#c4845a', borderRadius: '1px' }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    />
                  )}
                </NavLink>
              );
            })}
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isAuthenticated ? (
            <>
              <Link
                to="/notifications"
                style={{
                  position: 'relative', padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(44, 36, 30, 0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Bell style={{ width: '20px', height: '20px', color: 'rgba(44, 36, 30, 0.5)' }} />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      position: 'absolute', top: '-2px', right: '-2px', width: '18px', height: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%',
                      background: '#c0392b', color: '#ffffff', fontSize: '10px', fontWeight: 600,
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </Link>
              <UserMenu />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" style={{ fontSize: '0.8rem', fontWeight: 500, color: '#2c241e' }}>
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button style={{ fontSize: '0.8rem', fontWeight: 500, background: '#c4845a', color: '#fdf7f2', borderRadius: '6px' }}>
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            style={{ color: '#2c241e' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden', borderTop: '1px solid rgba(44, 36, 30, 0.06)', background: 'rgba(245, 240, 235, 0.95)', backdropFilter: 'blur(12px)' }}
          >
            <nav className="container-editorial" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '1rem 0' }}>
              {isAuthenticated && navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 500,
                    borderRadius: '4px', color: location.pathname === item.to ? '#2c241e' : 'rgba(44, 36, 30, 0.5)',
                    background: location.pathname === item.to ? 'rgba(44, 36, 30, 0.04)' : 'transparent',
                    transition: 'all 0.2s ease', textDecoration: 'none',
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <hr style={{ border: 'none', borderTop: '1px solid rgba(44, 36, 30, 0.06)', margin: '0.5rem 0' }} />
                  <Link
                    to="/settings"
                    style={{
                      display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 500,
                      borderRadius: '4px', color: 'rgba(44, 36, 30, 0.5)', transition: 'all 0.2s ease', textDecoration: 'none',
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    Settings
                  </Link>
                </>
              )}
              {!isAuthenticated && (
                <>
                  <Link to="/login" style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#2c241e', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link to="/register" style={{ display: 'block', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#c4845a', textDecoration: 'none' }} onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
