import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface FloatingShapeProps {
  style?: React.CSSProperties;
  amplitude?: number;
  duration?: number;
  delay?: number;
}

export function FloatingShape({
  style,
  amplitude = 10,
  duration = 8,
  delay = 0,
}: FloatingShapeProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      style={style}
      animate={{
        y: [0, amplitude, 0, -amplitude, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}