// src/components/ui/AnimatedCard.tsx
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  index?: number;
  hover?: boolean;
  onClick?: () => void;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, delay = 0, index = 0, hover = true, onClick }, ref) => {
    const delayValue = delay + index * 0.05;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          delay: delayValue,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={
          hover
            ? {
                y: -3,
                transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
              }
            : undefined
        }
        onClick={onClick}
        className={cn(
          'transition-colors duration-150',
          onClick && 'cursor-pointer',
          className
        )}
        style={{ willChange: 'transform' }}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';