/**
 * McGrath Tutoring brand tokens.
 *
 * Colors, fonts, and spacing values used across the app. Sourced from the
 * McGrath Tutoring brand guidelines (Notion: Brand Guidelines). Components
 * should always pull colors from here rather than hardcoding hex values.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** Raw brand palette — prefer `Colors.light` / `Colors.dark` in components. */
export const BrandColors = {
  navy: '#1B2A4A',
  gold: '#C9A44C',
  deepGreen: '#2D4A3E',
  offWhite: '#F7F5F0',
  charcoal: '#2A2A2A',
  white: '#FFFFFF',
} as const;

export const Colors = {
  light: {
    text: BrandColors.charcoal,
    textSecondary: '#5C5C5C',
    background: BrandColors.offWhite,
    backgroundElement: '#EFEBE2',
    backgroundSelected: '#E5DFD0',
    primary: BrandColors.navy,
    accent: BrandColors.gold,
    secondaryAccent: BrandColors.deepGreen,
    // Subtle outline for form controls — dark tint of the text color, so it
    // stays visible against whatever the surface underneath happens to be.
    border: 'rgba(42, 42, 42, 0.18)',
  },
  dark: {
    text: BrandColors.offWhite,
    textSecondary: '#C7C2B6',
    background: BrandColors.navy,
    backgroundElement: '#25375C',
    backgroundSelected: '#2E4269',
    primary: BrandColors.gold,
    accent: BrandColors.gold,
    secondaryAccent: BrandColors.deepGreen,
    border: 'rgba(247, 245, 240, 0.25)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Fixed colors for "this is selected/checked" indicators (pills, checkboxes,
 * toggles). Deliberately NOT theme-dependent, unlike everything in `Colors`
 * above: gold-on-navy reads clearly whether the surface behind it is
 * off-white (light mode) or navy (dark mode) — using `Colors[scheme].primary`
 * here instead would make a selected control invisible in dark mode, where
 * primary is navy and the page background is also navy.
 */
export const SelectedIndicator = {
  background: BrandColors.gold,
  foreground: BrandColors.navy,
} as const;

/**
 * Headings use Georgia (serif) per the brand guide; body/UI text uses Inter.
 */
export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    serif: 'Georgia',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter',
    serif: 'Georgia',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;

/**
 * Site-wide max content width — matches the approved wireframe's `max-w-5xl`
 * (1024px), used consistently for the header, footer, and every homepage
 * section. Widened from the original 800px so the header/footer/homepage
 * line up with the wireframe; `intake.tsx` and `privacy.tsx` also read this
 * constant, so they pick up the wider, more consistent measure too.
 */
export const MaxContentWidth = 1024;

/** The wireframe's `max-w-3xl` (768px) — only used for the final CTA card. */
export const NarrowContentWidth = 768;

/**
 * Tailwind's `sm` breakpoint (640px) — the wireframe switches its grid
 * sections (pillars, stats, testimonials) from a single stacked column to
 * multiple columns at this width. React Native has no CSS media queries, so
 * sections that need this read it via `useWindowDimensions()` instead.
 */
export const DesktopBreakpoint = 640;

/**
 * Shared elevation for card-like surfaces (the home screen's info card,
 * future stat tiles / testimonial cards). One definition here means every
 * "raised" surface in the app gets the same depth instead of each screen
 * picking its own shadow values by eye.
 *
 * `shadow*` properties render on iOS and web (react-native-web translates
 * them to a CSS box-shadow); `elevation` is the Android equivalent — both
 * are included so the same style object works on every platform.
 */
export const CardShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 3,
} as const;
