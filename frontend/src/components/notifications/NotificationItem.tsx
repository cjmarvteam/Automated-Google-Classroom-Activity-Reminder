import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppNotification } from '../../types';
import { Bell, Clock, CheckCircle2, BookOpen, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'deadline': return AlertCircle;
    case 'DAILY_REMINDER': return Bell;
    case 'OVERDUE': return AlertCircle;
    case 'UPCOMING_DUE': return Clock;
    default: return Info;
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case 'deadline': return 'text-[#c97a57]';
    case 'OVERDUE': return 'text-[#c0392b]';
    case 'DAILY_REMINDER': return 'text-[#dca77a]';
    case 'UPCOMING_DUE': return 'text-[#2980b9]';
    default: return 'text-muted-foreground';
  }
}

function getNotificationBg(type: string) {
  switch (type) {
    case 'deadline': return 'bg-[#c97a57]/10';
    case 'OVERDUE': return 'bg-[#c0392b]/10';
    case 'DAILY_REMINDER': return 'bg-[#dca77a]/10';
    case 'UPCOMING_DUE': return 'bg-[#2980b9]/10';
    default: return 'bg-muted/20';
  }
}

function formatType(type: string) {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function NotificationItem({ notification, onMarkRead }: Props) {
  const Icon = getNotificationIcon(notification.type);
  const color = getNotificationColor(notification.type);
  const bgColor = getNotificationBg(notification.type);

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <Card
      className={cn(
        'glass glass-hover rounded-xl border border-white/10 p-4 transition-all duration-200',
        !notification.read && 'border-l-4 border-l-[#c97a57] bg-[#c97a57]/5'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn('mt-0.5 rounded-lg p-2.5 shrink-0', bgColor, color)}>
          <Icon className="h-4 w-4" />
        </div>

        <div className="flex-1 min-w-0">
          {notification.title && (
            <p className="text-sm font-medium text-foreground mb-0.5">{notification.title}</p>
          )}
          <p className={cn('text-sm', !notification.read && 'font-medium text-foreground')}>
            {notification.message}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(notification.timestamp)}
            </span>
            {notification.read && (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-3 w-3" /> Read
              </span>
            )}
            <span className="capitalize px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-medium">
              {formatType(notification.type)}
            </span>
          </div>
        </div>

        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkRead(notification.id)}
            className="shrink-0 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-[#c97a57]/10 transition-all"
          >
            Mark read
          </Button>
        )}
      </div>
    </Card>
  );
}
