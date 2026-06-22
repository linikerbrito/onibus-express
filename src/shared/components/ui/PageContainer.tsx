import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function PageContainer({ children, maxWidth = 'lg' }: PageContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
  }[maxWidth];

  return (
    <div className={`w-full ${maxWidthClass} mx-auto px-4 py-8`}>
      {children}
    </div>
  );
}
