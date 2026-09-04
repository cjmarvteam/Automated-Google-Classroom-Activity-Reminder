import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '../../services/api';
import { AnimatedCounter } from './AnimatedCounter';
import { motion } from 'framer-motion';

export function LiveMetrics() {
  const [time, setTime] = useState(new Date());
  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const total = activities.length;
  const pending = activities.filter((a) => a.status === 'pending').length;
  const overdue = activities.filter((a) => a.status === 'overdue').length;
  const completed = activities.filter((a) => a.status === 'completed').length;
  const inProgress = activities.filter((a) => a.status === 'in_progress').length;

  const metrics = [
    { label: 'Total', value: total, color: '#2c241e' },
    { label: 'Pending', value: pending, color: '#d4a77a' },
    { label: 'In Progress', value: inProgress, color: '#c4845a' },
    { label: 'Overdue', value: overdue, color: '#c0392b' },
    { label: 'Completed', value: completed, color: '#27ae60' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-100 rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
          Live Metrics
        </span>
        <span className="text-xs text-gray-400">
          Updated {time.toLocaleTimeString()}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: metric.color }}
            >
              <AnimatedCounter value={metric.value} delay={index * 50} />
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{metric.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}