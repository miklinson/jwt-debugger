import type { JWTPayload, ValidationResult } from '../types/jwt.types';

/**
 * Validates JWT claims, particularly time-based claims (exp, nbf, iat)
 */
export function validateClaims(payload: JWTPayload): ValidationResult {
  const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
  const warnings: string[] = [];

  let isExpired = false;
  let isNotYetValid = false;
  let timeUntilExpiration: number | undefined;

  // Check expiration time (exp)
  if (payload.exp !== undefined) {
    if (payload.exp < now) {
      isExpired = true;
      warnings.push(`Token expired ${formatTimeAgo(now - payload.exp)} ago`);
    } else {
      timeUntilExpiration = payload.exp - now;
      // Warn if expiring soon (within 1 hour)
      if (timeUntilExpiration < 3600) {
        warnings.push(`Token expires in ${formatDuration(timeUntilExpiration)}`);
      }
    }
  }

  // Check not before time (nbf)
  if (payload.nbf !== undefined) {
    if (payload.nbf > now) {
      isNotYetValid = true;
      warnings.push(
        `Token not valid until ${formatTimeAgo(payload.nbf - now)} from now`
      );
    }
  }

  // Check issued at time (iat) - just informational
  if (payload.iat !== undefined) {
    const age = now - payload.iat;
    if (age < 0) {
      warnings.push('Token issued at time is in the future');
    }
  }

  return {
    isExpired,
    isNotYetValid,
    timeUntilExpiration,
    warnings,
  };
}

/**
 * Formats a duration in seconds to a human-readable string
 * Examples: "2h 34m 12s", "45m 20s", "30s"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0s';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * Formats seconds as "X time ago" string
 */
export function formatTimeAgo(seconds: number): string {
  return formatDuration(seconds);
}

/**
 * Formats a Unix timestamp to a human-readable date string
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
}

/**
 * Formats a Unix timestamp to ISO 8601 format
 */
export function formatTimestampISO(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toISOString();
}
