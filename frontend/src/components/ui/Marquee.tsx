import { motion } from 'framer-motion';

interface MarqueeProps {
  items: string[];
  speed?: number;
  className?: string;
  direction?: 'left' | 'right';
}

export function Marquee({
  items,
  speed = 25,
  className = '',
  direction = 'left',
}: MarqueeProps) {
  if (items.length === 0) return null;

  const doubledItems = [...items, ...items];
  const directionMultiplier = direction === 'left' ? -1 : 1;

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div
        className="inline-block"
        animate={{ x: [`${directionMultiplier * 0}%`, `${directionMultiplier * -50}%`] }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {doubledItems.map((item, index) => (
          <span
            key={index}
            className="inline-block mx-6 text-sm font-medium text-gray-400"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}