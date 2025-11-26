import { useState } from 'react';
import { useJWTDecoder } from './hooks/useJWTDecoder';
import { useTokenValidation } from './hooks/useTokenValidation';
import { formatTimestamp } from './utils/claims.utils';

function App() {
  const [rawToken, setRawToken] = useState('');
  const decodedJWT = useJWTDecoder(rawToken);
  const validation = useTokenValidation(decodedJWT?.payload);

  // Sample JWT for testing
  const sampleToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.8VLXUXa_rY0JvZ0YsYPpXfzQbZJYPjPdMZTEgURRCxs';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">JWT Debugger</h1>
        <p className="text-gray-400 mb-8">
          Decode and verify JWT tokens securely in your browser
        </p>

        <div className="space-y-6">
          {/* JWT Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Paste JWT Token:</label>
              <button
                onClick={() => setRawToken(sampleToken)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Try Sample Token
              </button>
            </div>
            <textarea
              value={rawToken}
              onChange={(e) => setRawToken(e.target.value)}
              className="w-full h-40 p-4 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
            {rawToken && !decodedJWT && (
              <p className="mt-2 text-red-400 text-sm">
                Invalid JWT format. Expected format: header.payload.signature
              </p>
            )}
          </div>

          {/* Validation Warnings */}
          {validation && validation.warnings.length > 0 && (
            <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
              <h3 className="font-bold text-yellow-400 mb-2">Validation Warnings:</h3>
              <ul className="space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-300 text-sm">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Decoded JWT Display */}
          {decodedJWT && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-blue-400">Header</h2>
                  <span className="text-xs text-gray-400">
                    Algorithm: {decodedJWT.header.alg}
                  </span>
                </div>
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  {JSON.stringify(decodedJWT.header, null, 2)}
                </pre>
              </div>

              {/* Payload */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-green-400 mb-4">Payload</h2>
                <pre className="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(decodedJWT.payload, null, 2)}
                </pre>

                {/* Time-based claims */}
                {(decodedJWT.payload.exp || decodedJWT.payload.iat || decodedJWT.payload.nbf) && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <h3 className="font-bold text-sm text-gray-400 mb-3">
                      Time-based Claims:
                    </h3>
                    <div className="space-y-2 text-sm">
                      {decodedJWT.payload.iat && (
                        <div>
                          <span className="text-gray-400">Issued At (iat):</span>
                          <span className="text-gray-300 ml-2">
                            {formatTimestamp(decodedJWT.payload.iat)}
                          </span>
                        </div>
                      )}
                      {decodedJWT.payload.nbf && (
                        <div>
                          <span className="text-gray-400">Not Before (nbf):</span>
                          <span className="text-gray-300 ml-2">
                            {formatTimestamp(decodedJWT.payload.nbf)}
                          </span>
                        </div>
                      )}
                      {decodedJWT.payload.exp && (
                        <div>
                          <span className="text-gray-400">Expires At (exp):</span>
                          <span className={`ml-2 ${
                            validation?.isExpired ? 'text-red-400' : 'text-gray-300'
                          }`}>
                            {formatTimestamp(decodedJWT.payload.exp)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Signature */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-purple-400 mb-4">Signature</h2>
                <p className="text-sm text-gray-400 mb-4">
                  To verify the signature, you'll need the secret key (for HMAC algorithms) or
                  the public key (for RSA/ECDSA algorithms).
                </p>
                <pre className="text-xs text-gray-500 overflow-x-auto break-all">
                  {decodedJWT.signature}
                </pre>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-300">
                  <strong>Security Notice:</strong> All JWT operations happen entirely in your
                  browser. No data is sent to any server. Your tokens and keys never leave your
                  device.
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!rawToken && (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <h2 className="text-xl font-bold text-gray-400 mb-2">No JWT Token Provided</h2>
              <p className="text-gray-500 mb-4">
                Paste a JWT token above or click "Try Sample Token" to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
