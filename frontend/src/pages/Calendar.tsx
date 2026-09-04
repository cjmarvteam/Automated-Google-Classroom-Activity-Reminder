import { lazy, Suspense, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchActivities, updateActivityStatus } from '../services/api';
import { ActivityDetailDialog } from '../components/activities/ActivityDetailDialog';
import { Activity } from '../types';
import { EventClickArg } from '@fullcalendar/core';
import { Skeleton } from '@/components/ui/skeleton';
import { usePomodoro } from '@/hooks/usePomodoro';
import { toast } from 'sonner';

const CalendarView = lazy(() => import('../components/calendar/CalendarView'));

export default function Calendar() {
  const queryClient = useQueryClient();
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  });
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const timer = usePomodoro();

  const events = activities.map((a) => ({
    id: a.id,
    title: a.title,
    date: a.dueDate,
    extendedProps: { status: a.status, subject: a.subject },
  }));

  const handleEventClick = (info: EventClickArg) => {
    const activity = activities.find((a) => a.id === info.event.id);
    if (activity) {
      setSelectedActivity(activity);
      setDialogOpen(true);
    }
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
        <Skeleton className="h-[600px] w-full rounded-xl" style={{ background: 'rgba(44,36,30,0.06)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">View all your activities and deadlines in a calendar view.</p>
      </div>
      <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-xl" style={{ background: 'rgba(44,36,30,0.06)' }} />}>
        <CalendarView events={events} onEventClick={handleEventClick} />
      </Suspense>
      <ActivityDetailDialog activity={selectedActivity} open={dialogOpen} onOpenChange={setDialogOpen} onStartFocus={handleStartFocus} onMarkComplete={handleMarkComplete} />
    </div>
  );
}
