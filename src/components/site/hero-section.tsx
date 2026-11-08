import { StyleSheet, Text, View } from 'react-native';

import { CTAButton } from '@/components/site/cta-button';
import { BrandColors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';

// Colors specific to this section's copy — the pill badge and body text use
// tones the wireframe defines inline rather than reusing a theme token, so
// they're kept local rather than added to `theme.ts`.
const PILL_BACKGROUND = '#EFF1F5';
const BODY_COLOR = '#4A4438';

type HeroSectionProps = {
  onGetStarted: () => void;
};

/**
 * The homepage's hero: a small eyebrow pill, a two-tone serif headline
 * (navy first line, green second line — the wireframe's signature look),
 * supporting copy, and the large CTA. Center-aligned, matching the
 * wireframe exactly (the previous build here was left-aligned).
 */
export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pill}>
        <Text style={styles.pillText}>PRIVATE TUTORING · GRADES 6–12</Text>
      </View>

      <Text style={styles.headline}>
        Personalized tutoring.{'\n'}
        <Text style={styles.headlineAccent}>Proven results.</Text>
      </Text>

      <Text style={styles.body}>
        One-on-one tutoring built around your student — from ACT and SAT preparation to everyday
        coursework like AP Biology and Anatomy.
      </Text>

      <CTAButton size="lg" onPress={onGetStarted} style={styles.cta}>
        Start Your Student&apos;s Journey
      </CTAButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.five,
  },
  pill: {
    backgroundColor: PILL_BACKGROUND,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    marginBottom: Spacing.four,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: BrandColors.navy,
  },
  headline: {
    fontFamily: Fonts.serif,
    fontSize: 40,
    lineHeight: 46,
    textAlign: 'center',
    color: BrandColors.navy,
    marginBottom: Spacing.four,
    maxWidth: 640,
  },
  headlineAccent: {
    color: BrandColors.deepGreen,
  },
  body: {
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    color: BODY_COLOR,
    maxWidth: 520,
    marginBottom: Spacing.five,
  },
  cta: {
    alignSelf: 'center',
  },
});
