/**
 * Small, dependency-free validators shared across form steps. Kept separate
 * from any one component so the same rule can be unit tested and reused
 * (e.g. by a future owner-dashboard edit form) without copy-pasting regex.
 *
 * Note on scope: these guard against malformed/malicious *input shape*
 * (garbage data, absurd lengths, control characters). They are not a SQL
 * escaping layer — Supabase's client sends values as parameters, never as
 * raw SQL strings, so injection isn't a risk this file needs to solve.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accepts common US formats: 5551234567, 555-123-4567, (555) 123-4567, 555.123.4567,
// with an optional leading +1. Deliberately loose — the goal is to catch typos,
// not to be a strict phone-number spec.
const PHONE_PATTERN = /^\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

// Generous ceilings — high enough that no legitimate name/school/note ever
// hits them, low enough to reject a pasted essay or a scripted flood.
const MAX_EMAIL_LENGTH = 254; // RFC 5321 limit
const MAX_PHONE_LENGTH = 20;
const MAX_TEXT_LENGTH = 200;

export function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(trimmed);
}

export function isValidPhone(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length <= MAX_PHONE_LENGTH && PHONE_PATTERN.test(trimmed);
}

/**
 * Cleans a free-text field (student name, school, notes) before it's stored
 * or sent anywhere: trims, collapses repeated whitespace, strips control
 * characters (invisible/non-printable bytes that have no legitimate reason
 * to be in a name field), and caps length. Run this on the value at
 * submit-time, not on every keystroke — trimming mid-type is annoying.
 */
export function sanitizeText(value: string, maxLength: number = MAX_TEXT_LENGTH): string {
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // strip control chars, keep \n/\t if ever needed
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);
}

/**
 * Validates a free-text field is non-empty and within bounds *after*
 * sanitization — use this to gate Continue/Submit, and store the sanitized
 * value, not the raw one.
 */
export function isValidFreeText(value: string, maxLength: number = MAX_TEXT_LENGTH): boolean {
  const cleaned = sanitizeText(value, maxLength);
  return cleaned.length > 0;
}
