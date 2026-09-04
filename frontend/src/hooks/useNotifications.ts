import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchNotifications, markNotificationRead } from '../services/api';
import { usePreferencesStore } from '../store/preferencesStore';
import { useTimerStore } from '../store/timerStore';
import { useAuthStore } from '../store/authStore';
import { isWithinQuietHours } from '../lib/utils';

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const { quietHours, deepWorkMode } = usePreferencesStore();
  const { mode } = useTimerStore();
  const token = useAuthStore((state) => state.token);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: Boolean(token),
    retry: false,
    refetchInterval: 30000,
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
