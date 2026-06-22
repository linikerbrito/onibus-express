import { ReactNode } from 'react';

interface CardProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export default function Card({ children, className = '' }: Readonly<CardProps>) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );
}
