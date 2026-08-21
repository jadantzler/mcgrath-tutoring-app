/**
 * Small, dependency-free validators shared across form steps. Kept separate
 * from any one component so the same rule can be unit tested and reused
 * (e.g. by a future owner-dashboard edit form) without copy-pasting regex.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accepts common US formats: 5551234567, 555-123-4567, (555) 123-4567, 555.123.4567,
// with an optional leading +1. Deliberately loose — the goal is to catch typos,
// not to be a strict phone-number spec.
const PHONE_PATTERN = /^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  return PHONE_PATTERN.test(value.trim());
}
