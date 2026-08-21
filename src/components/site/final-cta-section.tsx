import { StyleSheet, Text, View } from 'react-native';

import { CTAButton } from '@/components/site/cta-button';
import { BrandColors, Fonts, NarrowContentWidth, Spacing } from '@/constants/theme';

const SUBTEXT_COLOR = '#D8E3DB';

type FinalCtaSectionProps = {
  onGetStarted: () => void;
};

/**
 * The closing pitch — a deep-green rounded card with a headline, a short
 * promise, and one more CTA. This is also the homepage's `#contact` anchor
 * target: the wireframe doesn't have a literal contact form, "Contact" in
 * the nav just scrolls here.
 */
export function FinalCtaSection({ onGetStarted }: FinalCtaSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headline}>Ready to get started?</Text>
        <Text style={styles.subtext}>
          Tell us about your student and we&apos;ll follow up within one business day.
        </Text>
        <CTAButton size="lg" onPress={onGetStarted} style={styles.cta}>
          Start Your Student&apos;s Journey
        </CTAButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.six,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: NarrowContentWidth,
    backgroundColor: BrandColors.deepGreen,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.six,
    alignItems: 'center',
  },
  headline: {
    fontFamily: Fonts.serif,
    fontSize: 26,
    color: BrandColors.white,
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 15,
    color: SUBTEXT_COLOR,
    textAlign: 'center',
    marginBottom: Spacing.four,
  },
  cta: {
    alignSelf: 'center',
  },
});
