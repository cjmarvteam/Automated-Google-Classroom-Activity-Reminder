import { Activity } from '../../types';
import { motion } from 'framer-motion';
import { getDueStatus } from '@/lib/utils';
import { Calendar, BookOpen, Clock, ChevronRight } from 'lucide-react';

interface Props {
  activity: Activity;
  onClick: () => void;
}

export function ActivityCard({ activity, onClick }: Props) {
  const status = getDueStatus(activity.dueDate, activity.status);

  const statusColors = {
    Overdue: 'bg-red-50 text-red-700 border-red-200',
    'Due Today': 'bg-amber-50 text-amber-700 border-amber-200',
    'Due Tomorrow': 'bg-orange-50 text-orange-700 border-orange-200',
    'Due Soon': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Upcoming: 'bg-gray-50 text-gray-500 border-gray-200',
    Completed: 'bg-green-50 text-green-700 border-green-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const dotColors = {
    Overdue: '#c0392b',
    'Due Today': '#c4845a',
    'Due Tomorrow': '#d4a77a',
    'Due Soon': '#d4a77a',
    Upcoming: 'rgba(44,36,30,0.2)',
    Completed: '#27ae60',
    'In Progress': '#2980b9',
  };

  return (
    <motion.div
      whileHover={{
        y: -3,
        borderColor: 'rgba(44, 36, 30, 0.15)',
        transition: { duration: 0.15 },
      }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-gray-100 rounded-lg p-4 cursor-pointer transition-all"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: dotColors[status as keyof typeof dotColors] || 'rgba(44,36,30,0.2)' }}
            />
            <h3 className="font-medium text-sm truncate">{activity.title}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {activity.subject}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(activity.dueDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            {activity.maxPoints && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {activity.maxPoints} pts
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[status as keyof typeof statusColors] || 'bg-gray-50 text-gray-500 border-gray-200'}`}
          >
            {status}
          </span>
          <ChevronRight className="h-4 w-4 text-gray-300" />
        </div>
      </div>
    </motion.div>
  );
}