import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';

interface AutocompleteInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'list' | 'type'> {
  label?: string;
  options: string[];
  error?: string;
  icon?: ReactNode;
}

const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  (
    {
      label,
      options,
      error,
      icon,
      className,
      onChange,
      onBlur,
      onFocus,
      value,
      placeholder,
      id,
      name,
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState<string>(
      typeof value === 'string' ? value : '',
    );
    const inputId = id || name || 'autocomplete-input';
    const listId = `${inputId}-options`;

    const inputElRef = useRef<HTMLInputElement | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    useEffect(() => {
      setInputValue(typeof value === 'string' ? value : '');
    }, [value]);

    const filteredOptions = useMemo(() => {
      const normalizedValue = inputValue.trim().toLowerCase();
      if (!normalizedValue) {
        return options.slice(0, 5);
      }

      return options
        .filter((option) => option.toLowerCase().includes(normalizedValue))
        .slice(0, 5);
    }, [inputValue, options]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      onChange?.(event);
      setIsOpen(true);
      setHighlightedIndex(-1);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
      // delay close to allow click on options
      setTimeout(() => setIsOpen(false), 150);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
      setIsOpen(true);
    };

    const selectOption = (option: string) => {
      setInputValue(option);
      const syntheticEvent = { target: { value: option } } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
      setIsOpen(false);
      setHighlightedIndex(-1);
      inputElRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          selectOption(filteredOptions[highlightedIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    return (
      <div className="relative w-full">
        {label && (
          <label htmlFor={id || name} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-blue-600">
              {icon}
            </div>
          )}
          <input
            id={id}
            name={name}
            ref={(node) => {
              if (typeof ref === 'function') ref(node);
              else if (ref && 'current' in ref) (ref as any).current = node;
              inputElRef.current = node;
            }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            placeholder={placeholder}
            className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
              error ? 'border-red-500 focus:ring-red-600' : 'border-slate-300'
            } ${className || ''}`}
            {...props}
          />

          {isOpen && filteredOptions.length > 0 && (
            <ul
              id={listId}
              aria-label="Opções de cidade"
              className="absolute left-0 right-0 top-full z-10 mt-1 w-full min-w-full max-h-56 overflow-auto bg-white border border-slate-200 rounded-lg shadow-sm py-1"
            >
            {filteredOptions.map((option, idx) => {
              const isHighlighted = idx === highlightedIndex;
              return (
                <li key={option}>
                  <button
                    type="button"
                    onMouseDown={(ev) => ev.preventDefault()}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => selectOption(option)}
                    className={`w-full text-left px-3 py-2 text-sm ${
                      isHighlighted ? 'bg-blue-100 text-blue-600' : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        </div>
      </div>
    );
  },
);

export default AutocompleteInput;
