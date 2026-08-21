/**
 * The approved wireframe (the design spec several Notion tracker stories
 * reference) uses one fixed cream/navy/gold look — it has no dark-mode
 * variant. So instead of branching on the device's color scheme, this hook
 * always returns `Colors.light`, which already matches the wireframe's
 * palette (off-white background, navy primary, gold accent, deep-green
 * secondary accent).
 *
 * `Colors.dark` stays in `theme.ts` rather than being deleted — it's real,
 * working code from before this decision, and keeping it costs nothing —
 * but nothing reads it anymore. Every component that calls `useTheme()`
 * (ThemedText, ThemedView, the site header/footer, every intake form step)
 * picks up the fixed theme automatically, with no changes needed in any of
 * those files.
 */

import { Colors } from '@/constants/theme';

export function useTheme() {
  return Colors.light;
}
