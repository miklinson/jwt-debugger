export interface JWTHeader {
  alg: string;
  typ: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  iat?: number;
  nbf?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  raw: string;
}

export interface ValidationResult {
  isExpired: boolean;
  isNotYetValid: boolean;
  timeUntilExpiration?: number;
  warnings: string[];
}

export interface VerificationResult {
  valid: boolean;
  error?: string;
}

export type JWTAlgorithm =
  | 'HS256' | 'HS384' | 'HS512'
  | 'RS256' | 'RS384' | 'RS512'
  | 'ES256' | 'ES384' | 'ES512';

export type DecodeStatus = 'decoded' | 'masked' | 'invalid';

export interface PartialDecodePart<T> {
  status: DecodeStatus;
  value: T | null;
  rawValue: string;
  error?: string;
}

export interface PartialDecodedJWT {
  header: PartialDecodePart<JWTHeader>;
  payload: PartialDecodePart<JWTPayload>;
  signature: PartialDecodePart<string>;
  raw: string;
  isComplete: boolean;
}
