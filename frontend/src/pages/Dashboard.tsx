import { useQuery } from '@tanstack/react-query';
import { fetchActivities, fetchUpcomingActivities } from '../services/api';
import { FocusSession } from '../components/dashboard/FocusSession';
import { UpcomingActivities } from '../components/dashboard/UpcomingActivities';
import { LiveMetrics } from '../components/ui/LiveMetrics';
import { Marquee } from '../components/ui/Marquee';
import { Reveal } from '../components/ui/Reveal';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: allActivities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  });
  const { data: upcoming = [], isLoading: upcomingLoading } = useQuery({
    queryKey: ['upcoming'],
    queryFn: () => fetchUpcomingActivities(5),
  });

  const isLoading = activitiesLoading || upcomingLoading;
  const subjects = [...new Set(allActivities?.map((a) => a.subject) || [])];

  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';

  const firstName = user?.name?.split(' ')[0] || 'Student';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <section>
        <Reveal>
          <div className="flex flex-col gap-1">
            <span className="label-sm" style={{ color: '#c4845a' }}>Dashboard</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 600, lineHeight: 1.06, letterSpacing: '-0.03em', color: '#2c241e' }}>
              {greeting}, {firstName}
            </h1>
            <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(44, 36, 30, 0.5)', maxWidth: '480px', marginTop: '0.25rem' }}>
              Here's your academic overview for today. Stay ahead of every classroom activity.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link to="/activities">
              <motion.button className="btn-editorial btn-editorial-primary" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                View Activities <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link to="/calendar">
              <motion.button className="btn-editorial btn-editorial-outline" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                <Calendar className="w-4 h-4" /> Open Calendar
              </motion.button>
            </Link>
          </div>
        </Reveal>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-mono text-gray-300">01</span>
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-wider text-gray-400">Metrics</span>
        </div>
        <Reveal>
          {isLoading ? <SkeletonLoader variant="card" /> : <LiveMetrics />}
        </Reveal>
      </section>

      {subjects.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-mono text-gray-300">02</span>
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs uppercase tracking-wider text-gray-400">Subjects</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-lg py-4">
            <Marquee items={subjects} speed={30} />
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-mono text-gray-300">03</span>
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-wider text-gray-400">Focus</span>
        </div>
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: '1fr' }} className="lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Reveal delay={0.05}>
              {isLoading ? <SkeletonLoader variant="card" /> : <FocusSession />}
            </Reveal>
          </div>
          <div className="lg:col-span-1">
            <Reveal delay={0.1}>
              {isLoading ? <SkeletonLoader variant="activity" count={3} /> : <UpcomingActivities activities={upcoming} />}
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-mono text-gray-300">04</span>
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs uppercase tracking-wider text-gray-400">Calendar</span>
        </div>
        <Reveal delay={0.05}>
          <div style={{ background: '#ffffff', border: '1px solid rgba(44, 36, 30, 0.08)', borderRadius: '6px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="label-sm" style={{ color: '#c4845a' }}>Calendar</span>
              <p style={{ fontSize: '1rem', fontWeight: 500, color: '#2c241e', marginTop: '0.25rem' }}>View all your deadlines in one place</p>
              <p className="text-sm text-gray-400 mt-0.5">{allActivities?.length || 0} activities scheduled</p>
            </div>
            <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
              <Link to="/calendar" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', fontSize: '0.875rem', fontWeight: 500, borderRadius: '6px', border: '1px solid rgba(44, 36, 30, 0.08)', background: 'transparent', color: '#2c241e', textDecoration: 'none', transition: 'border-color 0.2s ease, background 0.2s ease' }}>
                <Calendar style={{ width: '16px', height: '16px' }} /> Open Calendar <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </section>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(44, 36, 30, 0.06)' }}>
        <span style={{ fontSize: '0.6rem', fontWeight: 500, letterSpacing: '0.12em', color: 'rgba(44, 36, 30, 0.2)' }}>SECTION 04</span>
        <span style={{ flex: 1, height: '1px', background: 'rgba(44, 36, 30, 0.06)' }} />
        <span style={{ fontSize: '0.6rem', color: 'rgba(44, 36, 30, 0.15)' }}>
          {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
