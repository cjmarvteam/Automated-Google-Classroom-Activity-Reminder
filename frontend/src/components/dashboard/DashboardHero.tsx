// src/components/dashboard/DashboardHero.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AnimatedButton } from '../ui/AnimatedButton';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { FloatingShape } from '../ui/FloatingShape';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

export function DashboardHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative floating shapes */}
      {!prefersReducedMotion && (
        <>
          <FloatingShape
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-40px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(196, 132, 90, 0.04)',
              filter: 'blur(60px)',
            }}
            amplitude={8}
            duration={12}
            delay={0}
          />
          <FloatingShape
            style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-60px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(212, 167, 122, 0.04)',
              filter: 'blur(70px)',
            }}
            amplitude={6}
            duration={16}
            delay={2}
          />
        </>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'grid',
          gap: '2.5rem',
          gridTemplateColumns: '1fr 1fr',
          position: 'relative',
          zIndex: 1,
        }}
        className="lg:grid-cols-2 max-lg:grid-cols-1"
      >
        {/* Left - Editorial Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: '24px', height: '1px', background: '#c4845a' }} />
            <span className="label-sm" style={{ color: '#c4845a' }}>Dashboard</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 600,
              lineHeight: 1.06,
              letterSpacing: '-0.03em',
              color: '#2c241e',
            }}
          >
            Your Classroom,
            <br />
            <span style={{ color: '#c4845a' }}>Organized.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: 'rgba(44, 36, 30, 0.5)',
              maxWidth: '480px',
            }}
          >
            Stay ahead of every classroom activity. Track assignments, deadlines,
            reminders, and upcoming activities in one focused workspace.
          </motion.p>

          <motion.div
            variants={itemVariants}
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}
          >
            <Link to="/activities">
              <AnimatedButton variant="primary" icon={<ArrowRight style={{ width: '16px', height: '16px' }} />}>
                View Activities
              </AnimatedButton>
            </Link>
            <Link to="/calendar">
              <AnimatedButton variant="outline" icon={<Calendar style={{ width: '16px', height: '16px' }} />}>
                Open Calendar
              </AnimatedButton>
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              paddingTop: '0.5rem',
            }}
          >
            <div>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: '#2c241e' }}>12</span>
              <span style={{
                display: 'block',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(44, 36, 30, 0.4)',
              }}>Active</span>
            </div>
            <span style={{ width: '1px', height: '20px', background: 'rgba(44, 36, 30, 0.08)' }} />
            <div>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: '#2c241e' }}>4</span>
              <span style={{
                display: 'block',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(44, 36, 30, 0.4)',
              }}>Due Soon</span>
            </div>
            <span style={{ width: '1px', height: '20px', background: 'rgba(44, 36, 30, 0.08)' }} />
            <div>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: '#2c241e' }}>18</span>
              <span style={{
                display: 'block',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(44, 36, 30, 0.4)',
              }}>Completed</span>
            </div>
          </motion.div>
        </div>

        {/* Right - Visual UI Composition */}
        <motion.div
          variants={itemVariants}
          style={{ position: 'relative' }}
          className="max-lg:hidden"
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(44, 36, 30, 0.06)',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 4px 24px rgba(44, 36, 30, 0.04)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span className="label-sm" style={{ color: '#c4845a' }}>Today's Activities</span>
              <span style={{
                fontSize: '0.6rem',
                color: 'rgba(44, 36, 30, 0.3)',
                background: 'rgba(44, 36, 30, 0.04)',
                padding: '2px 10px',
                borderRadius: '100px',
              }}>
                04 items
              </span>
            </div>

            {[
              { title: 'Mathematics', subtitle: 'Calculus: Derivatives', due: 'Tomorrow', color: '#c4845a' },
              { title: 'Web Development', subtitle: 'React Project', due: 'Sep 5', color: '#d4a77a' },
              { title: 'Database Systems', subtitle: 'Normalization', due: 'Sep 7', color: 'rgba(44,36,30,0.3)' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.08, duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '4px',
                  marginBottom: '0.25rem',
                  transition: 'background 0.15s ease',
                  cursor: 'default',
                }}
                whileHover={{ background: 'rgba(44, 36, 30, 0.02)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: item.color,
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#2c241e' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(44, 36, 30, 0.4)' }}>
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 500,
                  color: 'rgba(44, 36, 30, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  background: 'rgba(44, 36, 30, 0.04)',
                }}>
                  {item.due}
                </span>
              </motion.div>
            ))}

            <div style={{
              margin: '0.75rem 0',
              height: '1px',
              background: 'rgba(44, 36, 30, 0.06)',
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.6rem', color: 'rgba(44, 36, 30, 0.25)' }}>
                Last updated: Today, 2:30 PM
              </span>
              <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.6rem',
                color: 'rgba(44, 36, 30, 0.25)',
              }}>
                <Sparkles style={{ width: '12px', height: '12px' }} />
                Sync active
              </span>
            </div>
          </div>

          <div style={{
            position: 'absolute',
            bottom: '-20px',
            right: '20px',
            width: '60px',
            height: '1px',
            background: 'rgba(44, 36, 30, 0.06)',
          }} />
        </motion.div>
      </motion.div>
    </div>
  );
}