import { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface NumberCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function NumberCounter({ value, duration = 800, className }: NumberCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let startTime: number;
    const startValue = displayValue;
    const diff = value - startValue;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value, duration, prefersReducedMotion]);

  return <span className={className}>{displayValue}</span>;
}
