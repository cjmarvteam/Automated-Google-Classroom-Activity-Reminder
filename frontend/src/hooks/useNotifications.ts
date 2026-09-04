import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markNotificationRead } from '../services/api';
import { usePreferencesStore } from '../store/preferencesStore';
import { useTimerStore } from '../store/timerStore';
import { isWithinQuietHours } from '../lib/utils';
import { useAuthStore } from '../store/authStore';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { quietHours, deepWorkMode } = usePreferencesStore();
  const { mode } = useTimerStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: isAuthenticated ? 30000 : false,
    enabled: isAuthenticated,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const shouldSuppressPopups = (): boolean => {
    if (deepWorkMode) return true;
    if (mode === 'study') return true;
    if (quietHours.enabled && isWithinQuietHours(quietHours.start, quietHours.end)) return true;
    return false;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    isLoading,
    markRead: markReadMutation.mutate,
    shouldSuppressPopups,
    unreadCount,
  };
};
