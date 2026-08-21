import { useSyncExternalStore } from 'react';
import { Dimensions } from 'react-native';

import { DesktopBreakpoint } from '@/constants/theme';

function subscribe(callback: () => void) {
  const subscription = Dimensions.addEventListener('change', callback);
  return () => subscription.remove();
}

function getSnapshot() {
  return Dimensions.get('window').width >= DesktopBreakpoint;
}

// What the server renders, before there's a real window to measure — see
// the doc comment below for why this has to be a fixed value rather than a
// real measurement.
function getServerSnapshot() {
  return false;
}

/**
 * Whether the window is at least as wide as the wireframe's `sm` breakpoint
 * (640px) — used to switch the header nav / grid sections between their
 * mobile and desktop layouts.
 *
 * This isn't just `useWindowDimensions().width >= DesktopBreakpoint` because
 * this app's web export uses static rendering (`"output": "static"` in
 * `app.json`) — pages are pre-rendered to HTML on the server, where there's
 * no real window, before the browser "hydrates" that HTML with the live
 * app. React requires a component's first client render to produce exactly
 * the same output the server did; if the real window width were read
 * directly, the server would guess one width and the browser would
 * immediately see the real one, so the very first render would already
 * disagree with the server and React throws a hydration error (visible as
 * "Minified React error #418" in the console, and on screen as sections
 * rendering in the wrong place).
 *
 * `useSyncExternalStore`'s third argument, `getServerSnapshot`, exists
 * specifically for this: it's what gets used during server rendering (and
 * during the client's first hydration pass, so the two stay identical),
 * while `getSnapshot` takes over for every render after that. Returning a
 * fixed `false` from `getServerSnapshot` means both server and client agree
 * on the mobile layout for that first render; once hydration completes,
 * this hook re-reads the real window width and — if it's wide enough —
 * switches to the desktop layout. On a desktop browser this shows up as a
 * brief flash of the mobile layout on first paint, which is the standard,
 * imperceptible-in-practice tradeoff for this pattern.
 */
export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
