import { useMemo } from 'react';
import { parseJWT } from '../utils/jwt.utils';
import type { DecodedJWT } from '../types/jwt.types';

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
