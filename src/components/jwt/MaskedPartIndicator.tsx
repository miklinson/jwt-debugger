import type { DecodeStatus } from '../../types/jwt.types';

interface MaskedPartIndicatorProps {
  partName: string;
  status: Exclude<DecodeStatus, 'decoded'>;
  rawValue: string;
  error?: string;
}

export function MaskedPartIndicator({
  partName,
  status,
  rawValue,
  error
}: MaskedPartIndicatorProps) {
  const isMasked = status === 'masked';

  return (
    <div className={`rounded-lg p-6 border ${
      isMasked
        ? 'bg-yellow-900/20 border-yellow-700'
        : 'bg-red-900/20 border-red-700'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <svg
          className={`w-8 h-8 ${isMasked ? 'text-yellow-500' : 'text-red-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMasked ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          )}
        </svg>

        <div>
          <h3 className={`text-lg font-semibold ${isMasked ? 'text-yellow-300' : 'text-red-300'}`}>
            {isMasked ? `${partName} is Masked` : `${partName} Decode Failed`}
          </h3>
          <p className={`text-sm ${isMasked ? 'text-yellow-400' : 'text-red-400'}`}>
            {isMasked
              ? 'This part of the JWT has been redacted and cannot be decoded'
              : 'This part of the JWT could not be decoded'
            }
          </p>
        </div>
      </div>

      <div className="bg-gray-800 rounded p-3 mt-4">
        <p className="text-xs text-gray-400 mb-1">Raw value:</p>
        <code className="text-sm font-mono text-gray-300 break-all">{rawValue}</code>
      </div>

      {error && (
        <p className="text-xs text-gray-500 mt-2">{error}</p>
      )}
    </div>
  );
}
