// src/components/ui/SkeletonLoader.tsx
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'table' | 'activity';
  count?: number;
}

export function SkeletonLoader({ className, variant = 'card', count = 3 }: SkeletonLoaderProps) {
  const variants = {
    card: (
      <div className="space-y-3">
        <div className="h-4 w-3/4 rounded bg-[#2c241e]/5 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-[#2c241e]/5 animate-pulse" />
        <div className="h-20 rounded bg-[#2c241e]/5 animate-pulse" />
      </div>
    ),
    activity: (
      <div className="flex items-center justify-between p-3 border border-[#2c241e]/8 rounded-lg">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-2/3 rounded bg-[#2c241e]/5 animate-pulse" />
          <div className="h-3 w-1/3 rounded bg-[#2c241e]/5 animate-pulse" />
        </div>
        <div className="h-6 w-16 rounded-full bg-[#2c241e]/5 animate-pulse" />
      </div>
    ),
    table: (
      <div className="space-y-2">
        <div className="flex gap-4">
          <div className="h-4 w-1/4 rounded bg-[#2c241e]/5 animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-[#2c241e]/5 animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-[#2c241e]/5 animate-pulse" />
          <div className="h-4 w-1/4 rounded bg-[#2c241e]/5 animate-pulse" />
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 py-2 border-t border-[#2c241e]/5">
            <div className="h-4 w-1/4 rounded bg-[#2c241e]/5 animate-pulse" />
            <div className="h-4 w-1/4 rounded bg-[#2c241e]/5 animate-pulse" />
            <div className="h-4 w-1/4 rounded bg-[#2c241e]/5 animate-pulse" />
            <div className="h-4 w-1/4 rounded bg-[#2c241e]/5 animate-pulse" />
          </div>
        ))}
      </div>
    ),
  };

  return <div className={cn(className)}>{variants[variant]}</div>;
}