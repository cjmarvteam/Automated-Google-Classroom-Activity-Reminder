import { useQuery } from '@tanstack/react-query';
import { fetchUpcomingActivities } from '../../services/api';
import { usePomodoro } from '../../hooks/usePomodoro';
import { useTimerStore } from '../../store/timerStore';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function FocusSession() {
  const { data: upcoming = [] } = useQuery({
    queryKey: ['upcoming'],
    queryFn: () => fetchUpcomingActivities(1),
  });
  const suggestedActivity = upcoming[0];
  const timer = usePomodoro();
  const { isRunning, mode, secondsLeft, currentSession, totalSessions } = useTimerStore();
  const prefersReducedMotion = useReducedMotion();

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isStudy = mode === 'study';
  const progress = Math.max(0, Math.min(((totalSessions - currentSession + 1) / totalSessions) * 100, 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: '#ffffff',
        border: '1px solid rgba(44, 36, 30, 0.08)',
        borderRadius: '6px',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #c4845a, #d4a77a)',
          transformOrigin: 'left',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <span className="label-sm" style={{ color: '#c4845a' }}>Focus Session</span>
        <span style={{ fontSize: '0.65rem', color: 'rgba(44, 36, 30, 0.25)' }}>•</span>
        <motion.span
          key={mode}
          initial={!prefersReducedMotion ? { opacity: 0, scale: 0.9 } : { opacity: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: '0.65rem',
            fontWeight: 500,
            color: isStudy ? '#c4845a' : 'rgba(44, 36, 30, 0.4)',
            padding: '2px 10px',
            borderRadius: '100px',
            background: isStudy ? 'rgba(196, 132, 90, 0.08)' : 'rgba(44, 36, 30, 0.04)',
          }}
        >
          {isStudy ? 'Studying' : 'Break'}
        </motion.span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={secondsLeft}
            initial={!prefersReducedMotion ? { opacity: 0.6, scale: 0.98 } : { opacity: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            style={{
              fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              fontFamily: 'monospace',
              fontWeight: 600,
              color: '#2c241e',
              letterSpacing: '-0.02em',
            }}
          >
            {formatTime(secondsLeft)}
          </motion.div>
        </AnimatePresence>
        <span style={{
          fontSize: '0.7rem',
          color: 'rgba(44, 36, 30, 0.35)',
          marginTop: '0.25rem',
          fontWeight: 500,
        }}>
          {isStudy ? 'Focus Time' : 'Break Time'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
          <motion.button
            onClick={isRunning ? timer.pause : timer.start}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              height: '44px',
              padding: '0 1.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '6px',
              border: '1px solid transparent',
              background: '#c4845a',
              color: '#fdf7f2',
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
            whileHover={!prefersReducedMotion ? { y: -1 } : undefined}
            whileTap={!prefersReducedMotion ? { scale: 0.97 } : undefined}
            onMouseEnter={(e) => e.currentTarget.style.background = '#a86d47'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#c4845a'}
          >
            {isRunning ? (
              <>
                <Pause style={{ width: '16px', height: '16px' }} />
                Pause
              </>
            ) : (
              <>
                <Play style={{ width: '16px', height: '16px' }} />
                Start
              </>
            )}
          </motion.button>

          <motion.button
            onClick={timer.reset}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '6px',
              border: '1px solid transparent',
              background: 'transparent',
              color: 'rgba(44, 36, 30, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            whileHover={!prefersReducedMotion ? { color: '#2c241e', background: 'rgba(44, 36, 30, 0.04)' } : undefined}
          >
            <RotateCcw style={{ width: '16px', height: '16px' }} />
          </motion.button>
        </div>

        <div style={{ width: '100%', marginTop: '1rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.6rem',
            color: 'rgba(44, 36, 30, 0.3)',
            marginBottom: '0.25rem',
          }}>
            <span>Session {currentSession} of {totalSessions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '2px',
            background: 'rgba(44, 36, 30, 0.06)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #c4845a, #d4a77a)',
                borderRadius: '1px',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {suggestedActivity && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '0.65rem 1rem',
              background: 'rgba(44, 36, 30, 0.02)',
              border: '1px solid rgba(44, 36, 30, 0.04)',
              borderRadius: '4px',
            }}
          >
            <span style={{
              fontSize: '0.55rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'rgba(44, 36, 30, 0.3)',
            }}>
              Suggested Next
            </span>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#2c241e',
              marginTop: '0.1rem',
            }}>
              {suggestedActivity.title}
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.1rem',
              fontSize: '0.6rem',
              color: 'rgba(44, 36, 30, 0.35)',
            }}>
              <span>{suggestedActivity.subject}</span>
              <span style={{ width: '1px', height: '10px', background: 'rgba(44, 36, 30, 0.08)' }} />
              <span>
                Due {new Date(suggestedActivity.dueDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}