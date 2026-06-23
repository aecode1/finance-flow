import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
}

export function Badge({ children, color = '#6366F1' }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium font-sans"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {children}
    </span>
  );
}
