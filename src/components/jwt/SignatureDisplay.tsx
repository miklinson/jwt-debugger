import { useState } from 'react';
import { verifyJWT } from '../../utils/jwt.verify';
import { CopyButton } from '../ui/CopyButton';
import type { DecodedJWT, VerificationResult } from '../../types/jwt.types';

interface SignatureDisplayProps {
  jwt: DecodedJWT;
}

export function SignatureDisplay({ jwt }: SignatureDisplayProps) {
  const [algorithm, setAlgorithm] = useState(jwt.header.alg);
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const isHMAC = algorithm.startsWith('HS');
  const isRSA = algorithm.startsWith('RS');
  const isECDSA = algorithm.startsWith('ES');

  const handleVerify = async () => {
    if (!key.trim()) {
      setVerificationResult({
        valid: false,
        error: 'Please provide a key',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyJWT(jwt.raw, algorithm, key.trim());
      setVerificationResult(result);
    } catch (error) {
      setVerificationResult({
        valid: false,
        error: 'Verification failed',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Sample keys for testing
  const sampleHMACKey = 'your-256-bit-secret';
  const sampleRSAPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo
4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u
+qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh
kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ
0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg
cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc
mwIDAQAB
-----END PUBLIC KEY-----`;

  const handleUseSampleKey = () => {
    if (isHMAC) {
      setKey(sampleHMACKey);
    } else if (isRSA || isECDSA) {
      setKey(sampleRSAPublicKey);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Signature Verification
        </h3>
        <CopyButton text={jwt.signature} label="Copy Signature" />
      </div>

      {/* Signature Value */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Signature:
        </h4>
        <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto break-all whitespace-pre-wrap">
          {jwt.signature}
        </pre>
      </div>

      {/* Algorithm Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <optgroup label="HMAC (Symmetric)">
            <option value="HS256">HS256</option>
            <option value="HS384">HS384</option>
            <option value="HS512">HS512</option>
          </optgroup>
          <optgroup label="RSA (Asymmetric)">
            <option value="RS256">RS256</option>
            <option value="RS384">RS384</option>
            <option value="RS512">RS512</option>
          </optgroup>
          <optgroup label="ECDSA (Asymmetric)">
            <option value="ES256">ES256</option>
            <option value="ES384">ES384</option>
            <option value="ES512">ES512</option>
          </optgroup>
        </select>
      </div>

      {/* Key Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {isHMAC ? 'Secret Key' : 'Public Key (PEM format)'}
          </label>
          <button
            onClick={handleUseSampleKey}
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            Use Sample
          </button>
        </div>

        {isHMAC ? (
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full px-3 py-2 pr-20 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter secret key..."
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        ) : (
          <textarea
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full h-40 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={`-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----`}
            spellCheck={false}
          />
        )}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={isVerifying || !key.trim()}
        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isVerifying ? 'Verifying...' : 'Verify Signature'}
      </button>

      {/* Verification Result */}
      {verificationResult && (
        <div
          className={`p-4 rounded-lg border ${
            verificationResult.valid
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {verificationResult.valid ? (
              <>
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="font-semibold text-green-700 dark:text-green-300">
                  Signature Valid
                </span>
              </>
            ) : (
              <>
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="font-semibold text-red-700 dark:text-red-300">
                  Signature Invalid
                </span>
              </>
            )}
          </div>
          {verificationResult.error && (
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {verificationResult.error}
            </p>
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <p className="text-sm text-purple-900 dark:text-purple-200">
          <strong>Security Notice:</strong> All verification happens in your browser. Your keys
          never leave your device.
          {isHMAC && (
            <span className="block mt-2">
              ⚠️ Never paste production HMAC secrets. Use this for testing only.
            </span>
          )}
          {(isRSA || isECDSA) && (
            <span className="block mt-2">
              ✓ Public keys are safe to use for verification.
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
