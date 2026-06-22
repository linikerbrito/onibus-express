import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: 'primary' | 'secondary' | 'danger';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className,
  ...props
}: Readonly<ButtonProps>) {
  const baseClass = 'font-medium rounded-lg transition-colors disabled:cursor-not-allowed';

  const variantClass = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:bg-slate-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-400',
  }[variant];

  const sizeClass = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseClass} ${variantClass} ${sizeClass} ${className || ''}`}
    >
      {isLoading ? 'Carregando...' : children}
    </button>
  );
}
