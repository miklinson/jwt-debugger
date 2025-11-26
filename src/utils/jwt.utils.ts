import type { DecodedJWT, JWTHeader, JWTPayload } from '../types/jwt.types';

/**
 * Decodes a Base64URL encoded string
 * Base64URL uses - and _ instead of + and / and doesn't use padding
 */
export function base64UrlDecode(str: string): string {
  // Replace URL-safe characters with standard base64 characters
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  try {
    // Decode base64 string
    const decoded = atob(base64);
    // Convert to UTF-8
    return decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (error) {
    throw new Error('Invalid Base64URL encoding');
  }
}

/**
 * Validates if a string has the correct JWT format (header.payload.signature)
 */
export function isValidJWTFormat(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
}

/**
 * Parses a JWT token and returns the decoded header, payload, and signature
 * Returns null if the token is invalid
 */
export function parseJWT(token: string): DecodedJWT | null {
  if (!isValidJWTFormat(token)) {
    return null;
  }

  try {
    const [headerB64, payloadB64, signature] = token.split('.');

    const headerJson = base64UrlDecode(headerB64);
    const payloadJson = base64UrlDecode(payloadB64);

    const header: JWTHeader = JSON.parse(headerJson);
    const payload: JWTPayload = JSON.parse(payloadJson);

    return {
      header,
      payload,
      signature,
      raw: token,
    };
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}
