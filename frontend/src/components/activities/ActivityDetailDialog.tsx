import { Activity } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getDueStatus, getStatusColor } from '@/lib/utils';
import { Calendar, BookOpen, Clock, Sparkles, CheckCircle } from 'lucide-react';

interface Props {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartFocus: (activity: Activity) => void;
  onMarkComplete: (activity: Activity) => void;
}

export function ActivityDetailDialog({
  activity,
  open,
  onOpenChange,
  onStartFocus,
  onMarkComplete,
}: Props) {
  if (!activity) return null;

  const status = getDueStatus(activity.dueDate, activity.status);
  const color = getStatusColor(status);
  const isCompleted = activity.status === 'completed';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass rounded-2xl border border-white/10 shadow-2xl shadow-[#c97a57]/10 max-w-md p-0 overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c97a57] via-[#dca77a] to-[#c97a57]" />

        <div className="p-6">
          <DialogHeader className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-xl font-bold text-foreground">
                {activity.title}
              </DialogTitle>
              <Badge className={`${color} border-0 shrink-0 px-3 py-1 rounded-full text-xs font-medium`}>
                {status}
              </Badge>
            </div>
            {activity.description && (
              <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                {activity.description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4 mt-2">
            <div className="flex items-center gap-2.5 text-sm">
              <div className="rounded-lg bg-[#c97a57]/10 p-1.5 text-[#c97a57]">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-foreground">{activity.subject}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <div className="rounded-lg bg-[#c97a57]/10 p-1.5 text-[#c97a57]">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="text-foreground">
                {new Date(activity.dueDate).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            {activity.maxPoints && (
              <div className="flex items-center gap-2.5 text-sm col-span-2">
                <div className="rounded-lg bg-[#c97a57]/10 p-1.5 text-[#c97a57]">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-foreground">{activity.maxPoints} max points</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-2">
            {!isCompleted ? (
              <>
                <Button
                  onClick={() => onStartFocus(activity)}
                  className="btn-primary flex-1 gap-2 rounded-xl shadow-lg shadow-[#c97a57]/25"
                >
                  <Sparkles className="h-4 w-4" />
                  Start Focus Session
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onMarkComplete(activity)}
                  className="flex-1 gap-2 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-foreground"
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark Complete
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                disabled
                className="flex-1 gap-2 rounded-xl border-green-500/20 bg-green-500/5 text-green-600"
              >
                <CheckCircle className="h-4 w-4" />
                Completed ✓
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}