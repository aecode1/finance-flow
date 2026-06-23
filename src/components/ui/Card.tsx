import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-surface rounded-2xl border border-border shadow-card ${className}`}>
      {children}
    </div>
  );
}
