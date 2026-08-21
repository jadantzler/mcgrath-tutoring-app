import { Link } from 'expo-router';
import { GraduationCap } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BrandColors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';

// The wireframe's muted footer-link/copyright color (`#8A93A8`) — specific
// to text-on-navy-footer, so it lives here rather than as a general theme
// token.
const FOOTER_MUTED_COLOR = '#8A93A8';

/**
 * Persistent footer — shown on marketing/content pages, but not on the
 * intake form (see `_layout.tsx`). Ports the wireframe's footer: icon +
 * wordmark on the left, a Privacy Policy link and copyright on the right,
 * on a navy bar matching the header.
 */
export function SiteFooter() {
  return (
    <View style={styles.bar}>
      <View style={styles.inner}>
        <View style={styles.brand}>
          <GraduationCap size={17} color={BrandColors.white} />
          <Text style={styles.wordmark}>McGrath Tutoring</Text>
        </View>

        <View style={styles.links}>
          <Link href="/privacy" asChild>
            <Pressable>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Pressable>
          </Link>
          <Text style={styles.linkText}>© {new Date().getFullYear()} McGrath Tutoring LLC</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: BrandColors.navy,
  },
  inner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  wordmark: {
    fontFamily: Fonts.serif,
    fontSize: 14,
    color: BrandColors.white,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
  },
  linkText: {
    fontSize: 12,
    color: FOOTER_MUTED_COLOR,
  },
});
