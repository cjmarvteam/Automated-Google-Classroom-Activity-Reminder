import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchActivities, updateActivityStatus } from '../services/api';
import { ActivityTable } from '../components/activities/ActivityTable';
import { ActivityFilters } from '../components/activities/ActivityFilters';
import { ActivityCard } from '../components/activities/ActivityCard';
import { ActivityDetailDialog } from '../components/activities/ActivityDetailDialog';
import { Activity } from '../types';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Skeleton } from '@/components/ui/skeleton';
import { usePomodoro } from '@/hooks/usePomodoro';
import { toast } from 'sonner';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function Activities() {
  const queryClient = useQueryClient();
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const timer = usePomodoro();

  const subjects = useMemo(() => [...new Set(activities.map((a) => a.subject))], [activities]);

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (subjectFilter !== 'all' && a.subject !== subjectFilter) return false;
      if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [activities, search, statusFilter, subjectFilter]);

  const handleRowClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  const handleStartFocus = (activity: Activity) => {
    setDialogOpen(false);
    toast.success(`Starting focus session: ${activity.title}`);
    timer.start();
  };

  const handleMarkComplete = async (activity: Activity) => {
    try {
      await updateActivityStatus(activity.id, 'completed');
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['upcoming'] });
      toast.success(`"${activity.title}" marked as complete!`);
    } catch {
      toast.error('Failed to update activity status');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-32" style={{ background: 'rgba(44,36,30,0.06)' }} />
          <Skeleton className="h-4 w-48" style={{ background: 'rgba(44,36,30,0.06)' }} />
        </div>
        <Skeleton className="h-16 w-full rounded-xl" style={{ background: 'rgba(44,36,30,0.06)' }} />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" style={{ background: 'rgba(44,36,30,0.06)' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionReveal>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className="label-sm" style={{ color: '#c4845a' }}>Activity List</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#2c241e' }}>All Activities</h1>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'rgba(44, 36, 30, 0.5)', maxWidth: '480px' }}>
            Manage all your academic tasks and assignments in one focused workspace.
          </p>
        </div>
      </SectionReveal>

      <SectionReveal delay={0.05}>
        <ActivityFilters
          search={search} setSearch={setSearch}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          subjectFilter={subjectFilter} setSubjectFilter={setSubjectFilter}
          subjects={subjects}
        />
      </SectionReveal>

      <SectionReveal delay={0.1}>
        {isMobile ? (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((activity) => (
              <motion.div key={activity.id} variants={staggerItem}>
                <ActivityCard activity={activity} onClick={() => handleRowClick(activity)} />
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <div style={{ background: '#ffffff', border: '1px solid rgba(44, 36, 30, 0.06)', borderRadius: '6px', padding: '3rem 1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>&#128233;</div>
                <p style={{ fontSize: '0.95rem', fontWeight: 500, color: '#2c241e' }}>No activities found</p>
                <p style={{ fontSize: '0.8rem', color: 'rgba(44, 36, 30, 0.4)', marginTop: '0.25rem' }}>Try adjusting your search or filters</p>
              </div>
            )}
          </motion.div>
        ) : (
          <ActivityTable data={filtered} onRowClick={handleRowClick} />
        )}
      </SectionReveal>

      <ActivityDetailDialog activity={selectedActivity} open={dialogOpen} onOpenChange={setDialogOpen} onStartFocus={handleStartFocus} onMarkComplete={handleMarkComplete} />
    </div>
  );
}
