import { Activity } from '../../types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDueStatus, getStatusColor } from '@/lib/utils';
import { Calendar, BookOpen, Clock, ChevronRight } from 'lucide-react';

interface Props {
  activity: Activity;
  onClick: () => void;
}

export function ActivityCard({ activity, onClick }: Props) {
  const status = getDueStatus(activity.dueDate, activity.status);
  const color = getStatusColor(status);

  return (
    <Card
      className="glass glass-hover rounded-xl border border-white/10 p-4 cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start gap-2">
            <h3 className="font-medium text-sm flex-1 truncate">{activity.title}</h3>
            <Badge className={`${color} border-0 text-xs shrink-0 px-2.5 py-0.5 rounded-full`}>
              {status}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {activity.subject}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(activity.dueDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {activity.maxPoints && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {activity.maxPoints} pts
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground/30 flex-shrink-0 mt-0.5" />
      </div>
    </Card>
  );
}