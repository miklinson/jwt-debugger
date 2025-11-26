import { jwtVerify, importSPKI } from 'jose';
import type { VerificationResult } from '../types/jwt.types';

/**
 * Verifies a JWT token signature using the provided key
 * Supports both HMAC (symmetric) and RSA/ECDSA (asymmetric) algorithms
 */
export async function verifyJWT(
  token: string,
  algorithm: string,
  key: string
): Promise<VerificationResult> {
  if (!token || !algorithm || !key) {
    return {
      valid: false,
      error: 'Missing required parameters',
    };
  }

  try {
    // Check if algorithm is HMAC (symmetric)
    if (algorithm.startsWith('HS')) {
      // For HMAC algorithms, the key is a simple secret string
      const encoder = new TextEncoder();
      const secretKey = encoder.encode(key);

      await jwtVerify(token, secretKey, {
        algorithms: [algorithm],
      });

      return { valid: true };
    }

    // For RSA and ECDSA algorithms, import the PEM public key
    if (algorithm.startsWith('RS') || algorithm.startsWith('ES')) {
      // Import SPKI (Subject Public Key Info) format
      const publicKey = await importSPKI(key, algorithm);

      await jwtVerify(token, publicKey, {
        algorithms: [algorithm],
      });

      return { valid: true };
    }

    return {
      valid: false,
      error: `Unsupported algorithm: ${algorithm}`,
    };
  } catch (error) {
    // Parse error message for user-friendly feedback
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('signature')) {
      return {
        valid: false,
        error: 'Invalid signature - the key does not match the token',
      };
    }

    if (errorMessage.includes('Invalid key')) {
      return {
        valid: false,
        error: 'Invalid key format - ensure PEM format for RSA/ECDSA',
      };
    }

    if (errorMessage.includes('expired')) {
      return {
        valid: false,
        error: 'Token is expired',
      };
    }

    return {
      valid: false,
      error: errorMessage,
    };
  }
}
