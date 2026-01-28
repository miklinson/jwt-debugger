import { useMemo } from 'react';
import { parseJWT, parsePartialJWT } from '../utils/jwt.utils';
import type { DecodedJWT, PartialDecodedJWT } from '../types/jwt.types';

/**
 * Hook to decode a JWT token
 * Returns the decoded JWT or null if invalid
 */
export function useJWTDecoder(token: string): DecodedJWT | null {
  return useMemo(() => {
    if (!token || token.trim() === '') {
      return null;
    }

    return parseJWT(token.trim());
  }, [token]);
}

/**
 * Hook to decode a JWT token with partial support
 * Returns partial results even if some parts are masked/invalid
 */
export function usePartialJWTDecoder(token: string): PartialDecodedJWT | null {
  return useMemo(() => {
    if (!token || token.trim() === '') {
      return null;
    }

    return parsePartialJWT(token.trim());
  }, [token]);
}
