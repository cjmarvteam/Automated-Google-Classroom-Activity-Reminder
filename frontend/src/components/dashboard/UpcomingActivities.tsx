import { Activity } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { getDueStatus } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Props {
  activities: Activity[];
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
};

export function UpcomingActivities({ activities }: Props) {
  const limited = activities.slice(0, 5);
  const prefersReducedMotion = useReducedMotion();

  const getBadgeStyle = (status: string): React.CSSProperties => {
    const styles: Record<string, React.CSSProperties> = {
      Overdue: {
        background: 'rgba(192, 57, 43, 0.08)',
        color: '#c0392b',
        borderColor: 'rgba(192, 57, 43, 0.15)',
      },
      'Due Today': {
        background: 'rgba(196, 132, 90, 0.10)',
        color: '#a86d47',
        borderColor: 'rgba(196, 132, 90, 0.15)',
      },
      'Due Tomorrow': {
        background: 'rgba(212, 167, 122, 0.10)',
        color: '#b8875a',
        borderColor: 'rgba(212, 167, 122, 0.15)',
      },
      'Due Soon': {
        background: 'rgba(212, 167, 122, 0.08)',
        color: '#b8875a',
        borderColor: 'rgba(212, 167, 122, 0.12)',
      },
    };
    const defaultStyle = {
      background: 'rgba(44, 36, 30, 0.04)',
      color: 'rgba(44, 36, 30, 0.4)',
      borderColor: 'rgba(44, 36, 30, 0.06)',
    };
    return styles[status] || defaultStyle;
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid rgba(44, 36, 30, 0.08)',
        borderRadius: '6px',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <span className="label-sm" style={{ color: '#c4845a' }}>Upcoming</span>
        <Link
          to="/activities"
          style={{
            fontSize: '0.65rem',
            color: 'rgba(44, 36, 30, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            transition: 'color 0.2s ease',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#2c241e'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(44, 36, 30, 0.35)'}
        >
          View all <ArrowRight style={{ width: '12px', height: '12px' }} />
        </Link>
      </div>

      {limited.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ padding: '1.5rem 0', textAlign: 'center' }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎉</div>
          <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#2c241e' }}>All caught up!</p>
          <p style={{ fontSize: '0.65rem', color: 'rgba(44, 36, 30, 0.4)', marginTop: '0.15rem' }}>
            No upcoming activities
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={!prefersReducedMotion ? staggerContainer : undefined}
          initial="initial"
          animate="animate"
          style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
        >
          {limited.map((activity, index) => {
            const status = getDueStatus(activity.dueDate, activity.status);
            const badgeStyle = getBadgeStyle(status);
            const dotColor = status === 'Overdue' ? '#c0392b'
              : status === 'Due Today' ? '#c4845a'
              : status === 'Due Tomorrow' ? '#d4a77a'
              : status === 'Due Soon' ? '#d4a77a'
              : 'rgba(44, 36, 30, 0.2)';

            return (
              <motion.div
                key={activity.id}
                variants={!prefersReducedMotion ? staggerItem : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.6rem',
                  borderRadius: '4px',
                  border: '1px solid transparent',
                  transition: 'all 0.15s ease',
                  flexWrap: 'wrap',
                  gap: '0.25rem',
                  cursor: 'default',
                }}
                whileHover={
                  !prefersReducedMotion
                    ? {
                        borderColor: 'rgba(44, 36, 30, 0.06)',
                        background: 'rgba(44, 36, 30, 0.015)',
                        transition: { duration: 0.1 },
                      }
                    : undefined
                }
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', minWidth: 0, flex: 1 }}>
                  <span style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    marginTop: '5px',
                    flexShrink: 0,
                    background: dotColor,
                  }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      color: '#2c241e',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {activity.title}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginTop: '0.1rem',
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontSize: '0.6rem',
                        color: 'rgba(44, 36, 30, 0.35)',
                      }}>
                        <BookOpen style={{ width: '11px', height: '11px' }} />
                        {activity.subject}
                      </span>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                        fontSize: '0.6rem',
                        color: 'rgba(44, 36, 30, 0.35)',
                      }}>
                        <Clock style={{ width: '11px', height: '11px' }} />
                        {new Date(activity.dueDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.55rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  padding: '1px 10px',
                  borderRadius: '100px',
                  border: '1px solid',
                  ...badgeStyle,
                  flexShrink: 0,
                }}>
                  {status}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}