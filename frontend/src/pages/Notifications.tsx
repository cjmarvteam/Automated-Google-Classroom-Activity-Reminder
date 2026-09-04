import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { NotificationItem } from '../components/notifications/NotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, CheckCheck, AlertCircle, BookOpen } from 'lucide-react';
import { markAllNotificationsRead } from '../services/api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function Notifications() {
  const { notifications, markRead, unreadCount } = useNotifications();
  const queryClient = useQueryClient();

  const deadlineNotifs = notifications.filter((n) => n.type === 'deadline' || n.type === 'DAILY_REMINDER' || n.type === 'OVERDUE');
  const otherNotifs = notifications.filter((n) => n.type !== 'deadline' && n.type !== 'DAILY_REMINDER' && n.type !== 'OVERDUE');
  const allRead = notifications.every((n) => n.read);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to mark notifications');
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#e8d5c4]/30 text-5xl">&#128276;</div>
        <h2 className="text-2xl font-bold tracking-tight">All caught up!</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          You don't have any notifications right now. Check back later for updates on your activities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {!allRead && (
          <Button onClick={handleMarkAllRead} className="btn-secondary gap-2 rounded-xl shadow-lg shadow-[#dca77a]/20">
            <CheckCheck className="h-4 w-4" /> Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="glass rounded-xl p-1 border border-white/10 w-full sm:w-auto">
          <TabsTrigger value="all" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-[#c97a57]/20 data-[state=active]:text-[#c97a57] transition-all">
            <Bell className="h-4 w-4 mr-2" /> All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-[#c97a57]/20 data-[state=active]:text-[#c97a57] transition-all">
            <AlertCircle className="h-4 w-4 mr-2" /> Deadlines ({deadlineNotifs.length})
          </TabsTrigger>
          <TabsTrigger value="other" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-[#c97a57]/20 data-[state=active]:text-[#c97a57] transition-all">
            <BookOpen className="h-4 w-4 mr-2" /> Other ({otherNotifs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
          ))}
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-3 mt-4">
          {deadlineNotifs.length === 0 ? (
            <div className="glass rounded-xl py-16 text-center border border-white/10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8d5c4]/30 text-3xl">&#128197;</div>
              <p className="text-foreground font-medium">No deadline alerts</p>
              <p className="text-sm text-muted-foreground mt-1">All deadlines are under control!</p>
            </div>
          ) : (
            deadlineNotifs.map((n) => (
              <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
            ))
          )}
        </TabsContent>

        <TabsContent value="other" className="space-y-3 mt-4">
          {otherNotifs.length === 0 ? (
            <div className="glass rounded-xl py-16 text-center border border-white/10">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8d5c4]/30 text-3xl">&#128218;</div>
              <p className="text-foreground font-medium">No other notifications</p>
              <p className="text-sm text-muted-foreground mt-1">Stay on track with your learning!</p>
            </div>
          ) : (
            otherNotifs.map((n) => (
              <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
