import { ReactNode } from 'react';

interface PageContainerProps {
  readonly children: ReactNode;
  readonly maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  readonly className?: string;
}

export default function PageContainer({
  children,
  maxWidth = 'lg',
  className = '',
}: PageContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
  }[maxWidth];

  return (
    <div
      className={`w-full ${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
