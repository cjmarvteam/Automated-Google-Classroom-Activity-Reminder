// src/components/ui/AnimatedContainer.tsx
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { fadeInUp, fadeIn, scaleIn, transitions } from '@/lib/motion';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeInUp' | 'fadeIn' | 'scaleIn';
  delay?: number;
  duration?: number;
  as?: 'div' | 'section' | 'main';
}

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, animation = 'fadeInUp', delay = 0, duration = 0.5, as: Component = 'div' }, ref) => {
    const variants = {
      fadeInUp,
      fadeIn,
      scaleIn,
    };

    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants[animation]}
        transition={{
          duration,
          delay,
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

AnimatedContainer.displayName = 'AnimatedContainer';