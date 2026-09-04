import { LucideIcon } from 'lucide-react';
import { NumberCounter } from '../ui/NumberCounter';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <motion.div
      style={{
        background: '#ffffff',
        border: '1px solid rgba(44, 36, 30, 0.08)',
        borderRadius: '6px',
        padding: '1rem 1.25rem',
        transition: 'border-color 0.2s ease',
      }}
      whileHover={{
        borderColor: 'rgba(44, 36, 30, 0.15)',
        transition: { duration: 0.15 },
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'rgba(44, 36, 30, 0.5)',
          }}
        >
          {title}
        </span>
        <Icon style={{ width: '16px', height: '16px', color: 'rgba(44, 36, 30, 0.3)' }} />
      </div>
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#2c241e',
          marginTop: '0.25rem',
        }}
      >
        <NumberCounter value={value} duration={800} />
      </div>
    </motion.div>
  );
}