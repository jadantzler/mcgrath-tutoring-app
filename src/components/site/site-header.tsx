import { usePathname, useRouter } from 'expo-router';
import { GraduationCap, Menu, X } from 'lucide-react-native';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { CTAButton } from '@/components/site/cta-button';
import { NAV_LINKS } from '@/constants/site-content';
import { BrandColors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';
import { useIsDesktop } from '@/hooks/use-is-desktop';
import { scrollToSection } from '@/lib/scroll-to-section';

// `position: 'sticky'` is a web-only value that React Native's own type
// definitions don't know about (native has no concept of "sticky" — it's a
// CSS positioning scheme). react-native-web supports it at runtime; this
// cast just tells TypeScript to trust that, and it's skipped entirely on
// native platforms via the Platform.OS check below.
const STICKY_ON_WEB: ViewStyle =
  Platform.OS === 'web' ? ({ position: 'sticky', top: 0, zIndex: 40 } as unknown as ViewStyle) : {};

// The wireframe's muted nav-link color (`#C9BE9E`) — a warm, low-contrast
// tan against the navy bar. It's not one of the app's theme tokens because
// it's specific to text-on-navy-header, not a general light/dark surface
// color, so it lives here rather than in `theme.ts`.
const NAV_LINK_COLOR = '#C9BE9E';

/**
 * Persistent top bar, rendered once from the root layout around every
 * route. Ports the wireframe's header exactly: icon + wordmark on a navy
 * bar, anchor-scroll nav links + a gold "Get Started" CTA on wide screens,
 * a hamburger menu that reveals the same links + CTA on narrow ones.
 *
 * Two deliberate departures from the wireframe, both because this is a real
 * app instead of a single-page mockup: "Get Started" navigates to `/intake`
 * (via expo-router) instead of showing the wireframe's demo toast, and the
 * nav links only render on the homepage — `scrollToSection` targets ids
 * that only exist on `index.tsx`, so showing them on `/intake` or `/privacy`
 * would be links to nowhere.
 */
export function SiteHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const [menuOpen, setMenuOpen] = useState(false);

  // The nav links scroll to section ids that only exist on the homepage —
  // showing them on `/intake` or `/privacy` would be links to nowhere, so
  // they only render there.
  const showNavLinks = pathname === '/';
  const onIntake = pathname === '/intake';

  function goToIntake() {
    setMenuOpen(false);
    router.push('/intake');
  }

  function handleNavPress(id: string) {
    setMenuOpen(false);
    scrollToSection(id);
  }

  const cta = (
    <CTAButton onPress={goToIntake} style={onIntake ? styles.ctaMuted : undefined}>
      {onIntake ? "You're signing up" : 'Get Started'}
    </CTAButton>
  );

  return (
    <View style={[styles.bar, STICKY_ON_WEB]}>
      <View style={styles.inner}>
        <Pressable style={styles.brand} onPress={() => router.push('/')}>
          <GraduationCap size={22} color={BrandColors.white} />
          <Text style={styles.wordmark}>McGrath Tutoring</Text>
        </Pressable>

        {isDesktop ? (
          <View style={styles.desktopNav}>
            {showNavLinks
              ? NAV_LINKS.map((link) => (
                  <Pressable key={link.id} onPress={() => handleNavPress(link.id)}>
                    <Text style={styles.navLink}>{link.label}</Text>
                  </Pressable>
                ))
              : null}
            {cta}
          </View>
        ) : (
          <Pressable
            onPress={() => setMenuOpen((open) => !open)}
            hitSlop={8}
            accessibilityLabel={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <X size={22} color={BrandColors.white} />
            ) : (
              <Menu size={22} color={BrandColors.white} />
            )}
          </Pressable>
        )}
      </View>

      {!isDesktop && menuOpen ? (
        <View style={styles.mobileMenu}>
          {showNavLinks
            ? NAV_LINKS.map((link) => (
                <Pressable key={link.id} onPress={() => handleNavPress(link.id)}>
                  <Text style={styles.navLink}>{link.label}</Text>
                </Pressable>
              ))
            : null}
          {cta}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: BrandColors.navy,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  wordmark: {
    fontFamily: Fonts.serif,
    fontSize: 18,
    letterSpacing: 0.3,
    color: BrandColors.white,
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.five,
  },
  navLink: {
    fontSize: 14,
    fontWeight: '500',
    color: NAV_LINK_COLOR,
  },
  mobileMenu: {
    gap: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    alignItems: 'flex-start',
  },
  ctaMuted: {
    opacity: 0.6,
  },
});
