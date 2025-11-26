import { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { isValidJWTFormat } from '../../utils/jwt.utils';

interface JWTInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function JWTInput({ value, onChange }: JWTInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  // Update parent component with debounced value
  if (debouncedValue !== value) {
    onChange(debouncedValue);
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  // Sample JWT for testing
  const sampleToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.8VLXUXa_rY0JvZ0YsYPpXfzQbZJYPjPdMZTEgURRCxs';

  const handleUseSample = () => {
    setLocalValue(sampleToken);
    onChange(sampleToken);
  };

  const hasError = localValue.trim() !== '' && !isValidJWTFormat(localValue.trim());

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Encoded JWT Token
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleUseSample}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Try Sample
          </button>
          {localValue && (
            <button
              onClick={handleClear}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <textarea
        value={localValue}
        onChange={handleChange}
        className={`w-full h-64 p-4 font-mono text-sm rounded-lg border transition-colors
          ${
            hasError
              ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
          }
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2
        `}
        placeholder="Paste your JWT token here...&#10;&#10;Format: header.payload.signature"
        spellCheck={false}
      />

      {hasError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Invalid JWT format. Expected format: header.payload.signature
        </p>
      )}

      {localValue && !hasError && (
        <p className="text-sm text-green-600 dark:text-green-400">
          ✓ Valid JWT format detected
        </p>
      )}
    </div>
  );
}
