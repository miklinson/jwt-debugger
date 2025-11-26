import { useMemo } from 'react';
import { validateClaims } from '../utils/claims.utils';
import type { JWTPayload, ValidationResult } from '../types/jwt.types';

/**
 * Hook to validate JWT claims, especially time-based claims
 * Returns validation results including expiration status and warnings
 */
export function useTokenValidation(
  payload: JWTPayload | undefined
): ValidationResult | null {
  return useMemo(() => {
    if (!payload) {
      return null;
    }

    return validateClaims(payload);
  }, [payload]);
}
