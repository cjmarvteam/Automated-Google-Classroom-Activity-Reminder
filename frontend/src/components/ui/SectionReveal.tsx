import { motion, useInView } from 'framer-motion';
import { forwardRef, useRef } from 'react';
import { cn } from '@/lib/utils';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'none';
  scale?: boolean;
}

export const SectionReveal = forwardRef<HTMLDivElement, SectionRevealProps>(
  ({ children, className, delay = 0, direction = 'up', scale = false }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(internalRef, { once: true, margin: '-100px' });

    const variants = {
      hidden: {
        opacity: 0,
        y: direction === 'up' ? 24 : direction === 'down' ? -24 : 0,
        scale: scale ? 0.97 : 1,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          delay,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
      },
    };

    return (
      <motion.div
        ref={(node) => {
          (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={variants}
        className={cn(className)}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    );
  }
);

SectionReveal.displayName = 'SectionReveal';
