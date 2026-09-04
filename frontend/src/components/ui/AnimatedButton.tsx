import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = 'primary', className, icon, iconPosition = 'right', ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const baseStyles = {
      primary: 'btn-editorial btn-editorial-primary',
      outline: 'btn-editorial btn-editorial-outline',
      ghost: 'btn-editorial btn-editorial-ghost',
    };

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles[variant], className)}
        whileHover={
          !prefersReducedMotion
            ? {
                y: -1,
                transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
              }
            : undefined
        }
        whileTap={
          !prefersReducedMotion
            ? {
                scale: 0.97,
                transition: { duration: 0.08, ease: [0.4, 0, 0.2, 1] },
              }
            : undefined
        }
        {...(props as any)}
      >
        {icon && iconPosition === 'left' && (
          <motion.span
            whileHover={
              !prefersReducedMotion
                ? { x: -2, transition: { duration: 0.15 } }
                : undefined
            }
          >
            {icon}
          </motion.span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <motion.span
            whileHover={
              !prefersReducedMotion
                ? { x: 4, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } }
                : undefined
            }
          >
            {icon}
          </motion.span>
        )}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';