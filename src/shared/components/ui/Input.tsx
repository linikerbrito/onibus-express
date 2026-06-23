import { forwardRef, InputHTMLAttributes, ReactNode, useRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, icon, type, iconPosition = 'left', onFocus, onClick, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (type === 'date') {
        e.currentTarget.showPicker?.();
      }
      onFocus?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      if (type === 'date') {
        e.currentTarget.showPicker?.();
      }
      onClick?.(e as any);
    };

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={(props as any).id} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-blue-600">
              {icon}
            </div>
          )}
          {icon && iconPosition === 'right' && (
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-blue-600">
              {icon}
            </div>
          )}
          <input
            ref={ref || inputRef}
            type={type}
            onFocus={handleFocus}
            onClick={handleClick}
            {...props}
            className={`w-full ${icon && iconPosition === 'left' ? 'pl-10' : 'pl-3'} ${icon && iconPosition === 'right' ? 'pr-10' : 'pr-3'} py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
              error ? 'border-red-500 focus:ring-red-600' : 'border-slate-300'
            } ${className || ''}`}
          />
        </div>
        {error ? (
          <span className="block text-sm text-red-600 mt-1">{error}</span>
        ) : (
          <span className="block text-sm text-transparent mt-1">&nbsp;</span>
        )}
      </div>
    );
  },
);

export default Input;
