import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../../contexts/ThemeContext';
import { CopyButton } from '../ui/CopyButton';
import { formatTimestamp } from '../../utils/claims.utils';
import type { JWTPayload, ValidationResult } from '../../types/jwt.types';

interface PayloadDisplayProps {
  payload: JWTPayload;
  validation: ValidationResult | null;
}

export function PayloadDisplay({ payload, validation }: PayloadDisplayProps) {
  const { theme } = useTheme();
  const formattedJSON = JSON.stringify(payload, null, 2);

  const hasTimeClaims = payload.exp || payload.iat || payload.nbf;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          JWT Payload
        </h3>
        <CopyButton text={formattedJSON} label="Copy Payload" />
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <SyntaxHighlighter
          language="json"
          style={theme === 'dark' ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.875rem',
            background: theme === 'dark' ? '#1e1e1e' : '#f6f8fa',
          }}
        >
          {formattedJSON}
        </SyntaxHighlighter>
      </div>

      {/* Time-based Claims */}
      {hasTimeClaims && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-3">
            Time-based Claims
          </h4>
          <dl className="space-y-3 text-sm">
            {payload.iat && (
              <div>
                <dt className="text-green-700 dark:text-green-400 font-medium">
                  Issued At (iat):
                </dt>
                <dd className="text-green-900 dark:text-green-200 mt-1">
                  {formatTimestamp(payload.iat)}
                </dd>
                <dd className="text-green-700 dark:text-green-400 text-xs mt-1">
                  Unix: {payload.iat}
                </dd>
              </div>
            )}
            {payload.nbf && (
              <div>
                <dt className="text-green-700 dark:text-green-400 font-medium">
                  Not Before (nbf):
                </dt>
                <dd className="text-green-900 dark:text-green-200 mt-1">
                  {formatTimestamp(payload.nbf)}
                </dd>
                <dd className="text-green-700 dark:text-green-400 text-xs mt-1">
                  Unix: {payload.nbf}
                </dd>
              </div>
            )}
            {payload.exp && (
              <div>
                <dt className="text-green-700 dark:text-green-400 font-medium">
                  Expires At (exp):
                </dt>
                <dd
                  className={`mt-1 ${
                    validation?.isExpired
                      ? 'text-red-600 dark:text-red-400 font-semibold'
                      : 'text-green-900 dark:text-green-200'
                  }`}
                >
                  {formatTimestamp(payload.exp)}
                  {validation?.isExpired && ' (EXPIRED)'}
                </dd>
                <dd className="text-green-700 dark:text-green-400 text-xs mt-1">
                  Unix: {payload.exp}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Standard Claims */}
      {(payload.iss || payload.sub || payload.aud || payload.jti) && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Standard Claims
          </h4>
          <dl className="space-y-2 text-sm">
            {payload.iss && (
              <div>
                <dt className="text-gray-700 dark:text-gray-400 font-medium">Issuer (iss):</dt>
                <dd className="text-gray-900 dark:text-gray-200 mt-1 break-all">
                  {payload.iss}
                </dd>
              </div>
            )}
            {payload.sub && (
              <div>
                <dt className="text-gray-700 dark:text-gray-400 font-medium">Subject (sub):</dt>
                <dd className="text-gray-900 dark:text-gray-200 mt-1 break-all">
                  {payload.sub}
                </dd>
              </div>
            )}
            {payload.aud && (
              <div>
                <dt className="text-gray-700 dark:text-gray-400 font-medium">
                  Audience (aud):
                </dt>
                <dd className="text-gray-900 dark:text-gray-200 mt-1 break-all">
                  {Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud}
                </dd>
              </div>
            )}
            {payload.jti && (
              <div>
                <dt className="text-gray-700 dark:text-gray-400 font-medium">JWT ID (jti):</dt>
                <dd className="text-gray-900 dark:text-gray-200 mt-1 font-mono text-xs break-all">
                  {payload.jti}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
