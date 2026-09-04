import { NumberCounter } from '../ui/NumberCounter';
import { motion } from 'framer-motion';
import { BookOpen, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { SkeletonLoader } from '../ui/SkeletonLoader';

interface StatItem {
  title: string;
  value: number;
}

interface Props {
  stats: StatItem[];
  isLoading?: boolean;
}

const iconMap = {
  'Total Classes': BookOpen,
  'Pending': Clock,
  'Due Soon': AlertCircle,
  'Completed': CheckCircle,
};

const colorMap = {
  'Total Classes': '#c4845a',
  'Pending': '#d4a77a',
  'Due Soon': '#c0392b',
  'Completed': '#27ae60',
};

export function DashboardStats({ stats, isLoading }: Props) {
  if (isLoading) {
    return <SkeletonLoader variant="card" count={4} />;
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      }}
    >
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.title as keyof typeof iconMap] || BookOpen;
        const color = colorMap[stat.title as keyof typeof colorMap] || '#c4845a';

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + index * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#ffffff',
              border: '1px solid rgba(44, 36, 30, 0.06)',
              borderRadius: '6px',
              padding: '1rem 1.25rem',
              transition: 'border-color 0.2s ease, transform 0.15s ease',
              cursor: 'default',
            }}
            whileHover={{
              borderColor: 'rgba(44, 36, 30, 0.15)',
              y: -2,
              transition: { duration: 0.15 },
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(44, 36, 30, 0.4)',
              }}>
                {stat.title}
              </span>
              <Icon style={{ width: '16px', height: '16px', color: 'rgba(44, 36, 30, 0.2)' }} />
            </div>
            <div style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#2c241e',
              marginTop: '0.25rem',
            }}>
              <NumberCounter value={stat.value} duration={600} />
            </div>
            {/* Decorative mini bar */}
            <div style={{
              marginTop: '0.5rem',
              height: '2px',
              width: `${Math.min(stat.value / 20 * 100, 100)}%`,
              background: color,
              borderRadius: '1px',
              opacity: 0.2,
            }} />
          </motion.div>
        );
      })}
    </div>
  );
}