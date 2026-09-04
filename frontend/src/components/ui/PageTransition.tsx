import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children, className }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    return (
      <motion.div
        ref={ref}
        initial={!prefersReducedMotion ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={!prefersReducedMotion ? { opacity: 0, y: -6 } : { opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={cn(className)}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    );
  }
);

PageTransition.displayName = 'PageTransition';