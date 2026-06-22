import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AutocompleteInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'list' | 'type'> {
  label?: string;
  options: string[];
  error?: string;
}

const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  (
    {
      label,
      options,
      error,
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

    const triggerChange = (value: string) => {
      const syntheticEvent = {
        target: { value },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      onChange?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      onFocus?.(event);
    };

    return (
      <div className="relative w-full">
        {label && (
          <label htmlFor={id || name} className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <input
          id={id}
          name={name}
          list={listId}
          ref={ref}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          autoComplete="off"
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
            error ? 'border-red-500 focus:ring-red-600' : 'border-slate-300'
          } ${className || ''}`}
          {...props}
        />

        {error && <span className="block text-sm text-red-600 mt-1">{error}</span>}

        <datalist id={listId}>
          {filteredOptions.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>
    );
  },
);

export default AutocompleteInput;
