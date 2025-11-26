import type { ValidationResult } from '../../types/jwt.types';
import { ExpirationTimer } from './ExpirationTimer';

interface ValidationWarningsProps {
  validation: ValidationResult;
}

export function ValidationWarnings({ validation }: ValidationWarningsProps) {
  if (!validation || validation.warnings.length === 0) {
    return null;
  }

  const { isExpired, isNotYetValid, timeUntilExpiration } = validation;

  // Determine severity
  const severity = isExpired || isNotYetValid ? 'error' : 'warning';

  return (
    <div
      className={`rounded-lg border p-4 ${
        severity === 'error'
          ? 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-700'
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-700'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          {severity === 'error' ? (
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className={`text-sm font-semibold mb-2 ${
              severity === 'error'
                ? 'text-red-800 dark:text-red-300'
                : 'text-yellow-800 dark:text-yellow-300'
            }`}
          >
            {isExpired ? 'Token Expired' : isNotYetValid ? 'Token Not Yet Valid' : 'Warning'}
          </h3>

          <ul className="space-y-1">
            {validation.warnings.map((warning, index) => (
              <li
                key={index}
                className={`text-sm ${
                  severity === 'error'
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-yellow-700 dark:text-yellow-300'
                }`}
              >
                • {warning}
              </li>
            ))}
          </ul>

          {/* Expiration Timer */}
          {!isExpired && timeUntilExpiration !== undefined && timeUntilExpiration > 0 && (
            <div className="mt-3">
              <ExpirationTimer expirationTime={timeUntilExpiration} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
