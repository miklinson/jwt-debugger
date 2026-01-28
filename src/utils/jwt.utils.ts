import type { DecodedJWT, JWTHeader, JWTPayload, PartialDecodePart, PartialDecodedJWT } from '../types/jwt.types';

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

/**
 * Checks if a JWT part appears to be masked/redacted
 * Common patterns: ****, [REDACTED], xxx, etc.
 */
export function isMaskedPart(part: string): boolean {
  const maskedPatterns = [
    /^\*+$/,           // All asterisks
    /^x+$/i,           // All x's
    /^\[.*\]$/,        // [REDACTED], [HIDDEN], etc.
    /^<.*>$/,          // <redacted>, <masked>
  ];
  return maskedPatterns.some(pattern => pattern.test(part));
}

/**
 * Attempts to decode a single JWT part (header or payload)
 * Returns a PartialDecodePart with status indicating success/failure
 */
function decodeJWTPart<T>(
  part: string,
  partName: 'header' | 'payload'
): PartialDecodePart<T> {
  if (isMaskedPart(part)) {
    return {
      status: 'masked',
      value: null,
      rawValue: part,
      error: `${partName} appears to be masked/redacted`
    };
  }

  try {
    const decoded = base64UrlDecode(part);
    const parsed = JSON.parse(decoded) as T;
    return {
      status: 'decoded',
      value: parsed,
      rawValue: part
    };
  } catch (error) {
    return {
      status: 'invalid',
      value: null,
      rawValue: part,
      error: `Failed to decode ${partName}: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Parses a JWT token with support for partial/masked tokens
 * Returns partial results even if some parts fail to decode
 */
export function parsePartialJWT(token: string): PartialDecodedJWT | null {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3 || parts.some(part => part.length === 0)) {
    return null;
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  const header = decodeJWTPart<JWTHeader>(headerB64, 'header');
  const payload = decodeJWTPart<JWTPayload>(payloadB64, 'payload');

  const signature: PartialDecodePart<string> = isMaskedPart(signatureB64)
    ? { status: 'masked', value: null, rawValue: signatureB64, error: 'Signature appears to be masked' }
    : { status: 'decoded', value: signatureB64, rawValue: signatureB64 };

  const isComplete =
    header.status === 'decoded' &&
    payload.status === 'decoded' &&
    signature.status === 'decoded';

  return {
    header,
    payload,
    signature,
    raw: token,
    isComplete
  };
}
